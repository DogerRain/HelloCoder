---
title: Java内存模型的happen-before
date: 2022-05-26 17:04:00
permalink: /pages/Java%E5%86%85%E5%AD%98%E6%A8%A1%E5%9E%8B%E7%9A%84happen-before
lock: false
categories: 
  - PureJavaCoderRoad
  - Java高阶
  - JVM
tags: 
  - Java
  - happenbefore
  - 内存模型的
---
happen-before 和 指令重排序不是一个概念。

要清楚happen-before ，首先要知道Java内存模型。



## 指令重排序

在执行程序时，**为了提高性能，编译器和处理器常常会对指令进行重排序**。

*所以说我们书写代码的顺序，并不是等同于代码在CPU真正执行的顺序。*

这些重排序会导致线程安全的问题，一个很经典的例子就是双重锁定检查（DCL）。

DCL问题可以看看： https://www.jianshu.com/p/ca19c22e02f4 （单例模式）

JMM的编译器重排序规则会禁止一些特定类型的编译器重排序；针对处理器重排序，编译器在生成指令序列的时候会通过**插入内存屏障**指令来禁止某些特殊的处理器重排序。

**内存屏障**

编译器和处理器都必须遵守重新排序规则。不需要特别的努力来确保单处理器保持适当的顺序，因为它们都保证“按顺序”一致性。但是在多处理器上，要保证一致性，通常需要发出屏障指令。即使编译器优化了字段访问（例如，因为未使用加载的值），也必须仍然生成屏障，就像访问仍然存在一样。

> 内存屏障的概念以及：http://gee.cs.oswego.edu/dl/jmm/cookbook.html



指令重排序可以分为三种：

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/20181009231337835)

（1）编译器优化的重排序。编译器在不改变单线程程序语义的前提下，可以重新安排语句的执行顺序；
（2）指令级并行的重排序。现代处理器采用了指令级并行技术来将多条指令重叠执行。如果不存在数据依赖性，处理器可以改变语句对应机器指令的执行顺序；
（3）内存系统的重排序。由于处理器使用缓存和读/写缓冲区，这使得加载和存储操作看上去可能是在乱序执行的。

比如说：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/20181009231434528)

由于A,B之间没有任何关系，对最终结果也不会存在关系，它们之间执行顺序可以重排序。因此可以执行顺序可以是A->B->C或者B->A->C执行最终结果都是3.14，即A和B之间没有数据依赖性。

以上部分参考自：https://blog.csdn.net/ma_chen_qq/article/details/82990603

## happen-before

happen-before 是 Java 内存模型中保证多线程操作可见性的机制，也是对早期语言规范中含糊的可见性概念的一个精确定义。

内存模型通过happen-before 关系向程序员提供跨线程的内存可见保证性（**如果A线程的写操作a与B线程的读操作b之间存在happens-before关系，尽管a操作和b操作在不同的线程中执行，但JMM向程序员保证a操作将对b操作可见**）。

**具体的定义为：**
1）如果一个操作happens-before另一个操作，那么第一个操作的执行结果将对第二个操作可见，而且第一个操作的执行顺序排在第二个操作之前。

2）两个操作之间存在happens-before关系，并不意味着Java平台的具体实现必须要按照happens-before关系指定的顺序来执行。如果重排序之后的执行结果，与按happens-before关系来执行的结果一致，那么这种重排序并不非法（也就是说，JMM允许这种重排序）。



happen-before规则一共就八条：

### 1、单线程happen-before原则：在同一个线程中，书写在前面的操作happen-before后面的操作。

比如说：

```java
int a = 3;      //1
int b = a + 1;  //2
```

这里 //1对变量a的赋值操作对//2一定可见。

因为//2 中有用到//1中的变量a，再加上java内存模型提供了“单线程happen-before原则”，所以java虚拟机不许可操作系统对//1 //2 操作进行指令重排序。

如果是：

```java
int a = 3;
int b = 4;
```

指令重排序则可能发生。

### 2、锁的happen-before原则：同一个锁的unlock操作happen-before此锁的lock操作。

常见的就是synchronized、reentrantLock加锁。

解锁操作的结果对后面的加锁操作一定是可见的，无论两个是否在一个线程；简单的说就是线程A加了锁，在我没有解锁之前，线程B是无法进入的，而当线程A解锁了，线程B是可以感知的。

例子就不举了，前面的synchronized文章有说到。

### 3、volatile的happen-before原则： 对一个volatile变量的写操作happen-before对此变量的任意操作。

对 volatile 变量的写操作的结果对于发生于其后的任何操作的结果都是可见的。x86 架构下volatile 通过**内存屏障**和**缓存一致性协议**实现了变量在多核心之间的一致性。

```java
volatile int a;
//线程A执行
a = 1; //1
//线程B执行
b = a;  //2
```

如果线程A 执行//1，线程B执行了//2，并且“线程A”执行后,“线程B”再执行,那么符合“volatile的happen-before原则”所以“线程2”中的a值一定是1，而不会是初始值0。

###  4、happen-before的传递性原则：  如果A操作 happen-before B操作，B操作happen-before C操作，那么A操作happen-before C操作。

可以根据这两个规则推导出两个没有直接联系的操作其实是存在happen-before 关系的。

#### 5、 线程启动的happen-before原则：同一个线程的start方法happen-before此线程的其它方法。

翻译成人话就是：我在main线程 赋值了一个字段，下一步我又通过`start()`启动一个线程，那么这个main线程赋值操作对子线程是可见的。

```java
int a ;
//main线程
a = 1;
new Thread().start();

//子线程
b = a // b等于1
```

### 6、线程中断的happen-before原则：对线程interrupt方法的调用happen-before被中断线程的检测到中断发送的代码。

### 7、 线程终结的happen-before原则：线程中的所有操作都happen-before线程的终止检测，又叫做join规则

这两点可以理解为线程之间的通信，主线程对子线程发出通知，子线程是可以感知的。同时主线程可以感知子线程的状态。

### 8、 对象finalize规则：一个对象的初始化完成（构造函数执行结束）先行于发生它的finalize()方法的开始。

即先有类的初始化才有销毁，感觉这个和类加载器有关系。



---

happen-before，它不能简单地说前后关系，是因为它不仅仅是对执行时间的保证，也包括对内存读、写操作顺序的保证。

它和时间没有任何关系，仅仅是时钟顺序上的先后，并不能保证线程交互的可见性。



对于学习JMM，个人觉得不要陷得太深，毕竟这东西和CPU打交道，纠结于这些复杂的东西，未必有价值。



## 拓展：DCL的问题

double-check-locking 

先来看看常用第一种的单例模式：

```java
public class SingleInstance {
    private static SingleInstance instance = null;

    public static SingleInstance getInstance() {
        if (instance == null) { // 1
            instance = new SingleInstance();// 2
        }
        return instance;
    }
}
```

假如两个并发线程同时 getInstance()，线程A先判断是否为null，即`// 1` 处；刚判断完jvm将cpu资源给了线程B，由于线程B没有执行到`// 2` 处，所以 instance 还是空的，线程B就new了，然后又切换为线程A，又new一次，这样就会导致单例类被实例化两次。

> 既然需要有序性，可以加synchronized

第二次改进：

```java
public class SingleInstance {
    private static SingleInstance instance = null;
    //加锁，但是不要在外面加，每次调用这个方法就很耗时了，重量级
//    public synchronized static SingleInstance getInstanceSync() {
    public static SingleInstance getInstanceSync() {
        //这种也没啥意义，一样是重量级的，每次进入都需要检查
        synchronized (SingleInstance.class) {
            if (instance == null) { // 1
                instance = new SingleInstance();// 2
            }
        }
        return instance;
    }
}
```

上面是加了`synchronized`之后的版本，会避免多个线程产生多个实例，但是这种方法会影响性能。

可以改成这样：

第三次改进：

```java
public class SingleInstance {
	private static SingleInstance instance = null;

    public static SingleInstance getInstanceSync() {
        if (instance == null) {
            synchronized (SingleInstance.class) {
                if (instance == null) { // 1
                    instance = new SingleInstance();// 2
                }
            }
        }
        return instance;
    }
}
```

但是还是会有问题。

 `instance = new SingleInstance()`这里看起来是一句话，但实际上它并不是一个原子操作（原子操作的意思就是这条语句要么就被执行完，要么就没有被执行过，不能出现执行了一半这种情形）。事实上高级语言里面非原子操作有很多，我们只要看看这句话被编译后在JVM执行的对应汇编代码就发现，这句话被编译成8条汇编指令，大致做了3件事情：

1. 给SingleInstance的实例分配内存。

2. 初始化SingleInstance的构造器。

3. 将instance对象**指向**分配的内存空间（注意到这步instance就非null了）。

但是，由于Java编译器允许处理器乱序执行（out-of-order），以及JDK1.5之前JMM（Java Memory Medel）中Cache、寄存器到主内存回写顺序的规定，上面的第2点和第3点的顺序是无法保证的，也就是说，执行顺序可能是`1-2-3`也可能是`1-3-2`，如果是后者，并且在3执行完毕、2未执行之前，被切换到线程二上，这时候instance因为已经在线程一内执行过了第三点，instance已经是非空了，所以线程二直接拿走instance，然后使用，然后就会报错了。

> 简单来说可能存在某个线程拿到了一个没有执行构造方法的对象

第四次改进：

```java
public class SingleInstance {
	private volatile static SingleInstance instance = null;

    public static SingleInstance getInstanceSync() {
        if (instance == null) {
            synchronized (SingleInstance.class) {
                if (instance == null) { // 1
                    instance = new SingleInstance();// 2
                }
            }
        }
        return instance;
    }
}
```



在Java中设置变量值的操作，除了long和double类型的变量外都是原子操作，也就是说，对于变量值的简单读写操作没有必要进行同步。

> 于long和double变量，把他们作为2个原子性的32位值来对待，而不是一个原子性的64位值，
>  这样将一个long型的值保存到内存的时候，可能是2次32位的写操作，
>  2个竞争线程想写不同的值到内存的时候，可能导致内存中的值是不正确的结果。
>
> 1、写入高位32位值(线程2)
> 2、写入高位32位值(线程1)
> 3、写入低位32位值(线程1)
> 4、写入低位32位值(线程2)
>
> 这样内存中的值变成线程1的高32位值和线程2的低32位值的组合，是个错误的值。volatile本身不保证获取和设置操作的原子性，仅仅保持修改的可见性。但是java内存模型保证声明为volatile的long和double变量的get和set操作是原子的。
>
> 作者：达微
> 链接：https://www.jianshu.com/p/f40d96d91c1c

上面这个例子使用volatile屏蔽掉了VM中必要的代码优化（防止指令重排序），所以在效率上比较低，会带来一些性能问题，因此一定在必要时才使用此关键字。

