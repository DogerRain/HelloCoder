---
title: Redis的监控指标有哪些？
date: 2022-06-02 11:18:19
lock: false
permalink: /pages/Redis%E7%9A%84%E7%9B%91%E6%8E%A7%E6%8C%87%E6%A0%87%E6%9C%89%E5%93%AA%E4%BA%9B%EF%BC%9F
categories: 
  - LearnJavaToFindAJob
  - 【中级】12k-26k档
  - 中间件
  - Redis
tags: 
  - Redis
---
Redis的监控指标有很多，主要分为：

- 性能指标：Performance
- 内存指标: Memory
- 基本活动指标：Basic activity
- 持久性指标: Persistence
- 错误指标：Error
- 性能指标：Performance



只需要在客户端输入：

```shell
localhost:1> info 
```

或者在服务器输入：

```shell
[root@VM-8-8-centos ~]# redis-cli info
```

结果如下：

```javascript
# Server
redis_version:3.0.504
redis_git_sha1:00000000
redis_git_dirty:0
redis_build_id:a4f7a6e86f2d60b3
redis_mode:standalone
os:Windows  
arch_bits:64
multiplexing_api:WinSock_IOCP
process_id:2348
run_id:d3aee9c3d802ef1114615b1bb31185d8c05880c1
tcp_port:6379
uptime_in_seconds:1669285
uptime_in_days:19
hz:10
lru_clock:6552582
config_file:E:\Redis\redis.windows-service.conf

# Clients
connected_clients:1
client_longest_output_list:0
client_biggest_input_buf:0
blocked_clients:0

# Memory
used_memory:694072
used_memory_human:677.80K
used_memory_rss:693152
used_memory_peak:694072
used_memory_peak_human:677.80K
used_memory_lua:36864
mem_fragmentation_ratio:1.00
mem_allocator:jemalloc-3.6.0

# Persistence
loading:0
rdb_changes_since_last_save:0
rdb_bgsave_in_progress:0
rdb_last_save_time:1632273249
rdb_last_bgsave_status:ok
rdb_last_bgsave_time_sec:-1
rdb_current_bgsave_time_sec:-1
aof_enabled:0
aof_rewrite_in_progress:0
aof_rewrite_scheduled:0
aof_last_rewrite_time_sec:-1
aof_current_rewrite_time_sec:-1
aof_last_bgrewrite_status:ok
aof_last_write_status:ok

# Stats
total_connections_received:1
total_commands_processed:20
instantaneous_ops_per_sec:0
total_net_input_bytes:465
total_net_output_bytes:2049
instantaneous_input_kbps:0.01
instantaneous_output_kbps:0.00
rejected_connections:0
sync_full:0
sync_partial_ok:0
sync_partial_err:0
expired_keys:0
evicted_keys:0
keyspace_hits:0
keyspace_misses:0
pubsub_channels:0
pubsub_patterns:0
latest_fork_usec:0
migrate_cached_sockets:0

# Replication
role:master
connected_slaves:0
master_repl_offset:0
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0

# CPU
used_cpu_sys:18.41
used_cpu_user:33.23
used_cpu_sys_children:0.00
used_cpu_user_children:0.00

# Cluster
cluster_enabled:0

# Keyspace
db0:keys=5,expires=0,avg_ttl=0
```



如一些内存信息：

```javascript
[root@CombCloud-2020110836 src]# ./redis-cli info | grep used | grep human
used_memory_human:2.99M  # 内存分配器从操作系统分配的内存总量
used_memory_rss_human:8.04M  #操作系统看到的内存占用，top命令看到的内存
used_memory_peak_human:7.77M # redis内存消耗的峰值
used_memory_lua_human:37.00K   # lua脚本引擎占用的内存大小
```

一些活动指标：

```javascript
[root@CombCloud-2020110836 src]# ./redis-cli info | grep connected_clients
connected_clients:1
[root@CombCloud-2020110836 src]# ./redis-cli info | grep connected
connected_clients:1   # 客户端连接数量
connected_slaves:1   # slave连接数量
```

