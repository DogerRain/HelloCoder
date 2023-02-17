---
title: springboot异步编程
date: 2022-09-08 23:31:39
lock: false
permalink: /pages/springboot%E5%BC%82%E6%AD%A5%E7%BC%96%E7%A8%8B
categories:
  - 随笔
tags:
  - springboot
  - 异步编程
---
Spring Boot  有两种异步编程的实现：

- `WebAsyncTask` ，包括 异步回调，超时处理 和 异常处理
- `@Async` 注解

首先使用异步编程，并不会改变 RT（响应时间）。

只是利用了 **Servlet 3的新特性：异步Servlet** 把 主容器的线程释放了，当子线程处理完成后，再返回结果，在高并发情况下，可以提高吞吐量。



