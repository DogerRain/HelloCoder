---
title: Ribbon的负载均衡策略有哪些？
date: 2022-06-02 11:18:20
lock: false
permalink: /pages/Ribbon%E7%9A%84%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1%E7%AD%96%E7%95%A5%E6%9C%89%E5%93%AA%E4%BA%9B%EF%BC%9F
categories: 
  - LearnJavaToFindAJob
  - 【初级】6~12k档
  - Java框架
  - SpringCloud
tags: 
  - Ribbon
---
## 1、Ribbon的负载均衡策略有哪些？

com.netflix.loadbalancer.RandomRule #配置规则 随机
com.netflix.loadbalancer.RoundRobinRule #配置规则 轮询
com.netflix.loadbalancer.RetryRule #配置规则 重试
com.netflix.loadbalancer.WeightedResponseTimeRule #配置规则 响应时间权重
com.netflix.loadbalancer.BestAvailableRule #配置规则 最空闲连接策略

Ribbon默认是 **RandomRule 随机 轮询策略**。

而Feign @FeignClient注解的时候 是默认使用了Ribbon进行客户端的负载均衡的，默认的是**RoundRobinRule 轮询的策略**

```java
//使用FeignClient 告知发布方的应用名称 默认使用ribbon进行负载均衡
@FeignClient(name="stu-provide")
public interface TestFeign {
    @RequestMapping(value = "/getAll/{id}",method = RequestMethod.GET)
    public Student getAll(@PathVariable("id") Integer id);
}
```







## 2、Ribbon的实现原理是什么？

ribbon实现的关键点是为ribbon定制的RestTemplate，ribbon利用了RestTemplate的拦截器机制，在拦截器中实现ribbon的负载均衡。负载均衡的基本实现就是利用applicationName从服务注册中心获取可用的服务地址列表，然后通过一定算法负载，决定使用哪一个服务地址来进行http调用。

Ribbon的RestTemplate

RestTemplate中有一个属性是`List<ClientHttpRequestInterceptor> interceptors`，如果interceptors里面的拦截器数据不为空，在RestTemplate进行http请求时，这个请求就会被拦截器拦截进行，拦截器实现接口ClientHttpRequestInterceptor，需要实现方法是

```text
ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution)
      throws IOException;
```

也就是说拦截器需要完成http请求，并封装一个标准的response返回。



## 3、Ribbon几种负载均衡策略的原理是什么？

### 3.1、RandomRule 

随机负载规则很简单，随机整数选择服务，最终达到随机负载均衡。

### 3.2、RoundRobinRule 

线性轮询负载均衡策略。在类中维护了一个原子性的nextServerCyclicCounter成员变量作为当前服务的索引号，每次在所有服务数量的限制下，就是将服务的索引号加1，到达服务数量限制时再从头开始。

其实就是一个求余的过程。

### 3.3、WeightedResponseTimeRule

响应时间作为选取权重的负载均衡策略。

其含义就是，响应时间越短的服务被选中的可能性大。

**假设有4个服务，每个服务的响应时间（ms）：**

A: 200

B: 500

C: 30

D: 1200

**总响应时间：**

200+500+30+1200=1930ms

**接下来第二个for循环，计算每个服务的权重。**

服务的权重=总响应时间-服务自身的响应时间：

A: 1930-200=1730

B: 1930-500=1430

C: 1930-30=1900

D: 1930-1200=730

**总权重：**

1730+1430+1900+730=5790

**响应时间及权重计算结果示意图：**

![](https://images2018.cnblogs.com/blog/166781/201803/166781-20180309161056472-1998885095.png)

结果就是响应时间越短的服务，它的权重就越大。

 

再看一下choose方法。

重点在while循环的第3个if这里。

首先如果判定没有服务或者权重还没计算出来时，会采用父类RoundRobinRule以线性轮询的方式选择服务器。

有服务，有权重计算结果后，就是以总权重值为限制，拿到一个随机数，然后看随机数落到哪个区间，就选择对应的服务。

所以选取服务的结论就是：

响应时间越短的服务，它的权重就越大，被选中的可能性就越大。



参考：https://www.cnblogs.com/kongxianghai/p/8477781.html