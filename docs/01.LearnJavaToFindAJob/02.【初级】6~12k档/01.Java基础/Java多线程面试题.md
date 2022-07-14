---
title: Java多线程面试题
date: 2022-06-02 11:18:18
lock: false
permalink: /pages/Java%E5%A4%9A%E7%BA%BF%E7%A8%8B%E9%9D%A2%E8%AF%95%E9%A2%98
categories: 
  - LearnJavaToFindAJob
  - 【初级】6~12k档
  - Java基础
tags: 
  - Java
---
### 1、 线程创建方式

- 继承Thread类
- 实现runnable接口
- 匿名内部类创建线程
- 创建带返回值的Callable
- 线程池创建线程



### 2、Runnable接口与Callable接口的区别

- 同：

都是接口。

- 异：

Runnable接口中的run()方法的返回值是void，它做的事情只是纯粹地去执行run()方法中的代码而已；

Callable接口中的call()方法是有返回值的，是一个泛型，和Future、FutureTask配合可以用来获取异步执行的结果。



### 3、volatile和synchronized区别

volatile关键字是线程同步的轻量级实现，所以volatile性能肯定比synchronized关键字要好。

但是volatile关键字只能用于变量，而synchronized关键字可以修饰方法以及代码块。

synchronized关键字在JavaSE1.6之后进行了主要包括为了减少获得锁和释放锁带来的性能消耗而引入的偏向锁和轻量级锁以及其它各种优化之后执行效率有了显著提升，实际开发中使用 synchronized 关键字的场景还是更多一些。

多线程访问volatile关键字不会发生阻塞，而synchronized关键字可能会发生阻塞。

volatile关键字能保证数据的可见性，但不能保证数据的原子性。synchronized关键字两者都能保证。

volatile关键字主要用于解决变量在多个线程之间的**可见性**，而 synchronized关键字解决的是多个线程之间访问资源的同步性。

synchronized 保证三大性：**原子性，有序性，可见性**，

volatile 保证**有序性，可见性，不能保证原子性**。



### 4、sleep方法和wait方法有什么区别

sleep方法和wait方法都可以用来放弃CPU一定的时间暂停当前运行的线程，不同点在于如果线程持有某个对象的监锁，**sleep方法不会释放这个对象的锁，wait方法会释放这个对象的锁**，sleep必须要设定时间，而wait可以设定也可以不设定。

Sleep属于Thread类，wait属于Object类。



### 5、什么是多线程的上下文切换

多线程的上下文切换是指CPU控制权由一个已经正在运行的线程切换到另外一个就绪并等待获取CPU执行权的线程的过程。



### 6、如果提交任务时，线程池队列已满，会发生什么

如果使用的LinkedBlockingQueue，也就是无界队列的话，继续添加任务到阻塞队列中等待执行，因为LinkedBlockingQueue可以无限存放任务；如果使用的是有界队列比方说ArrayBlockingQueue的话，则会使用拒绝策略RejectedExecutionHandler处理满了的任务。



### 7、什么是线程局部变量ThreadLocal

线程局部变量是局限于线程内部的变量，属于线程自身所有，不在多个线程间共享。 它是一种特殊的线程绑定机制，将变量与线程 绑定 在一起，为每一个线程维护一个独立的变量副本。Java 提供 ThreadLocal 类来支持线程局部变量，是一种实现线程安全的方式。

ThreadLocal 无法解决共享对象的更新问题， ThreadLocal 对象建议使用 static修饰。这个变量是针对一个线程内所有操作共有的，所以设置为静态变量，所有此类实例共享此静态变量 ，也就是说在类第一次被使用时装载，只分配一块存储空间，所有此类的对象 ( 只要是这个线程内定义的 ) 都可以操控这个变量。

**ThreadLocal造成内存泄漏的原因？如何解决？**

> 参考：https://mp.weixin.qq.com/s?__biz=MzAxNTc4ODYzOQ==&mid=2247484359&idx=1&sn=4c501e11010297c323043d0ebc5243f0&chksm=9bfffcf7ac8875e13729c01505f68e20d16dd8f5329b053d79d84f2341504c3b8240ebfc7e86&token=602231616&lang=zh_CN#rd



### 8、线程池中submit() 和 execute()方法有什么区别

两个方法都可以向线程池提交任务，execute()方法的返回类型是void，它定义在Executor接口中, 而submit()方法可以返回持有计算结果的Future对象。



---

以上这几个问题，如果你不是很清楚，建议复习一遍多线程的知识，多线程是面试必问的内容，也是一个复杂的知识点，在学习Java的过程中是一定要搞明白的，可以参考我的专栏，一共分为15篇文章：

https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&album_id=1519640768087457793&__biz=MzAxNTc4ODYzOQ==#wechat_redirect



### 9、start 与 run 的区别

1. start（）方法来启动线程，真正实现了多线程运行。这时无需等待 run 方法体代码执行完毕，可以直接继续执行下面的代码。

2. 通过调用 Thread 类的 start()方法来启动一个线程， 这时此线程是处于就绪状态， 并没有运行。

3. 方法 run()称为线程体，它包含了要执行的这个线程的内容，线程就进入了运行状态，开始运行 run 函数当中的代码。 Run 方法运行结束， 此线程终止。然后 CPU 再调度其它线程。

   

###  10、synchronized 和   ReentrantLock 的区别

同：

1.  都是用来协调多线程对共享对象、变量的访问
2.  都是可重入锁，同一线程可以多次获得同一个锁
3.  都保证了可见性和互斥性

异：

1.  ReentrantLock 显示的获得、释放锁，synchronized 隐式获得释放锁
2.  ReentrantLock 可响应中断、可轮回，synchronized 是不可以响应中断的，为处理锁的
不可用性提供了更高的灵活性
3.  ReentrantLock 是 API 级别的，synchronized 是 JVM 级别的
4.  ReentrantLock 可以实现公平锁
5.  ReentrantLock 通过 Condition 可以绑定多个条件
6.  底层实现不一样， synchronized 是同步阻塞，使用的是悲观并发策略，lock 是同步非阻
塞，采用的是乐观并发策略
7.  Lock 是一个接口，而 synchronized 是 Java 中的关键字，synchronized 是内置的语言
实现。
8.  synchronized 在发生异常时，会自动释放线程占有的锁，因此不会导致死锁现象发生；
而 Lock 在发生异常时，如果没有主动通过 unLock()去释放锁，则很可能造成死锁现象，
因此使用 Lock 时需要在 finally 块中释放锁。
9.  Lock 可以让等待锁的线程响应中断，而 synchronized 却不行，使用 synchronized 时，
等待的线程会一直等待下去，不能够响应中断。
10. 通过 Lock 可以知道有没有成功获取锁，而 synchronized 却无法办到。
11. Lock 可以提高多个线程进行读操作的效率，既就是实现读写锁等。



### 11、线程的调度策略

线程调度器选择优先级最高的线程运行，但是，如果发生以下情况，就会终止线程的运行：

（1）线程体中调用了 yield 方法让出了对 cpu 的占用权利

（2）线程体中调用了 sleep 方法使线程进入睡眠状态

（3）线程由于 IO 操作受到阻塞

（4）另外一个更高优先级线程出现

（5）在支持时间片的系统中，该线程的时间片用完



### 12、如何停止一个正在运行的线程？

1. 使用退出标志（比如return），使线程正常退出，也就是当run方法完成后线程终止。
2. 使用stop方法强行终止，但是不推荐这个方法，因为stop和suspend及resume一样都是过期作废的方法。
3. 使用interrupt方法中断线程。



