---
title: Redis分布式事务锁的秒杀、超卖简单例子
date: 2022-05-26 17:04:04
permalink: /PureJavaCoderRoad/pages/Redis%E5%88%86%E5%B8%83%E5%BC%8F%E4%BA%8B%E5%8A%A1%E9%94%81%E7%9A%84%E7%A7%92%E6%9D%80%E3%80%81%E8%B6%85%E5%8D%96%E7%AE%80%E5%8D%95%E4%BE%8B%E5%AD%90
lock: false
categories: 
  - PureJavaCoderRoad
  - 中间件
  - Redis
tags: 
  - Redis
---
上一篇文章介绍了Redisson的分布式锁原理，这篇文章来验证一下Redisson分布式锁的作用。

https://mp.weixin.qq.com/s?__biz=MzAxNTc4ODYzOQ==&mid=2247484916&idx=1&sn=bc751ea9f5ab5aa1ea718d73c5dc3e90&chksm=9bfffac4ac8873d272f14184771bcf007ba8cff99fe8fc695ccf76e709535ce8e5d67b30d502&token=1827592027&lang=zh_CN#rd

## 1、搭建Redis主从

我这里使用Redis的主从模式。

搭建Redis主从，一主两从：

**1、修改config文件**

把redis.confg 复制多两份。

一共三份配置文件，分别是 redis6379.conf、redis6380.conf、redis6381.conf。

 **1、修改master** 

redis6379.conf 不需要修改，默认端口是 6379

这里我设置了密码：

```java
requirepass redis
```

**pid修改：**

```java
pidfile /var/run/redis_6379.pid
```

可以另外修改一下允许远程连接，把bind注释。

 

 **2、修改 slave**

 修改 redis6380.conf 

**端口：**

```java
port 6380
```

**pid修改：**

```java
pidfile /var/run/redis_6380.pid
```

**指明master ：**

```java
slaveof 127.0.0.1 6379
```

因为我的redis配置了 密码 ，需要加上

```java
masterauth redis
```

redis6381.conf  修改同上。

**2、启动**

```java
[root@VM-8-8-centos src]# ./redis-server /var/www/web/redis-5.0.8/redis6380.conf
16237:C 16 Oct 2020 09:26:22.275 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
16237:C 16 Oct 2020 09:26:22.275 # Redis version=5.0.8, bits=64, commit=00000000, modified=0, pid=16237, just started
16237:C 16 Oct 2020 09:26:22.275 # Configuration loaded
[root@VM-8-8-centos src]# ./redis-server /var/www/web/redis-5.0.8/redis6381.conf
16248:C 16 Oct 2020 09:26:27.793 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
16248:C 16 Oct 2020 09:26:27.793 # Redis version=5.0.8, bits=64, commit=00000000, modified=0, pid=16248, just started
16248:C 16 Oct 2020 09:26:27.793 # Configuration loaded
```

成功启动：

```java
[root@VM-8-8-centos src]# ps -aux|grep redis
root      6570  0.0  0.7 167336 13784 ?        Ssl  Oct14   2:15 ./redis-server *:6379
root     16238  0.0  0.3 153900  6400 ?        Ssl  09:26   0:00 ./redis-server *:6380
root     16249  0.0  0.4 153900  7700 ?        Rsl  09:26   0:00 ./redis-server *:6381
root     16264  0.0  0.0 112712   956 pts/0    R+   09:26   0:00 grep --color=auto redis
```

查看一下配置：

slave 6381：

```java
[root@VM-8-8-centos src]# ./redis-cli -p 6381 -a redis
Warning: Using a password with '-a' or '-u' option on the command line interface may not be safe.
127.0.0.1:6381> info replication
# Replication
role:slave
master_host:127.0.0.1
master_port:6379
master_link_status:down
master_last_io_seconds_ago:-1
master_sync_in_progress:0
slave_repl_offset:1
master_link_down_since_seconds:1602812509
slave_priority:100
slave_read_only:1
connected_slaves:0
master_replid:9c3ed5d61281a184e63c10483a8aeb31c3c57402
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:0
second_repl_offset:-1
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0
```

master 6379 ：

```java
[root@VM-8-8-centos src]# ./redis-cli -p 6379 -a redis
Warning: Using a password with '-a' or '-u' option on the command line interface may not be safe.
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:0
master_replid:d26097e5e79e7475e91e8d0f04b0b756047d2a75
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:0
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:0
```

连接你的redis：

```java
./redis-cli.exe -h 82.71.16.139 -p 6379 -a redis
```

使用redis-desktop-manager连接：



![redis-desk](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/redis-desk.png)

## 2、配置Nginx

配置Nginx，分流进入两个服务。

修改nginx.conf

```java
	upstream mysite {
        server 127.0.0.1:8090 weight=1;
        server 127.0.0.1:8091 weight=1;
    }
    server {
        listen       80;
        server_name  hellocoder.com ;

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
		
		location / {
		 proxy_pass http://mysite;
        }
    }
```

最后改一下hosts。

```java
127.0.0.1 www.hellocoder.com
127.0.0.1 hellocoder.com
```

启动nginx。



## 3、模拟秒杀业务

配置redisson：

引入依赖：

```xml
        <dependency>
            <groupId>org.redisson</groupId>
            <artifactId>redisson</artifactId>
            <version>3.7.3</version>
        </dependency>
```

配置Redis：

新建 `RedissonConfig.java`:

```java
@Configuration
public class RedissonConfig {
    @Bean
    public RedissonClient redissonClient() {
        Config config = new Config();
//        config.useSingleServer();//单机
//        config.useMasterSlaveServers();//集群
//        config.useSentinelServers();//哨兵
//        config.useClusterServers();//集群
//        config.setLockWatchdogTimeout(30000);
//使用的Redis主从模式
        config.useMasterSlaveServers()
                .setPassword("redis")
                .setMasterAddress("redis://82.71.16.139:6379")
                .addSlaveAddress("redis://82.71.16.139:6380","redis://82.71.16.139:6381");
        return Redisson.create(config);
    }
```

新建两个实体：

`Book.java`:

```java
/**
 * @author HaC
 * @date 2020/10/16
 * @Description
 */

@Builder
@Data
@TableName("t_book")
@AllArgsConstructor
@NoArgsConstructor
public class Book {
    @TableId(value = "book_id", type = IdType.AUTO)
    private long bookId;
    private String name;
    private int count;
}
```

`Order.java`

```java
@Builder
@Data
@TableName("t_book_order")
@AllArgsConstructor
@NoArgsConstructor
public class Order {
    @TableId(value = "id", type = IdType.AUTO)
    private int id;
    private String orderId;
    private long bookId;
    private int status;
    private long userId;
    private int count;
    private String billTime;
}
```



`OrderController.java`：

```java
@RestController
@Slf4j
@RequestMapping("Order/")
public class OrderController {

    @Autowired
    BookOrderService bookOrderService;


    @RequestMapping("/seckill")
    public RetResult seckill(@RequestParam(value = "bookId") Long bookId, @RequestParam(value = "userId", required = false) Long userId) {
        if (userId == null) {
            //模拟userId，随机生成，这里应该有前端传入
            userId = (long) (Math.random() * 1000);
        }
        String result = bookOrderService.seckill(bookId, userId);
        return RetResponse.makeOKRsp(result);
    }
}
```



这里模拟了两种情况：

一种是不加锁，第二种是加redis锁

`BookOrderService.java`

```java
@Slf4j
@Service
public class BookOrderService {

    @Autowired
    BookMapper bookMapper;

    @Autowired
    OrderMapper orderMapper;

    @Autowired
    RedissonClient redissonClient;
    
    public String seckill(Long bookId, Long userId) {
          return notLockDemo(bookId, userId);
//        return lockDemo(bookId, userId);
    }
    
    
    String lockDemo(Long bookId, Long userId) {
        final String lockKey = bookId + ":" + "seckill" + ":RedissonLock";
        RLock rLock = redissonClient.getLock(lockKey);

        try {
            // 尝试加锁，最多等待20秒，上锁以后10秒自动解锁
            Boolean flag = rLock.tryLock(20, 10, TimeUnit.SECONDS);

            if (flag) {
                //1、判断这个用户id 是否已经秒杀过
                List<Order> list = orderMapper.selectList(new QueryWrapper<Order>().lambda().eq(Order::getUserId, userId).eq(Order::getStatus, 1).eq(Order::getBookId, bookId));
                if (list.size() >= 1) {
                    log.info("你已经抢过了");
                    return "你已经抢过了，一人只能抢一次";
                }

                //2、查库存
                Book book = bookMapper.selectOne(new QueryWrapper<Book>().lambda().eq(Book::getBookId, bookId));
                if (book != null && book.getCount() > 0) {
                    //生成订单
                    String orderId = UUID.randomUUID().toString();
                    Order newOrder = Order.builder().
                            orderId(orderId).
                            status(1).
                            bookId(bookId).
                            userId(userId).
                            count(1).
                            billTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date())).build();

                    orderMapper.insert(newOrder);

                    //更新库存
                    Book newBook = Book.builder().count(book.getCount() - 1).build();
                    bookMapper.update(newBook, new QueryWrapper<Book>().lambda().eq(Book::getBookId, bookId));
                    log.info("userId：{} 秒杀成功", userId);
                    return "秒杀成功" + "";
                } else {
                    log.info("秒杀失败，被抢完了");
                }
            } else {
                log.info("请勿重复点击，userid:{} ", userId);
                return "你已经抢过了";
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (rLock.isLocked()) {
                if (rLock.isHeldByCurrentThread()) {
                    rLock.unlock();
                }
            }
        }
        return "很遗憾，没货了...";
    }


    String notLockDemo(Long bookId, Long userId) {
        //1、判断这个用户id 是否已经秒杀过
        List<Order> list = orderMapper.selectList(new QueryWrapper<Order>().lambda().eq(Order::getUserId, userId).eq(Order::getStatus, 1).eq(Order::getBookId, bookId));
        if (list.size() >= 1) {
            log.info("你已经抢过了");
            return "你已经抢过了，一人只能抢一次";
        }

        //2、查库存
        Book book = bookMapper.selectOne(new QueryWrapper<Book>().lambda().eq(Book::getBookId, bookId));
        if (book != null && book.getCount() > 0) {
            //生成订单
            String orderId = UUID.randomUUID().toString();
            Order newOrder = Order.builder().
                    orderId(orderId).
                    status(1).
                    bookId(bookId).
                    userId(userId).
                    count(1).
                    billTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date())).build();
            orderMapper.insert(newOrder);
            //更新库存
            Book newBook = Book.builder().count(book.getCount() - 1).build();
            bookMapper.update(newBook, new QueryWrapper<Book>().lambda().eq(Book::getBookId, bookId));
            log.info("userId：{} 秒杀成功", userId);
            return "秒杀成功" + "";
        } else {
            log.info("秒杀失败，被抢完了");
            return "很遗憾，没货了...";
        }
    }
}
```



新建两个表。

t_book、t_book_order

```sql
DROP TABLE IF EXISTS `t_book` ;
CREATE TABLE `t_book` (
  `book_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `name` varchar(400) DEFAULT NULL COMMENT '名称',
  `count` int DEFAULT 0 COMMENT '数量',
  PRIMARY KEY (`book_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='商品表';

DROP TABLE IF EXISTS `t_book_order` ;
CREATE TABLE `t_book_order` (
	`id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `order_id` varchar(100) NOT NULL  COMMENT '订单号',
  `book_id` bigint(20) NOT NULL  COMMENT '商品id',
  `user_id` bigint(20) DEFAULT NULL COMMENT '用户id',
	`status` int DEFAULT 1 COMMENT '状态',
  `count` int DEFAULT 0 COMMENT '购买数量',
  `bill_time`  datetime DEFAULT NULL COMMENT '下单时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='订单表';


INSERT INTO `seckill`.`t_book`(`book_id`, `name`, `count`) VALUES (1, '《HaC的自传》', 5);
```



## 4、测试

启动服务，启动两个端口的服务，模拟分布式部署。

![ ](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201020174536968.png)



**1、不加锁情况：**

使用jmeter 模拟并发。不加锁的情况模拟10个请求在1s发出 共2次，方便查看：

![ ](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201020175418983.png)

![ ](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201020174428480.png)

点击start。

查看一下日志，日志显示不止5个订单是成功的。

8090这台服务器：

![ ](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201020175113982.png)

8091这台服务器：

![ ](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201020175141910.png)

同一时间进入请求。

查询一下订单：

![ ](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201020175235437.png)

![ ](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201020175254479.png)



库存为0之后，但是初始化只有 5 本书，最后竟然出现了18个订单，显然是有问题的。

**这就是不加锁的结果。**



**2、加锁情况：**

清空表：

```sql
TRUNCATE TABLE t_book_order;
UPDATE t_book SET count = 5 WHERE book_id =1;
```



放开`BookOrderService.java`注释，重启两个服务

```java
    public String seckill(Long bookId, Long userId) {
//        return notLockDemo(bookId, userId);
        return lockDemo(bookId, userId);
    }
```

jmeter设置 1000个请求，共2次

![ ](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201020175636010.png)

再看一下日志：

8090服务器：

![ ](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201020175927806.png)

8091服务器：

![ ](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201020180003725.png)

日志刚好5个订单成功，看一下数据库：

![ ](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201020180107177.png)

![ ](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201020180120705.png) 



刚好生成 5 个订单，没有超卖的现象。

**这就是使用Redisson加锁的结果。**

---

以上就是redisson分布式锁的简单使用，这样我们就可以在代码使用redisson，控制业务的正确性了。