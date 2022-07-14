---
title: Tomcat面试题
date: 2022-06-02 11:18:17
lock: false
permalink: /pages/Tomcat%E9%9D%A2%E8%AF%95%E9%A2%98
categories: 
  - LearnJavaToFindAJob
  - 【中级】12k-26k档
  - 中间件
tags: 
  - Tomcat
  - 面试题
---
## 1、Tomcat的三种运行模式是什么？

**tomcat中一共有三种运行模式，分别是:bio,nio,apr**

bio是阻塞式IO操作，使用的是传统的java i/o处理方式，对于每一个请求都要创建一个线程来进行处理，所以开销较大不适合处理高并发的场景

nio是基于java中非阻塞IO操作的API实现，比传统的i/o处理方式有更高的并发运行性能，是一个高可移植库，它是Apache HTTP Server2.x的核心。

apr是从操作系统级别解决异步IO问题，大幅度提高服务器的并发处理性能，也是Tomcat生产环境运行的首选方式。

## 2、Tomcat的参数有哪些

可以看一下Tomcat的启动脚本参数：





参考：

-https://blog.51cto.com/u_13760226/2324401