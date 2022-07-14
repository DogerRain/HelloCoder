---
title: 谈谈Java的垃圾回收
date: 2022-05-26 17:04:00
permalink: /pages/%E8%B0%88%E8%B0%88Java%E7%9A%84%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6
lock: false
categories: 
  - PureJavaCoderRoad
  - Java高阶
  - JVM
tags: 
  - Java
  - 谈谈
  - 垃圾回收
---
Java的垃圾回收老生常谈了，了解Java的GC对我们优化代码，设置参数性能调优有很大的帮助。

特别是面试也经常会问到。

本篇文章一次性帮你总结Java的垃圾回收知识点，主要围绕以下问题展开：

![小朋友你是否有很多问号](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/GC.png)

## 1、为什么要有GC，哪些内存对象需要回收？

对于一个Java开发者来说，了解过Java内存区域的都知道，Java内存区域分了堆、栈、程序计数器等等。

Java的程序计数器，栈内存 ，他们随线程生，随线程灭，方法结束后内存也就回收了。

> 一个字符串“abc”已经进入常量池，但是当前系统没有任何一个String对象引用了做“abc”的字面量，那么，如果发生垃圾回收并且有必要时，“abc”就会被系统移出常量池。
>
> 
>
> 常量池中的其他类（接口）、方法、字段的符号引用也与此类似。

当Java虚拟机发现内存资源紧张的时候，就会自动地去清理无用变量所占用的内存空间，为我们的程序提升更高的性能。

## 2、如何判断对象需要回收？

一般常见的两种回收判断算法：

### 2.1、 引用计数算法

给对象中添加一个引用计数器，每当有一个地方引用它时，计数器值就加1；当引用失效时，计数器值就减1。

任何时刻计数器为0的对象就是不可能再被使用的。

![ ](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20201112173947055.png)

该方法实现简单，效率高，但是它很难它很难解决对象之间相互循环引用的问题。比如图中的 `Object3` 和`Object4`相互引用，引用计数不可能为0，虽然它们已经没有被Root引用了。

所以，大多数jvm判断对象是否存活基本并没有采取该方法。



### 2.2、可达性分析算法（根搜索算法）

这个算法的基本思路就是通过一系列的称为“GC Roots”的对象作为起始点，从这些节点开始向下搜索,搜索所走过的路径称为引用链(Reference Chain)。

当一个对象到GC Roots没有任何引用链相连时（不可达）则证明此对象是不可用的。

>要注意的是，不可达对象不等价于可回收对象，不可达对象变为可回收对象至少要经过两次标记过程。两次标记后仍然是可回收对象，则将面临回收。

![ ](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20201112173028555.png)



**被认为GC Roots的有以下几种：**

- 虚拟机栈中引用的对象
- 方法区中静态属性、常量引用的对象 
- Native方法引用的对象



## 3、如何回收（垃圾收集算法）？

随着Java虚拟机的发展，jvm衍生出了很多种垃圾回收算法。

#### 1、标记-清除（Mark-Sweep）算法

最基础的垃圾回收算法，分为两个阶段，标记和清除。

标记阶段标记出所有需要回收的对象，清除阶段回收被标记的对象所占用的空间。

![ ](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/249993-20170307205221484-1705867339.png)

从图中我们就可以发现，该算法最大的问题是内存碎片化严重，后续可能发生大对象不能找到可利用空间的问题。

#### 2、复制算法（copying ）

为了解决 Mark-Sweep 算法内存碎片化的缺陷而被提出的算法。按内存容量将内存划分为**相等大小**的两块。

每次只使用其中一块，当这一块内存满后将尚存活的对象复制到另一块上去，把已使用的内存清掉，如图：

![ ](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/249993-20170307205837031-1503624197.png)

这种算法虽然实现简单，内存效率高，不易产生碎片，但是最大的问题是可用内存被压缩到了原本的一半。且存活对象增多的话，Copying 算法的效率会大大降低。

#### 3、标记-整理（Mark-Compact）算法

结合了以上两个算法，为了避免缺陷而提出。标记阶段和   `标记-清除（Mark-Sweep）算法` 相同，标记后不是清理对象，而是将存活对象移向内存的一端。**然后清除两端边界外的对象。**

![ ](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/249993-20170308200502734-920263398.png)

直接清除边界的对象也不好，如果边界是老年代，每一次都被清除就很不合理。

#### 4、分代收集算法

分代收集法是目前虚拟机（包括**HotSpot VM**）收集器都是采用该方法。

![ ](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20201030143215163.png)

对象将根据存活的时间被分为：新生代（Young Generation）、年老代（Old Generation）、永久代（Permanent Generation，也就是方法区），然后进行分代回收，分算法回收。



**新生代**：对象被创建时，内存的分配首先发生在新生代（准确地说是Eden区，大对象（大于Eden空间）可以直接 被创建在年老代）

新生代又划分为 `Eden 区` + `Survivor区` （Survivor区又分 from 和 to 区），大小分别占 `80%，10%，10%`。

Eden区是连续的内存空间，因此在其上分配内存极快。

**老年代**：老年代存储的对象比新生代多，而且大对象也多。老年代用的算法是**标记-整理算法**。

**永久代（方法区）**：1.8就没有了，只有元空间。常见的就是**常量池、类信息**等等。

#### 分代收集算法的GC过程：

（1）在年轻代中，Eden区提供堆内存如果满了，Eden进行**MinorGC**，将存活的对象→from ，Eden区清空；

（2）Eden区再次满， Eden 区和 from  区同时进行 Minor GC，把存活对象放入 to 区，Eden和from 同时清空； 

如果在to区中的对象仍然存活，则把对象标志 +1。

（3）重复（2）的操作， 某些对象在反复 Survive **15** 次后，或者Eden+from 的存活对象 > to ，这些对象就只能放到老年代了，如果老年代放不下了，就进行**Full GC**）；

> 记住是 15 次

（4）当 Old 区也被填满时，进行 **Full GC**，对 Old 区进行垃圾回收。

> 可以通过参数 SurvivorRatio 手动配置 Eden 区和单个 Survivor 区的比例，默认为 8。可以通过参数–XX:SurvivorRatio 来设定，即将堆内存中年轻代划分为8:1:1



## 4、垃圾回收器

垃圾回收器是虚拟机不断发展产生的，不同的垃圾回收器使用不同的垃圾回收算法（下面讲到）

以HotSpot VM来说，垃圾回收器大致分为七种类型：

- 串行：Serial New收集器
- 串行：Serial Old收集器
- 串行：ParNew收集器
- 并行：Parallel收集器
- 并行：Parallel Old 收集器
- 并发 标记扫描CMS收集器
- G1收集器

 ![ ](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20201105180041789.png)

>parallel 的意思是并行的意思。concurrent 是并发的意思。
>
>注：串行、并行 其它工作线程要暂停，并发不会。



jdk11中，发布最新的ZGC垃圾收集器。完全没有分代的概念，官方介绍是无空间碎片，时间可控，能超大堆收集。





## 5、JAVA  四中引用类型 与 GC回收关系

![ ](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20201030151715015.png)



## 6、JVM常见参数

设置合理的jvm参数对Java程序有至关重要的作用。

>**基本设置：**
>
>-Xms300m 起始内存（堆大小）设置为300m
>
>-Xmx 最大内存
>
>-Xmn 新生代内存
>
>-Xss 栈大小。 就是创建线程后，分配给每一个线程的内存大小
>
>-XX:NewRatio=n:设置年轻代和年老代的比值。如:为3，表示年轻代与年老代比值为1：3，年轻代占整个年轻代年老代和的1/4
>
>-XX:SurvivorRatio=n:年轻代中Eden区与两个Survivor区的比值。注意Survivor区有两个。如：3，表示Eden：Survivor=3：2，一个Survivor区占整个年轻代的1/5
>
>-XX:MaxPermSize=n:设置持久代大小
>
>**收集器设置**
>
>-XX:+UseSerialGC:设置串行收集器
>
>-XX:+UseParallelGC:设置并行收集器
>
>-XX:+UseParalledlOldGC:设置并行年老代收集器
>
>-XX:+UseConcMarkSweepGC:设置并发收集器（CMS）
>
>**并行收集器设置**
>
>-XX:ParallelGCThreads=n:设置并行收集器收集时使用的CPU数。并行收集线程数。
>
>-XX:MaxGCPauseMillis=n:设置并行收集最大暂停时间
>
>-XX:GCTimeRatio=n:设置垃圾回收时间占程序运行时间的百分比。公式为1/(1+n)
>
>**并发收集器设置**
>
>-XX:+CMSIncrementalMode:设置为增量模式。适用于单CPU情况。
>
>-XX:ParallelGCThreads=n:设置并发收集器年轻代收集方式为并行收集时，使用的CPU数。并行收集线程数。
>
>**垃圾回收统计信息**
>
>-XX:+PrintGC
>
>-XX:+PrintGCDetails
>
>-XX:+PrintGCTimeStamps
>
>-Xloggc:filename
>
>



## 7、查看垃圾回收器

```java
java -XX:+PrintCommandLineFlags -version
```

Windows：

```java
C:\Users\HaC> java -XX:+PrintCommandLineFlags -version
-XX:InitialHeapSize=266928960 -XX:MaxHeapSize=4270863360 -XX:+PrintCommandLineFlags -XX:+UseCompress
edClassPointers -XX:+UseCompressedOops -XX:-UseLargePagesIndividualAllocation -XX:+UseParallelGC
java version "1.8.0_131"
Java(TM) SE Runtime Environment (build 1.8.0_131-b11)
Java HotSpot(TM) 64-Bit Server VM (build 25.131-b11, mixed mode)
```

Linux：

```java
[root@GZSB-CJB-SHH1-14-GEMINI-0 ~]# java -XX:+PrintCommandLineFlags -version
-XX:InitialHeapSize=261339776 -XX:MaxHeapSize=4181436416 -XX:+PrintCommandLineFlags -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseParallelGC 
java version "1.8.0_131"
Java(TM) SE Runtime Environment (build 1.8.0_131-b11)
Java HotSpot(TM) 64-Bit Server VM (build 25.131-b11, mixed mode)
```

可以看到是使用了 `UseParallelGC` 

还可以使用 `jmap -heap 进程id` 命令查看收集器，还可以查看新生代、老年代的空间大小。

```java
[root@VM_0_12_centos ~]# jmap -heap 19505

Attaching to process ID 19505, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 25.171-b11

using thread-local object allocation.
Garbage-First (G1) GC with 1 thread(s)

Heap Configuration:
   MinHeapFreeRatio         = 40
   MaxHeapFreeRatio         = 70
   MaxHeapSize              = 268435456 (256.0MB)
   NewSize                  = 1363144 (1.2999954223632812MB)
   MaxNewSize               = 160432128 (153.0MB)
   OldSize                  = 5452592 (5.1999969482421875MB)
   NewRatio                 = 2
   SurvivorRatio            = 8
   MetaspaceSize            = 21807104 (20.796875MB)
   CompressedClassSpaceSize = 1073741824 (1024.0MB)
   MaxMetaspaceSize         = 17592186044415 MB
   G1HeapRegionSize         = 1048576 (1.0MB)

Heap Usage:
G1 Heap:
   regions  = 256
   capacity = 268435456 (256.0MB)
   used     = 66499440 (63.41880798339844MB)
   free     = 201936016 (192.58119201660156MB)
   24.772971868515015% used
G1 Young Generation:
Eden Space:
   regions  = 18
   capacity = 74448896 (71.0MB)
   used     = 18874368 (18.0MB)
   free     = 55574528 (53.0MB)
   25.35211267605634% used
Survivor Space:
   regions  = 1
   capacity = 1048576 (1.0MB)
   used     = 1048576 (1.0MB)
   free     = 0 (0.0MB)
   100.0% used
G1 Old Generation:
   regions  = 46
   capacity = 58720256 (56.0MB)
   used     = 46576496 (44.41880798339844MB)
   free     = 12143760 (11.581192016601562MB)
   79.31929997035435% used

34372 interned Strings occupying 3886072 bytes.
```

`Garbage-First (G1) GC with 1 thread(s)` ，可以看到是使用了 G1 垃圾收集器。`Eden Space`、`Survivor Space`、`G1 Old Generation`分别说明了Eden区、Survivor区、老年代的大小。

     常见的垃圾回收器标识：
     Concurrent Mark-Sweep GC ：CMS回收器
     Mark Sweep Compact GC：    串行GC（Serial GC）
     Parallel GC with 2 thread(s)： 并行GC（ParNew）
> 常用的命令行工具还有：jps、jstat、jinfo、jmap、jstack。而更多的可视化工具如jconsole、visualVM等暂不介绍，大家有兴趣请参阅相关文档。查看新生代内存占用、老年代内存占用、其他区内存占用和GC等四大方面的指标。



##  8、小结

- 判断是否需要回收内存的算法： 引用计数法、可达性分析算法（根搜索算法）

- 垃圾回收算法分为 标记-清除、复制、标志-整理、分代收集算法 4种。

- **垃圾回收器** 目前分为7种类型,按类型可分**串行，并行，并发标记，G1**。小数据量和小型应用，使用串行垃圾回收器即可；对于对响应时间无特殊要求的，可以使用并行垃圾回收器和并发标记垃圾回收器。对于heap可以分配很大的中大型应用，使用G1垃圾回收器比较好，进一步优化和减少了GC暂停时间，避免用户在使用有顿挫的感觉。

- 没有最好的垃圾回收器，，每一种垃圾回收器有自己的回收算法甚至是几种算法一起用，对新生代和老年代又可以分开回收。

  
  
  ![JVM GC总结](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/GC2.png)
  
  
  
  ---

