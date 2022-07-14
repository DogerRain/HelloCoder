---
title: MySQL的自增ID用完了会怎样？
date: 2022-06-02 11:18:18
lock: false
permalink: /pages/MySQL%E7%9A%84%E8%87%AA%E5%A2%9EID%E7%94%A8%E5%AE%8C%E4%BA%86%E4%BC%9A%E6%80%8E%E6%A0%B7%EF%BC%9F
categories: 
  - LearnJavaToFindAJob
  - 【中级】12k-26k档
  - MySQL
tags: 
  - MySQL
  - ID
  - 自增
---
我本人没有遇到这个问题，但是看到群里的小伙伴被问了，这也是个很有趣的问题，涉及MySQL的原理了，而且还是个坑，会牵涉很多问题。

> 面试官：MySQL的自增ID用完了会怎样？
>
> 小白：那插入应该有问题吧。
>
> 面试官：会报错吗？还是会覆盖其他列，还是会申请额外空间？
>
> 小白：应该会报错。
>
> 面试官：那你知道原理是什么吗？
>
> 小白：这个不清楚~

## 1、MySQL的自增ID用完了会怎样?

> MySQL版本：8.0.13

既然想知道自增ID用完了会出现什么样的结果，那干脆来测试一下。

`int`占4个字节，如果是无符号那么它最大的范围是`2^32-1 = 4,294,967,295`，约43亿。

我这里使用`int`作为主键，建表，设置最大的自增ID：

```sql
CREATE TABLE test 
( 
	id INT UNSIGNED auto_increment PRIMARY KEY,
	name VARCHAR(20) NOT NULL DEFAULT ''

) auto_increment = 4294967295;

INSERT INTO test(`name`) VALUES ( "HaC" );
```

这个语句是插入成功的：

```sql
mysql> select * from test;
+------------+------+
| id         | name |
+------------+------+
| 4294967295 | HaC  |
+------------+------+
1 row in set (0.00 sec)
```

我们此时再插入一条语句 `INSERT INTO test(name) VALUES ( "HelloCoder" );`

```sql
mysql> INSERT INTO test(`name`) VALUES ( "HelloCoder" );
ERROR 1062 (23000): Duplicate entry '4294967295' for key 'PRIMARY'
```

以上结果说明，当再次插入时，使用的自增ID还是 `4294967295`，并不会再自增，**报主键冲突的错误**。所以说，**MySQL的自增ID用完了，会导致插入直接报错。**

原理就是设置的主键`int`的范围决定的。



## 2、达到最大值了怎么办？

相信你答出插入出错，面试官依然还会问：

> 面试官：假如刚开始选自增ID的时候，使用了int又恰好用完了，那应该怎么办？
>
> 小白：简单，使用alter语句修改就行了，换成更大的bigint就行了。

这样答也不是没有问题，但是其实还是跳入了另外一个坑。

bigint 占8个字节，`2^64 -1  = 18446744073709551615` 。

但是，你想想看，上千万上亿的数据，你一个：

```sql
ALTER TABLE test modify  COLUMN id BIGINT NOT NULL;
```

这得到猴年马月，IO不得等很久？服务器都要告警了。

> 面试官：alter修改大表没有什么注意事项吗？
>
> 小白：额....应该会锁表

Mysql在5.6版本之前，直接修改表结构的过程中会锁表，所以不能直接alter表；优选的方案的操作步骤如下：

- （1）首先创建新的临时表，表结构通过命令ALTAR TABLE新定义的结构
- （2）然后把原表中数据导入到临时表
- （3）删除原表
- （4）最后把临时表重命名为原来的表名

Mysql 5.6 虽然引入了Online DDL，在修改表结构的时候，增加`ALGORITHM=INPLACE, LOCK=NONE`，在运行 alter table 操作的同时允许运行 select,insert,update,delete语句。

```sql
ALTER TABLE tbl_name CHANGE c1 c1 BIGINT, ALGORITHM=COPY;
```

但是以下一些场景，仍然会锁表：

- ①某个慢SQL或者比较大的结果集的SQL在运行，执行ALTER TABLE时将会导致锁表发生；

- ②存在一个事务在操作表的时候，执行ALTER TABLE也会导致修改等待；

> 参考MySQL的Online DDL介绍：
> https://dev.mysql.com/doc/refman/5.6/en/innodb-online-ddl-operations.html#online-ddl-column-operations

这是我从上面MySQL官网截取的5.6版本对于Online DDL的支持：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210528103213243.png)

所以如果你直接使用 ALTER 这样的语句在线修改表数据结构，还是会导致这张表无法进行更新类操作 ( DELETE、UPDATE、DELETE )。

这里有个问题也要注意一下，在执行DDL的时候，还是可以进行DML( DELETE、UPDATE、DELETE )操作的，因为DDL一旦开始了，就无法停止，MySQL会把DML语句缓存到有个buff里面

> 面试官：既然alter会锁表，那有什么办法可以解决吗？
>
> 小白：额...

列举一些建议：

- online DDL前，最好确认一下当前数据库有没有类似`table metadata lock`存在
- 查看一下有没有未提交的事务，查看事务`nformation_schema.innodb_trx`表
- 以上两个问题，总结就是尽量选择流量小的时间点执行，这也是为什么深夜上线的原因。
- 借助第三方工具，这些工具在DDL是可以不阻塞表，比如说**pt-online-schema-change**
- 最好的方案还是主从切换来做，直接在从库上进行表结构修改，不会阻塞从库的读操作，改完之后，进行主从切换即可。

> 可以参考阿里的解决方案：https://help.aliyun.com/document_detail/94566.html



## 3、有遇到过ID用完的情况吗？

> 噼里啪啦前面都答出来.....
>
> 面试官：（小伙子还不错）
>
> 面试官：那，有遇到过ID用完的情况吗？
>
> 小白：额...

你想想看，既然这个表到达了索引上限，我算它一天插入 10w 条数据，那么就是 `4294967295 / 100000 / 365 = 117` 年才用完，再考虑一些删除、ID不连续，那也得好几十年才用完。

好吧，如果面试官非要杠假如一天就1百万、1千万条数据了。

那么就上`bigint`吧。



等等！

回到最开始的问题上，业务上一个表竟然可以达到几个亿，那说明B+树（Innodb）的查询效率已经很慢了，**那为什么不分库分表呢？**

> 小白：没听清，你再问我一遍
>
> 面试官：有遇到过ID用完的情况吗？
>
> 小白：没遇到过，即使是用int类型的主键，但是我们在ID达到最大值之前，就分库分表了。
>
> 面试官：.....好吧，那分库分表分哪几种，如何分？

欲知下事，且听下回：[对分库分表的理解，为什么要分库分表？](articles\项目深度\对分库分表的理解，为什么要分库分表？.md) 