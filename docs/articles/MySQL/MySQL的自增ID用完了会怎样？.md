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

我这里使用`int`作为主键，`int`占4个字节，那么它最大的范围是`2^32-1 = 4,294,967,295`，建表，设置最大的自增ID：

```mysql
CREATE TABLE test 
( 
	id INT UNSIGNED auto_increment PRIMARY KEY,
	name VARCHAR(20) NOT NULL DEFAULT ''

) auto_increment = 4294967295;

INSERT INTO test(`name`) VALUES ( "HaC" );
```

这个语句是插入成功的：

```mysql
mysql> select * from test;
+------------+------+
| id         | name |
+------------+------+
| 4294967295 | HaC  |
+------------+------+
1 row in set (0.00 sec)
```

我们此时再插入一条语句 `INSERT INTO test(name) VALUES ( "HelloCoder" );`

```mysql
mysql> INSERT INTO test(`name`) VALUES ( "HelloCoder" );
ERROR 1062 (23000): Duplicate entry '4294967295' for key 'PRIMARY'
```

发现报错了，所以说，**MySQL的自增ID用完了，会导致插入直接报错。**

原理就是设置的主键`int`的范围决定的。



## 2、达到最大值了怎么办？

相信你答出插入出错，面试官依然还会问：

> 面试官：假如刚开始选自增ID的时候，使用了int又恰好用完了，那应该怎么办？
>
> 小白：简单，使用alter语句修改就行了，换成更大的bigint就行了。

这样答也不是没有问题，但是其实还是跳入了另外一个坑。

Mysql在5.6版本之前，直接修改表结构的过程中会锁表，具体的操作步骤如下：
（1）首先创建新的临时表，表结构通过命令ALTAR TABLE新定义的结构
（2）然后把原表中数据导入到临时表
（3）删除原表
（4）最后把临时表重命名为原来的表名

[自增 ID 用完了怎么办 ?_Hern（宋兆恒）-CSDN博客_数据库自增id用完了](https://blog.csdn.net/qq_36761831/article/details/100136057)

Mysql 5.6 虽然引入了Online DDL，但是并不是修改表结构的时候，一定不会导致锁表，在一些场景下还是会锁表的，比如

- ①某个慢SQL或者比较大的结果集的SQL在运行，执行ALTER TABLE时将会导致锁表发生；

- ②存在一个事务在操作表的时候，执行ALTER TABLE也会导致修改等待；

