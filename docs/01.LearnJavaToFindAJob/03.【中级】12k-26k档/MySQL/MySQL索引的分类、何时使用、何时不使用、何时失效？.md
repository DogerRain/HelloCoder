---
title: MySQL索引的分类、何时使用、何时不使用、何时失效？
date: 2022-06-02 11:18:19
lock: false
permalink: /pages/MySQL%E7%B4%A2%E5%BC%95%E7%9A%84%E5%88%86%E7%B1%BB%E3%80%81%E4%BD%95%E6%97%B6%E4%BD%BF%E7%94%A8%E3%80%81%E4%BD%95%E6%97%B6%E4%B8%8D%E4%BD%BF%E7%94%A8%E3%80%81%E4%BD%95%E6%97%B6%E5%A4%B1%E6%95%88%EF%BC%9F
categories: 
  - LearnJavaToFindAJob
  - 【中级】12k-26k档
  - MySQL
tags: 
  - MySQL
  - 索引的分类
  - 何时使用
  - 何时不使用
  - 何时失效
---
## 1、索引分类

索引有五种，分别是：

普通索引、唯一索引、主键索引、组合索引、全文索引

### 1、普通索引

普通索引的值可以重复，可以为空

```sql
alter table `table_name` add index index_name(`column`);
```

创建索引最好的做法是在建表的时候就顺带创建，如果之后再创建：

- 对于聚簇索引，会根据原来的表，再创建一个新的带有索引数据结构的表，然后把原来的表删除，再把表名改成原来表的名字。
- 非聚集索引则是通过修改索引文件来完成（因为索引是在单独的文件）

但是这两者，都占用了额外的资源。



### 2、唯一索引

索引列的值必须唯一，不能重复，但可以为空

```sql
alter table `table_name` add unique(`column`);
```

### 3、主键索引

索引列的值必须唯一，不能重复只能有一个，不允许为空。一般在建表指定。

```sql
alter table `table_name` add primary key(`column`);
```

### 4、组合索引

在多个字段上创建索引，遵循最左前缀原则

```sql
alter table `table_name` add index index_name(`column1`,`column2`,`column3`);
```

### 5、全文索引

关键字：FULLTEXT 。用的比较少，现在只有**char，varchar，text**上可以创建全文索引。类似于一个搜索引擎，在大量数据中寻找。

> 注意：FULLTEXT索引仅可用于 MyISAM 表

```sql
# 创建表的时候添加全文索引
CREATE TABLE `artical` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `subject` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
    `title` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
    `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
    `time` Date NULL DEFAULT NULL,
    PRIMARY KEY(`id`),
    FULLTEXT (content)
)engine=MyISAM;

# 修改表结构添加全文索引
alter table `artical` add FULLTEXT(`content`);

# 直接创建索引
CREATE FULLTEXT INDEX index_content ON `artical`(`content`);
```

## 2、何时使用索引

MySQL每次查询只使用一个索引。与其说是“数据库查询只能用到一个索引”，倒不如说，和全表扫描比起来，去分析两个索引B+树更加耗费时间。所以where A=a and B=b这种查询使用（A，B）的组合索引最佳，B+树根据（A，B）来排序。

（1）主键，unique字段；

（2）和其他表做连接的字段需要加索引；

（3）在where里使用＞，≥，＝，＜，≤，is null和between等字段；

（4）使用不以通配符开始的like，如 where A like 'China%'；

（5）聚集函数MIN()，MAX()中的字段；

（6）order by和group by字段；



## 3、何时不使用索引

（1）表记录太少； 

（2）数据重复且分布平均的字段（只有很少数据值的列）；

（3）经常插入、删除、修改的表要减少索引；

（4）text，image等类型不应该建立索引，这些列的数据量大（假如text前10个字符唯一，也可以对text前10个字符建立索引）；

（5）MySQL能估计出全表扫描比使用索引更快时，不使用索引；



## 4、索引何时失效

 （1）组合索引未使用最左前缀，例如组合索引（A，B），where B=b不会使用索引；

（2）like未使用最左前缀，where A like '%China'；

（3）搜索一个索引而在另一个索引上做order by，where A=a order by B，只使用A上的索引，因为查询只使用一个索引；

（4）or会使索引失效。如果查询字段相同，也可以使用索引。

例如：

where A=a1 or A=a2（生效），

where A=a or B=b（失效，除非A和B都加上索引）

（5）隐式转换

如果列类型是字符串类型，要使用引号，否则索引会实效。

例如 where A='1' 生效，where A=1 索引失效（会进行类型转换）；

但是列是int类型，where A='1'  是不会失效的。

（6）在索引列上的操作，函数（upper()等）、or、！=(<>)、not in等；



## 5、索引设计、索引优化 

1、使用覆盖索引

2、业务上具有唯一特性的字段，即使是组合字段，也建议建成唯一索引。

3、多表关联查询时，尽量不超过三个join

4、在varchar字段上建立索引时，必须指定索引长度，没必要对全字段建立索引，根据实际文本区分度决定索引长度。说明：索引的长度与区分度是一对矛盾体，一般对字符串类型数据，长度为20的索引，区分度会高达90%以上，可以使用count(distinct left(列名, 索引长度))/count(*)的区分度来确定。

5、遵循最左匹配原则

6、注意隐式转换（上面说到）



## 6、使用索引的优缺点有哪些？

**优点:**
1.可以通过建立唯一索引或者主键索引，保证数据库表中每一行数据的唯一性
2.建立索引可以大大提高检索的数据，以及减少表的检索行数
3.在表连接的连接条件，可以加速表与表直接的相连
4.在**分组**和**排序**字句进行数据检索，可以减少查询时间中分组和 排序时所消耗的时间(数据库的记录会重新排序)
5.建立索引,在查询中使用索引，可以提高性能
**缺点:**
1.创建索引和维护索引会耗费时间，随着数据量的增加而增加
2.索引文件会占用物理空间，除了数据表需要占用物理空间之外，每一个索引还会占用一定的物理空间
3.当对表的数据进行 INSERT,UPDATE,DELETE 的时候,索引也要动态的维护,这样就会降低数据的维护速度,(建立索引会占用磁盘空间的索引文件。一般情况这个问题不太严重，但如果你在一个大表上创建了多种组合索引，索引文件的会膨胀很快)。