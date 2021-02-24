Redis是基于内存操作，很快，既然Redis在内存工作，但是数据如何保存呢？

在Redis重启的时候，如何把数据恢复，保持一致性？这就涉及Redis的持久化机制了。



## 1、Redis的持久化机制

Redis的持久化机制有两种：

- RDB
- AOF

可以单独使用其中一种或将二者结合使用。



## 2、RDB

RDB持久化是将当前进程中的数据生成**快照**保存到硬盘(因此也称作快照持久化)，保存的文件后缀是`.rdb`

#### 2.1 自动触发

常见配置：


```java
# Redis默认设置， 表示  900秒内产生1条写入命令就触发一次快照，自动触发 bgsave
save 900 1
save 300 10
save 60 10000

# 如果持久化出错，主进程是否停止写入
stop-writes-on-bgsave-error yes

# 是否压缩，如果开启，则消耗更多的CPU，否则消耗更多硬盘
rdbcompression yes

# 使用CRC64算法来进行数据校验，但是这样做会增加大约10%的性能消耗
rdbchecksum yes

# 快照文件名称
dbfilename dump.rdb

# 快照文件保存路径
dir ./
```



**①、save m n：**表示m秒内数据集存在n次修改时，自动触发**bgsave**。

其他参数解释见上。

#### 2.2 手动触发

手动触发有两种方法：

- **1）save**

  同步操作，会阻塞当前Redis服务器，执行save命令期间，Redis不能处理其他命令，直到RDB过程完成为止。

- **2）bgsave**
  异步操作，Redis fork 出一个新子进程，原来的 Redis 进程（父进程）继续处理客户端请求，而子进程则负责将数据保存到磁盘，然后退出。

```shell
localhost:0>save
"OK"

localhost:0>bgsave
"Background saving started"

localhost:0>lastsave
"1603777804"
```



很明显`bgsave` 更适合执行RDB 操作，所以Redis的内部操作，包括自动触发，也是 `bgsave`。



RDB bgsave 具体过程如下：

​	1、Redis服务器接收`bgsave`，主线程需要调用系统的 `fork()` 函数，构建出一个子进程去操作； 
​	2、子线程创建好RDB文件并退出时，向父进程发送一个通知，告知RDB文件创建完毕；
​	3、父进程接收子进程创建好的RDB文件，`bgsave`命令执行结束。



## 3、AOF

AOF是记录Redis的命令，增量备份。

常见配置：

```java
# 是否开启aof，默认是不开启
appendonly no

# 文件名称
appendfilename "appendonly.aof"

# 同步方式，有三种，默认是 everysec
appendfsync everysec

# aof重写期间是否同步
no-appendfsync-on-rewrite no

# 重写触发配置
# (当前AOF文件大小超过上一次重写的AOF文件大小的百分之多少才会重写)
auto-aof-rewrite-percentage 100
# AOF文件重写需要的尺寸，AOF多大时开启重写
auto-aof-rewrite-min-size 64mb

# 文件重写策略
aof-rewrite-incremental-fsync yes
```

①`appendfsync everysec`的三种模式：

- always：把每个写命令都立即同步到aof文件，很慢，但是很安全
- everysec：每秒同步一次，Redis官方推荐。
- no：redis不刷盘交给OS来处理，非常快，但是也最不安全

 

②`aof-rewrite-incremental-fsync`：

每次批量写入磁盘的数据量由aof-rewrite-incremental-fsync参数控制，默认为32M，避免单次刷盘数据过多造成硬盘阻塞



#### 3.1 AOF的工作流程：

1. 所有的写入命令追加到`aof_buf`缓冲区中。

2. AOF会根据对应的策略向磁盘做同步操作。刷盘策略由`appendfsync`参数决定。

3. 定期对AOF文件进行重写。重写策略由`auto-aof-rewrite-percentage`、`auto-aof-rewrite-min-size`两个参数决定。

#### 3.2 为什么需要重写？

因为重写后文件会变小。

1. 进程内超时的数据不用再写入到AOF文件中。
2. 存在删除命令。
3. 多条写命令可以合并为一个。

比如一个value 自增1w次，那AOF就需要记录1w次的操作，如果重写后，就可以直接记录该key的最终set值了。



#### 3.3 AOF重写过程

​	重写分为：

- 自动触发

  由`auto-aof-rewrite-percentage`、`auto-aof-rewrite-min-size`两个参数决定 且没有进行BGSAVE、BGREWRITEAOF操作 。

  

  贴一下Redis的原话：

```java
# Automatic rewrite of the append only file.
# Redis is able to automatically rewrite the log file implicitly calling
# BGREWRITEAOF when the AOF log size grows by the specified percentage.
# 
# This is how it works: Redis remembers the size of the AOF file after the
# latest rewrite (if no rewrite has happened since the restart, the size of
# the AOF at startup is used).
#
# This base size is compared to the current size. If the current size is
# bigger than the specified percentage, the rewrite is triggered. Also
# you need to specify a minimal size for the AOF file to be rewritten, this
# is useful to avoid rewriting the AOF file even if the percentage increase
# is reached but it is still pretty small.
#
# Specify a percentage of zero in order to disable the automatic AOF
# rewrite feature.

auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
```

  

  简单解释一下，首先当你AOF文件超过了 `auto-aof-rewrite-min-size`才会重写。

   Redis会记录上一次重写的大小，和当前AOF的大小，当 `（当前AOF大小/上次重写AOF大小）> auto-aof-rewrite-percentage`  则自动重写。

  

  例如当前文件大小129mb，上一次AOF重写原文件大小是64mb，超过100%，就重写。


  自动重写也是调用 `bgrewriteaof` 命令。

- 手动触发

  调用`bgrewriteaof`命令。

  短短一句命令其实背后做了很多操作。

```java
localhost:0>bgrewriteaof
"Background append only file rewriting started"
```


AOF重写大致过程：

1. 父进程执行fork()，创建一个子进程。

2. 父进程处理客户端请求，父进程把所有修改命令会写入到`aof_rewrite_buf`中，并根据`appendfsync`策略持久化到AOF文件中。

3. 子进程把新AOF文件写入完成后，子进程发送信号给父进程，父进程更新统计信息。

4. 父进程将aof_rewrite_buf（AOF重写缓冲区）的数据写入到新的AOF文件中。

> 过期的键不会被记录到 `AOF` 文件中

![ AOF重写流程 ](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201027155614967.png)


> AOF的持久化也可能会造成阻塞。

fsync 每秒同步一次，假如系统磁盘比较忙，可能就会造成Redis主线程阻塞。



## 4、数据恢复

当Redis重新启动时，可以读取快照文件恢复数据。

将备份文件 (`dump.rdb`) 或者 （`.aof文件`）移动到 redis 安装目录并启动服务即可，redis就会自动加载文件数据至内存了。

RDB恢复又分两种情况：

1）**主库master**：

- 载入RDB时，过期键会被忽略。


2）**从库salve**：

载入 RDB 时，文件中的所有键都会被载入，当同步进行时，会和Master 保持一致。不过，因为主从服务器在进行数据同步的时候，从服务器的数据库就会被清空，所以一般来说，过期键在载入RDB文件的从服务器也不会造成影响

 

AOF则不会，过期但并未被删除释放的状态会被正常记录到 `AOF` 文件中，当过期键发生释放删除时，`DEL` 也会被同步到 `AOF` 文件中去。



如果同时开启了RDB和AOF，Redis会优先加载AOF文件，找不到AOF文件才会加载RDB文件。



redis4.0开始 添加了RDB-AOF混合方式，可以通过设置`aof-use-rdb-preamble yes`开启。`.aof`文件就由`.rdb`和`.aof`文件组成了。这样加载速度快，同时结合AOF，增量的数据以AOF方式保存了，数据更少的丢失。

![ ](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201027170452172.png)



参考：

- https://www.cnblogs.com/ivictor/p/9749465.html
- https://blog.csdn.net/qq_28018283/article/details/80764518
- https://redis.io/topics/persistenc
