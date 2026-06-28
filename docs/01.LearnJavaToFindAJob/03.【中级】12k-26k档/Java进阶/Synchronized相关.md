---
title: Synchronized相关
date: 2026-06-21 23:53:05
lock: false
permalink: /pages/Synchronized%E7%9B%B8%E5%85%B3
categories:
  - LearnJavaToFindAJob
  - 【中级】12k-26k档
  - Java进阶
tags:
  - Synchronized
  - 相关
---

## Synchronized 是公平锁吗？

`Synchronized` 天生就是非公平锁，而且无法设置为公平锁。



什么是公平锁和非公平锁？



公平锁：线程按照请求锁的顺序严格获取锁。如果队列中有线程在等待，新来的线程必须排队。

非公平锁：允许新来的线程（插队者）在锁被释放时，直接尝试获取锁，而不管等待队列中是否已经有线程在等待。



如何理解它是非公平的？

我们需要了解一下`Synchronized` 的工作原理：

`synchronized` 在 JVM 层面基于 **Monitor（管程）** 实现。当线程进入一个 `synchronized` 块时，它会尝试获取对象 Monitor 的所有权。

> JVM 会申请一个操作系统层面的 互斥量（Mutex Lock），也称为监视器锁（Monitor）。
>
> 

当锁被释放时，所有在 **Contention Set**（竞争集）或 **Entry Set**（进入集）中等待的线程都会被唤醒（或通知），然后它们会竞争重新进入 Monitor 的权利。



`synchronized` 无法保证等待线程的获取顺序，没有像 `ReentrantLock` 的 CLH 队列。 只能依赖 OS 调度（随机性）。



那么 新线程可以直接尝试竞争，它通常会比那些刚被唤醒的、需要经历上下文切换的线程更快一步获取到锁。这就是典型的**插队行为**。



## 底层原理

synchronized 关键字底层原理属于 JVM 层面的东西。修饰不同的地方也不一样。

1、同步块

**`synchronized` 同步语句块的实现使用的是 `monitorenter` 和 `monitorexit` 指令，其中 `monitorenter` 指令指向同步代码块的开始位置，`monitorexit` 指令则指明同步代码块的结束位置。**

```javascript
public class SynchronizedDemo {
    public void method() {
        synchronized (this) {
            System.out.println("synchronized 代码块");
        }
    }
}
```

当执行 `monitorenter` 指令时，线程试图获取锁也就是获取 **对象监视器 `monitor`** 的持有权。

对象锁的拥有者线程才可以执行 `monitorexit` 指令来释放锁。在执行 `monitorexit` 指令后，将锁计数器设为 0，表明锁被释放，其他线程可以尝试获取锁。

2、synchronized 修饰方法的情况

```java
public class SynchronizedDemo2 {
    public synchronized void method() {
        System.out.println("synchronized 方法");
    }
}
```

JVM 通过该 `ACC_SYNCHRONIZED` 访问标志来辨别一个方法是否声明为同步方法，从而执行相应的同步调用。



不过，两者的本质都是对对象监视器 monitor 的获取。

