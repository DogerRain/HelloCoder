## 索引分类

索引有五种，分别是：

普通索引、唯一索引、主键索引、组合索引、全文索引

### 1、普通索引

普通索引的值可以重复，可以为空

```mysql
alter table `table_name` add index index_name(`column`);
```

### 2、唯一索引

索引列的值必须唯一，不能重复，但可以为空

```mysql
alter table `table_name` add unique(`column`);
```

### 3、主键索引

索引列的值必须唯一，不能重复只能有一个，不允许为空。一般在建表指定。

```mysql
alter table `table_name` add primary key(`column`);
```

### 4、组合索引

在多个字段上创建索引，遵循最左前缀原则

```mysql
alter table `table_name` add index index_name(`column1`,`column2`,`column3`);
```

### 5、全文索引

用的比较少，现在只有char，varchar，text上可以创建全文索引。类似于一个搜索引擎，在大量数据中寻找。

```mysql
alter table `table_name` add fulltext(`column`);
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

（5）如果列类型是字符串，要使用引号。

例如 where A='1' 生效，where A=1 索引失效（会进行类型转换）；

但是列是int，where A='1'  是不会失效的。

（6）在索引列上的操作，函数（upper()等）、or、！=(<>)、not in等；