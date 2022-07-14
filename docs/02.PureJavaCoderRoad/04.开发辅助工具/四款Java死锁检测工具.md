---
title: 四款Java死锁检测工具
date: 2022-05-26 17:04:06
permalink: /pages/%E5%9B%9B%E6%AC%BEJava%E6%AD%BB%E9%94%81%E6%A3%80%E6%B5%8B%E5%B7%A5%E5%85%B7
lock: false
categories: 
  - PureJavaCoderRoad
  - 开发辅助工具
tags: 
  - Java
  - 四款
---
在 Java 中，死锁（Deadlock）情况是指：**两个或两个以上的线程持有不同系统资源的锁，线程彼此都等待获取对方的锁来完成自己的任务，但是没有让出自己持有的锁，线程就会无休止等待下去。线程竞争的资源可以是：锁、网络连接、通知事件，磁盘、带宽，以及一切可以被称作“资源”的东西。**



在程序执行的时候，难免会遇到死锁的情况。



下面介绍一下如何排查Java中的死锁线程。

---

先来个死锁的例子：

```java
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class ReentrantLockDeadLock {
    static Lock lock1 = new ReentrantLock();
    static Lock lock2 = new ReentrantLock();

    public static void main(String[] args) throws InterruptedException {
        Thread thread1 = new Thread(new DeadLockDemo(lock1, lock2), "Thread1");
        Thread thread2 = new Thread(new DeadLockDemo(lock2, lock1), "Thread2");
        thread1.start();
        thread2.start();
    }

    static class DeadLockDemo implements Runnable {
        Lock lockA;
        Lock lockB;

        public DeadLockDemo(Lock lockA, Lock lockB) {
            this.lockA = lockA;
            this.lockB = lockB;
        }

        @Override
        public void run() {
            try {
                lockA.lock();
                System.out.println(Thread.currentThread().getName() + "\t 自己持有：" + lockA + "\t 尝试获得：" + lockB);
                TimeUnit.SECONDS.sleep(2);
                lockB.lock();
                System.out.println(Thread.currentThread().getName() + "\t 自己持有：" + lockB + "\t 尝试获得：" + lockA);
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                lockA.unlock();
                lockB.unlock();
                System.out.println(Thread.currentThread().getName() + "正常结束!");
            }
        }
    }
}
```

执行该类，可以明显看到，程序不会自动结束，说明还有线程**占用资源**或者**等待资源**。

首先使用 `jps` 命令列出当前的Java进程：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210801/image-20210824103325691.png)

下面使用一些工具进行抓取死锁的线程。

## 1、jstack

找到疑似死锁的例子，找到 PID，上图中可以看到 `20148` 线程是我上面执行死锁的例子：

```java
> jstack -l 20148
20148 com.yudianxx.basic.线程.ReentrantLock.ReentrantLockDeadLock
```

> jps -l ; -l 参数可以显示完整的启动类

执行 `jstack -l 20148`

往下找，会显示一段 `deadlock` 的关键字：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210801/image-20210824112216025.png)

再看到下面，提示：

```java
at com.yudianxx.basic.线程.ReentrantLock.ReentrantLockDeadLock$DeadLockDemo.run(ReentrantLockDeadLock.java:39)
```

即可定位到死锁的类和行数。



## 2、jconsole

jconsole 位于 JDK 的 bin 目录，双击即可运行。

如下，选择需要建立连接的进程。

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210801/image-20210824101138022.png)

切换到 **线程**，再点击下方的 **检测死锁** ，即可查看死锁的情况：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210801/image-20210824112452610.png)

除此之外，jconsole 还可以查看堆内存、CPU、线程数 等其他信息。

## 3、jvisualvm

jvisualvm 也在 JDK 的 bin 目录。

选择本地的进程，上方切换至 **线程** ，再点击一下 **线程Dump** 即可。

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210801/image-20210824113514128.png)

点击后可以看到线程的状态日志，可以看到死锁的信息：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210801/image-20210824113643717.png)

## 4、jmc

同样位于 JDK 的 bin 目录。

打开你需要监测的进程：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210801/image-20210824114429643.png)

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210801/image-20210824114540025.png)

下方切换到 **线程**

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210801/image-20210824135124607.png)

图中看到的就是死锁的标识。

---

以上就是定位java线程死锁的工具，推荐使用 jstack 命令，毕竟后三个工具在Linux中是没有的。

jstack 通过找到类入口，再找出当前线程正在等待哪个线程，然后再定位到死锁的行数。





参考：

- [https://learnjava.baimuxym.cn](https://learnjava.baimuxym.cn)

- [https://rain.baimuxym.cn/article/5](https://rain.baimuxym.cn/article/5)