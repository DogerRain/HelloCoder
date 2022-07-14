---
title: HTTP请求的方式
date: 2022-06-02 11:18:21
lock: false
permalink: /pages/HTTP%E8%AF%B7%E6%B1%82%E7%9A%84%E6%96%B9%E5%BC%8F
categories: 
  - LearnJavaToFindAJob
  - 【初级】6~12k档
  - 计算机网络
tags: 
  - HTTP
  - 请求的方式
---
写Java的小伙伴，相信都用过以下的HTTP请求方式：

```java
@RequestMapping
@GetMapping
@PostMapping
@DeleteMapping
@PutMapping
```



## 1、常见的HTTP请求方式都有哪些？

`HTTP/1.1协议`中共定义了`八种方法`，有时也叫`动作`，来表明`Request-URL`指定的资源不同的操作方式

1. 在HTTP1.0中，定义了三种请求方法：`GET, POST 和 HEAD`方法。
2. 在HTTP1.1中，新增了五种请求方法：`OPTIONS, PUT, DELETE, TRACE 和 CONNECT`方法 但我们常用的一般就是`GET和POST`请求。



GET和POST的区别，请参考：

 [计算机网络面试题](计算机网络面试题.md) 

关于post和get谁更安全的说法：

虽然说get方法参数可见，从传输的角度来说，他们都是不安全的，因为 HTTP 在网络上是`明文传输`的，只要在网络节点上捉包，就能完整地获取数据报文。

其实，要想安全传输，就只有加密，也就是 `HTTPS`。



## 2、get方法可以像post一样有Request body吗？

HTTP的底层是TCP/IP。所以GET和POST的底层也是TCP/IP，也就是说，GET/POST都是TCP连接。

GET和POST能做的事情是一样一样的。**你要给GET加上request body，给POST带上url参数，技术上是完全行的通的。**





## 3、get方法的参数写法是固定的吗？

在约定中，我们的参数是写在`?`后面，用`&`分割。

解析报文的过程是通过获取 TCP 数据，用正从数据中获取 `Header 和 Body`，从而提取参数。

既然是正则，我们也可以自定义约定参数，只要服务端能解释就行。

