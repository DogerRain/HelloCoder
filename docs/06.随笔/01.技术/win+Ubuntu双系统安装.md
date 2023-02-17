---
title: win+Ubuntu双系统安装
date: 2022-10-15 18:42:26
lock: false
permalink: /pages/win+Ubuntu%E5%8F%8C%E7%B3%BB%E7%BB%9F%E5%AE%89%E8%A3%85
categories:
  - 随笔
  - 技术
tags:
  - winUbuntu
  - 双系统安装
---




需要创建四个分区：

1）给/（主分区）50G，用于存放系统，/var /usr /lib等都在这

        主分区+空间起始位置+Ext4日志文件系统+挂载点/；

2）给/boot(引导分区) 500M（不过我是UEFI启动，据说不用这个，我不确定，所以分以下吧）

        主分区+空间起始位置+Ext4日志文件系统+挂载点/boot

3）给 swap（交换空间） 12G，因为我内存12G。

        逻辑分区+空间起始位置+交换空间；

4）剩下都给/home

       逻辑分区+空间起始位置+Ext4日志文件系统+挂载点/home
