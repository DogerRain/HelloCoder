---
title: IDEA相逢恨晚的技巧
date: 2026-06-21 23:53:05
lock: false
permalink: /pages/IDEA%E7%9B%B8%E9%80%A2%E6%81%A8%E6%99%9A%E7%9A%84%E6%8A%80%E5%B7%A7
categories:
  - 随笔
  - 所思所悟
tags:
  - IDEA
  - 相逢恨晚
  - 技巧
---
https://www.zhihu.com/question/300830746/answer/2836522148

IDEA的plugins插件就不在这里介绍了，有很多文章和答案都有分享过了。


作为一名老司机程序员，例举一些

## 1、external tool

 ![](http://rainyudianxx.baimuxym.cn/hellocoder/image-20260401182209340.png)



自定义外部工具打开方式，可以使用外部工具打开IDEA的文件，比如我这里经常需要打开 markdown文件、压缩包，就可以直接配置打开工具。



```
Program：你工具的目录

Arguments："$FilePath$"

Working directoty：$ProjectFileDir$
```





为工具添加快捷键：

![](http://rainyudianxx.baimuxym.cn/hellocoder/image-20260401182514819.png)



右击文件，选择 external tool 或者使用刚刚设置的快捷键就可以打开了：

![](http://rainyudianxx.baimuxym.cn/hellocoder/image-20260401182625888.png)