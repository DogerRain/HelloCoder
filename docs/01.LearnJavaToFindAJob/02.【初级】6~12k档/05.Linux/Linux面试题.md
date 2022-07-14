---
title: Linux面试题
date: 2022-06-02 11:18:18
lock: false
permalink: /pages/Linux%E9%9D%A2%E8%AF%95%E9%A2%98
categories: 
  - LearnJavaToFindAJob
  - 【初级】6~12k档
  - Linux
tags: 
  - Linux
  - 面试题
---
## 1、 常用的Linux命令

#### 1）文件操作

cat、vi、vim、ls、mkdir、touch 、cp、mv

查找是否存在该文件名：

```bash
find / -name mysql 
```

cat：一次性显示文件内容

#### 2）日志

```java
tail -f /var/www/MOB_logs/catalina.2018-05-18.out 
```

抓取关键字：

```javascript
cat catalina.2019-03-20.out | grep "返回respData"
```

```java
grep -i "返回respData" catalina.2018-06-11.out
```

#### 3）解压

```java
tar -zxvf filename.tar.gz
```

#### 4）查找进程

```java
ps -aux|grep java
```

#### 5) 系统、内存、磁盘、网络相关

​	top 查看内存、cpu情况

​	du、df 查看磁盘、文件大小

```java
du -s -h /data/
```

​	ping、curl 查看网络是否正常

#### 6）权限相关

chmod：修改文件的权限

chown：即**change owner**，修改文件和目录的所有者权限

chattr：chmod的底层操作，锁定文件

 ![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210104215503268.png)





## 2、 系统缓慢的原因，或者突然很卡

- Full GC次数过多
- CPU 过高
- 接口耗时、HTTP请求过多，响应慢。（比较经典）
- 死锁（Blocke）
- 某个线程进入WAITTING，sleep、wait时间过长，假死。

CPU 过高、Full GC次数过多、内存使用过多、硬盘空间不足等问题，都会带来系统突然运行缓慢的问题，也是面试特别容易被问到的，下面针对系统运行缓慢等问题进行展开。



#### 这又引申出两个问题：

CPU利用率和负载的问题。

**CPU利用率**显示的是程序在运行期间实时占用的CPU百分比；cpu使用率反映的是当前cpu的繁忙程度，忽高忽低的原因在于占用cpu处理时间的进程可能处于io等待状态但却还未释放进入wait。

**CPU负载**是指某段时间内占用cpu时间的进程和等待cpu时间的进程数，这里等待cpu时间的进程是指等待被唤醒的进程，不包括处于wait状态进程。

> CPU利用率高，并不意味着CPU的负载大。两者之间没有必然的关系。

**CPU负载很高怎么办？**

可以通过 `ps -axjf`查看`STAT`这一列是否存在 D 状态进程

比如：

```java
[root@VM-8-8-centos proc]# ps -axjf
 PPID   PID  PGID   SID TTY      TPGID STAT   UID   TIME COMMAND
    0     2     0     0 ?           -1 D        0   0:00 [kthreadd]
    2     4     0     0 ?           -1 S<       0   0:00  \_ [kworker/0:0H]
    2     6     0     0 ?           -1 D        0   0:10  \_ [ksoftirqd/0]
    2     7     0     0 ?           -1 S        0   0:00  \_ [migration/0]
```

> D 状态是指不可中断的睡眠状态。该状态的进程无法被 kill，也无法自行退出。只能通过恢复其依赖的资源或者重启系统来解决。

负载高，好比节假日的高速公路堵车，马路都是车，已经阻塞了，收费站外面还有很多车在等着，解决方法就是多建一条高速公路，提升服务器的硬件性能，或者找出I/O等待的任务，手动处理。

负载高常见的原因有：

- 磁盘读写请求过多
- MySQL死锁或者查询返回慢
- 硬盘故障，读写请求获取不到资源



如果CPU很高，请看下面：

## 3、 线上 CPU 爆高  接近100%，怎么排查？

#### 	1）使用 `top` 命令

然后键盘按 1  表示进入第1个CPU（如果是多核需要分别查看不同的CPU）

 演示： 

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

看到右上角：

```java
load average: 1.73, 1.70, 1.71
```

— `load average`后面的三个数分别是1分钟、5分钟、15分钟的负载情况。 指的是处于可运行状态和不可中断状态的平均进程数。数字越大，CPU负载越大。

如果 小于 `CPU数 * 每个CPU的核心数` ， 则表示负载是合理的，比如上面我的服务器 CPU 是1个，只有1个核心，那么现在1.7的负载大于1，就很不合理了，证明有很多任务在等待中。



**如何查CPU和CPU核心？**

查看CPU数目：

```java
cat /proc/cpuinfo | grep "model name" 
```

查看CPU核心：

```java
cat /proc/cpuinfo | grep "cpu cores"
```

演示：

```java
[root@VM-8-8-centos ~]# cat /proc/cpuinfo | grep "model name"
model name      : AMD EPYC 7K62 48-Core Processor
[root@VM-8-8-centos ~]# cat /proc/cpuinfo | grep "cpu cores"
cpu cores       : 1
```



#### 2）键盘按下 x

按下 x，就会把CPU使用情况排序，找到CPU过高的`pid`，以`pid 19505`为例，

然后看一下这个pid的线程情况：

```java
ps -mp 19505 -o THREAD,tid,time   
```

演示：

```java
[root@VM_0_12_centos ~]# ps -mp 19505 -o THREAD,tid,time   
USER     %CPU PRI SCNT WCHAN  USER SYSTEM   TID     TIME
root      0.0   -    - -         -      -     - 04:03:21
root      0.0  19    - futex_    -      - 19505 00:00:00
root      0.0  19    - futex_    -      - 19507 00:00:08
root      0.0  19    - futex_    -      - 19508 00:00:01
root      0.0  19    - futex_    -      - 19509 00:47:56
root      0.0  19    - futex_    -      - 19510 00:00:00
root      0.0  19    - futex_    -      - 19511 00:00:00
root      0.0  19    - futex_    -      - 19512 00:00:00
root      0.0  19    - futex_    -      - 19513 00:07:45
root      0.0  19    - futex_    -      - 19514 00:00:00
root      0.0  19    - futex_    -      - 19515 00:00:00
root      0.0  19    - futex_    -      - 19516 00:00:00
root      0.0  19    - futex_    -      - 19517 00:00:00
root      0.0  19    - futex_    -      - 19518 00:01:33
root      0.0  19    - futex_    -      - 19519 00:01:21
root      0.0  19    - futex_    -      - 19520 00:00:00
root      0.0  19    - futex_    -      - 19521 02:23:05
root      0.0  19    - futex_    -      - 19539 00:00:00
root      0.0  19    - futex_    -      - 19540 00:00:00
root      0.0  19    - futex_    -      - 19576 00:05:10
```

或者使用以下命令

```java
top -Hp 19505 -d 1 -n 1  
```

都是一样的，

#### 3）把tid (线程id )转成  16进制 

以 `tid 19507` 为例

```java
printf "%x\n" tid
```

演示：

```java
[root@VM_0_12_centos ~]# printf "%x\n" 19507
4c33
```

4）查看 tid 4c31 线程堆栈情况：

只查看前30行

```java
jstack 19505 |grep tid -A 30
```

演示：

```java
[root@VM_0_12_centos ~]# jstack 19505 |grep 4c33 -A 30 
"DestroyJavaVM" #36 prio=5 os_prio=0 tid=0x00007fbb3800a000 nid=0x4c33 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"http-nio-8848-Acceptor-0" #34 daemon prio=5 os_prio=0 tid=0x00007fbb3820e800 nid=0x4cb2 runnable [0x00007fbaff268000]
   java.lang.Thread.State: RUNNABLE
        at sun.nio.ch.ServerSocketChannelImpl.accept0(Native Method)
        at sun.nio.ch.ServerSocketChannelImpl.accept(ServerSocketChannelImpl.java:422)
        at sun.nio.ch.ServerSocketChannelImpl.accept(ServerSocketChannelImpl.java:250)
        - locked <0x00000000f2a67c30> (a java.lang.Object)
        at org.apache.tomcat.util.net.NioEndpoint.serverSocketAccept(NioEndpoint.java:448)
        at org.apache.tomcat.util.net.NioEndpoint.serverSocketAccept(NioEndpoint.java:70)
        at org.apache.tomcat.util.net.Acceptor.run(Acceptor.java:95)
        at java.lang.Thread.run(Thread.java:748)

"http-nio-8848-ClientPoller-0" #33 daemon prio=5 os_prio=0 tid=0x00007fbb38f21000 nid=0x4cb1 runnable [0x00007fbaff369000]
   java.lang.Thread.State: RUNNABLE
        at sun.nio.ch.EPollArrayWrapper.epollWait(Native Method)
        at sun.nio.ch.EPollArrayWrapper.poll(EPollArrayWrapper.java:269)
        at sun.nio.ch.EPollSelectorImpl.doSelect(EPollSelectorImpl.java:93)
        at sun.nio.ch.SelectorImpl.lockAndDoSelect(SelectorImpl.java:86)
        - locked <0x00000000f2a67e60> (a sun.nio.ch.Util$3)
        - locked <0x00000000f2a67e70> (a java.util.Collections$UnmodifiableSet)
        - locked <0x00000000f2a67e18> (a sun.nio.ch.EPollSelectorImpl)
        at sun.nio.ch.SelectorImpl.select(SelectorImpl.java:97)
        at org.apache.tomcat.util.net.NioEndpoint$Poller.run(NioEndpoint.java:743)
        at java.lang.Thread.run(Thread.java:748)

"http-nio-8848-exec-10" #32 daemon prio=5 os_prio=0 tid=0x00007fbb38229800 nid=0x4cb0 waiting on condition [0x00007fbaff46a000]
   java.lang.Thread.State: WAITING (parking)
        at sun.misc.Unsafe.park(Native Method)
        - parking to wait for  <0x00000000f2a68030> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
```



## 4、 查看垃圾回收GC的情况，包括fullGC次数和耗时

#### 1）查看

```
ps -aux|grep java
```

假如pid是19505

#### 2）使用`jstat  -gc`或者 `jstat  -gcutil` 查看空间使用情况

```java
[root@VM_0_12_centos ~]# jstat  -gc 19505
 S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT     GCT   
 0.0   1024.0  0.0   1024.0 72704.0   8192.0   57344.0    45449.8   73168.0 70119.8 8708.0 8169.9    214    7.855   0      0.000    7.855
```

```java
[root@VM_0_12_centos ~]# jstat  -gcutil 19505
  S0     S1     E      O      M     CCS    YGC     YGCT    FGC    FGCT     GCT   
  0.00 100.00  12.68  79.26  95.83  93.82    214    7.855     0    0.000    7.855
```



参数解析

>S0  — Heap上的 Survivor space 0 区已使用空间的百分比
>S1  — Heap上的 Survivor space 1 区已使用空间的百分比
>E  — Heap上的 Eden space 区已使用空间的百分比
>O  — Heap上的 Old space 区已使用空间的百分比
>P  — Perm space 区已使用空间的百分比
>YGC — 从应用程序启动到采样时发生 Young GC 的次数
>YGCT– 从应用程序启动到采样时 Young GC 所用的时间(单位秒)
>FGC — 从应用程序启动到采样时发生 Full GC 的次数
>FGCT– 从应用程序启动到采样时 Full GC 所用的时间(单位秒)
>GCT — 从应用程序启动到采样时用于垃圾回收的总时间(单位秒)

**上下文切换**

频繁上下文，会带来性能问题



## 5、查内存使用情况

于Linux/Unix系统内存占用的百分比，无须过于关心，一般大于90%都是属于正常情况~

1）使用free查看内存使用情况

```java
[root@VM_0_12_centos ~]#  free -h
              total        used        free      shared  buff/cache   available
Mem:           1.8G        862M         69M        600K        906M        806M
Swap:            0B          0B          0B
```

2）释放内存

- 先 执行 sync

```
[root@VM_0_12_centos ~]# sync
```

（描述：sync 命令运行 sync 子例程。如果必须停止系统，则运行sync 命令以确保文件系统的完整性。sync 命令将所有未写的系统缓冲区写到磁盘中，包含已修改的 i-node、已延迟的块 I/O 和读写映射文件）

- 修改`drop_caches` 参数

drop_caches的详细文档如下：

**a**、`To free pagecache`:     清空 页面 高速缓存

```
echo 1 > /proc/sys/vm/drop_caches
```

**b**、`To free dentries and inodes`:    清空 目录项 和 索引节点

```
echo 2 > /proc/sys/vm/drop_caches
```

**c**、`To free pagecache, dentries and inodes`:    清空以上两项

```
echo 3 > /proc/sys/vm/drop_caches
```

我这里演示试一下执行：

```
echo 3 > /proc/sys/vm/drop_caches
```

然后再查看内存情况：

```java
[root@VM_0_12_centos ~]# free -h
              total        used        free      shared  buff/cache   available
Mem:           1.8G        862M        904M        600K         71M        856M
Swap:            0B          0B          0B
```

结果：free 和 available 变大了，buff/cache 变小了，有效的释放了buffer和cache。



## 6、 查硬盘使用情况

df

```java
[root@VM_0_12_centos ~]# df -hl
Filesystem      Size  Used Avail Use% Mounted on
/dev/vda1        50G   14G   34G  29% /
devtmpfs        909M     0  909M   0% /dev
tmpfs           920M     0  920M   0% /dev/shm
tmpfs           920M  620K  919M   1% /run
tmpfs           920M     0  920M   0% /sys/fs/cgroup
tmpfs           184M     0  184M   0% /run/user/0
```

du

```java
[root@VM_0_12_centos ~]# du -h heap 
147M    heap
```

非递归查目录大小，方便查看总体情况：

```java
[root@VM_0_12_centos ~]#  du -s -h /root
1.3G    /root
```

知道目录的占用大小，就可以进行清理了。

## 7、 怎么杀死进程？

一般情况下，终止一个前台进程使用 Ctrl + C 就可以了。对于一个后台进程就需要用 kill 命令来终止。
我们会先使用 ps、top 等命令获得进程的 PID，然后使用 kill 命令来杀掉该进程。

例如：

```java
 ps -aux|grep java
```

找到 java的线程id

```java
kill -9 3827
```



## 8、linux vm内核参数优化设置

#### 1）CPU

使用 uptime查看CPU使用情况

```java
[root@VM_0_12_centos ~]# uptime
 17:03:41 up 307 days,  1:31,  3 users,  load average: 0.00, 0.01, 0.05
```

使用`vmstat`查看CPU使用状态

```java
[root@VM_0_12_centos ~]# vmstat 2 10 	#2秒打印一次，一共10次
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
0  0      0 131104 199740 1341608    0    0     0     0  137  301  0  0 99  0  0
0  0      0 131104 199740 1341612    0    0     0    26  162  342  0  0 99  1  0
0  0      0 131140 199740 1341612    0    0     0     0  135  301  0  0 99  0  0
0  0      0 130892 199740 1341616    0    0     0     0  188  463  1  1 99  0  0
0  0      0 130912 199740 1341620    0    0     0    68  145  284  1  0 99  0  0
```

解释：

>**procs列**
>
>`r`: 运行队列长度和正在运行的线程数；
>
>`b`: 表示睡眠进程的数量，即阻塞的进程数；
>
>`swpd`: 虚拟内存已使用的大小，如果大于0，表示你的机器物理内存不足了，如果不是程序内存泄露的原因，那么你该升级内存了或者把耗内存的任务迁移到其他机器；
>
>**memory列**
>
>`free`:空闲的物理内存的大小；
>
>`buff`: 存储，目录里面的内容、权限等的缓存大小；
>
>`cache`: 缓冲大小，值越大，命中缓冲几率越大，就不会经常读写磁盘；
>
>**swap列**
>
>`si`: 每秒从磁盘读入虚拟内存的大小，如果这个值大于0，表示物理内存不够用或者内存泄露了，要查找耗内存进程解决掉。我的机器内存充裕，一切正常。
>
>`so`: 每秒虚拟内存写入磁盘的大小，同上；
>
>**io列**
>
>`bi`: 块设备每秒接收的块数量，这里的块设备是指系统上所有的磁盘和其他块设备，默认块大小是1024byte；
>
>`bo`: 块设备每秒发送的块数量，例如我们读取文件，bo就要大于0。bi和bo一般都要接近0，不然就是IO过于频繁，IO等待时间也长，需要调整；
>
>**system列**
>
>`in`: 每秒CPU的中断次数，包括时间中断；
>
>`cs`: 每秒上下文切换次数 ;
>
>> 这两个值越大，内核消耗的CPU时间会越大
>
>**CPU列**
>
>`us`: 用户进程执行时间(user time)，us的值比较高时，说明用户进程消耗的CPU时间多，长期高应检查程序
>
>`sy`: 系统进程执行时间(system time)，sy的值高时，说明系统内核消耗的CPU资源多，长期高因检查系统
>
>`id`: 空闲时间(包括IO等待时间)，中央处理器的空闲时间 。以百分比表示。
>
>`wa`: 等待CPU的进程占用百分比
>
>`st`: cpu在虚拟化环境上在其他占用的开销，可以理解为被抽走了多少cpu资源





#### 2) 端口

只用关心`TIME_WAIT`的个数，Linux下可用端口的数量只有`65535`个，占用一个少一个，我们可以调整Linux的TCP内核参数，让系统更快的释放`TIME_WAIT`连接。

```java
[root@VM_0_12_centos ~]# netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}'
CLOSE_WAIT 1
ESTABLISHED 5
```

修改：

```
vim /etc/sysctl.conf
```

修改3个参数：

1) `net.ipv4.tcp_syncookies = 1`  表示开启SYN Cookies,当出现SYN等待队列溢出时,启用cookies来处理,可防范少量SYN攻击；默认为0,表示关闭

2) `net.ipv4.tcp_tw_reuse = 1`   表示开启重用,允许将TIME-WAIT sockets重新用于新的TCP连接,默认为0,表示关闭

3) `net.ipv4.tcp_tw_recycle = 1` 表示开启TCP连接中TIME-WAIT sockets的快速回收,默认为0,表示关闭


查看可用端口范围：

```java
[root@VM_0_12_centos ~]# cat /proc/sys/net/ipv4/ip_local_port_range
32768   60999
```

修改 `sysctl.conf` 文件修改范围：

`net.ipv4.ip_local_port_range = 1024 65535`

3）定时任务清理临时目录垃圾文件，日志归档

4）锁定关键系统文件，防止被提权篡改

5）清除多余的系统虚拟账号



## 9、如何合理查找

换句话说就是 合理使用find参命令

#### 1）在 `/software` 目录下找出大小超过 10MB 的文件

`find /software -type f -size +10240k`

```java
[root@VM_0_12_centos /]# find /software -type f -size +10240k
/software/mysql-5.6.33-linux-glibc2.5-x86_64.tar.gz
/software/mysql/lib/libmysqlclient.a
/software/mysql/lib/libmysqld-debug.a
/software/mysql/lib/libmysqld.a
```

#### 2）目录下找出 365 天之内未被访问过的文件

 `find /software \! -atime -365`

```java
[root@VM_0_12_centos /]# find /software \! -atime -365
/software
/software/mysql-5.7.20-linux-glibc2.12-x86_64.tar.gz
```

#### 3） 目录下找出 365 天之前被修改过的文件

`find /home -mtime +365 `

```java
[root@VM-8-8-centos ~]# find /home -mtime +365
/home
/home/HaC
/home/HaC/HaC.pub
/home/HaC/HaC
```



## 10、Linux的目录结构

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210104231500000.png)

常见的：

- **/bin**：
  bin 是 Binaries (二进制文件) 的缩写, 这个目录存放着最经常使用的命令。
- **/boot：**
  这里存放的是启动 Linux 时使用的一些核心文件，包括一些连接文件以及镜像文件。
- **/dev ：**
  dev 是 Device(设备) 的缩写, 该目录下存放的是 Linux 的外部设备，在 Linux 中访问设备的方式和访问文件的方式是相同的。
- **/etc：**
  etc 是 Etcetera(等等) 的缩写,这个目录用来存放所有的系统管理所需要的配置文件和子目录。
- **/home**：
  用户的主目录，在 Linux 中，每个用户都有一个自己的目录，一般该目录名是以用户的账号命名的，如上图中的 alice、bob 和 eve。
- **/lib**：
  lib 是 Library(库) 的缩写这个目录里存放着系统最基本的动态连接共享库，其作用类似于 Windows 里的 DLL 文件。几乎所有的应用程序都需要用到这些共享库。