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


## 指令重排序

在执行程序时，**为了提高性能，编译器/CPU 常常会对指令进行重排序**。

常见的指令重排序有下面 2 种情况：

- **编译器优化重排**：编译器（包括 JVM、JIT 编译器等）在不改变单线程程序语义的前提下，重新安排语句的执行顺序。
- **指令并行重排**：现代处理器采用了指令级并行技术(Instruction-Level Parallelism，ILP)来将多条指令重叠执行。如果不存在数据依赖性，处理器可以改变语句对应机器指令的执行顺序。



*所以说我们书写代码的顺序，并不是等同于代码在CPU真正执行的顺序。*

这些重排序会导致线程安全的问题，一个很经典的例子就是双重锁定检查（DCL）。



**指令重排序的一个重要限制**：**不能改变单线程程序的执行结果**（as-if-serial 语义）。



以下是一个例子：

```java
public class YourExampleFixed {
    int x = 0;
    int y = 0;
    
    void correctReorderingPossibilities() {
        // 原始：
        x = 1;          // A
        y = 2;          // B  
        int sum = x + y; // C（依赖A和B）
        
        // ✅ 允许的重排序1：交换A和B（独立写）
        y = 2;          // B先执行
        x = 1;          // A后执行
        int sum = x + y; // C（还是1+2=3）
        
        // ✅ 允许的重排序2：提前读取（读取的是初始化值0）
        int sum = x + y; // C先执行（0+0=0）⚠️ 这改变了结果！
        x = 1;          // A
        y = 2;          // B
        // ❌ 不允许！因为改变了单线程结果
        // 因为这种重排序会改变单线程程序的执行结果，违反了as-if-serial语义，编译器和CPU不会这样做

    }
}
```

 

## happen-before规则

happen-before的语义：**前一个操作的结果对于后一个操作是可见的**

> 操作 1 happens-before 操作 2，操作 1 的结果对操作 2 是可见的。（或者说操作1先发生于操作2）



happens-before 的规则有 8 条。

### 1. 程序次序规则

> 一个线程内，代码前面操作 happens-before 后面操作。
>
> **理解**：单线程看似代码从上往下执行，JMM 允许不破坏单线程结果的指令重排；只要单线程执行结果不变，内部可以重排，只是从**可见性逻辑上**前面操作 hb 后面。

### 2. 锁解锁规则（monitor）

> 同一个锁：解锁 happens-before 后续加锁。
>
> **理解**：线程 A 释放 synchronized 锁，A 所有共享变量刷新到主存；后续线程 B 获取同一把锁，能看见 A 解锁前所有修改，是 synchronized 可见性的底层依据。

### 3. volatile 读写规则

> volatile 写 happens-before 后续任意 volatile 读。
>
> **理解**：写完 volatile 立刻刷入主存；后面读 volatile 强制清空本地缓存拿新值，是 volatile 可见性的 happens-before 来源。

### 4. 传递性规则

> A hb B，B hb C → A hb C。
>
> **理解：最关键串联规则**，可以跨同步组件传递可见性：
>
> 举例：普通变量赋值→写 volatile (hb)→读 volatile (hb)→普通读取，前面赋值对后面读取可见。

### 5. 线程 start 启动规则

> Thread.start () happens-before 子线程内所有代码。
>
> **理解**：主线程在 start () 之前的所有变量修改，子线程内部一定可见。







下面是对上面规则的一些例子：



JMM 通过 happen-before 关系向程序员提供**跨线程**的内存可见保证性（**如果A线程的写操作a与B线程的读操作b之间存在happens-before关系，尽管a操作和b操作在不同的线程中执行，但JMM向程序员保证a操作将对b操作可见**）。



单线程：

```java
// 线程内，代码顺序提供happens-before
class ProgramOrder {
    int x = 0;
    
    void method() {
        x = 1;          // 操作A
        int y = x + 1;  // 操作B
        // A happens-before B  ，程序顺序规则：同一线程中，前面的写操作 happens-before 后面的操作
        // B一定能看到A写入的1
    }
}
```

> **程序顺序规则**：同一线程中，前面的操作 happens-before 后面的操作



 多线程：

```java
class VolatileRule {
    private int data = 0;
    // volatile限制特定类型的重排序
    private volatile boolean ready = false;
    
    // 线程1：写数据
    void writer() {
        data = 42;          // 普通写 (1)
        ready = true;       // volatile写 (2)
        // (1) happens-before (2)
        // (2) happens-before 所有后续的ready读
    }
    
    // 线程2：读数据  
    void reader() {
        if (ready) {        // volatile读 (3)
      //保证看到 42 ，而不是线程1 重排序后，先执行 ready = true 再执行线程2，这样线程2就会看到 0
            System.out.println(data); //  (4) 
            // (2) happens-before (3)
            // (3) happens-before (4)
            // 所以 (1) happens-before (4)！
        }
    }
}
```

> **volatile 变量规则**：volatile 写 happens-before volatile 读



可以说：volatile建立跨线程的可见性保证和重排序约束，具体实现原理就是 StoreStore屏障



## 常见误解澄清

### 误解1："happens-before禁止所有重排序"



```java
// ❌ 错误理解
class Misunderstanding1 {
    int a = 0, b = 0;
    
    void wrong() {
        // 认为：a=1 happens-before b=2
        // 所以：a=1 和 b=2不能重排序
        
        a = 1;
        b = 2;
        // 实际上：单线程内可以重排序！
        // happens-before只保证可见性，不禁止无害重排序（因为这两个操作无联系）
    }
}
```



### 误解2："所有volatile操作都不能重排序"



```java
// ❌ 错误理解  
class Misunderstanding2 {
    volatile int v1 = 0, v2 = 0;
    
    void wrong() {
        // 认为：两个volatile变量操作不能重排序
        v1 = 1;
        v2 = 2;
        // 实际上：可以重排序！
        // volatile只保证：写v1 happens-before 读v1
        // 不保证：写v1 happens-before 写v2
    }
}
```





**指令重排序和happens-before是"矛和盾"的关系：**

| 指令重排序（矛）             | happens-before（盾）           |
| :--------------------------- | :----------------------------- |
| **攻击方**：试图优化指令顺序 | **防守方**：设置规则约束重排序 |
| **目标**：提高单线程性能     | **目标**：保证多线程正确性     |
| **策略**：能重排就重排       | **策略**：该禁止时就禁止       |



## 拓展：DCL的问题 - 单例模式

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



上面这个例子使用volatile屏蔽掉了VM中必要的代码优化（防止指令重排序），所以在效率上比较低，会带来一些性能问题，因此一定在必要时才使用此关键字。

