---
title: binlog、redolog、undolog的区别和作用
date: 2022-06-02 11:18:18
lock: false
permalink: /pages/binlog%E3%80%81redolog%E3%80%81undolog%E7%9A%84%E5%8C%BA%E5%88%AB%E5%92%8C%E4%BD%9C%E7%94%A8
categories: 
  - LearnJavaToFindAJob
  - 【中级】12k-26k档
  - MySQL
tags: 
  - binlog
  - redolog
  - undolog
  - 区别
  - 作用
  - 区别和作用
---
我们知道事务有ACID四个，四个事务的实现是通过InnoDB日志和锁来保证的。

**隔离性**是通过数据库锁的机制实现的。

**持久性**通过redo log（重做日志）来实现

**原子性**和**一致性**通过Undo log来实现。

## 1、bin log

`binlog` 用于记录数据库执行的写入性操作(不包括查询)信息，以二进制的形式保存在磁盘中。`binlog` 是 `mysql`的逻辑日志，并且由 `Server` 层进行记录，使用任何存储引擎的 `mysql` 数据库都会记录 `binlog` 日志。

> 所以binlog日志并不是innodb独有的，它是server层的日志

既然是server层的日志，它记录的都是事务操作内容，是一种逻辑日志。

> 逻辑日志：可以简单理解为记录的就是sql语句 。

`binlog` 是通过追加的方式进行写入的，可以通过`max_binlog_size` 参数设置每个 `binlog`文件的大小，当文件大小达到给定值之后，会生成新的文件来保存日志。

### binlog使用场景：

1. `binlog`可以作为恢复数据使用，通过使用 `mysqlbinlog` 工具来恢复数据。
2. 主从复制搭建（数据同步）。在 `Master` 端开启 `binlog` ，然后将 `binlog`发送到各个 `Slave` 端， `Slave` 端重放 `binlog` 从而达到主从数据一致

### binlog刷盘时机：

MySQL数据库中的任何存储引擎对于数据库的更改都会产生`binlog`，此时记录还在内存中，那么 `biglog`是什么时候刷到磁盘中的呢？

- 0：不去强制要求，由系统自行判断何时写入磁盘；
- 1：每次 `commit` 的时候都要将 `binlog` 写入磁盘；
- N：每N个事务，才会将 `binlog` 写入磁盘。

从上面可以看出， `sync_binlog` 最安全的是设置是 `1` ，这也是`MySQL 5.7.7`之后版本的默认值。但是设置一个大一些的值可以提升数据库性能，因此实际情况下也可以将值适当调大，牺牲一定的一致性来获取更好的性能。

### binlog日志格式：

`binlog` 日志有三种格式，分别为 `STATMENT` 、 `ROW` 和 `MIXED`。

> 在 `MySQL 5.7.7` 之前，默认的格式是 `STATEMENT` ， `MySQL 5.7.7` 之后，默认值是 `ROW`。日志格式通过 `binlog-format` 指定。

- `STATMENT`：基于`SQL` 语句的复制( `statement-based replication, SBR` )，每一条会修改数据的sql语句会记录到`binlog` 中  。

- - 优点：不需要记录每一行的变化，减少了 binlog 日志量，节约了 IO  , 从而提高了性能；
  - 缺点：在某些情况下会导致主从数据不一致，比如执行sysdate() 、  slepp()  等 。

- `ROW`：基于行的复制(`row-based replication, RBR` )，不记录每条sql语句的上下文信息，仅需记录哪条数据被修改了。

- - 优点：不会出现某些特定情况下的存储过程、或function、或trigger的调用和触发无法被正确复制的问题 ；
  - 缺点：会产生大量的日志，尤其是` alter table ` 的时候会让日志暴涨

- `MIXED`：基于`STATMENT` 和 `ROW` 两种模式的混合复制(`mixed-based replication, MBR` )，一般的复制使用`STATEMENT` 模式保存 `binlog` ，对于 `STATEMENT` 模式无法复制的操作使用 `ROW` 模式保存 `binlog`



## 2、redo log

redo log 是 InnoDB 引擎特有的。redo log作为异常宕机或者介质故障后的数据恢复使用。所以这也是持久性的依赖，只要事务提交成功，数据库对已经修改的数据就被永久保存下来了。

### 有了binglog为什么还要有redolog？

主要原因如下：

1. binlog会记录所有的日志，是关于一个事务的逻辑日志，而redolog只需要记录innodb引擎本身的日志
2. innodb是以页为单位和磁盘进行交互的，如果一个事务只修改一个数据页里面的几个字节，那将整个数据页刷盘就很浪费资源了；或者一个事务可能涉及修改多个数据页，而且binlog是随机写，如果每次事务提交都刷盘，会极大影响数据库的性能。
3. 确保事务的持久性，如果binlog在刷盘的时候宕机了，就真的丢失了（当然binlog可以每次都刷盘但是性能不好），redo log的落盘并不是随着事务的提交才写入的，而是在事务的执行过程中，便开始写入 `redo log buffer`中，所以在恢复的时候，redolog依然记录了宕机前的数据。

因此设计了redolog， **具体来说就是只记录事务对数据页做了哪些修改**，这样就能完美地解决性能问题了(相对而言文件更小并且是顺序IO)。

### redo log 概念

`redo log`记录的是新数据的备份。在事务提交前，只要将`redo log`持久化即可，不需要将数据持久化。当系统崩溃时，虽然数据没有持久化，但是`redo log`已经持久化。系统可以根据`redo log`的内容，将所有数据恢复到最新的状态。 （从而达到持久性）

### redo log 工作过程

`mysql` 每执行一条 `DML` 语句，先将记录写入 `redo log buffer`，后续某个时间点再一次性将多个操作记录写到 `redo log file`。这种 **先写日志，再写磁盘** 的技术就是 `MySQL`
里经常说到的 `WAL(Write-Ahead Logging)` 技术。

在计算机操作系统中，用户空间( `user space` )下的缓冲区数据一般情况下是无法直接写入磁盘的，中间必须经过操作系统内核空间( `kernel space` )缓冲区( `OS Buffer` )。

因此， `redo log buffer` 写入 `redo logfile` 实际上是先写入 `OS Buffer` ，然后再通过系统调用 `fsync()` 将其刷到 `redo log file`
中，过程如下：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-202112image-20210824174026761.png)

redolog支持三种将 `redo log buffer` 写入 `redo log file` 的时机，可以通过 `innodb_flush_log_at_trx_commit` 参数配置：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-202112image-20210824174356130.png)



由 `binlog` 和 `redo log` 的区别可知：`binlog` 日志只用于归档，只依靠 `binlog` 是没有 `crash-safe` 能力的。

但只有 `redo log` 也不行，因为 `redo log` 是 `InnoDB`特有的，且日志上的记录落盘后会被覆盖掉。因此需要 `binlog`和 `redo log`二者同时记录，才能保证当数据库发生宕机重启时，数据不会丢失。

## 3、undo log

`undo log`的原理很简单，为了满足事务的**原子性**，在操作任何数据之前，首先将数据备份到一个地方（这个存储数据备份的地方称为`undo log`）。然后进行数据的修改。如果出现了错误或者用户执行了`ROLLBACK`语句，系统可以利用`undo log`中的备份将数据恢复到事务开始之前的状态。 

简单来说就是，比如你执行一条 `INSERT` 语句，就会对应一条`DELETE` 的 `undo log` ，所以发生错误或者回滚了，就能回滚到事务之前的状态了。



---

参考：

-  [https://juejin.cn/post/6860252224930070536](https://juejin.cn/post/6860252224930070536)