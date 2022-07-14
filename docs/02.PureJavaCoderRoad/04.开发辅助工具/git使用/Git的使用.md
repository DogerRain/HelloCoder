---
title: Git的使用
date: 2022-05-26 17:04:05
permalink: /pages/Git%E7%9A%84%E4%BD%BF%E7%94%A8
lock: false
categories: 
  - PureJavaCoderRoad
  - 开发辅助工具
  - git使用
tags: 
  - Git
  - 使用
---
Git是一个版本管理工具，你想想看，如果一个项目有多个人开发，如何保证协作的过程中代码是正确的、是同步的呢？

这就是需要用到Git了。

## GitHub和Git的关系与区别

> 很多初学者分混淆了GitHub和Git的关系，误认为Git等同于GitHub，其实这两个根本不是一个东西。

Git是一个命令行工具，一个分布式版本控制系统，类似的工具还有SVN，它可以控制你的文件提交、回调，是一个版本管理工具。

GitHub是一个代码托管网站，背后使用Git作为版本管理工具（而非svn）。主要服务是将你的项目代码托管到云服务器上，而非存储在自己本地硬盘上。类似的网站还有gitlab.com、gitee.com(国内)

## Git教程

下面提到一些Git的教程，我个人觉得十分不错，推荐给大家，无论是对新手还是工作几年的开发人员来说，都十分友好：

- [Git教程-廖雪峰](https://www.liaoxuefeng.com/wiki/896043488029600/)

  廖大yyds，最受欢迎的git使用教程之一

- [learnGitBranching](https://github.com/pcottle/learnGitBranching)
  通过可视化动画效果来帮助开发人员理解Git命令

- [《Git 官方文档教程》](https://git-scm.com/book/zh/v2)

- [《Pro Git》](https://www.progit.cn/)



## Github教程

- [github漫游指南](https://github.com/phodal/github)

  github的使用教程，可以快速看看

-  [学会在Github精准搜索项目](github使用教程\学会在Github精准搜索项目.md) 



---

**Github和Git不是同一个东西。**新手可能会混淆，除此还有SVN、Gitlab ，我来简单说明一下。



Git、SVN 都是版本管理工具，这是两个不同的工具，好比微信和电话，都可以用来通信，但是场景不一样。

红框这个就是Git的快捷方式，下面这个则是SVN的快捷方式：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210511094124483.png)

- Git管理的对象是仓库，SVN管理的对象是文件。 所以Git时候用来管理代码，SVN适合用来管理文件（比如可以用来搭建一个仓库管理需求文档、API文档、培训文件什么的）
- 既然不是一个东西，命令也稍有区别。



而 Github、Gitee、GitLab  则是可视化的Git仓库，好比打电话，华为有华为的打电话界面（GitHub），小米有小米的打电话界面（GitLab），但是底层都是一样的通讯协议（Git）。

目前全球最大的同性交友平台——GitHub，是免费的，这里汇聚了世界各地的开发者，作为开发，大家很有必要去掌握GitHub的使用。

GitLab一般是公司内部自己使用，使用GitLab，可以很简单的就搭建一个仓库，公司内部的开发人员就可以使用它了。



**我一般会使用GitHub做什么：**

- **收集资源、教程、项目**

我一般都是在GitHub搜索一些教程，比如python、lambda8使用等等，但是GitHub的仓库如此多，要学会过滤，所以新手入门，要养成搜索的好习惯，建议看看 [学会在Github精准搜索项目](github使用教程\学会在Github精准搜索项目.md) 

- **代码仓库**

这个不用说了，我自己平时的代码都是同步到GitHub的，比如说LeetCode的刷题、一些常用的类等等。

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210511100824802.png)

- **文件、笔记同步**

GitHub不适合大文件同步（因为网络慢~），比如目前，你现在看到的这些文章，我都是放在GitHub的。

- **图床**

有时候写笔记，会涉及很多图片，那这些图片也可以存放到GitHub，比如说上面这张。可以配合很多工具，把图片上传到自己的仓库，然后获取到URL，就可以在任何地方使用了，而且免费。

- **GitHubPage**

GitHub即是一个仓库，其实它也是一个静态服务器，我们可以把自己的`.html` 文件放在仓库，利用GitHub提供的GitHubPage功能，就可以生成一个自己的博客了。

比如说你现在看到的《Java小白之路》，其中就是使用GitHubPage和GiteePage，但是详细的搭建，可以看我后续一些文章。

