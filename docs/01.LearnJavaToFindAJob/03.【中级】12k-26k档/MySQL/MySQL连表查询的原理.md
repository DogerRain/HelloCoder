在 MySQL 中，多表 JOIN 的本质其实就是一个嵌套循环（Nested-Loop Join）的过程。



无论你关联了 3 张表还是 5 张表，MySQL 优化器通常都不会同时处理它们，而是“两两配对”：先让表 A 和表 B 匹配，把匹配到的结果集作为一张“临时表”，再用这张“临时表”去跟表 C 匹配，以此类推。



## 一、 核心工作原理：嵌套循环（Nested-Loop Join）

你可以把多表 JOIN 想象成写代码时的**多层 `for` 循环**。

- **驱动表（Outer Table / 外层循环）**：MySQL 选出的第一张表（或第一组结果集），负责提供最基础的数据。
- **被驱动表（Inner Table / 内层循环）**：紧跟在后面的表，用外层循环传进来的关联字段，去自己表里匹配数据。



来看一个具体例子： 

假设我们有三张表：用户表（`users`）、订单表（`orders`）、商品表（`products`）。

```SQL
SELECT u.name, o.order_no, p.prod_name
FROM users u
INNER JOIN orders o ON u.id = o.user_id
INNER JOIN products p ON o.prod_id = p.id
WHERE u.status = 'active';
```

MySQL 的执行逻辑（伪代码）就像下面这样：

```Python
# 1. 外层循环：先去驱动表 users 筛选出活跃用户
for user_row in users:
    if user_row.status == 'active': # 匹配 WHERE 条件
        
        # 2. 第二层循环：用 user_row.id 去 orders 表里找匹配的订单
        for order_row in orders:
            if order_row.user_id == user_row.id: # 匹配第一个 ON 条件
                
                # 3. 第三层循环：用 order_row.prod_id 去 products 表里找匹配的商品
                for prod_row in products:
                    if prod_row.id == order_row.prod_id: # 匹配第二个 ON 条件
                        
                        # 三层全部匹配成功，输出这一行数据
                        output_row(user_row.name, order_row.order_no, prod_row.prod_name)
```

## 二、 表与表匹配的具体方式（算法演进）

在实际运行中，如果像上面伪代码一样每条数据都去全表扫描，大表关联时数据库直接就崩溃了。为了提高效率，MySQL 针对**内层循环（被驱动表）**有不同的匹配策略：

### 1. Index Nested-Loop Join（基于索引的嵌套循环 - 性能最高）

如果被驱动表的关联字段（比如 `orders.user_id` 和 `products.id`）建了**索引**，那么内层循环就不需要去傻傻地全表扫描了。

- **工作机制**：外层循环传过来一个 `user_id = 10`，内层循环直接通过 **B+树索引** 瞬间定位到对应的订单。
- **特点**：速度极快，是生产环境中最健康的 JOIN 状态。

### 2. Block Nested-Loop Join（基于块的嵌套循环 - 没索引时的无奈之举）

如果被驱动表**没有索引**，MySQL 为了防止外层循环每传一个值就让内层全表扫描一次（IO 压力太大），会引入一个叫 **Join Buffer（连接缓冲区）** 的内存空间。

- **工作机制**：它把外层表的数据先大批量地加载到内存缓存中，然后让内层表（被驱动表）只进行**一次全表扫描**，在内存里把这两批数据一次性比对完。
- **特点**：虽然比纯全表扫描快，但非常消耗 CPU 和内存。*(注：在 MySQL 8.0 及以上版本中，该算法已被性能更优秀的 **Hash Join** 算法取代)*。

### 3. Hash Join 哈希连接（MySQL8.0 新增）

适用于：关联字段无索引、等值连接、大表 Join

流程：

1. 选小表（驱动表），内存构建哈希表：key = 关联字段，value = 整行数据；

2. 遍历大表，拿每条关联值去哈希表匹配；

3. 匹配成功拼接结果。


适用场景：无索引的大表等值 JOIN；不支持范围匹配、多条件非等值

## 三、 多表 JOIN 的关键“潜规则”

1. **你写的顺序，不等于 MySQL 执行的顺序** 在你的 SQL 语句里，你可能先写了 `FROM users` 再 `JOIN orders`。但 MySQL **优化器会通过计算成本（Cost）**，自动选择**结果集最小、效率最高**的那张表作为最外层的“驱动表”。
2. **多表 JOIN 数量不宜过多** 当你有 5 张表 JOIN 时，MySQL 优化器需要去评估 `5! = 120` 种不同的组合排列方式（谁当驱动表、谁在第二层...），算出一套成本最低的方案。表越多，优化器分析的消耗就呈指数级上升。通常建议单条 SQL 关联表**不要超过 3~5 张**。



无论是 `INNER JOIN`、`LEFT JOIN` 还是 `RIGHT JOIN`，MySQL 在底层的匹配核心仍然是前面提到的**嵌套循环（Nested-Loop Join）**。

它们之间唯一的区别在于：**当“外层循环（驱动表）”在“内层循环（被驱动表）”里找不到匹配的记录时，MySQL 该如何处理这行数据。**

###  INNER JOIN（内连接）

`INNER JOIN` 的原则是**两边都有才留下**。

### LEFT JOIN（左外连接）

`LEFT JOIN` 的原则是**左表（驱动表）是老大，不管右表有没有，左表都要完整保留**。

### RIGHT JOIN（右外连接）

`RIGHT JOIN` 和 `LEFT JOIN` 的逻辑完全一样，只不过主角变成了右表。



如果没写ON 条件，那就是笛卡尔积。