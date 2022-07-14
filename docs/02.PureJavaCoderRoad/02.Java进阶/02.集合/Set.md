---
title: Set
date: 2022-05-26 17:03:56
permalink: /pages/Set
lock: false
categories: 
  - PureJavaCoderRoad
  - Java进阶
  - 集合
tags: 
  - Set
---
## Set 介绍

`Set`是一个 **可为null、不可重复** 的集合。

至于 是否有序，要看子类的实现。

> `List` 是 **有序、可为null、可重复**的集合

使用：

```java
import java.util.Set;
```



## Set 接口的API

`Set` 接口的API比List少，但用法基本一致：

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210128095931650.png)



一般在业务开发中，使用Set的情况比较少。



## Set接口的实现类

常见的实现类有：

- HashSet
- TreeSet
- LinkedHashSet



### HashSet

HashSet是Set接口的典型实现，大多数时候使用Set集合时一般是使用HashSet。

HashSet按Hash算法来存储集合中的元素，因此具有很好的存取和查找性能。底层数据结构是**哈希表**。

```java
Set set = new HashSet();
```

HashSet具有以下特点：

- **不能保证元素的排列顺序**；
- HashSet不是同步的（线程不安全）；
- 集合元素值可以是null；



HashSet 和 HashMap 一样，用每个元素的hashCode值来计算其存储位置。



### LinkedHashSet

```java
Set linkedHashSet = new LinkedHashSet();
```

LinkedHashSet 继承 HashSet ，也是根据元素的hashCode值来决定元素的存储位置。底层数据结构是**链表**。

但它同时使用链表维护元素的次序，这样使得元素看起来是以插入的顺序保存的。

输出集合里的元素时，元素顺序总是与添加顺序一致，因此LinkedHashSet 是有序的。

但是`LinkedHashSet`依然是`HashSet`，因此它**不允许集合重复**。



### TreeSet

```java
Set treeSet = new TreeSet();
```

TreeSet可以确保集合元素处于排序状态。

TreeSet内部实现的是**红黑树**，默认整型排序为从小到大。

可以通过Comparator接口实现自定义排序。

