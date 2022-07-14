---
title: Redis主从、哨兵、集群的区别
date: 2022-06-02 11:18:19
lock: false
permalink: /pages/Redis%E4%B8%BB%E4%BB%8E%E3%80%81%E5%93%A8%E5%85%B5%E3%80%81%E9%9B%86%E7%BE%A4%E7%9A%84%E5%8C%BA%E5%88%AB
categories: 
  - LearnJavaToFindAJob
  - 【中级】12k-26k档
  - 中间件
  - Redis
tags: 
  - Redis
  - 主从
  - 哨兵
  - 集群的区别
---
## Redis 主从复制、哨兵和集群三者区别

**主从复制是为了数据备份**；**哨兵是为了高可用**，Redis主服务器挂了哨兵可以切换；**集群则是因为单实例能力有限，搞多个分散压力**，简短总结如下：

**主从模式：**备份数据、负载均衡，一个Master可以有多个Slaves。

![](https://upload-images.jianshu.io/upload_images/6555006-d7be3c1271b96a7e.png?imageMogr2/auto-orient/strip|imageView2/2/w/701/format/webp)

**哨兵模式：**sentinel发现master挂了后，就会从slave中重新选举一个master。当主节点出现故障时，由Redis Sentinel自动完成故障发现和转移，并通知应用方，实现高可用性。

（1）集群监控：负责监控Redis master和slave进程是否正常工作
（2）消息通知：如果某个Redis实例有故障，那么哨兵负责发送消息作为报警通知给管理员
（3）故障转移：如果master node挂掉了，会自动转移到slave node上
（4）配置中心：如果故障转移发生了，通知client客户端新的master地址

**集群模式：**cluster是为了解决单机Redis容量有限的问题，将数据按一定的规则分配到多台机器。



简单总结：

**sentinel着眼于高可用，Cluster提高并发量。**

**1. 主从模式**：读写分离（高性能），备份，一个Master可以有多个Slaves。

**2. 哨兵sentinel**：监控，自动转移，哨兵发现主服务器挂了后，就会从slave中重新选举一个主服务器。（高可用）

**3. 集群**：为了解决单机Redis容量有限的问题，将数据按一定的规则分配到多台机器，即每台redis存储不同的内容；内存/QPS不受限于单机，可受益于分布式集群高扩展性。



