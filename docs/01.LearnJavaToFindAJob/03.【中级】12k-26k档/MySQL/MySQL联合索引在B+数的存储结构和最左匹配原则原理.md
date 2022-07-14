---
title: MySQL联合索引在B+数的存储结构和最左匹配原则原理
date: 2022-06-02 11:18:19
lock: false
permalink: /pages/MySQL%E8%81%94%E5%90%88%E7%B4%A2%E5%BC%95%E5%9C%A8B+%E6%95%B0%E7%9A%84%E5%AD%98%E5%82%A8%E7%BB%93%E6%9E%84%E5%92%8C%E6%9C%80%E5%B7%A6%E5%8C%B9%E9%85%8D%E5%8E%9F%E5%88%99%E5%8E%9F%E7%90%86
categories: 
  - LearnJavaToFindAJob
  - 【中级】12k-26k档
  - MySQL
tags: 
  - MySQL
  - B
  - 联合索引在
---
## A&Q MySQL联合索引在B+数的存储结构和最左匹配原则原理

联合索引也是MySQL一个很常见的索引，有时候我们在 where 后面加了很多条件，合理使用联合索引可以提升我们的SQL执行效率。

而且联合索引还有一个最左匹配原则，概念相信大家都知道，但是原理是什么呢？



还是以Innodb为例子。

MySQL把 B+Tree作为索引底层数据结构，联合索引也是一样，它也是 **B+Tree** 的结构。



唯一索引、普通索引 在innodb上的实现也差不多，而联合索引的实现和普通索引的实现其实是一样的。

参考：[Innodb和MyISAM索引的区别（B树、B+树、聚簇索引、非聚簇索引）？](articles\MySQL\Innodb和MyISAM索引的区别.md) 



假设 有表：


![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210701/image-20210727165810144.png)

表T1有字段a,b,c,d,e，其中a是主键，并创建了一个联合索引idx_t1_bcd(b,c,d)，然后b、c、d三列作为联合索引，在B+树上的结构正如上图所示。

> 联合索引（b，c，d）生成一个索引树，同样是B+树的结构，首先我们创建的`index_bcd(b,c,d)`索引，相当于创建了(b)、（b、c）（b、c、d）三个索引。

非叶子节点，上面两行，以第二行为例，b、c、d 组成的联合索引就是在B+树的结构，特点有：

- 按顺序排列，按 b 排序：1、2、2、3、3、4、6、8 
- 如果字段 b 相等，再按字段 c 排序 



所以到这里，你大概可以知道 **最左匹配原则** 的原理了。

 **最左匹配原则** 它是依赖于联合索引的存储结构的，只有在匹配了最左边的索引 b ，才能知道这一行数据的位置。

比如说上面图片：

- where b =1 ; 可以很容易知道它在第一个位置（它是有序的）
- where c =2 ; 则可以找到两行，（2，2，2）和（3，2，2），这样在整体看来，是无序的，因为 c =2 ，它可以出现在节点的任何一个位置。**所以这也是为什么最左匹配原则失效的原因。**



列举一些SQL的索引使用情况：

```sql
select * from T1 where b = 12 and c = 14 and d = 3;-- 全值索引匹配 三列都用到
select * from T1 where b = 12 and c = 14 and e = 'd';-- 应用到两列索引
select * from T1 where b = 12 and e = 'd';-- 应用到一列索引
select * from T1 where b = 12  and c >= 14 and e = 'd';-- 应用到b、c两列列索引及索引条件下推优化
select * from T1 where b = 12  and d = 3;-- 应用到一列索引  因为不能跨列使用索引 没有c列 连不上
select * from T1 where c = 14  and d = 3;-- 无法应用索引，违背最左匹配原则
```



---

参考：

- https://juejin.cn/post/6844904073955639304