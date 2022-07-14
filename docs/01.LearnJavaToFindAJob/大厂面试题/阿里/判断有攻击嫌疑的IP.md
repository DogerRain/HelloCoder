---
title: 判断有攻击嫌疑的IP
date: 2022-06-02 11:18:20
lock: false
permalink: /pages/%E5%88%A4%E6%96%AD%E6%9C%89%E6%94%BB%E5%87%BB%E5%AB%8C%E7%96%91%E7%9A%84IP
categories: 
  - LearnJavaToFindAJob
  - 大厂面试题
  - 阿里
tags: 
  - IP
---
阿里上机笔试

异常访问统计：

运维同学最近发现应用的访问日志有异常，需要分析下应用服务器是否被攻击了。

根据经验值：若一个IP单秒访问pv >= 1000，并且，持续大于等于5s，则认为该IP有攻击嫌疑。

现在有日志文件 access.txt，每一行都表示一个访问记录，请读取文件并输出有嫌疑的IP列表。



解决方法：

滑动窗口，维护前后两个指针，一个HashMap，一个输出结果的Set，文件需要先事先分割。



或者直接用spark，切割。

