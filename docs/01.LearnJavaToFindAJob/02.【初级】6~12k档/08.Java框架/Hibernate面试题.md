---
title: Hibernate面试题
date: 2022-06-02 11:18:18
lock: false
permalink: /pages/Hibernate%E9%9D%A2%E8%AF%95%E9%A2%98
categories: 
  - LearnJavaToFindAJob
  - 【初级】6~12k档
  - Java框架
tags: 
  - Hibernate
  - 面试题
---
### 1、Hibernate的理解

Java的核心之一是面向对象设计，那么如何把数据库的数据封装成一个对象返回呢？如何把一个对象出局后保存到数据库呢？Java采用了jdbc来解决这个问题，但是数据量如何解决，也没有标准的模板来解决呢？这就是Hibernate的功能之一了。



Hibernate实现了Java对象与关系数据库记录的映射关系，简称ORM，像mybatis、jpa也是一种ORM框架。有了Hibernate，我们就不需要写jdbc代码了，直接调用hibernate的方法就可以了，比如save、get。对 JDBC 访问数据库的代码做了封装，简化了数据访问层繁琐的重复。



### 2、Hibernate运行过程和原理

简单运行过程如下：

配置Configuration 、产生SessionFactory、创建session对象、启动事务、完成CURD、提交事务、关闭session。



所以核心是：**Configuration、SessionFactory、Session**

1、hibernate启动的时候利用Configuration读取xml配置文件 
2、通过配置文件创建SessionFactory对象，初始化hibernate基本信息 
3、获取session然后调用CRUD方法进行数据操作，hibernate会把我们的数据进行三种状态的划分，然后根据状态进行管理我们的数据，对应的发送SQL进行数据操作 
4、关闭session，如果有事务的情况下，需要手动获取事务并开启，然后事务结束后提交事务。 
5、在提交事务的时候，去验证我们的快照里面的数据和缓存数据是否一致，如果不一致，发送SQL进行修改。

### 3、Hibernate的数据三种状态 

Hibernate把他所管理的数据划分为三种状态 
**瞬时的**（刚new出来的数据–内存有，数据库没有） 不和数据库的数据有任何关联关系，在Hibernate中，可通过session的save()或 saveOrUpdate()方法将瞬时对象与数据库相关联，并将数据对应的插入数据库中，此时该瞬时对象转变成持久化对象.

**持久的** （从数据查询的，或者刚保存到数据库，session没关闭的， 数据库有，内存也有） 处于该状态的对象在数据库中具有对应的记录，并拥有一个持久化标识。如果是用hibernate的delete()方法，对应的持久对象就变成瞬时对象，因数据库中的对应数据已被删除，该对象不再与数据库的记录关联。

当一个session执行close()或clear()、evict()之后，持久对象变成脱管对象，此时持久对象会变成脱管对象，此时该对象虽然具有数据库识别值，但它已不在HIbernate持久层的管理之下。

**游离的** （数据库有，内存没有） 当与某持久对象关联的session被关闭后，该持久对象转变为脱管对象。当脱管对象被重新关联到session上时，并再次转变成持久对象。



在事务提交的时候，Hibernate去对比处于持久状态的数据是否发生改变，(快照区、一级缓存区)，当我们会话结束前，对持久状态数据进行了修改的话，快照区的数据会跟着改变。当session提交事务的时候，如果发现快照区和一级缓存的数据不一致，就会发送SQL进行修改。



### 4、Hibernate的get方法和load方法的区别 

1、get和load都是利用主键策略查询数据， 
2、get默认不使用懒加载机制，load默认要使用懒加载机制，所谓的懒加载就是我们这个数据如果不使用，hibernate就不发送SQL到数据库查询数据。 
3、当查询数据库不存在的数据的时候，get方法返回null，load方法抛出空指针异常， 
原因是因为，load方法采用的动态代理的方式实现的，我们使用load方法的时候，Hibernate会创建一个该实体的代理对象，该代理只保存了该对象的ID，当我们访问该实体对象其他属性，Hibernate就发送SQL查询数据封装到代理对象，然后在利用代理对象返回给我们实际的数据。



### 5、Hibernate的缓存机制

hibernate分为2级缓存 

一级缓存又叫session缓存，又叫事务级缓存，生命周期从事务开始到事务结束，一级缓存是hibernate自带的，暴力使用，当我们一创建session就已有这个缓存了。数据库就会自动往缓存存放， 
二级缓存是hibernate提供的一组开放的接口方式实现的，都是通过整合第三方的缓存框架来实现的，二级缓存又叫sessionFactory的缓存，可以跨session访问。常用的EHcache、OScache，这个需要一些配置。



当我们每次 查询数据的时候，首先是到一级缓存查看是否存在该对象，如果有直接返回，如果没有就去二级缓存进行查看，如果有直接返回，如果没有在发送SQL到数据库查询数据， 
当SQL发送查询回该数据的时候，hibernate会把该对象以主键为标记的形式存储到二级缓存和一级缓存，如果返回的是集合，会把集合打散然后以主键的形式存储到缓存。一级缓存和二级缓存只针对以ID查询的方式生效，get、load方法。



### 6、Hibernate有哪几种查询数据的方式

3种

- hql、
- 条件查询QBC(Query By Criteria)
- 原生sql （通过createSQLQuery建立）