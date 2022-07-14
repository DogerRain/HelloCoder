---
title: （10）利用Docsify搭建个人笔记网站
date: 2022-07-14 16:13:16
lock: true
permalink: /pages/%EF%BC%8810%EF%BC%89%E5%88%A9%E7%94%A8Docsify%E6%90%AD%E5%BB%BA%E4%B8%AA%E4%BA%BA%E7%AC%94%E8%AE%B0%E7%BD%91%E7%AB%99
categories:
  - 专栏
  - 《从0到1搭建服务器》
tags:
  - Docsify
  - 利用
---
写文档的工具非常多，但是作为程序员，大部人还是偏爱Markdown的，有时需要写一份开发文档，以供自己或者他人查看，那如何把 Markdown 文件转换成文档呢？



**docsify** 就可以做到了，**docsify** 可以直接加载 Markdown 文件并动态渲染，同时还可以生成封面页，还可以部署在`github pages` ，效果图像以下这种：

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210116215519024.png)

> docsify官方文档：[https://docsify.js.org/#/zh-cn/](https://docsify.js.org/#/zh-cn/)



## 1、安装docsify

安装docsify需要node环境，所以必须先安装Node环境才能进行下一步。

Node下载地址：https://nodejs.org/zh-cn/download/current/

配置完node环境后，使用`npm`下载docsify组件：

```shell
npm i docsify-cli -g
```



## 2、初始化文档目录

> 演示为 windows 系统

新建一个目录 为 `LearnJavaToFindAJob`

进入目录，再新建一个文件 `docs`

>  `docs` 目录表示我所有文章的根目录

```bash
docsify init ./docs
```

看到这个目录生成了文件：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210225164718113.png)

这个`index.html` 就是首页了，可以放在自己的服务器，利用Nginx、Tomcat进行部署都行。或者你也可以使用GitHubPage进行部署。

## 3、运行

```bash
docsify serve ./docs
```

打开  http://localhost:3000 就发现可以访问文档了。



## 4、其他配置

docsify 提供了很多配置给到用户自行设置，更详细的配置都可以在官网找到：

docsify官方文档：[https://docsify.js.org/#/zh-cn/](https://docsify.js.org/#/zh-cn/)

下面列举一下我自己的配置：

### 4.1、index.html

如果你的MD文件多，首次访问是非常慢的，因为docsify的原理也是通过把md文件渲染成html，所以白屏时间可以加个提示：

```html
<div id="app">
    正在加载中.....
</div>
```

其他一些插件：

```html
<script>
    window.$docsify = {
        coverpage: true,
        name: 'LearnJavaToFindAJob',
		//点击name对应的URL
        nameLink: '#/README',
        repo: 'https://github.com/DogerRain/LearnJavaToFindAJob',
        loadNavbar: true,
        loadSidebar: true, // 加载自定义侧边栏
        maxLevel: 0, // 默认情况下会抓取文档中所有标题渲染成目录，可配置最大支持渲染的标题层级。
        subMaxLevel: 0, // 生成目录的最大层级
        mergeNavbar: true, // 小屏设备下合并导航栏到侧边栏
        alias: { // 定义路由别名，可以更自由的定义路由规则。 支持正则
            '/.*/_sidebar.md': '/_sidebar.md',//防止意外回退
            '/.*/_navbar.md': '/_navbar.md'
        },
		
        auto2top: true,
		//代码一键复制
        copyCode: {
            buttonText: '复制',
            errorText: 'Error',
            successText: '复制成功'
        },
		//分页
        pagination: {
            previousText: '上一章节',
            nextText: '下一章节',
            crossChapter: true,
            crossChapterText: true,
        },
		//全局搜索
        search: {
            paths: 'auto',
            placeholder: '搜索',
            noData: '找不到结果',
            depth: 3, //搜索的标题深度
        },
		//字数统计，需要引入js
        count:{
            countable:true,
            fontsize:'0.9em',
            color:'rgb(90,90,90)',
            language:'chinese'
        },
		 coverpage: true,
		onlyCover: true

    }
</script>
<!-- Docsify v4 核心-->
<script src="//cdn.jsdelivr.net/npm/docsify@4"></script>
<!--不同代码的高亮-->
<script src="//cdn.jsdelivr.net/npm/prismjs@1.22.0/components/prism-c.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/prismjs@1.22.0/components/prism-cpp.min.js"></script>
<script src="//unpkg.com/prismjs/components/prism-bash.js"></script>
<script src="//unpkg.com/prismjs/components/prism-java.js"></script>
<script src="//unpkg.com/prismjs/components/prism-sql.js"></script>
<script src="//unpkg.com/prismjs/components/prism-bash.js"></script>
<script src="//unpkg.com/prismjs/components/prism-c.js"></script>
<script src="//unpkg.com/prismjs@1.23.0/components.js"></script>
<!--代码复制-->
<script src="//cdn.jsdelivr.net/npm/docsify-copy-code"></script>
<!--图片缩放-->
<script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/zoom-image.min.js"></script>
<!--分页-->
<script src="//cdn.jsdelivr.net/npm/docsify-pagination/dist/docsify-pagination.min.js"></script>
<!--搜索-->
<script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/search.min.js"></script>
<!--字数统计-->
<script src="//unpkg.com/docsify-count/dist/countable.js"></script>

<!--主题-->
<!--<script src="https://cdn.jsdelivr.net/npm/docsify-themeable@0/dist/js/docsify-themeable.min.js"></script>-->
<!--卜蒜子访问统计-->
<script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
```



### 4.2、左侧栏

新建一个 `_sidebar.md` 文件，只需要写入自己的表题和路径即可：

（注意：这里一定是要对应你文章的相对路径）

```bash
- [算法](articles\算法\高频算法面试题.md)
- [八大排序算法](articles\算法\八大排序算法.md) 
    - <font style="color:orange;font-size:14px;font-weight:500">字符串(辅助Map)：</font>
    - [1-两数之和](articles\算法\1-两数之和.md) 
    - [2-两数相加](articles\算法\2两数相加.md) 
    - [387-字符串中的第一个唯一字符](articles\算法\387-字符串中的第一个唯一字符.md) 
    - [20-有效的括号](articles\算法\20-有效的括号.md) 
    -  [09-用两个栈实现一个队列](articles\算法\09-用两个栈实现一个队列.md) 
    - <font style="color:orange;font-size:14px;font-weight:500">链表：</font>
    - [19-删除链表的倒数第N个结点](articles\算法\19-删除链表的倒数第N个结点.md) 
    - [206-翻转链表](articles\算法\206-翻转链表.md) 
    -  [141环形链表](articles\算法\141环形链表.md) 
    -  [234回文链表](articles\算法\234回文链表.md) 
    - <font style="color:orange;font-size:14px;font-weight:500">树：</font>
    - [543-二叉树最大直径](articles\算法\543二叉树最大直径.md) 
    - [11-盛水最多的容器](articles\算法\11-盛水最多的容器.md) 
    - <font style="color:orange;font-size:14px;font-weight:500">动态规划：</font>
    -  [70-爬楼梯](articles\算法\70-爬楼梯.md) 
    -   [53-连续最大子序和](articles\算法\53-连续最大子序和.md) 
    -   <font style="color:orange;font-size:14px;font-weight:500">回溯：</font>
    -  [46-全排列](articles\算法\46-全排列.md) 
```

展示效果：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210513155302640.png)

### 4.3、导航栏

新建一个 `_navbar.md` 文件，写入：

```
* [技术博客](https://rain.baimuxym.cn/)

* [Github地址](https://github.com/DogerRain/LearnJavaToFindAJob)
```

展示效果：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210513155530146.png)



### 4.4、首页

新建一个 `_coverpage.md` 文件，写入：

```
<!--图片-->
<div align="center"> <img src="https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/%E5%85%AC%E4%BC%97%E5%8F%B7HelloCoder.png"/  style="zoom:50%;"> </div>

<!--一些描述-->
#  LearnJavaToFindAJob

### LearnJavaToFindAJob  是一个帮助Java程序员到找到一份工作的面试指南。

 

- Java常见的面试题
- MySQL、MQ、Nginx等中间件
- 计算机网络、操作系统
- 高频算法
- 大厂原题
- 项目经验
- 简历

<!--卜蒜子统计-->
<span id="busuanzi_container_site_pv">
👀    本站总访问量 <span id="busuanzi_value_site_pv"></span>次
</span>| 🐒本站访客数<span id="busuanzi_value_site_uv"></span>人次

[开始阅读](/README.md)

<!--封面-->
![](images/cover.jpg)

```

<img src="https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210511180707445.png" style="zoom:65%;" />

体验地址：[https://purejava.baimuxym.cn](https://purejava.baimuxym.cn)