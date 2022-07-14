---
title: （5）部署JavaWeb项目到服务器
date: 2022-07-14 16:13:16
permalink: /pages/%EF%BC%885%EF%BC%89%E9%83%A8%E7%BD%B2JavaWeb%E9%A1%B9%E7%9B%AE%E5%88%B0%E6%9C%8D%E5%8A%A1%E5%99%A8
categories: 
  - 专栏
  - 《从0到1搭建服务器》
tags: 
  - JavaWeb
  - 部署
lock: need
---
上两篇文章我教大家部署了静态网站，那么这篇文章来教大家部署一个JavaWeb项目。



## 1、 配置环境

这里不赘述了。

我这里安装JDK+Nginx环境

安装环境的不赘述，详见其他第二篇文章。

## 2、再解析一个新的二级域名

（买了一个主域名，理论上支持无限个二级、三级域名，所以你买了一个域名，比如说我买了baimuxym.cn，xxx.baimuxym.cn 我也可以随便用 ）



因为我的二级域名 `www` 已经部署了**静态网站**，所以我需要重新申请一个域名。

进入腾讯云的后台 ，我这里添加了一个 rain，`rain.baimuxym.cn` 就是我的二级域名了，如图所示：

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201011231636181.png)

配置一下**记录值**，指向我的服务器。



## 3、准备一个war包

我们平时在IDEA开发项目的时候，可以直接配置Tomcat，配置Deployment的包，点击debug或者run，然后访问

`localhost:8080` 或者 `127.0.0.1:8080` 即可。

但是把项目发布到服务器可没有这么简单。

下面来演示一下两种发布的模块；

### 3.1、 第一种  传统的项目

利用maven打包或者IDEA自带的build Artifacts 功能，打成一个jar或者war 包。

这里也可以分为两种情况：

- 把项目放到Tomcat的`webapps`目录即可，然后开启Tomcat（tomcat会自动解压这个jar、war），直接通过**IP+Port**访问你的项目即可。

- 通过修改Tomcat的`server.xml` 文件，指定你的项目路径和端口



### 3.2、 第二种 springboot项目

springboot项目自带Tomcat，我们可以直接直接运行，不需要配置Tomcat，这种部署比较简单，下面来演示一下。

我这里准备一个新的springboot项目，只有一个方法：

```java
@RequestMapping("/sayHello")
    public String sayHello(){
        return "Hello,Coder!";
    }
```

执行maven打包目录：

```bash
mvn clean package
```

target目录会生成一个jar，比如我这里是 `HelloCoder-second-0.0.1-SNAPSHOT.jar`，把这个jar上传到服务器任意一个目录，

执行： `java -jar HelloCoder-second-0.0.1-SNAPSHOT.jar`

```bash
[root@VM-8-8-centos ~]# java -jar HelloCoder-second-0.0.1-SNAPSHOT.jar
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v2.4.5)

2021-05-17 14:24:27.458  INFO 12080 --- [           main] com.yudianxx.second.SecondApplication    : Starting SecondApplication using Java 1.8.0_131 on 
```

> 注意项目的端口，我这里是 8888，所以要记得开放防火墙

浏览器访问：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210517143140938.png)

这就是一个JavaWeb的运行过程。

