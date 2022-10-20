---
title: 占用几分钟时间，让你掌握top命令
date: 2022-05-26 17:04:01
permalink: /pages/%E5%8D%A0%E7%94%A8%E5%87%A0%E5%88%86%E9%92%9F%E6%97%B6%E9%97%B4%EF%BC%8C%E8%AE%A9%E4%BD%A0%E6%8E%8C%E6%8F%A1top%E5%91%BD%E4%BB%A4
lock: false
categories: 
  - PureJavaCoderRoad
  - Linux
tags: 
  - top
  - 命令
---
服务器负载过高，排查问题一定离不开top命令。

这篇文章就来教大家如何使用top命令看top命令的结果。

## 1、使用top命令

```java
[root@VM-8-8-centos ~]# top
top - 23:17:16 up  7:54,  1 user,  load average: 1.73, 1.70, 1.71
Tasks:  95 total,   1 running,  94 sleeping,   0 stopped,   0 zombie
%Cpu(s): 50.0 us, 50.0 sy,  0.0 ni,  0.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem :  1882056 total,    69588 free,  1255116 used,   557352 buff/cache
KiB Swap:        0 total,        0 free,        0 used.   478816 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S %CPU %MEM     TIME+ COMMAND
 1953 root      20   0  101080   2248   1732 S  0.3  0.1   0:01.89 YDLive
 2310 root      20   0 2369316 246988  13760 S  0.3 13.1   0:22.47 java
 5082 root      20   0  154808  10500   3248 S  0.3  0.6   0:11.14 YDService
    1 root      20   0   43444   3872   2580 S  0.0  0.2   0:01.27 systemd
    2 root      20   0       0      0      0 S  0.0  0.0   0:00.00 kthreadd
    4 root       0 -20       0      0      0 S  0.0  0.0   0:00.00 kworker/0:0H
    5 root      20   0       0      0      0 S  0.0  0.0   0:00.07 kworker/u2:0
    6 root      20   0       0      0      0 S  0.0  0.0   0:00.02 ksoftirqd/0
    7 root      rt   0       0      0      0 S  0.0  0.0   0:00.00 migration/0

```

然后键盘按 1  表示进入第1个CPU核心（如果是多核需要分别查看不同的CPU），按 2 表示进入第2个CPU核心，要取决你要多少个CPU核心。

上面一堆密密麻麻的数字和单词，下面来慢慢看。



## 2、Load Average

有经验的老运维们，单从Load Average 就可以判断系统负载高低。

看到右上角：

```java
load average: 1.73, 1.70, 1.71
```

— `load average`后面的三个数分别是1分钟、5分钟、

15分钟的负载情况。 指的是处于可运行状态和不可中断状态的平均进程数。数字越大，CPU负载越大。

如果 小于 `CPU数 * 每个CPU的核心数` ， 则表示负载是合理的，比如上面我的服务器 CPU 是 1 个，只有 1 个核心，那么现在1.7的负载大于1，就很不合理了。

但是，这个数值高了也并不能直接代表这台机器的性能有问题。可能是因为正在进行**CPU密集型的计算**，也有可能是因为I/O问题导致运行队列堵了（证明有很多任务在等待中）。

所以，当我们看到这个数值飙升的时候，还得具体问题具体分析。



**如何查CPU和CPU核心？**

- 查看逻辑CPU的个数

```bash
cat /proc/cpuinfo| grep "processor"| wc -l
```

- 查看物理CPU个数

```bash
cat /proc/cpuinfo| grep "physical id"| sort| uniq| wc -l
```

- 查看逻辑CPU数目：

```bash
cat /proc/cpuinfo | grep "model name" 
```

- 查看CPU核心：（每个物理CPU中core的个数(即核数)）

```bash
cat /proc/cpuinfo | grep "cpu cores"
```

演示一下：

```java
[root@VM-8-8-centos ~]# cat /proc/cpuinfo |grep "processor"|wc -l  
1
[root@localhost ~]# cat /proc/cpuinfo |grep "physical id"|sort |uniq|wc -l
1
[root@VM-8-8-centos ~]# cat /proc/cpuinfo | grep "model name"
model name      : AMD EPYC 7K62 48-Core Processor
[root@VM-8-8-centos ~]# cat /proc/cpuinfo | grep "cpu cores"
cpu cores       : 1
```

表示我的服务器只有 1 个CPU， 1  个CPU只有 1 个核心，只有 1 个 线程。

这里是题外话了，我们一般需要关注`model name` 和  `cpu cores` 就可以了。



## 3、一行一行看

### 第一行：

```bash
top - 23:17:16 up  7:54,  1 user,  load average: 1.73, 1.70, 1.71

top：当前时间
up：机器运行了多少时间
users：当前有多少用户
load average：分别是过去1分钟，5分钟，15分钟的负载
```

这里最重要的就是`load average` 了。



### 第二行：

```bash
Tasks:  95 total,   1 running,  94 sleeping,   0 stopped,   0 zombie

Tasks：当前有多少进程
running：正在运行的进程
sleeping：正在休眠的进程
stopped：停止的进程
zombie：僵尸进程
```

running线程越多，服务器自然压力越大。

zombie表示僵尸线程，借用官方解释：

> 一个进程在调用exit命令结束自己的生命的时候，其实它并没有真正的被销毁，而是留下一个称为[僵尸进程](http://www.nowamagic.net/librarys/veda/tag/僵尸进程)（Zombie）的数据结构（系统调用exit， 它的作用是使进程退出，但也仅仅限于将一个正常的进程变成一个僵尸进程，并不能将其完全销毁）。

一般可以使用以下两个命令找到 父进程的Id，然后 kill 掉：

```bash
ps -e -o stat,ppid,pid,cmd|egrep '^[Zz]'
ps -ef | grep "defunct"
```

注：

- `'^[Zz]'`：这是正则表达式，^表示第一个字符的位置，[Zz]，表示z或者大写的Z字母，即表示第一个字符为Z或者z开头的进程数据，只所以这样是因为僵尸进程的状态信息以Z或者z字母开头。
- 多数linux系统，也会将僵尸进程标识为`defunct`



### 第三行：

```bash
%Cpu(s): 50.0 us, 50.0 sy,  0.0 ni,  0.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st


us: 用户进程占CPU的使用率
sy: 系统进程占CPU的使用率
ni: 用户进程空间改变过优先级
id: 空闲CPU占用率
wa: 等待输入输出的CPU时间百分比
hi: 硬件的中断请求
si: 软件的中断请求
st: steal time
```

这里表示了CPU的使用情况。

`us`长期过高，表明用户进程占用了大量的CPU时间。

`us+sy`如果长期超过80或者90，可能就代表了CPU性能不足，需要加CPU了。

可以看到我这里 `us`占了 50%，`sy`占了50%，`ni` 为0，CPU的剩余空闲率已经没有了，说明CPU资源不足。

### 第四行+第五行

```bash
KiB Mem :  1882056 total,    69588 free,  1255116 used,   557352 buff/cache
KiB Swap:        0 total,        0 free,        0 used.   478816 avail Mem

KiB Mem 物理内存
KiB Swap 交换区总量
total：内存总量
free：空闲内存
used：使用的
buffer/cache：写缓存/读缓存
```

这里解释一下，所谓缓冲的**交换区总量-KiB Swap**，即内存中的内容被换出到交换区，而后又被换入到内存，但使用过的交换区尚未被覆盖，该数值即为这些内容已存在于内存中的交换区的大小。 

其实使用 `free` 命令也是一样可以得出这样的结果。

 **为什么会有Swap？**

　　当Linux的物理内存快要被耗尽时，系统会把一些进程占用的内存转移到 swap 区，当物理内存被释放一部分时，swap 区的一些内存占用又慢慢回到 mem 区，但是 mem 区却不再是之前的满负荷状态，而是有一部分 free 的内存！

【总结】

　　1）当物理内存快被耗尽时，系统并没有崩溃，而是拿 swap 做临时内存，当两者都耗尽，系统 OutofMemory

　　2）物理内存达到峰值，系统中一些不常用的进程内存占用被提到 swap 区

　　3）当 Men 区的资源进行释放时，被挪到 swap 的内存并不会全部回来，随着系统或者程序的唤醒才会慢慢回到 men 区

　　4）swap 是内存不够时，磁盘虚拟出来的内存，磁盘主要是 I/O 级别的操作，并不是系统内核级别的操作，处理速度跟 mem 区不是一个等级。

> 这部分参考自：https://www.cnblogs.com/lili-xia/p/11506188.html



所以说这么多，简单一句就是 ：**当物理内存不够用的时候，操作系统才会把暂时不用的数据放到Swap中。所以当这个数值变高的时候，说明内存不足了，需要充钱升级内存了**

### 第五行下面

```bash
 PID USER      PR  NI    VIRT    RES    SHR S %CPU %MEM     TIME+ COMMAND
 1953 root      20   0  101080   2248   1732 S  0.3  0.1   0:01.89 YDLive
 2310 root      20   0 2369316 246988  13760 S  0.3 13.1   0:22.47 java
 5082 root      20   0  154808  10500   3248 S  0.3  0.6   0:11.14 YDService
    1 root      20   0   43444   3872   2580 S  0.0  0.2   0:01.27 systemd
    2 root      20   0       0      0      0 S  0.0  0.0   0:00.00 kthreadd
    4 root       0 -20       0      0      0 S  0.0  0.0   0:00.00 kworker/0:0H
    5 root      20   0       0      0      0 S  0.0  0.0   0:00.07 kworker/u2:0
    6 root      20   0       0      0      0 S  0.0  0.0   0:00.02 ksoftirqd/0
    7 root      rt   0       0      0      0 S  0.0  0.0   0:00.00 migration/0
    
PID:进程id
USER:进程所有者
PR:优先级。数值越大优先级越高
NI:nice值，负值表示高优先级，正值表示低优先级
VIRT:进程使用的虚拟内存总量
SWAP:进程使用的虚拟内存中被换出的大小
RES:进程使用的、未被换出的物理内存大小
SHR:共享内存大小
SHR:共享内存大小
S：进程状态。D表示不可中断的睡眠状态；R表示运行；S表示睡眠；T表示跟踪/停止；Z表示僵尸进程。
%CPU:上次更新到现在的CPU占用百分比 ；
%MEM:进程使用的物理内存百分比 ；
TIME+:进程使用的CPU时间总计，单位1/100秒；
COMMAND:命令名/命令行（进程启动的命令，可以使用 top -c 打印完整的命令）
```

这个就像是Windows的资源管理器一样。

键盘按下 x 键 ，就会把CPU的占用率进行降序排序。

借助 %CPU、%MEM 这两个一般就可以找出占用CPU、内存 最高的的进程ID，再借助ps、jstack、vmstat、iostat 这些常用的命令，就很容易定位出问题了。

