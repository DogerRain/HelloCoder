---
title: util.concurrent的理解
date: 2022-06-02 11:18:21
lock: false
permalink: /pages/util.concurrent%E7%9A%84%E7%90%86%E8%A7%A3
categories: 
  - LearnJavaToFindAJob
  - 【中级】12k-26k档
  - Java进阶
tags: 
  - utilconcurrent
  - 理解
---
java.util.concurrent  也就是我们常说的JUC，主要包含三大块内容：

- **Atomic** 原子类，常见的如AtomicInteger
- **Locks** 锁，常见的如 ReentrantLock
- **Concurrent**  
  - 线程池相关，如 ThreadPoolExecutor、ExecutorService、Callable
  - collection相关 ，并发容器相关，高性能集合，如ConcurrentMap、CopyOnWriteArrayLis、BlockingDeque
  - 工具类相关 ，如信号量 Semaphore，CountDownLatch

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210625104229408.png)