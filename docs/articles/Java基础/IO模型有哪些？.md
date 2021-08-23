IO 即输入输出，根据冯诺依曼体系结构，计算机结构分为 5 大部分：**运算器、控制器、存储器、输入设备、输出设备**

<img src="https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210407175139315.png" style="zoom:50%;" />

站在我们程序员的角度来看，首先要明白一些概念：

IO就是**计算机系统与外部设备之间通信的过程**，比如说把读写文件，一行一行遍历。

站在计算机操作系统的角度：

其实IO是分为 **用户空间（User space）** 和 **内核空间（Kernel space ）** 的，我们在程序发起IO操作，其实操作系统是需要从**用户空间**（程序）进入到**内核空间**（操作系统指令），这样才能访问文件。

**文件IO:**
读取：需要将操作系统内核空间将数据准备好拷贝给应用程序的用户空间
写入：需要将应用程序的用户空间将数据准备好拷贝给操作系统内核空间

**网络IO:**
接收网络请求：网络--》网卡--》内核空间--》用户空间
发送网络请求：用户空间--》内核空间--》网卡--》网络

**同步异步:**

所谓同步，就是在发出一个*调用*时，在没有得到结果之前，该*调用*就不返回。但是一旦调用返回，就得到返回值了。

而异步则是相反，**调用在发出之后，这个调用就直接返回了，所以没有返回结果**。换句话说，当一个异步过程调用发出后，调用者不会立刻得到结果。而是在*调用*发出后，*被调用者*通过状态、通知来通知调用者，或通过回调函数处理这个调用。

**阻塞非阻塞：**

阻塞调用是 指调用结果返回之前，当前线程会被挂起。调用线程只有在得到结果之后才会返回。
非阻塞调用 指在不能立刻得到结果之前，该调用不会阻塞当前线程。



IO的模型一般分为四种：

- ①同步阻塞IO（Blocking IO）：即BIO，传统的IO模型。
- ②同步非阻塞IO（Non-blocking IO）， 即NIO，默认创建的socket都是阻塞的，非阻塞IO要求socket被设置为NONBLOCK。注意这里所说的NIO并非Java的NIO（New IO）库。
- ③多路复用IO（IO Multiplexing）：即经典的Reactor设计模式，有时也称为**异步阻塞IO**，Java中的Selector和Linux中的epoll都是这种模型（Redis单线程为什么速度还那么快，就是因为用了多路复用IO和缓存操作的原因）
-  ④异步IO（Asynchronous IO）：即经典的Proactor设计模式，也称为*异步非阻塞IO*。

## 1、BIO：

![](https://img-blog.csdnimg.cn/20190809100213430.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x6YjM0ODExMDE3NQ==,size_16,color_FFFFFF,t_70)

我们目前使用较多的也是这种BIO，比如说InputStream的wirte和read，都是同步阻塞的，只有等待文件读写完毕，我们才能进行下一步。

> 服务器实现模式为一个连接一个线程，即客户端有连接请求时服务器端就需要启动一个线程进行处理，如果这个连接不做任何事情会造成不必要的线程开销

## 2、NIO

![img](https://img-blog.csdnimg.cn/20190809100722996.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x6YjM0ODExMDE3NQ==,size_16,color_FFFFFF,t_70)

著名的 Netty 就是使用NIO。

> 同步非阻塞，服务器实现模式为一个请求一个线程，即客户端发送的连接请求都会注册到多路复用器上，多路复用器轮询到连接有I/O请求时才启动一个线程进行处理。

## 3、多路复用IO

![img](https://img-blog.csdnimg.cn/20190809100538991.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x6YjM0ODExMDE3NQ==,size_16,color_FFFFFF,t_70)

Redis就是这种**多路复用IO**

> 服务器实现模式为一个有效请求一个线程，客户端的I/O请求都是由OS先完成了再通知服务器应用去启动线程进行处理

:arrow_double_down:

拓展：

所谓的I/O复用，就是多个I/O可以复用一个进程。I/O多路复用允许进程同时检查多个fd，以找出其中可执行I/O操作的fd。
系统调用select()和poll()来执行I/O多路复用。在Linux2.6中引入的epoll()是select()的升级版，提供了更高的性能。通过I/O复用，我们可以在一个进程处理大量的并发I/O。

### 初级版I/O复用

比如一个进程接受了10000个连接，这个进程每次从头到尾的问一遍这10000个连接：“有I/O事件没？有的话就交给我处理，没有的话我一会再来问一遍。”然后进程就一直从头到尾问这10000个连接，如果这10000个连接都没有I/O事件，就会造成CPU的空转，并且效率也很低，不好不好。

那么，如果发明一个代理，每次能够知道哪个连接有了I/O流事件，不就可以避免无意义的空转了吗？为了避免CPU空转，可以引进了一个代理（一开始有一位叫做select的代理，后来又有一位叫做poll的代理，不过两者的本质是一样的）。

### 升级版I/O复用

#### select()

select可以同时观察许多流的I/O事件，在空闲的时候，会把当前线程阻塞掉，当有一个或多个流有I/O事件时，就从阻塞态中醒来，于是我们的程序就会轮询一遍所有的流（于是我们可以把“忙”字去掉了）。

```
while true {
  select(streams[])
  for i in streams[] {
            if i has data
                  read until unavailable
}
}
 
 12345671234567
```

**select()采用轮询的方式来检查fd是否就绪，当fd数量较多时，性能欠佳**。因为从select那里仅仅知道了，有I/O事件发生了，但却并不知道是那几个流（可能有一个，多个，甚至全部），我们只能无差别轮询所有流，找出能读出数据，或者写入数据的流，对他们进行操作。–from 知乎

#### 生活实例

小明家楼下有一个收发室，每次有快递到了就先代收，但收发室也不知道那个是小明的快递；但小明去取的时候，要查询所有代收的快递。

### 高级版I/O复用

#### epoll()

epoll能更高效的检查大量fd，UNIX中提供了类似功能的kqueue调用。
epoll可以理解为event poll，不同于忙轮询和无差别轮询，**当连接有I/O流事件产生的时候，epoll就会去告诉进程哪个连接有I/O流事件产生，然后进程就去处理这个事件**。此时我们对这些流的操作都是有意义的。（复杂度降低到了O(k)，k为产生I/O事件的流的个数，也有认为O(1)的）

#### 生活实例

小明家楼下有一个收发室，每次有快递到了，就先代收并做了标记；然后通知小明去取送给小明的快递。（精确打击）

> 参考自：https://blog.csdn.net/yournevermore/article/details/101029630

## 4、AIO

![img](https://img-blog.csdnimg.cn/20201016154144678.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x6YjM0ODExMDE3NQ==,size_16,color_FFFFFF,t_70)

Nginx采用了**异步非阻塞**的方式工作。



## 活实例

阻塞取快递：小明收到快递即将送达的信息后，什么事都不做，一直专门等快递。
非阻塞取快递：小明收到快递即将送达的信息后，等快递的时候，还一边敲代码、一边刷微信。

**同步与异步，重点在于消息通知的方式；阻塞与非阻塞，重点在于等消息时候的行为。**
所以，就有了下面4种组合方式

```
1. 同步阻塞：小明收到信息后，啥都不能干，下楼干等快递；
2. 同步非阻塞：小明收到信息后，边刷微博，边等着取快递；
3. 异步阻塞：小明收到信息后，啥都不干，一直等着快递员通知他取快递；
4. 异步非阻塞：小明收到信息后，边刷着微博，边等快递员通知他取快递。
```

