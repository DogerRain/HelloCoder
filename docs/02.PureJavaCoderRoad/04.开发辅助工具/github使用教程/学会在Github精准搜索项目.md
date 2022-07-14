---
title: 学会在Github精准搜索项目
date: 2022-05-26 17:04:06
permalink: /pages/%E5%AD%A6%E4%BC%9A%E5%9C%A8Github%E7%B2%BE%E5%87%86%E6%90%9C%E7%B4%A2%E9%A1%B9%E7%9B%AE
lock: false
categories: 
  - PureJavaCoderRoad
  - 开发辅助工具
  - github使用教程
tags: 
  - Github
  - 学会在
---
相信很多小伙伴都会“使用”Github，Github作为汇集全球最多程序员的网站，上面有许多开源的项目。

平时需要找项目、找文档，特别是在找实战项目都时候，要怎么高效地使用Github呢？

本篇文章就来介绍一下如何精准的搜索项目。

## 1、Github的项目由什么组成？

要搜索项目，就要先了解一下一个项目有什么组成。

- Name：即仓库的名称

- About：项目简单说明，项目的归类，项目的官网

- Readme：这是项目的详细说明，一般包括项目的使用说明、开源协议

- Contributors ：作者

- 源码：项目的代码

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210311141251744.png)

除此之外，还有`star`数、`fork`数、开源协议、release发布版本，以及以下一些操作供用户使用：

```
watch：会持续收到项目的动态
fork：复制某个项目到自己的仓库
star：可以理解为点赞
clone：将项目下载到本地
follow：关注你感兴趣的作者，会收到他们的动态
```



##  2、如何搜索？

搜索嘛，很简单，左上角键入你需要搜索的关键字就行，就像用百度一样。

假如要搜索 **vue** ，在 Github 的左上角键入关键字  **vue**，回车即可出现很多与vue有关的项目，但是项目非常多，这样的筛选是十分耗费精力的。

![搜索 vue](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210311101815088.png)

但是Github 的搜索引擎就像百度一样，百度的搜索有很多技巧，比如说 `site:rain.baimuxym.cn Java`，表示只在 网站 rain.baimuxym.cn 搜索 **Java** 内容。

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210311103140903.png)



废话少说，下面奉上Github 的搜索小技巧。

## 3、使用Github 精准搜索

### 1、in:name  条件

根据名字查找，只会显示**仓库名称**包含该name的项目

```
in:name springbootLogback
```

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210311111008688.png)

### 2、in:readme 条件

根据**readme**文件包含的关键字进行过滤

```
in:readme springbootLogback
```

### 3、in:description 条件

根据项目描述过滤，也就是 **About** 的内容

```
in:description "A magical vue admin"
```

### 4、language:条件

根据**语言**过滤

```
in:description springboot language:Java
```

比如说搜索**毕设**

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210311143651096.png)

### 5、pushed: 条件

根据**推送时间**过滤

```
in:description springboot language:Java puished:>2020-04-03
```

### 6、stars: 条件

根据**点赞数**来过滤

```
in:description "A magical vue admin" stars:>1000
```

### 7、awesome 关键字

awesome 开头的系列，一般是用来收集学习、工具、书籍类相关的项目

如：

```
awesome python
awesome go
awesome linux
```

![python资源](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210311141028741-1.png)



## 4、源码查看插件推荐

除此之外，搜索结果显示项目后，我们需要点击查看项目的时候，项目有很多文件，而且Github 加载比较慢，当我们需要查看源码的时候，是件很麻烦的事情。

这里推荐一个Chrome插件：**Octotree**

> 下载地址：https://github.com/buunguyen/octotree

安装完之后，访问Github 会在左边出现一个树形：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210311143225194.png)

点击你需要的文件，Github 就会在右边预览，很便捷。