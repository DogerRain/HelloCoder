---
title: Java内存区域
date: 2022-05-26 17:04:00
permalink: /pages/Java%E5%86%85%E5%AD%98%E5%8C%BA%E5%9F%9F
lock: false
categories: 
  - PureJavaCoderRoad
  - Java高阶
  - JVM
tags: 
  - Java
  - 内存区域
---
很多人会误以为Java内存区域和内存模型是同一个东西，其实并不是。

**Java内存区域**是指 JVM运行时将数据分区域存储 ，简单的说就是不同的数据放在不同的地方。通常又叫 **运行时数据区域**。

**Java内存模型**（JMM）定义了程序中各个变量的访问规则，即在虚拟机中将变量存储到内存和从内存中取出变量这样的底层细节。

## 1、Java内存区域

##### 1.8 之前：

![Java内存区域 1.8之前](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20201109230052253.png)

##### JDK1.8（含）之后：

![Java内存区域 1.8](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20201109230258985.png)



区别就是 1.8有一个**元数据区**替代**方法区**了。



 JDK 1.7 其实是并没完全移除方法区，但是不会像1.6以前报 “`java.lang.OutOfMemoryError: PermGen space`”，而是报 `java.lang.OutOfMemoryError: Java heap space`

> 1.7部分内容（比如 常量池、静态变量有方法区转移到了堆）

![演变](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20201112231733936.png)

那么，Java 8 中 PermGen 为什么被移出 HotSpot JVM 了？我总结了两个主要原因（详见：[JEP 122: Remove the Permanent Generation](http://openjdk.java.net/jeps/122)）：

1. 由于 PermGen 内存经常会溢出，引发恼人的 *java.lang.OutOfMemoryError: PermGen*，因此 JVM 的开发者希望这一块内存可以更灵活地被管理，不要再经常出现这样的 OOM
2. 移除 PermGen 可以促进 HotSpot JVM 与 JRockit VM 的融合，因为 JRockit 没有永久代。

根据上面的各种原因，PermGen 最终被移除，**方法区移至 Metaspace，字符串常量移至 Java Heap**。

> 引用自https://www.sczyh30.com/posts/Java/jvm-metaspace/



下面逐一介绍一下jvm管辖的这几种内存区域。

## 2、程序计数器

程序计数器（Program Counter Register）是一块较小的内存空间，由于JVM可以并发执行线程，因此会存在线程之间的切换，而这个时候就程序计数器会记录下当前程序执行到的位置，以便在其他线程执行完毕后，恢复现场继续执行。



JVM会为每个线程分配一个程序计数器，与线程的生命周期相同。

如果线程正在执行的是应该Java方法，这个计数器记录的是正在执行虚拟机字节码指令的地址。

如果正在执行的是Native方法，计数器的值则为空（undefined）

**程序计数器是唯一一个在 Java 虚拟机规范中没有规定任何 OutOfMemoryError 情况的区域。**

## 3、Java虚拟机栈

虚拟机栈 描述的是 Java 方法执行的内存模型：

每个方法在执行的同时都会创建一个栈帧（Stack Frame，是方法运行时的基础数据结构）用于存储局部变量表、操作数栈、动态链接、方法出口等信息。每一个方法从调用直至执行完成的过程，就对应着一个栈帧在虚拟机栈中入栈到出栈的过程。 

虚拟机栈是每个线程独有的，随着线程的创建而存在，线程结束而死亡。

在虚拟机栈内存不够的时候会`OutOfMemoryError`，在线程运行中需要更大的虚拟机栈时会出现`StackOverFlowError`。

![ ](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20201112180235118.png)

虚拟机栈包含很多**栈帧**，每个方法执行的同时会创建一个栈帧，栈帧又存储了方法的局部变量表、操作数栈、动态连接和方法返回地址等信息。

> 在活动线程中，只有位于栈顶的栈帧才是有效的，称为**当前栈帧**，与这个栈帧相关联的方法称为当前方法。

##### 	1）局部变量表

局部变量表是存放**方法参数**和**局部变量**的区域。

全局变量是放在堆的，有两次赋值的阶段，一次在类加载的准备阶段，赋予系统初始值；另外一次在类加载的初始化阶段，赋予代码定义的初始值。

而局部变量没有赋初始值是不能使用的。

##### 	2）操作数栈

一个先入后出的栈。

当一个方法刚刚开始执行的时候，这个方法的操作数栈是空的，在方法的执行过程中，会有各种字节码指令往操作数栈中写入和提取内容，也就是出栈/入栈操作。

##### 	3） 动态连接

　每个栈帧都包含一个指向运行时常量池中该栈帧所属方法的引用。持有这个引用是为了支持方法调用过程中的动态连接(Dynamic Linking)。

> 常量池可以便于指令的识别

```java
    public void methodA(){
        
    }
    public void methodB(){
        methodA();//methodB()调用methodA(),先找到调用methodA()的版本符号，再变为直接引用
    }
```

方法调用并不等同于方法执行，方法调用阶段唯一的任务就是确定被调用方法的版本(即调用哪一个方法)，这也是Java强大的扩展能力，在运行期间才能确定目标方法的**直接引用**。

所有方法调用中的目标方法在Class文件里面都是一个常量池中的符号引用，在类加载的解析阶段，会将其中的一部分符号引用转化为直接引用。

##### 	4）方法返回地址（方法出口）

返回分为 正常返回 和 异常退出。

无论何种退出情况，都将返回至方法当前被调用的位置，这也程序才能继续执行。

一般来说，方法正常退出时，调用者的PC计数器的值可以作为返回地址，栈帧中会保存这个计数器值。

方法退出的过程相当于弹出当前栈帧。

## 4、本地方法栈

Java虚拟机栈是调用Java方法；本地方法栈是调用本地native方法，可以认为是通过 `JNI` (Java Native Interface) 直接调用本地 C/C++ 库，不受JVM控制。

![ Native方法 ](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20201102143405046.png)

![Java虚拟机栈与本地方法栈的调用过程](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20201112232713327.png)

本地方法栈也会抛出 **StackOverflowError** 和 **OutOfMemoryError** 异常

## 5、Java堆

Java 堆是被所有**线程共享**的一块内存区域，在虚拟机启动时创建。此内存区域的唯一目的就是存放对象实例，几乎所有的对象实例都在这里分配内存。

堆是垃圾收集器管理的主要区域，又称为“GC堆”，可以说是Java虚拟机管理的内存中最大的一块。

现在的虚拟机（包括**HotSpot VM**）都是采用分代回收算法。在分代回收的思想中， 把堆分为：新生代+老年代+永久代（1.8没有了）； 新生代 又分为 Eden + From Survivor + To Survivor区。

![ ](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201030143215163.png)

## 6、方法区

方法区（Method Area）与 Java 堆一样，是所有**线程共享**的内存区域。

方法区用于存储已经被虚拟机加载的类信息（即加载类时需要加载的信息，包括版本、field、方法、接口等信息）、final常量、静态变量、编译器即时编译的代码等。

方法区逻辑上属于堆的一部分，但是为了与堆进行区分，通常又叫“非堆”。

方法区比较重要的一部分是**运行时常量池**（Runtime Constant Pool），为什么叫运行时常量池呢？是因为运行期间可能会把新的常量放入池中，比如说常见的String的intern()方法。

```java
String a = "I am HaC";
Integer b = 100;
```

在编译阶段就把所有的字符串文字放到一个常量池中，复用同一个（比如说上述的“I am HaC”），节省空间。

**关于方法区和元空间的关系：**

>方法区是JVM规范概念，而永久代则是Hotspot虚拟机特有的概念，简单点理解：方法区和堆内存的永久代其实一个东西，但是方法区是包含了永久代。
>
>只有 HotSpot 才有 “PermGen space”，而对于其他类型的虚拟机，如 JRockit（Oracle）、J9（IBM） 并没有“PermGen space”

## 7、元空间

1.8就把方法区改用元空间了。类的元信息被存储在元空间中。元空间没有使用堆内存，而是与堆不相连的**本地内存区域**。所以，理论上系统可以使用的内存有多大，元空间就有多大，所以不会出现永久代存在时的内存溢出问题。

可以通过 `-XX:MetaspaceSize` 和 `-XX:MaxMetaspaceSize` 来指定元空间的大小。



## 8、总结：

 ![Java内存区域](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/Java内存区域.png)



参考：

- https://www.cnblogs.com/czwbig/p/11127124.html
- https://blog.csdn.net/xyh930929/article/details/84067186
- https://www.cnblogs.com/paddix/p/5309550.html
- 《深入理解Java虚拟机》
- 《码出高效》