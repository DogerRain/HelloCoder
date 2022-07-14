---
title: Java线程类面试题库（一）
date: 2022-06-02 11:18:16
lock: true
permalink: /pages/Java%E7%BA%BF%E7%A8%8B%E7%B1%BB%E9%9D%A2%E8%AF%95%E9%A2%98%E5%BA%93%EF%BC%88%E4%B8%80%EF%BC%89
categories: 
  - LearnJavaToFindAJob
  - 【初级】6~12k档
  - 牛客网题库
tags: 
  - Java
---
##### 1、关于下面一段代码，以下说法正确的是： ()

```java
public class Test {
    private synchronized void a() {
    }
    private void b() {
        synchronized (this) {
        }
    }
    private synchronized static void c() {
    }
    private void d() {
        synchronized (Test.class) {
        }
    }
}
```

A	同一个对象，分别调用方法a和b，锁住的是同一个对象

B	同一个对象，分别调用方法a和c，锁住的是同一个对象

C	同一个对象，分别调用方法b和c，锁住的不是同一个对象

D	同一个对象，分别调用方法a、b、c，锁住的不是同一个对象



**A C D**  

修饰非静态方法 锁的是this 对象

修饰静态方法 锁的是class对象



##### 2、下列说法正确的是( )

A	volatile,synchronized 都可以修改变量，方法以及代码块

B	volatile，synchronized 在多线程中都会存在阻塞问题

C	volatile能保证数据的可见性，但不能完全保证数据的原子性，synchronized即保证了数据的可见性也保证了原子性

D	volatile解决的是变量在多个线程之间的可见性、原子性，而sychroized解决的是多个线程之间访问资源的同步性



**C**

>volatile只能修改变量，synchronized可以修饰方法，以及代码块
>多线程访问volatile不会发生阻塞，而synchronized会出现阻塞
>volatile能保证数据的可见性，但不能保证原子性
>关键字volatile解决的下变量在多线程之间的可见性；而synchronized解决的是多线程之间资源同步问题
>
>———<<Java多线程编程核心技术>>



#####  3、下面关于volatile的功能说法正确的是哪个

A	原子性

B	有序性

C	可见性

D	持久性



**B C**

synchronized 保证三大性，原子性，有序性，可见性，

volatile 保证有序性，可见性，不能保证原子性。



##### 4、 对于线程局部存储TLS(thread local storage)，以下表述正确的是

A	解决多线程中的对同一变量的访问冲突的一种技术

B	TLS会为每一个线程维护一个和该线程绑定的变量的副本

C	每一个线程都拥有自己的变量副本，从而也就没有必要对该变量进行同步了

D	Java平台的java.lang.ThreadLocal是TLS技术的一种实现



**A B D** 

ThreadLocal只是为每个线程处理自己的状态而引入的一个机制，不是用来解决每个线程共享变量的问题。



##### 5、当编译并运行下面程序时会发生什么结果（）

```java
public class Bground extends Thread{
    public static void main(String argv[]){
        Bground b = new Bground();
        b.run();
    }
    public void start(){
        for(int i=0;i<10;i++){
            System.out.println("Value of i = "+i);
        }
    }
}
```

A	编译错误，指明run方法没有定义

B	运行错误，run方法没有定义

C	编译通过并输出0到9

D	编译通过，但无输出



**D**

对于线程而言，start是让线程从new变成runnable。run方法才是执行体的入口。
但是在Thread中，run方法是个空方法，没有具体实现。
Bground继承了Thread，但是没有重写run方法，那么调用run方法肯定是无输出。



##### 6、下列哪些情况下会导致线程中断或停止运行（      ）

A	InterruptedException异常被捕获

B	线程调用了wait方法

C	当前线程创建了一个新的线程

D	高优先级线程进入就绪状态



**A B**

A选项正确，Java中一般通过interrupt方法中断线程

B选项正确，线程使用了wait方法，会强行打断当前操作，进入阻塞（暂停）状态，然后需要notify方法或notifyAll方法才能进入就绪状态

C选项错误，新创建的线程不会抢占时间片，只有等当前线程把时间片用完，其他线程才有资格拿到时间片去执行。

D选项错误，调度算法未必是剥夺式的，而准备就绪但是还没有获得CPU，它的权限更高只能说明它获得CPU被执行的几率更大而已



##### 7、以下多线程对int型变量x的操作,哪个不需要进行同步()

A	++x

B	x=y

C	x++

D	x=1



**D**

前三个不是原子操作，最后一个直接赋值，为原子操作。



##### 8、下列哪些操作会使线程释放锁资源？

A	sleep()

B	wait()

C	join()

D	yield()



**BC**

1.sleep会使当前线程睡眠指定时间，不释放锁
2.yield会使当前线程重回到可执行状态，等待cpu的调度，不释放锁
3.wait会使当前线程回到线程池中等待，释放锁，当被其他线程使用notify，notifyAll唤醒时进入可执行状态
4.当前线程调用 某线程.join（）时会使当前线程等待某线程执行完毕再结束，底层调用了wait，释放锁



##### 9、关于多线程和多进程，下面描述正确的是（）：

A	多进程里，子进程可获得父进程的所有堆和栈的数据；而线程会与同进程的其他线程共享数据，拥有自己的栈空间。

B	线程因为有自己的独立栈空间且共享数据，所有执行的开销相对较大，同时不利于资源管理和保护。

C	线程的通信速度更快，切换更快，因为他们在同一地址空间内。

D	一个线程可以属于多个进程。



**A C** 

1、一个线程只能属于一个进程，而一个进程可以有多个线程，但至少有一个线程（通常说的主线程）。

2、资源分配给进程，同一进程的所有线程共享该进程的所有资源。线程之间共享进程获得的数据资源，所以开销小，但不利于资源的管理和保护；而进程执行开销大，但是能够很好的进行资源管理和保护。

3、 子进程的所有资源都继承父进程，得到父进程资源的副本，子进程可获得父进程的所有堆和栈的数据，但二者并不共享地址空间。但线程拥有属于自己的一小部分资源，就是栈空间，保存其运行状态和局部自动变量的。



##### 10、假设如下代码中，若t1线程在t2线程启动之前已经完成启动。代码的输出是（）

```java
public static void main(String[]args)throws Exception {
    final Object obj = new Object();
    Thread t1 = new Thread() {
        public void run() {
            synchronized (obj) {
                try {
                    obj.wait();
                    System.out.println("Thread 1 wake up.");
                } catch (InterruptedException e) {
                }
            }
        }
    };
    t1.start();
    Thread.sleep(1000);//确保线程1先运行
    Thread t2 = new Thread() {
        public void run() {
            synchronized (obj) {
                obj.notifyAll();
                System.out.println("Thread 2 sent notify.");
            }
        }
    };
    t2.start();
}
```

A	Thread 1 wake up
	  Thread 2 sent notify.

B	Thread 2 sent notify.
 	  Thread 1 wake up

C	 A、B皆有可能

D	 程序无输出卡死



**B**

notify()、notifyAll() 调用后，并不是马上就释放对象锁的。所以t2先执行完了，然后释放了obj的锁，t1才能执行。