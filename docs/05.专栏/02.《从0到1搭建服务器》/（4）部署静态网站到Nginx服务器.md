---
title: （4）部署静态网站到Nginx服务器
date: 2022-07-14 16:13:16
lock: true
permalink: /pages/%EF%BC%884%EF%BC%89%E9%83%A8%E7%BD%B2%E9%9D%99%E6%80%81%E7%BD%91%E7%AB%99%E5%88%B0Nginx%E6%9C%8D%E5%8A%A1%E5%99%A8
categories:
  - 专栏
  - 《从0到1搭建服务器》
tags:
  - Nginx
  - 服务器
---
上个章节[【教你搭建服务器系列】（3）部署静态网站到Tomcat服务器](https://blog.csdn.net/yudianxiaoxiao/article/details/109662030)，搭建Tomcat服务器部署静态网站实在是太麻烦了， 那么这一章节，我来教大家把静态简历网站部署到更**轻量级的Nginx服务器**。



之前我们已经学习了搭建Linux服务器的环境，这里就不再讲述搭建Nginx的环境了。有兴趣的可以移步[【教你搭建服务器系列】（2）搭建服务器环境，安装JDK、MySQL、Redis、Tomcat、Nginx](https://blog.csdn.net/yudianxiaoxiao/article/details/109589101)

## 1、下载Nginx证书

需要先去腾讯云的后台把SSL证书下载下来，然后上传到你的服务器的某个目录（上一篇文章也就说过了，这里不啰嗦了：）

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/clipboard-1602490530864.png)

我这里上传的位置是：`/usr/local/nginx/learnjava.baimuxym.cn/`

## 2、上传你的项目

必须是一个静态网站，你可以部署你的简历、hexo 到这里。

我这里上传一个docsify 的文档到：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210511165711963.png)

## 3、配置Nginx

找到你的Nginx配置文件 `nginx.conf`

如果你忘记了，或者实在不知道是在哪里了，可以执行查找命令：

```bash
find / -name nginx.conf
```

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210130174719939.png)

这里有两个文件。

> 我这里在编译安装的时候移动过位置，如果在[【教你搭建服务器系列】（2）搭建服务器环境，安装JDK、MySQL、Redis、Tomcat、Nginx](https://blog.csdn.net/yudianxiaoxiao/article/details/109589101#t3)你是按照我的命令安装，那么就是第一个配置文件了。

打开`nginx.conf`

```bash
[root@VM-8-8-centos ~]# cd /usr/local/nginx/conf/
[root@VM-8-8-centos conf]# vi nginx.conf
```

如果你不熟悉使用vim，可以把`nginx.conf` 下载到本地，修改完成再上传上去。

如果你对Nginx不熟悉，可以参考一下：

修改`nginx.conf`  为：

```bash
  server {
       listen       80; #监听端口
       server_name  learnjava.baimuxym.cn; #请求域名
       return      301 https://$host$request_uri; #重定向至https访问。
   }
   
    server {
    listen 443 ssl; # 这里改的是
    server_name learnjava.baimuxym.cn; # 改为绑定证书的域名

    ssl on;
    ssl_certificate /usr/local/nginx/learnjava.baimuxym.cn/1_learnjava.baimuxym.cn_bundle.crt; # 改为自己申请得到的 crt 文件的名称或者 pem文件的名称
    ssl_certificate_key /usr/local/nginx/learnjava.baimuxym.cn/2_learnjava.baimuxym.cn.key; # 改为自己申请得到的 key 文件的名称
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_prefer_server_ciphers on;

    location / { # 匹配所有
    root  /var/www/web/LearnJavaToFindAJob/docs; # 你的静态网站项目路径，刚刚上传的目录
    index index.html;	 # 首页名称
    	}
    }
```

> 申请的SSL证书域名一定要和自己这里配置的 server_name、ssl_certificate、ssl_certificate_key 一致

第一个server的目的就是 访问 [http://learnjava.baimuxym.cn](http://learnjava.baimuxym.cn)  就会默认跳转到  [https://learnjava.baimuxym.cn](https://learnjava.baimuxym.cn)



## 4、启动Nginx

常见的Nginx命令：

```bash
./nginx  # 启动
./nginx -s stop #停止
./nginx -s reload #重启，Nginx启动了才能reload，否则报错
```

 

进入Nginx的sbin目录启动：

```bash
[root@VM-8-8-centos ~]# cd /usr/local/nginx/sbin/
[root@VM-8-8-centos sbin]# ./nginx
```

如果没有报错，就说明启动成功了，如果提示不支持SSL，那么你还需要安装一下OpenSSL：

```bash
yum install -y openssl openssl-devel
```

启动后，打开浏览器访问 [https://learnjava.baimuxym.cn](https://learnjava.baimuxym.cn/#/)  （下图所示）

<img src="https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210511180707445.png" style="zoom:65%;" />

---

大家可以点击  [https://learnjava.baimuxym.cn](https://learnjava.baimuxym.cn/#/)  体验一下，这是一个在线文档，我利用 docsify + Nginx 搭建的，同时配合了typora+GitHub图床+Git 同步，就能随时都可以查看自己的笔记了。

下一篇文章教大家如何搭建docsify 。



**拓展**

对Nginx不熟悉的筒子们，可以看看我的另外一篇教程：[Nginx入门与实践](https://purejava.baimuxym.cn/#/articles\Nginx\Nginx%E5%85%A5%E9%97%A8)