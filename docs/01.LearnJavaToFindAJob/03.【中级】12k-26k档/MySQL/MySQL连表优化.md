---
title: MySQL连表优化
date: 2026-06-24 15:50:14
lock: false
permalink: /pages/MySQL%E8%BF%9E%E8%A1%A8%E4%BC%98%E5%8C%96
categories:
  - LearnJavaToFindAJob
  - 【中级】12k-26k档
  - MySQL
tags:
  - MySQL
  - 连表优化
---
多表关联查询（Join）是 MySQL 中最常见也最容易出性能问题的场景。优化的核心思路是：**减少扫描数据量、利用索引、改写 SQL 或拆分查询。**



在阅读本篇优化连表文章之前，建议先了解 MySQL连表查询的原理 ，当你明白了MySQL的join是如何工作后，也就明白如何优化了。



## 一、优化前置：先看执行计划

不要凭感觉优化，先看 `EXPLAIN`。



```sql
EXPLAIN SELECT * 
FROM orders o 
JOIN users u ON o.user_id = u.id 
JOIN products p ON o.product_id = p.id 
WHERE o.create_time > '2026-01-01';
```



重点关注这几个字段：

| 字段    | 要警惕的值                          | 说明                                 |
| :------ | :---------------------------------- | :----------------------------------- |
| `type`  | `ALL`（全表扫描）                   | 必须优化，尽量达到 `ref` 或 `range`  |
| `rows`  | 数值过大（> 10 万）                 | 扫描行数太多，可能未走索引或索引失效 |
| `Extra` | `Using temporary`、`Using filesort` | 说明有临时表或文件排序，需要优化     |
| `key`   | `NULL`                              | 没用到索引，要检查关联条件和查询条件 |

## 二、核心优化手段

### 1. 每张表的关联字段必须建索引

**最基础也是最有效的一步。**



```sql
-- 订单表关联用户表：user_id 必须建索引
ALTER TABLE orders ADD INDEX idx_user_id (user_id);

-- 订单表关联商品表：product_id 必须建索引
ALTER TABLE orders ADD INDEX idx_product_id (product_id);

-- 用户表关联订单表：id 是主键，已经自动有索引
```



**为什么有效？** 多表 Join 的本质是嵌套循环（Nested Loop Join）。如果内层表的关联字段没有索引，每匹配一行就要全表扫描一次，复杂度为 O(N × M)。有了索引，每次匹配变成 B+ 树查找，复杂度降为 O(N × log M)。



### 2. 过滤条件尽量下推（尽早过滤数据）

**错误的写法**：先 Join 再筛选

```sql
SELECT * 
FROM orders o 
JOIN users u ON o.user_id = u.id 
WHERE o.create_time > '2026-01-01'  -- 在 Join 之后才筛选
  AND u.status = 1;
```

**正确的写法**：先筛选再 Join

```sql
SELECT * 
FROM (SELECT * FROM orders WHERE create_time > '2026-01-01') o 
JOIN (SELECT * FROM users WHERE status = 1) u ON o.user_id = u.id;
```



> **原理**：先减少参与 Join 的数据量，Join 时的匹配次数大幅减少。



**其实使用现代 MySQL 5.7 及以上、8.0+ 版本**：两种写法在底层会被合并，**完全没有区别**。



### 3.  逻辑颠覆：小表驱动大表（控制外层循环）

优化器会自动选择“小表”作为驱动表。但这里的“小表”指的不是整张表的数据量，而是**经过 `WHERE` 条件过滤后，参与 JOIN 的结果集大小**。

#### 案例对比：

假设 `users` 表有 100 万行，`orders` 表有 1000 万行。

```SQL
SELECT * FROM users u 
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'frozen' AND u.regist_time > '2026-01-01';
```

- **分析**：虽然 `users` 表本身很大，但经过 `WHERE` 条件过滤后，满足条件的“被冻结的新用户”可能只有 500 人。
- **结果**：MySQL 会把这 500 人作为外层循环（驱动表），去循环 500 次匹配订单表。这是一种非常健康的查询。
- **优化动作**：针对驱动表的过滤条件（如 `status` 和 `regist_time`）建立复合索引，让驱动表自身的数据筛选达到极致。





### 4. 利用覆盖索引减少回表

如果查询的字段都在索引中，MySQL 可以直接从索引返回数据，无需回表。



```sql
-- 创建覆盖索引
CREATE INDEX idx_order_user_amount ON orders (user_id, amount, order_id);

-- 查询时只查索引中的字段
SELECT order_id, user_id, amount 
FROM orders 
WHERE user_id = 12345;
```



### 5. 分而治之：拆成多次查询

当 Join 过于复杂或数据量极大时，可以在应用层拆成多次查询。这种 拆分为单表查询 + 内存拼接 ，其实是空间换时间。



```sql
-- 一次复杂 Join
SELECT o.*, u.name, p.product_name
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN products p ON o.product_id = p.id
WHERE o.create_time > '2026-01-01';

-- 改为两次查询
-- 第一次：查出订单数据
SELECT * FROM orders WHERE create_time > '2026-01-01';
-- 第二次：根据订单中的 user_id 和 product_id 批量查询
SELECT * FROM users WHERE id IN (1, 2, 3, ...);
SELECT * FROM products WHERE id IN (10, 20, 30, ...);
```



 内存消耗与临时表压力（最关键的原因）：

- **执行一次复杂 JOIN 时**： MySQL 会把三张表的数据同时拉到内存中进行复杂的嵌套比对。如果 `orders` 表符合条件的数据量比较大，MySQL 需要在内存中开辟一块很大的空间（甚至可能因为超过 `tmp_table_size` 限制而被迫**在磁盘上建立临时表**）来存放中间匹配的结果集。这个过程非常消耗 CPU 和内存。
- **拆成两次批量单表查询时**： 每次查询的逻辑都极度纯粹。第一个查询只走 `orders` 的时间索引，吐出数据；第二个查询直接拿着一组 ID 去 `users` 表的 B+ 树主键索引里精准定位。**MySQL 引擎在整个过程中不需要进行多表字段的交叉比对，不需要建立任何临时的中间连接表。** 内存开销是极其轻量且可控的。



再者就是数据往往是读多写少，只要 `orders`、`users`、`products` 这三张表里**任何一张表的任意一行数据**发生了修改，整个连表查询在应用层（如 Redis）或数据库层的缓存就全部失效了，缓存命中率极低。



> **优点**：各查询独立，可利用缓存；避免大表 Join 产生的临时表。
> **缺点**：应用层要多写代码，网络往返次数增加。



## 三、总结

| 优化原则         | 说明                                                        |
| :--------------- | :---------------------------------------------------------- |
| **小表驱动大表** | 优先选择数据量小的表作为驱动表，用 `STRAIGHT_JOIN` 强制指定 |
| **避免全表扫描** | 每个表的关联字段都要有索引                                  |
| **减少返回列**   | 只 Select 必要的字段，不要 `SELECT *`                       |
| **分批查询**     | 用 `LIMIT` + 主键游标分批查询大数据量                       |
| **分解 Join**    | 在应用层分多次查询，利用本地缓存                            |
| **读写分离**     | 复杂查询走从库，减少主库压力                                |