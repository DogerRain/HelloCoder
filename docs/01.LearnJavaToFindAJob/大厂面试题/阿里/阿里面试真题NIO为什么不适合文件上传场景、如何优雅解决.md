---
title: 阿里面试真题NIO为什么不适合文件上传场景、如何优雅解决
date: 2022-06-02 11:18:21
lock: false
permalink: /pages/%E9%98%BF%E9%87%8C%E9%9D%A2%E8%AF%95%E7%9C%9F%E9%A2%98NIO%E4%B8%BA%E4%BB%80%E4%B9%88%E4%B8%8D%E9%80%82%E5%90%88%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0%E5%9C%BA%E6%99%AF%E3%80%81%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E8%A7%A3%E5%86%B3
categories: 
  - LearnJavaToFindAJob
  - 大厂面试题
  - 阿里
tags: 
  - NIO
---
> 原文：https://mp.weixin.qq.com/s/VMiB-4a15TgsIA2W-c4HHg
>
> 作者： 中间件兴趣圈

该系列已分别介绍了服务端、客户端的启动流程，本文将重点剖析Netty是如何封装NIO的读事件。

> 温馨提示：本文虽然是源码分析，但强烈建议精读，根据源码阐述其背后的设计哲学，也用黑体进行了标注，请特别留意。

在阅读本篇文章之前，请稍微思考如下几个问题：

- NIO为什么不适合文件上传等场景
- NIO如何避免一个超大数据传送的连接对其他请求的影响
- NIO如何处理半关闭

## １、读事件概述

------

关于Read事件在SocketChannel与ServerSocketChannel所对应的操作不一样，在SocketChannel中，则对应数据读，而在ServerSocketChannel中则被被封装成接受客户端的连接请求。

NIO read事件入口在NioEventLoop的processSelectedKey方法，截图如下：

![图片](https://mmbiz.qpic.cn/mmbiz_png/Wkp2azia4QFuCkrwrlv8ob4cHT9m5yAHZZHzOIU8JEHEOBP9GdzvVCtv9QTcBcLickFURbOBxZib7FZ0iasYGZonpw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)


其核心入口为UnSafe的read方法，关于UnSafe的类层次结构如下图所示：

![图片](https://mmbiz.qpic.cn/mmbiz_png/Wkp2azia4QFuCkrwrlv8ob4cHT9m5yAHZG58JtPOIst6Xf0xliacnnSEc8GSyllQQZEJnmGxosibQS997iaoZL3JaA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

- AbstractNioByteChannel的内部类NioByteUnsafe#read
  SocketChannel对应的读事件处理流程，即IO读的处理实现。
- AbstractNioMessageChannel的内部类NioMessageUnsafe#read
  ServerSocketChannle对应的读事件处理流程。



接下来将分别介绍这两个流程。



## 2、IO读事件处理流程

------

IO读事件由AbstractNioByteChannel内部类AbstractNioUnsafe的read方法实现，接下来重点剖析该方法，从中窥探Netty对IO读事件的处理。

![图片](https://mmbiz.qpic.cn/mmbiz_png/Wkp2azia4QFuCkrwrlv8ob4cHT9m5yAHZRcu8dgCK21dOfHnxkK9S4yh651pOfSibNrEAqEcH2TyCzuict3TuAibcw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)


Step1：如果没有开启自动注册读事件，在每一次读时间处理过后会取消读事件，默认为自动注册。

> 温馨提示：如果通道不注册读事件，将无法从通道中读取数据，即无法处理请求或接受响应。

如果没有开启自动读事件，需要应用程序在需要的时候手动调用通道的read方法。

取消读事件，Netty基于NIO给出了非常标准的实现，基本可以当场模板代码使用：

![图片](https://mmbiz.qpic.cn/mmbiz_png/Wkp2azia4QFuCkrwrlv8ob4cHT9m5yAHZcy4xZ6CUY9nYeXejcjW1gfsSsKo64smWl3M2F3z2hKiavYky85nsxmQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)


其实现关键点：首先判断键值对是否有效，然后通过位运算进行取消注册。

![图片](https://mmbiz.qpic.cn/mmbiz_png/Wkp2azia4QFuCkrwrlv8ob4cHT9m5yAHZXOqTaP1foibmcbYtluh2za7hpBVzusd20thxxxQLjUnCWicXyOaflbjA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)


Step2：创建接受缓存区内存分配器，这里有两个关键点：

- maxMessagesPerRead
  每一个通道在一次读事件处理过程中最多可以调用底层Socket进行读取的次数，默认为16次，**这里的设计哲学是避免一个通道需要读取太多的数据，从而影响其他通道的数据读，因为在一个事件选择器中多个通道的读事件是串行执行的**。
- RecvByteBufAllocator
  接受缓冲区的内存分配策略，分为分配固定大小(不够时扩容)、动态变化(根据历史分配的大小，动态条件合适的内存大小)，**这里主要的设计哲学是合理利用内存，并减少扩容，提高内存的分配效率与使用效率**。

![图片](https://mmbiz.qpic.cn/mmbiz_png/Wkp2azia4QFuCkrwrlv8ob4cHT9m5yAHZgia0KGDsRKVdyYdFj8fE8eZxcMI7zwv5uLu6ZGOdwmMPwfF80LBD0iaA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)


Step3：循环处理读事件，最多处理maxMessagePerRead。接下来探讨一下单次读事件的处理流程。

![图片](https://mmbiz.qpic.cn/mmbiz_png/Wkp2azia4QFuCkrwrlv8ob4cHT9m5yAHZpK1ibh3V5hkd3swoPicZhaCaN3lezGHkwbEJ32sgS712PN6kBUgay6VQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)


Step4：进行一次IO读处理，其处理有如下几个关键点：

- 首先分配一个ByteBuf，俗称接收缓存区，用来存放从网络中读取的内容。

- 获取一下分配到的累积缓存区可写的字节数，**这个后面有妙用**。

  调用底层网络读API从网卡中读取数据，NIO的读取实现如下所示：

  ![图片](https://mmbiz.qpic.cn/mmbiz_png/Wkp2azia4QFuCkrwrlv8ob4cHT9m5yAHZoRH6WnbW5lK2ldUKeMn1v8nwUB2JVpM2wB8BDRwcB3BalQAicNvlXog/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

  即调用NIO中的SocketChannel进行读数据，其返回参数表示这次从网卡中读取到的字节数。**如果读取到的字节少于0，则表示对端通道已关闭，己端也需要进行相应的处理，例如关闭通道**。

- 读到一批数据后，会通过事件传播机制向事件链中传播channelRead事件，触发后续对该批数据的处理。

![图片](https://mmbiz.qpic.cn/mmbiz_png/Wkp2azia4QFuCkrwrlv8ob4cHT9m5yAHZoTh78C4jloDmia1l5NtTicwC0LiaunWdricSyhZzbMxAwdibq5zwZRxoPeg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)


Step5：判断该通道是否需要继续读，其基本依据如下：

- 如果未开启自动注册读事件，读完一次之后将不再继续读取。
- 如果本次读取到的字节数小于接收缓存区，说明此刻网卡中没有可读数据，等下一次读事件触发再继续读。

![图片](https://mmbiz.qpic.cn/mmbiz_png/Wkp2azia4QFuCkrwrlv8ob4cHT9m5yAHZeGibNdb1vBL22OSlOFkFiaUz0mJYtlgM7rfEcSIFS4qDm5CIKO3ic8E3Q/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)


Step6：一次或多次读操作结束后，会触发一次读完成事件，向整个事件链传播。

整个网络读处理流程就介绍到这了。

## 3、接受连接处理流程

在Netty中，服务端接收客户端的连接请求(OP_ACCEPT)，被封装在channelRead 事件中，其代码入口为：AbstractNioMessageChannel　的内部类NioMessageUnsafe的read方法。

![图片](https://mmbiz.qpic.cn/mmbiz_png/Wkp2azia4QFuCkrwrlv8ob4cHT9m5yAHZVdzfsYrCJEWbmQ7TzicZTBdiaUVQZAMcmutXbOJIaBqeZtzugCutu7ibQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)


其大概的实现要点在前面已经介绍，这里主要看一下NioServerSocketChannel的doReadMessage。

![图片](https://mmbiz.qpic.cn/mmbiz_png/Wkp2azia4QFuCkrwrlv8ob4cHT9m5yAHZgl4G1EWaK9TRIS1ceqd2S2GeiaxHc6l3zShcHF3KNVRXHnLXPeIOT2w/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)


通过使用底层的NIO接受一个连接，并获取NioSocketChannel对象。然后继续该对象向下传播channelRead事件，在后续的处理器中对该对象进行操作，例如将其注册读事件，从而触发网络的读操作，关于NioSocketChannel如何绑定读事件、注册业务相关的事件监听器机制已经在Netty进阶：手把手教你如何编写一个NIO服务端中详细介绍，本文就不再重复。