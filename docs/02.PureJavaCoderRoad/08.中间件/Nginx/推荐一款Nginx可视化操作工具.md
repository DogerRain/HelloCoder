---
title: 推荐一款Nginx可视化操作工具
date: 2022-05-26 17:04:02
permalink: /pages/%E6%8E%A8%E8%8D%90%E4%B8%80%E6%AC%BENginx%E5%8F%AF%E8%A7%86%E5%8C%96%E6%93%8D%E4%BD%9C%E5%B7%A5%E5%85%B7
lock: false
categories: 
  - PureJavaCoderRoad
  - 中间件
  - Nginx
tags: 
  - Nginx
  - 推荐一款
---
有时候发现 Nginx 在修改的时候十分麻烦，对我这种使用vim不习惯的菜鸟来说，每次都是把conf文件复制到本地，修改完成后再上传上去，十分耗费时间。



闲逛GitHub的时候竟然发现了一个好东西

[https://github.com/onlyGuo/nginx-gui](https://github.com/onlyGuo/nginx-gui)

这是个可视化Nginx管理面板，先试用一波。



## 1、nginx-gui

看了一下，GitHub上面作者很久没有维护了，作者说他正在996.....

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210512170525988.png)



这是个springbooot项目：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210512170646794.png)



## 2、部署

先把包下载下来，选择下载版本。

下载地址：[https://github.com/onlyGuo/nginx-gui/releases](https://github.com/onlyGuo/nginx-gui/releases)

我这里是部署在Linux上，所以选择的是第一个：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210512171043631.png)



上传到服务器的某个目录

**解压：**

```bash
unzip  Nginx-GUI-For-Linux_X64_v1.6 .zip
```

**修改配置文件：**

```bash
[root@VM-8-8-centos Nginx-GUI-For-Linux_X64_v1.6]# vi conf/conf.properties
```

**修改你的Nginx配置路径和配置路径：**

```properties
nginx.path = /usr/local/nginx
nginx.config = /usr/local/nginx/conf/nginx.conf
account.admin = admin

```

默认账户/密码都是 `admin`

**赋予执行权限：**

```bash
[root@VM-8-8-centos Nginx-GUI-For-Linux_X64_v1.6]# ls
bin   data     lib   shutdown.bat  startup.bat
conf  include  logs  shutdown.sh   startup.sh
[root@VM-8-8-centos Nginx-GUI-For-Linux_X64_v1.6]# chmod 777 startup.sh shutdown.sh
```

**启动：**

```bash
[root@VM-8-8-centos Nginx-GUI-For-Linux_X64_v1.6]# ./startup.sh
.
Nginx GUI Service Running ...
./startup.sh: line 18: /var/www/web/Nginx-GUI-For-Linux_X64_v1.6/lib/bin/java_vms_nginx_gui: Permission denied
Nginx GUI Service Shutdown !

```

看了一下报错 `/var/www/web/Nginx-GUI-For-Linux_X64_v1.6/lib/bin/java_vms_nginx_gui: Permission denied`

这个文件权限不够，赋权：

```bash
[root@VM-8-8-centos Nginx-GUI-For-Linux_X64_v1.6]# chmod 777 /var/www/web/Nginx-GUI-For-Linux_X64_v1.6/lib/bin/java_vms_nginx_gui
[root@VM-8-8-centos Nginx-GUI-For-Linux_X64_v1.6]# ./startup.sh
.
Nginx GUI Service Running ...
  _   _           _                    _____   _    _   _____
 | \ | |         (_)                  / ____| | |  | | |_   _|
 |  \| |   __ _   _   _ __   __  __  | |  __  | |  | |   | |
 | . ` |  / _` | | | | '_ \  \ \/ /  | | |_ | | |  | |   | |
 | |\  | | (_| | | | | | | |  >  <   | |__| | | |__| |  _| |_
 |_| \_|  \__, | |_| |_| |_| /_/\_\   \_____|  \____/  |_____|
           __/ |
          |___/

```

再启动就可以了。



## 3、访问

默认端口是 `8889` ，云服务器记得开放防火墙。

访问即可：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210512173151815.png)



首页：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210512173244062.png)

配置：

这里会读取你的配置，而且支持在线修改，热加载模式，这个功能十分好用。

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210512173409606.png)

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210512173450424.png)

还有其他一些功能，比如说监听、规则管理、负载均衡设置等等，但是看了一下有bug，不过我只需要在线修改 `nginx.conf` 就可以了。

总的来说，这个工具值得试一下。