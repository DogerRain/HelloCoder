---
title: SpringCloud面试题
date: 2022-06-02 11:18:20
lock: false
permalink: /pages/SpringCloud%E9%9D%A2%E8%AF%95%E9%A2%98
categories: 
  - LearnJavaToFindAJob
  - 【初级】6~12k档
  - Java框架
  - SpringCloud
tags: 
  - SpringCloud
  - 面试题
---
### 1、什么是 SpringCloud？为什么需要Spring Cloud？

spring cloud 是一系列框架的有序集合。它利用 spring boot 的开发便利性巧妙地简化了分布式系统基础设施的开发，如服务发现注册、配置中心、消息总线、负载均衡、断路器、数据监控等，都可以用 spring boot 的开发风格做到一键启动和部署。

Spring Cloud并没有重复制造轮子，它只是将各家公司开发的比较成熟、经得起实际考验的服务框架组合起来，通过Spring Boot风格进行再封装屏蔽掉了复杂的配置和实现原理，最终给开发者留出了一套简单易懂、易部署和易维护的分布式系统开发工具包。

**为什么需要Spring Cloud？**

业务初期比较简单，没有考虑很多应用场景，一般都是单体结构，但是随着业务发展，越来越多的模块相互依赖，项目越来越复杂，就会带来**代码结构混乱**、**开发效率低效**、**排查解决问题成本高**等问题。

微服务架构逐渐取代了单体架构，且这种趋势将会越来越流行。Spring Cloud是目前最常用的微服务开发框架。

而且SpringCloud包含了很多开箱即用的轮子，见下。



### 2、SpringCloud的核心组件包括什么？

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210220103846234.png)

**Spring Cloud Config**
集中配置管理工具，分布式系统中统一的外部配置管理，默认使用Git来存储配置，可以支持客户端配置的刷新及加密、解密操作。

**Spring Cloud Netflix**
Netflix OSS 开源组件集成，包括Eureka、Hystrix、Ribbon、Feign、Zuul等核心组件。
Eureka：服务治理组件，包括服务端的注册中心和客户端的服务发现机制；
Ribbon：负载均衡的服务调用组件，具有多种负载均衡调用策略；
Hystrix：服务容错组件，实现了断路器模式，为依赖服务的出错和延迟提供了容错能力；
Feign：基于Ribbon和Hystrix的声明式服务调用组件；
Zuul：API网关组件，对请求提供路由及过滤功能。

**Spring Cloud Bus**
用于传播集群状态变化的消息总线，使用轻量级消息代理链接分布式系统中的节点，可以用来动态刷新集群中的服务配置。

**Spring Cloud Consul**
基于Hashicorp Consul的服务治理组件。

**Spring Cloud Security**
安全工具包，对Zuul代理中的负载均衡OAuth2客户端及登录认证进行支持。

**Spring Cloud Sleuth**
Spring Cloud应用程序的分布式请求链路跟踪，支持使用Zipkin、HTrace和基于日志（例如ELK）的跟踪。

**Spring Cloud Stream**
轻量级事件驱动微服务框架，可以使用简单的声明式模型来发送及接收消息，主要实现为Apache Kafka及RabbitMQ。

**Spring Cloud Task**
用于快速构建短暂、有限数据处理任务的微服务框架，用于向应用中添加功能性和非功能性的特性。

**Spring Cloud Zookeeper**
基于Apache Zookeeper的服务治理组件。

**Spring Cloud Gateway**
API网关组件，对请求提供路由及过滤功能。Zuul也是应该网关，gateway和Zuul各有优势。

**Spring Cloud OpenFeign**
基于Ribbon和Hystrix的声明式服务调用组件，可以动态创建基于Spring MVC注解的接口实现用于服务调用 ，和Feign类似，后来逐渐取代了Feign。



### 3、SpringCloud 和 Dubbo 有哪些区别?

**首先，他们都是分布式管理框架。**

#### 1、传输差异

dubbo 是二进制传输，占用带宽会少一点。

SpringCloud是http 传输，带宽会多一点，同时使用http协议一般会使用JSON报文，消耗会更大。

#### 2、开发难度

dubbo 开发难度较大，所依赖的 jar 包有很多问题大型工程无法解决。SpringCloud 对第三方的继承可以一键式生成，天然集成。

#### 3、服务调用方式

最大的区别：

**Spring Cloud抛弃了Dubbo 的RPC通信，采用的是基于HTTP的REST方式。**

#### 4、注册中心

dubbo 是zookeeper ；springcloud是eureka，也可以是zookeeper



### 4、微服务之间如何独立通讯的?

同步：dubbo通过 RPC 远程过程调用；springcloud通过 REST 接口json调用 。

异步：消息队列，如：RabbitMq、ActiveM、Kafka 等。

**简单介绍一下RPC 和 REST：**

**RPC** ：全称 `Remote Procedure Invocation` ，也就是我们常说的服务的注册与发现，直接通过远程过程调用来访问别的service，就像调用本地函数一样方便。没有中间件代理，系统更简单。（底层使用Socket通信）

> 如何注册和发现？
>
> 服务发布时，注册中心(eureka、zookeeper)会找到指定的服务名。
>
> 注册中心加`@EnableEurekaServer`，服务用`@EnableDiscoveryClient`，然后用ribbon或feign进行服务直接的调用发现。

**Rest**：严格意义上说接口很规范，操作对象即为资源，对资源的四种操作（post、get、put、delete），并且参数都放在URL上,但是不严格的说Http+json、Http+xml，常见的http api都可以称为Rest接口。（http基于tcp，socket封装了os的tcp操作，http底层通过socket实现tcp传输）

> 注意：Socket和Http是都是基于TCP的

### 5、SpringBoot和SpringCloud的区别？

SpringBoot专注于快速方便的开发单个个体微服务。

SpringCloud是关注全局的微服务协调整理治理框架，它将SpringBoot开发的一个个单体微服务整合并管理起来，为各个微服务之间提供，配置管理、服务发现、断路器、路由、微代理、事件总线、全局锁、决策竞选、分布式会话等等集成服务。所以可以看到SpringCloud有很多的组件。

SpringBoot可以离开SpringCloud独立使用开发项目， 但是SpringCloud离不开SpringBoot ，属于依赖的关系

SpringBoot专注于快速、方便的开发单个微服务个体，SpringCloud关注全局的服务治理框架。



### 6、什么是 Hystrix 断路器？

Hystrix是一个专门的服务保护框架，可以理解为保险丝。

#### 服务熔断（目的是为了保护服务）

Hystrix 是一个延迟和容错库，旨在隔离远程系统、服务和第三方库的访问点，当出现故障是不可避免的故障时，Hystrix会自动开启服务保护功能，然后通过服务降级的方式返回一个友好的提示给客户端。

#### 服务降级（目的是为了提高用户体验）

在高并发情况下，防止用户一直处于等待状态，返回一个友好的提示给客户端，不去处理请求，调用fallbackMethod。比如返回一个“服务器繁忙，请稍后重试”。



### 7、什么是SpringCloudConfig?

在分布式系统中，由于服务数量巨多，为了方便服务配置文件统一管理，实时更新，所以需要**分布式配置中心组件**。

在Spring Cloud中，有分布式配置中心组件spring cloud config ，它支持配置服务放在配置服务的内存中（即本地），也支持放在远程Git仓库中。在spring cloud config 组件中，分两个角色，一是config server，二是config client。

> @EnableConfigServer 开启配置中心

### 8、什么是Spring Cloud Gateway?

Spring Cloud Gateway是Spring Cloud官方推出的第二代网关框架，取代Zuul网关。网关作为流量的，在微服务系统中有着非常作用，网关常见的功能有路由转发、权限校验、限流控制等作用。

使用了一个RouteLocatorBuilder的bean去创建路由，除了创建路由RouteLocatorBuilder可以让你添加各种predicates和filters，predicates断言的意思，顾名思义就是根据具体的请求的规则，由具体的route去处理，filters是各种过滤器，用来对请求做各种判断和修改。