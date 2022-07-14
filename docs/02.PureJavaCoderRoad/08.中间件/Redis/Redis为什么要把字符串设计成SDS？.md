---
title: Redis为什么要把字符串设计成SDS？
date: 2022-05-26 17:04:04
permalink: /PureJavaCoderRoad/pages/Redis%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81%E6%8A%8A%E5%AD%97%E7%AC%A6%E4%B8%B2%E8%AE%BE%E8%AE%A1%E6%88%90SDS%EF%BC%9F
lock: false
categories: 
  - PureJavaCoderRoad
  - 中间件
  - Redis
tags: 
  - Redis
  - SDS
---
## 1、什么是 SDS？

`Redis`的`String`数据结构底层实现是基于`SDS`实现的。

而`Redis`是用`C`语言开发的，Redis底层并没有采用C语言传统的字符串表示，即以空字符结尾的字符数组，而是采用专门为其设计的简单动态字符串作为其默认字符串表示，其英文全称为Simple Dynamic String，简称SDS。



## 2、SDS 定义

```c
struct sdshdr {
      //记录buff数组中已使用字节的数量 等于sds所保存字符串长度
      int len;
      //记录buff数组中未使用字节的数量
      int free;
      //字节数组，保存字符串
      char buf[];
}
```

类似于Java的字符串String，String也是通过 char[]（JDK 1.8） 存储字符。

SDS 和C的字符串一样，也是以`'\0'`表示结束，这一个字节不会计入已使用的长度. 这样做的好处是可以重用C字符串函数库里面的一部分函数。

如：

```java
127.0.0.1:6379> set name "HelloCoder"
```

在Redis的底层中其实是这样存储的：

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210222103537364.png)

> 此时键值对的`key`和`value`都是一个字符串对象，而对象的底层实现分别是两个保存着字符串`name`和`HelloCoder`的`SDS`结构。

## 3、SDS 与 C字符串区别

这里主要是讲述一下SDS相比C字符串的优势，也是SDS比C语言字符串的更加适用Redis的原因。

#### 3.1、获取字符串长度时间复杂度

C字符串需要遍历，时间复杂度为`O(n)`。

SDS直接获取， 时间复杂度为`O(1)`，因为有 len 函数记录字符串长度。

#### 3.2、 防止缓冲区溢出

C语言不记录自身长度，字符串在执行拼接字符串时，如果长度不够会产生缓冲区溢出的问题。

>  `/strcat` 函数可以将 `src` 字符串中的内容拼接到 `dest` 字符串的末尾：
>
> ```
> char *strcat(char *dest, const char *src);
> ```

SDS的空间分配策略完全杜绝了这种可能性，当API需要对SDS进行修改时，  API会首先会检查SDS的空间是否满足条件, 如果不满足， API会自动对它的空间动态扩展。

#### 3.3、减少修改字符串带来的内存重分配次数

C字符串的长度和底层数组的长度之间存在着关联性，每次增加或缩小一个C字符串，程序都**必须**对C字符串的数据进行内存重分配操作，否则会出现内存泄漏。

由于Redis频繁操作数据，内存分配和释放耗时可能对性能造成影响,，SSD避免了这种缺陷,，实现空间预分配和惰性空间释放两种优化策略，不是每次都要重新分配内存。

##### 1.空间预分配

> 以下参考自《redis设计与实现》

这是SDS分配空间的伪代码：

```c
def sdsMakeRoomFor(sdshdr, required_len):

    # 预分配空间足够，无须再进行空间分配
    if (sdshdr.free >= required_len):
        return sdshdr

    # 计算新字符串的总长度
    newlen = sdshdr.len + required_len

    # 如果新字符串的总长度小于 SDS_MAX_PREALLOC , SDS_MAX_PREALLOC 的值为 1024*1024, 即1M
    # 那么为字符串分配 2 倍于所需长度的空间
    # 否则就分配所需长度加上 SDS_MAX_PREALLOC 数量的空间
    if newlen < SDS_MAX_PREALLOC:
        newlen *= 2
    else:
        newlen += SDS_MAX_PREALLOC

    # 分配内存
    newsh = zrelloc(sdshdr, sizeof(struct sdshdr) + newlen + 1)

    # 更新 free 属性
    newsh.free = newlen - sdshdr.len

    # 返回
    return newsh
```


总结就是：

- **len长度小于 1 M**

如果修改后len长度小于 1 M，这时分配给`free`的大小和len一样,，例如修改过后为10字节,  那么给`free`也是10字节（未使用空间） ，buf实际长度变成了  `10 byte+ 10 byte + 1byte`  

> 1byte  是结尾的`'\0'`

- **len长度将大于等于1 M**

如果修改后`len`长度大于等于1 M, 这时分配给`free`的长度为 1 M,   例如修改过后为10M（即newlen的值），  那么给`free`是1M 。 buf实际长度变成了 `10M + 1M + 1 byte`。

在修改时，首先检查空间是不是够，如果足够，直接使用，否则执行内存重分配。

#####  2、惰性空间释放

当缩短SDS长度时，Redis不进行内存释放，而是记录到`free`字段中， 等待下次使用。 与此同时，也提供相应的API，可以手动释放内存。

比如说此前：

```java
127.0.0.1:6379> set name "HelloCoder"
```

name 的 `len` 等于 10，现在修改为

```java
127.0.0.1:6379> set name "HaC"
```

此时 `len` 就变为 3，`free`此时就保存为17 （10 + 10 - 3 = 17）。

> 第一个10是原来就有的free大小

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210222141751272.png)

#### 3.4、二进制安全

C字符串只有末尾能保存空格， 中间如果有空格（空字符将被误认为是字符串结尾）会被截取认作结束标识，这样就不能保存图片,，音频视频等二进制数据了。

比如说保存特殊字符串，转成二进制的字节 :  保留的数据中间出现了`'\0'`， C 字符串所用的函数只会识别出其中的 `"Redis"` ， 而忽略之后的 `"Cluster"` 。

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210222125022614.png)

但是在SDS中这是没有任何问题的,  因为它使用len而不是空字符判断结束。

所有的SDS API会以二进制的方式处理SDS buf数组里面的数据，程序不会对其中数据做任何限制、过滤、修改。

数据写入是什么样子，读取出来就是什么样子。

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210222125222306.png)

#### 3.5、 兼容部分C字符串函数

Redis保留了`\0` 结尾，虽然分配多了一个字节的空间，但这样的好处是为了重用一部分C语言`<string.h>`库定义的函数。

比如说可以重用C语言的 `strcasecmp` 对比函数，从而避免了不必要的代码重复。

## 4、总结

简单的说Redis为什么要使用SDS，其实就是修改了C的原生实现，让其更灵活、高效。

一图总结SDS的好处：

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210222144222171.png)

