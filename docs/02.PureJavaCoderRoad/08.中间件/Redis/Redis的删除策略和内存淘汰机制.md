---
title: Redis的删除策略和内存淘汰机制
date: 2022-05-26 17:04:04
permalink: /PureJavaCoderRoad/pages/Redis%E7%9A%84%E5%88%A0%E9%99%A4%E7%AD%96%E7%95%A5%E5%92%8C%E5%86%85%E5%AD%98%E6%B7%98%E6%B1%B0%E6%9C%BA%E5%88%B6
lock: false
categories: 
  - PureJavaCoderRoad
  - 中间件
  - Redis
tags: 
  - Redis
  - 删除策略
---
Redis的key可以设置过期时间，那是否意味着时间一到就会马上被删除呢？

Redis的数据存储大小是有限的，假如内存不足Redis有什么应对策略呢？

本篇文章将介绍一下Redis的过期策略和内存淘汰机制。

## 1、redis的过期策略

redis的key过期删除策略有以下三种：

#### 1.定时删除

在设置key的过期时间的同时，为该key创建一个定时器，让定时器在key的过期时间来临时，对key进行删除
**优点：**
保证内存被尽快释放
**缺点：**
1)若过期key很多，删除这些key会占用很多的CPU时间，在CPU时间紧张的情况下，CPU不能把所有的时间用来做要紧的事儿，还需要去花时间删除这些key。
2)定时器的创建耗时，若为每一个设置过期时间的key创建一个定时器（将会有大量的定时器产生），性能影响严重 

#### 2.惰性删除

key过期的时候不删除，每次从数据库获取key的时候去检查是否过期，若过期，则删除，返回null。
**优点：**
删除操作只发生在从数据库取出key的时候发生，而且只删除当前key，所以对CPU时间的占用是比较少的，而且此时的删除是已经到了非做不可的地步.
**缺点：**
若大量的key在超出超时时间后，很久一段时间内，都没有被获取过，那么可能发生内存泄露（无用的垃圾占用了大量的内存）

#### 3.定期删除

如果当前库中没有一个key设置了过期时间，直接执行下一个库的遍历，随机获取一个设置了过期时间的key，检查该key是否过期，如果过期，删除key，判断定期删除操作是否已经达到指定时长，若已经达到，直接退出定期删除。（默认每个库检测20个key）
**优点:**
1)通过限制删除操作的时长和频率，来减少删除操作对CPU时间的占用--处理"定时删除"的缺点
2)定期删除过期key--处理"惰性删除"的缺点
**缺点：**
1)在内存友好方面，不如"定时删除"
2)在CPU时间友好方面，不如"惰性删除"

Redis采用的删除策略是：**定期删除+惰性删除** ，这种方法是十分高效。



## 2、内存淘汰机制

Redis有过期策略，假如你的Redis只能存1G的数据，你一个请求写入2G，而你也没有及时请求key，那么惰性删除就不生效了，Redis占用内存就会越来越高。

Redis可以设置内存大小：

```
# maxmemory <bytes>
# 设置Redis最大占用内存大小为100
maxmemory 100mb
```

超过了这个内存大小，就会触发**内存淘汰机制**

至于为什么一定要设置这个大小，可以看一下官方：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210325144733549.png)

> 如果不设置，Redis将消耗掉系统所有的可用内存

Redis有一个默认  **内存淘汰机制**：

```
# maxmemory-policy noeviction
```

`maxmemory-policy`一共有8个值，当内存不足时：

1）noeviction： 不删除，直接返回报错信息。 
2）allkeys-lru：移除最久未使用（使用频率最少）使用的key。**推荐使用这种。**
3）volatile-lru：在设置了过期时间的key中，移除最久未使用的key。 
4）allkeys-random：随机移除某个key。 
5）volatile-random：在设置了过期时间的key中，随机移除某个key。
6）volatile-ttl： 在设置了过期时间的key中，移除准备过期的key。
7）allkeys-lfu：移除最近最少使用的key。
8）volatile-lfu：在设置了过期时间的key中，移除最近最少使用的key。

查看内存淘汰机制：

```bash
localhost:0>config get maxmemory-policy
 1)  "maxmemory-policy"
 2)  "noeviction"
```

>LRU和LFU的区别：
>
>LRU是最近最少使用页面置换算法(Least Recently Used),也就是首先淘汰最长时间未被使用的页面!
>
>这个主要针对的是使用时间
>
>比如有数据 1，1，1，2，2，3
>此时缓存中已有（1，2）
>当3加入的时候，得把前面的1淘汰，变成（3，2）
>
>
>
>LFU是最近最不常用页面置换算法(Least Frequently Used),也就是淘汰一定时期内被访问次数最少的页!
>
>这个主要针对的是使用频率
>
>比如有数据 1，1，1，2，2，3
>缓存中有（1(3次)，2(2次)）
>当3加入的时候，得把后面的2淘汰，变成（1(3次)，3(1次)）



**引申：**

假如我的key没有设置expire，即没有设置过期时间。那么 volatile-lru、volatile-random、volatile-ttl  就无法执行了，和 noeviction 就一样了。

