---
title: Redis之缓存击穿、穿透、雪崩
date: 2022-05-26 17:04:04
permalink: /PureJavaCoderRoad/pages/Redis%E4%B9%8B%E7%BC%93%E5%AD%98%E5%87%BB%E7%A9%BF%E3%80%81%E7%A9%BF%E9%80%8F%E3%80%81%E9%9B%AA%E5%B4%A9
lock: false
categories: 
  - PureJavaCoderRoad
  - 中间件
  - Redis
tags: 
  - Redis
---
> 数据获取的流程，一般是前端请求，后台先从缓存中取数据，缓存取不到则去数据库中取，数据库取到了则返回给前端，然后更新缓存，如果数据库取不到则返回空数据给前端

流程图：

![ ](https://images-1253198264.cos.ap-guangzhou.myqcloud.com/image-20200608113313177.png)



假如缓存的数据没有，后台则会一直请求数据库，对数据库造成压力，如果是请求量大或者恶意请求则会导致数据库崩溃，我们一般称为缓存穿透、缓存击穿、缓存雪崩。

## 1、缓存穿透

描述：缓存穿透是指**缓存和数据库中都没有的数据**，而用户不断发起请求，如发起为id为“-1”的数据或id为特别大（不存在的数据）。这时的用户很可能是攻击者，攻击会导致数据库压力过大。

 ![缓存穿透](https://images-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201028233114175.png)

解决：

1. 接口层增加校验，如用户鉴权校验，id做基础校验，比如 id<=0的直接拦截；
2. 从缓存取不到的数据，在数据库中也没有取到，这时也可以将key-value对写为key-null，直接返回空值。缓存有效时间可以设置短点，如30秒（设置太长会导致正常情况也没法使用）。这样可以防止攻击用户反复用同一个id暴力攻击。
3. 利用互斥锁，缓存失效的时候，先去获得锁，得到锁了，再去请求数据库。没得到锁，则休眠一段时间重试。
4. 异步更新。直接返回一个空值，然后启动一个线程去数据库读数据，更新缓存，比如项目启动前先加载缓存。
5. **最常见**的则是采用**布隆过滤器**，将所有可能存在的数据哈希到一个足够大的bitmap中，一个一定不存在的数据会被 这个bitmap拦截掉，从而避免了对底层存储系统的查询压力。

## 2、缓存击穿

描述： 缓存击穿是指**缓存中没有但数据库中有的数据**，当一个key非常热点（类似于爆款），在不停的扛着大并发，大并发集中对这一个点进行访问；当这个key在失效的瞬间，持续的大并发就穿破缓存，直接请求数据库，就像在一个屏障上凿开了一个洞。

![缓存击穿](https://images-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201028233133015.png)

解决：

1. 设置热点数据永远不过期。

2. 加互斥锁。

   如图：

   ![ ](https://images-1253198264.cos.ap-guangzhou.myqcloud.com/20180919143214879.png)

如果缓存中有数据，则直接返回，如果没有，则第一个进入的线程先去查询数据库，并加上锁，其他线程则等待，这样就能防止去数据库查重复数据、重复更新缓存了。

## 3、缓存雪崩

缓存雪崩是指**缓存中数据大批量到过期时间**，大批量数据同一时间过期，导致请求量全部请求到数据库，造成数据库宕机。

![缓存雪崩](https://images-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201028233209257.png)

解决：

1. 给缓存失效时间，加上一个随机值，避免大量缓存集体失效。
2. 双缓存：缓存A和B，比如A的失效时间是20分钟，B不失效。比如从A中没读到，就去B中读，然后异步起一个线程同步到A。



关于互斥锁，可以看看下面这个例子：

1. **Redis**

如果是使用Redis，可以使用Redis的`SETNX`，也就是只有不存在的时候才设置，可以利用它来实现锁的效果。

```java
public String get(key) {
      String value = redis.get(key);
      if (value == null) { //代表缓存值过期
          //设置3min的超时，防止del操作失败的时候，下次缓存过期一直不能load db
		  if (redis.setnx(key_mutex, 1, 3 * 60) == 1) {  //代表设置成功
               value = db.get(key);
                      redis.set(key, value, expire_secs);
                      redis.del(key_mutex);
              } else {  //这个时候代表同时候的其他线程已经load db并回设到缓存了，这时候重试获取缓存值即可
                      sleep(50);
                      get(key);  //重试
              }
          } else {
              return value;      
          }
 }
```

2. **memcache**

```java
if (memcache.get(key) == null) {  
    // 3 min timeout to avoid mutex holder crash  
    if (memcache.add(key_mutex, 3 * 60 * 1000) == true) {  
        value = db.get(key);  
        memcache.set(key, value);  
        memcache.delete(key_mutex);  
    } else {  
        sleep(50);  
        retry();  
    }  
} 
```



## 4、缓存预热

缓存预热就是系统上线后，后者系统在重启的时候，将相关的缓存数据直接加载到Redis。这样就可以避免在用户请求的时候，先查询数据库，然后再将数据缓存的问题，用户直接查询事先被预热的缓存数据。



解决：

   1. 上线时加个接口，手动触发加载缓存，或者定时刷新缓存。
   2. 数据量不大，可以在项目启动的时候自动进行加载。

​    

---



参考：

- https://www.iteye.com/blog/carlosfu-2269687

- https://mp.weixin.qq.com/s/LOCLXG_mzBVQeFrtM8srmA

  

**求点赞👍** **求关注❤️** **求分享💬** 