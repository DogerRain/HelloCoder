在操作数据库的工具中，Navicat无疑是最强大的一个，但是它是收费的。而且支持的数据库产品较少。

此前也介绍过 Workbench 这一个工具，也是开源免费的。但是Workbench 并不是那么好用。

这篇文章来介绍一下另外一个数据库管理神器——DBeaver 。



**这是我见过支持连接最多数据库的软件，没有之一。**

而且对于它社区免费版本来说，功能也足够多，可以说是非常良心了。

![](http://rainyudianxx.baimuxym.cn/HelloCoder/images/image-20220822164259214.png)

## 1、简介

DBeaver 是一个基于 Java 开发，免费开源的通用数据库管理和开发工具（收费版功能更多）

DBeaver分为社区版和企业版，社区版是完全免费的，支持 **Windows/Mac OS X/Linux** 操作系统

它支持任何具有一个JDBC驱动程序数据库。比如MySQL、PostgreSQL、MariaDB、SQLite、Oracle、Db2、SQL Server、Derby 等等 80+数据库。

官网地址：[https://dbeaver.io](https://dbeaver.io)

github-wiki介绍：[https://github.com/dbeaver/dbeaver/wiki](https://github.com/dbeaver/dbeaver/wiki)

## 2、下载与安装

直接在官网或者github下载即可，注意区分不同的操作系统，分为安装版和解压版，因为基于Java开发，所以运行也要Java运行环境，安装的时候可以根据提示是否安装JRE。

另外，官方网站还提供了 DBeaver 的 Eclipse 插件，可以在 Eclipse 中进行集成。

我这里以windows为例，点击直接安装即可。

DBeaver 需要Java环境，建议也一并安装了，22版本的DBeaver 需要JDK 11 版本。

![](http://rainyudianxx.baimuxym.cn/HelloCoder/images/image-20220822163823817.png)



https://mp.weixin.qq.com/s/dQuM6N2TG_nSjDD3c3zUqg

## 3、功能介绍

![](https://dbeaver.io/wp-content/uploads/2018/03/mock_data-450x220.png)

### 3.1、连接、配置、分组

点击 “`数据库`” -> “`新建连接`” ，新建一个数据库连接，设置数据库的连接信息：主机、端口、数据库、用户、密码。

点击最下面的“`测试链接(T)`”可以测试连接配置的正确性。初次创建某种数据库的连接时，会提示下载相应的 JDBC 驱动。

### 3.1、数据库支持数量多

![](https://rainyudianxx.baimuxym.cn/HelloCoder/blog/image-20220822164438921.png)



但是在首次连接某个DB的时候，需要安装驱动，特别是一些非主流DB，很容易就出错，对新手来说不友好。

![](https://rainyudianxx.baimuxym.cn/HelloCoder/blog/image-20220822193620698.png)

不过只要你按照它的错误提示，很容易就能解决了。

## 4、总结

目前为止，醋酸菌已经介绍过4款数据库连接工具了，分别是：

- DataGrip
- Workbench
- DBeaver

首先来说，个人认为 Navicat  是最好用的，但是它收费，而且功能最强大。

Workbench 是MySQL官方免费开源的工具，对MySQL的支持最好，但是界面不好，而且不太好用。

DBeaver 支持的数据库类型最多，也支持插件化。

DataGrip 功能最强大，而且插件多。



|            | Navicat | DataGrip | DBeaver    | Workbench   |
| ---------- | ------- | -------- | ---------- | ----------- |
| 费用       | 收费    | 收费     | 社区版免费 | 免费        |
| 数据库支持 | 主流10+ | 24+      | 80+        | 对MySQL友好 |
| 功能       | 强大    | 强大     | 一般       | 一般        |
| 界面       | 简洁    | 好       | 较好       | 一般        |
|            |         |          |            |             |



