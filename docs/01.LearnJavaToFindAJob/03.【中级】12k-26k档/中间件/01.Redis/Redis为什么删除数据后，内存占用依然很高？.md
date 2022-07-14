---
title: Redis为什么删除数据后，内存占用依然很高？
date: 2022-06-02 11:18:19
lock: false
permalink: /pages/Redis%E4%B8%BA%E4%BB%80%E4%B9%88%E5%88%A0%E9%99%A4%E6%95%B0%E6%8D%AE%E5%90%8E%EF%BC%8C%E5%86%85%E5%AD%98%E5%8D%A0%E7%94%A8%E4%BE%9D%E7%84%B6%E5%BE%88%E9%AB%98%EF%BC%9F
categories: 
  - LearnJavaToFindAJob
  - 【中级】12k-26k档
  - 中间件
  - Redis
tags: 
  - Redis
---
有一次线上要做数据的预热，是一个暂时性的高并发活动，启动的时候把MySQL的部分数据加载到缓存，免得因为请求量过大而击穿数据库造成服务器压力。

期间Redis的大部分key都是不断地被修改。

活动结束后，发现Redis的内存占用挺大的，打算把Redis的key清除，确认数据无误后使用了flushdb命令，但**Redis在删除数据后，占用的内存依然降不下来**。

这让我很疑惑。

后来发现是Redis的内存碎片和内存分配策略问题。

## 1、内存碎片

这个问题类似于MySQL，如果你了解MySQL的话，MySQL在使用delete语句删除表数据的时候，表的大小是不会有很明显的变化，反而还可能会增大空间。

如果MySQL的引擎是 MyISAM ，会立刻释放磁盘空间 ，而InnoDB 不会释放磁盘空间，数据只是对你不可见。会产生空洞，标记为可复用，下次你执行insert，会覆盖这部分空间。

这也有点类似于GC 标记清除法回收对象的样子。

就连操作系统中对于内存分配也是一样的，比如应用需要申请一块连续`K`个字节的空间，虽然剩余总的内存总量大于`k`个字节，但是没有一块**连续的内存空间**是`k`个字节，这就会产生**内存碎片**，Redis也是如此：

比如刚好三个键值`k1`、`k2`、`k3`、占用`3`、`3`、`2` 共`8`个字节：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210325163603017.png)

此时`k1`键值修改后变成占用 `2 个字节`，就会产生碎片：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210325163616172.png)

>如果是键值删除，情况也是如此

但如果是修改键值，`k1`键值特别大，如果大于目前预分配的空间 `8 字节`，就会进行扩容；如果在预分配空间内但需要相邻的`k2`空间，比如说`4字节`，操作系统会把 `k2` 拷贝到别的空间，此时又会出现一个内存碎片：


![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210325164423133.png)

所以Redis造成内存碎片的主要原因是自己的内存分配策略和键值的删除、修改造成的。



## 2、内存分配策略

在编译时指定的Redis使用的内存分配器，可以是libc、jemalloc、tcmalloc，默认是jemalloc。jemalloc在64位系统中，将内存空间划分为小、大、巨大三个范围；

每个范围内又划分了许多小的内存块单位；存储数据的时候，会选择大小最合适的内存块进行存储。

jemalloc划分的内存单元如图所示：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/Home/9972795-3ac5b08c5ee00c46.png)

假如你要分配一个3字节的数据，Redis就会分配一个8字节的的空间（预分配）。如果下次这个数据增大了，在5字节以内，Redis就不会再申请额外的空间。但如果此时需要继续写入6 字节，则已分配空间不够用了，需要再次向系统申请分配内存空间。



但是如果没有写入，这5字节也将会是内存碎片。

还有就是，键、值都会随时修改或者删除（一般修改后的value与原来value的大小差异较大才会产生），这就导致Redis进行空间的扩容和释放，这样一来也会产生内存碎片。

Redis的String数据类型，（底层是SDS实现），它就是会预分配空间，当缩短SDS长度时，Redis不进行内存释放，而是记录到`free`字段中， 等待下次使用。 与此同时，也提供相应的API，可以手动释放内存。

“存在即合理”，预分配内存的好处就是避免了内存分配和释放耗时可能对性能造成影响。

> 这也是典型的空间换时间

## 3、key过期和内存淘汰机制

Redis的key是可以设置过期时间的。

当key过期，Redis也算会回收的，但并不是时间一到，就会被回收，所以内存不一定会立马减少。

> 本篇文章主要说的是人为主动删除为什么Redis内存不下降，但这里是Redis**自动释放内存**的被动过程~就不展开说了

想要了解key过期的删除策略和内存不足Redis的应对方法，可以参考：https://mp.weixin.qq.com/s/rYD7-Xfs7InLCjd-O-iQxA



## 4、内存碎片查看

### 4.1、内存碎片查看


我这里本地演示一下，这是使用flushdb几次后（flushdb也会产生很多内存碎片）：

```java
localhost:0>INFO memory
"# Memory
used_memory:3986048
used_memory_human:3.80M
used_memory_rss:14991360
used_memory_rss_human:14.30M
used_memory_peak:4330880
used_memory_lua:36864
mem_fragmentation_ratio:3.80
mem_allocator:jemalloc-3.6.0
......
"
```

参数解释：

##### 1、used_memory：

**Redis实际已经使用了的内存大小**，包括redis进程内部开销和你的cache的数据所占用的内存，单位byte。

##### 2、used_memory_human：

加了单位的`used_memory` 

##### 3、used_memory_rss： 

**操作系统实际分配的内存**

##### 4、used_memory_peak：

redis内存使用的峰值。

##### 5、used_memory_peak：

用户cache数据的峰值大小。

##### 6、used_memory_lua：

执行lua脚本所占用的内存。

##### 7、mem_fragmentation_ratio：

内存碎片率，计算公式：`used_memory_rss / used_memory`

##### 8、mem_allocator

内存分配器

这里主要看一下这个`mem_fragmentation_ratio`，一般来说：

​	（1）`>1&&<1.5`：合理的范围，说明操作系统分配的内存总是总是大于实际申请的空间，碎片不多

​    （2）`>1.5`：内存碎片率已经超过`50%`，需要采取一些措施来降低碎片率。

​	（3）`<1`：实际分配的内存小于申请的内存了，很显然内存不足了，这样会导致部分数据写入到`Swap`中

> swap对于操作系统来比较重要， 当物理内存不足时， 可以将一部分内存页进行swap操作， 以解燃眉之急。
>
> swap空间由硬盘提供， 对于需要高并发、 高吞吐的应用来说， 磁盘IO通常会成为系统瓶颈。当然内存达到了Redis的规则，会触发内存淘汰机制。
>
> 之后Redis访问Swap中的数据时，延迟会变大，性能会降低。

可以看到我这里演示的 Redis实际使用的空间是 `used_memory_human:3.80M`，操作系统实际分配的空间是`used_memory_rss_human:14.30M` ，内存碎片率达到了`mem_fragmentation_ratio:3.80`，内存碎片率十分高！

这也要提醒一下大家，Redis使用flushdb命令只能清掉数据但是清不掉内存~

## 5、内存碎片清理

**那要如何清除内存碎片呢？**

处理内存碎片是Redis调优的一种方法之一。

#### 解决方法一： 

- 重启Redis

没有什么问题是重启无法解决的，yyds！

但，在生产环境不能这么玩啊，如果Redis恰好没有持久化，这会导致数据丢失的，即使持久化了，万一数据量大，重启恢复时间长，期间不可用对业务影响也大。

- 执行 memory purge 命令

手动暴力整理内存碎片，会阻塞主进程，生产环境慎用。

#### 解决方法二：

Redis 4.0-RC3版本之后，Redis提供了一种自动清理内存碎片的参数`activedefrag` 

```bash
# 开启自动内存碎片整理(总开关)
activedefrag yes
```

只需要设置开启即可：

```bash
127.0.0.1:6379> config get activedefrag
1) "activedefrag"
2) "no"
127.0.0.1:6379> config set activedefrag yes
OK
```

Redis开启了自动清理内存碎片参数，那要达到什么条件才会清理呢？

Redis提供了一下触发机制，下面4个参数都是**满足任意一条件**后就可以进行清理：

- **active-defrag-ignore-bytes 100mb**

  默认值，碎片达到100MB时，开启清理。

- **active-defrag-threshold-lower 10**

  默认值，当碎片超过 10% 时，开启清理。

- **active-defrag-threshold-upper 100**

  默认值，内存碎片超过 100%，则尽最大努力整理。

只需要进入redis客户端或者在conf配置文件设置即可：

```bash
127.0.0.1:6379> config get active-defrag-ignore-bytes
1) "active-defrag-ignore-bytes"
2) "104857600"
127.0.0.1:6379> config get active-defrag-threshold-lower
1) "active-defrag-threshold-lower"
2) "10"
127.0.0.1:6379> config get active-defrag-threshold-upper
1) "active-defrag-threshold-upper"
2) "100"
```

Redis在清理内存，是会消耗CPU资源的，而且IO也会是一个瓶颈。

为了避免对正常请求的影响，同时又能保证性能。Redis 提供了监控 CPU 占用比例的参数，在满足以下条件时才会保证清理正常开展：

- **active-defrag-cycle-min 5**：

  默认值，占用资源最小百分比

- **active-defrag-cycle-max 75**：

  默认值，占用资源最大百分比，一旦超过则停止清理，从而避免在清理时，大量的内存拷贝阻塞 Redis，导致其它请求延迟。

还有一些其他参数：

- **active-defrag-max-scan-fields**：

  碎片整理 扫描set/hash/zset/list时，仅当 set/hash/zset/list 的长度小于此阀值时，才会将此key加入碎片整理；



稍微引申一下，可以看看4.0版本下Redis的`activeDefragCycle` 函数实现：

```c
     /*每秒进行一次判断*/
    run_with_period(1000) {
        /* 碎片大小 */
        size_t frag_bytes;
        /* 碎片率*/
        float frag_pct = getAllocatorFragmentation(&frag_bytes);
       /* 如果没有运行或碎片低于碎片大小或者低于碎片率，则不执行 */
        if (!server.active_defrag_running) {
            if(frag_pct < server.active_defrag_threshold_lower || frag_bytes < server.active_defrag_ignore_bytes)
                return;
        }
        /* 计算CPU的阀值 */
        int cpu_pct = INTERPOLATE(frag_pct,
                server.active_defrag_threshold_lower,
                server.active_defrag_threshold_upper,
                server.active_defrag_cycle_min,
                server.active_defrag_cycle_max);
        cpu_pct = LIMIT(cpu_pct,
                server.active_defrag_cycle_min,
                server.active_defrag_cycle_max);
         /* 如果没有运行，则不执行 */
        if (!server.active_defrag_running ||
            /* 根据上面计算的cpu_pct和大小与我们设置的参数进行比较判断，决定是否执行 */
            cpu_pct > server.active_defrag_running)
        {
            server.active_defrag_running = cpu_pct;
            serverLog(LL_VERBOSE,
                "Starting active defrag, frag=%.0f%%, frag_bytes=%zu, cpu=%d%%",
                frag_pct, frag_bytes, cpu_pct);
        }
    }
```



## 总结

1、Redis删除数据内存仍然占用高是因为存在**内存碎片**。

2、Redis内存碎片的由自身的 **内存分配策略** 和 **键值对的大幅度修改、删除** 造成的。

3、可以使用`INFO memory`命令查看内存的碎片率。

4、可以通过`memory purge` 主动的方式 或者开启`activedefrag` 被动的方式清理内存碎片。



参考：

-  Redis官方文档：https://redis.io/topics/memory-optimization
-  Redis的key过期删除策略内存淘汰机制：https://mp.weixin.qq.com/s/rYD7-Xfs7InLCjd-O-iQxA

