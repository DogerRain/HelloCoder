---
title: Linux三剑客之grep命令
date: 2022-05-26 17:04:01
permalink: /pages/Linux%E4%B8%89%E5%89%91%E5%AE%A2%E4%B9%8Bgrep%E5%91%BD%E4%BB%A4
lock: false
categories: 
  - PureJavaCoderRoad
  - Linux
tags: 
  - Linux
  - grep
  - 三剑客之
  - 命令
---
grep是Linux三大文本（awk，sed，grep）处理工具之一，有着强大的过滤功能。

grep命令常配合awk命令一起使用。

语法：

```bash
grep [参数] [文件或目录...]
```

grep命令常用参数：

- **-A  n**：显示匹配到的字符串所在的行及其**后n行**，after
- **-B  n**：显示匹配到的字符串所在的行及其**前n行**，before
- **-C  n**：显示匹配到的字符串所在的行及其**前后**各n行，context
- **-c 或 --count** : 计算符合样式的列数。
- **-d <动作> 或 --directories=<动作>** : 当指定要查找的是目录而非文件时，必须使用这项参数，否则grep指令将回报信息并停止动作。
- **-E 或 --extended-regexp** : 将样式为延伸的正则表达式来使用。
- **-i** : 忽略字符大小写的差别。
- **-l** ：列出包含指定模式的文件的文件名
- **-n** : 在显示符合样式的那一行之前，标示出该行的列数编号。
- **-o** : 只显示模式匹配到的字符串内容。
- **-v 或 --invert-match** : 显示不包含匹配文本的所有行，反过来（invert），只打印没有匹配的，而匹配的反而不打印。
- **-w** : 只显示全字符合的，被匹配的文本只能是单词，而不能是单词中的某一部分，如文本中有liker，而我搜寻的只是like，就可以使用-w选项来避免匹配liker
- **-x** : 只显示全列符合的列。

除此之外还有两个符号：

- **^ 符号**：输出所有以某指定模式开头的行
- **$ 符号** ：输出所有以指定模式结尾的行



如果不加任何参数，默认显示含有该字符串的行。



下面详细演示一下：

## 1、不加参数 在文件中查找模式（单词）

常用的用法：

```bash
[root@VM-8-8-centos ~]# grep 'echo' /root/test_tomcat_restart.sh
echo "有进程：$ps_pid"
echo "-------开始杀进程--------"
echo "正在杀进程： $id"
echo "-------杀进程完成--------"
echo "-------重启项目......--------"
```

还可以进一步输出，在输出的基础上再查找：

```bash
[root@VM-8-8-centos ~]# grep 'echo' /root/test_tomcat_restart.sh | grep 'id'
echo "有进程：$ps_pid"
echo "正在杀进程： $id"
```

> 竖线`|` 左右被理解为简单命令，即前一个（左边）简单命令的标准输出指向后一个（右边）标准命令的标准输入

同样地，我们可以在输出结果中查询：

```bash
[root@VM-8-8-centos ~]# ifconfig | grep 'inet'
        inet 172.17.0.1  netmask 255.255.0.0  broadcast 0.0.0.0
        inet6 fe80::42:60ff:fe60:e84e  prefixlen 64  scopeid 0x20<link>
        inet 10.0.8.8  netmask 255.255.252.0  broadcast 10.0.11.255
        inet6 fe80::5054:ff:fe17:41dd  prefixlen 64  scopeid 0x20<link>
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
```

## 3、使用 -E 正则查找

查找包含 `echo` 或者 `pid` 字符串的行

```bash
[root@VM-8-8-centos ~]#  grep -E 'echo|pid' /root/test_tomcat_restart.sh
ps_pid=`ps -ef | grep "$NAME" | grep -v grep | awk '{print $2}'`
#kill -9 ${ps_pid}
echo "有进程：$ps_pid"
echo "-------开始杀进程--------"
for id in $ps_pid
echo "正在杀进程： $id"
echo "-------杀进程完成--------"
echo "-------重启项目......--------"
```

以上等同于`egrep`命令 

```bash
egrep 'echo|pid' /root/test_tomcat_restart.sh
```


## 4、使用-v 参数输出不包含指定模式的行

参数可以一起使用，查找不包含 `echo` 或者不包含 `id` 的行，并且显示行号

```bash
[root@VM-8-8-centos ~]#  grep -vEn 'echo|id' /root/test_tomcat_restart.sh
1:
2:
3:#!/bin/bash
4:NAME="/var/www/web/apache-tomcat-8.0.53/"    #想要杀死的进程
8:
11:do
14:done
17:cd /var/www/web/apache-tomcat-8.0.53/bin
18:./startup.sh
19:
```


## 5、使用 -n 显示查找结果

```bash
[root@VM-8-8-centos ~]#  grep -n 'echo' /root/test_tomcat_restart.sh
7:echo "有进程：$ps_pid"
9:echo "-------开始杀进程--------"
13:echo "正在杀进程： $id"
15:echo "-------杀进程完成--------"
16:echo "-------重启项目......--------"
```



## 6、使用 ^ 符号输出所有以某指定模式开头的行

显示以`echo "-` 开头的行：

```bash
[root@VM-8-8-centos ~]# grep '^echo "-' /root/test_tomcat_restart.sh
echo "-------开始杀进程--------"
echo "-------杀进程完成--------"
echo "-------重启项目......--------"
```



## 7、使用 $ 符号输出所有以指定模式结尾的行

```bash
[root@VM-8-8-centos ~]# grep 'pid$' /root/test_tomcat_restart.sh
for id in $ps_pid
```

 可以利用`^$`查询一下空行：

```bash
[root@VM-8-8-centos ~]# grep -n ^$ /root/test_tomcat_restart.sh
1:
2:
19:
```

## 8、使用 `.*` 可以匹配中间未知的内容

```bash
[root@VM-8-8-centos ~]# grep -E 'echo.*pid' /root/test_tomcat_restart.sh
echo "有进程：$ps_pid"
```



## 9、使用 -l 参数列出指定文件的文件名

在多个文件中，出现该字符串的文件列表。

```bash
[root@VM-8-8-centos ~]# grep -l 'echo' /root/test_tomcat_restart.sh /root/tomcat_restart.sh
/root/test_tomcat_restart.sh
/root/tomcat_restart.sh
```

## 10、使用 -r 参数递归查询

在 `/var/www/web/HaCBlog` 目录下及其子目录的所有文件中，查询匹配的字符串 `异步线程发生异常`：

```bash
[root@VM-8-8-centos ~]# grep -r '异步线程发生异常' /var/www/web/HaCBlog
/var/www/web/HaCBlog/info.log:2021-03-21 21:24:46 [com.hac.blog.framework.config.AsyncConfig$SpringAsyncExceptionHandler:47] ERROR - 异步线程发生异常！Method [sendToAdmin]，Error Message [Mail server connection failed; nested exception is com.sun.mail.util.MailConnectException: Couldn't connect to host, port: xxx, 465; timeout 50000;
/var/www/web/HaCBlog/info.log:2021-03-21 21:24:46 [com.hac.blog.framework.config.AsyncConfig$SpringAsyncExceptionHandler:47] ERROR - 异步线程发生异常！Method [asyncSaveSystemLog]，Error Message [null]
```

## 11、-c 参数查询行数

查询服务器有多少个核心：

```bash
[root@VM-8-8-centos ~]# grep -c "model name" /proc/cpuinfo
1
```

## 12、-C  n 参数列出前后n行

```bash
[root@VM-8-8-centos ~]# grep -C 2 -n "model name" /proc/cpuinfo
3-cpu family    : 23
4-model         : 49
5:model name    : AMD EPYC 7K62 48-Core Processor
6-stepping      : 0
7-microcode     : 0x1000065
```

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210322161236954.png)



## 13、-w 参数完全匹配

```bash
[root@VM-8-8-centos ~]# grep -w "model name" /proc/cpuinfo
model name      : AMD EPYC 7K62 48-Core Processor
[root@VM-8-8-centos ~]# grep -w "model nam" /proc/cpuinfo
[root@VM-8-8-centos ~]#
```

