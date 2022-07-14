---
title: Nginx可视化配置神器
date: 2022-06-17 21:47:01
lock: false
permalink: /pages/Nginx%E5%8F%AF%E8%A7%86%E5%8C%96%E9%85%8D%E7%BD%AE%E7%A5%9E%E5%99%A8
categories:
  - 脚手架
tags:
  - Nginx
---
此前一篇文章介绍过Nginx的详细使用： [Nginx入门与实践](http://mp.weixin.qq.com/s?__biz=MzAxNTc4ODYzOQ==&mid=2247485827&idx=1&sn=b8df5093d42c053a028584b7c01e786c&chksm=9bfff6b3ac887fa5783ecd8acadad5d09066b0b5fc7bf68801c33d3d37c13d220a5247b581a5#rd)



顺便再来列举一些常用的配置清单👇

## 侦听端口

```lua
server {
    # Standard HTTP Protocol
    listen 80;
    # Standard HTTPS Protocol
    listen 443 ssl;
    # For http2
    listen 443 ssl http2;
    # Listen on 80 using IPv6
    listen [::]:80;
    # Listen only on using IPv6
    listen [::]:80 ipv6only=on;
}
```

## 访问日志

```lua
server {
    # Relative or full path to log file
    access_log /path/to/file.log;
    # Turn 'on' or 'off'
    access_log on;
}
```

## 域名

```lua
server {
    # Listen to yourdomain.com
    server_name yourdomain.com;
    # Listen to multiple domains  server_name yourdomain.com www.yourdomain.com;
    # Listen to all domains
    server_name *.yourdomain.com;
    # Listen to all top-level domains
    server_name yourdomain.*;
    # Listen to unspecified Hostnames (Listens to IP address itself)
    server_name "";
}
```

## 静态资源

```lua
server {
    listen 80;
    server_name yourdomain.com;
    location / {
        root /path/to/website;
    }
}
```

## 重定向

```lua
server {
    listen 80;
    server_name www.yourdomain.com;
    return 301 http://yourdomain.com$request_uri;
}

server {
    listen 80;
    server_name www.yourdomain.com;
    location /redirect-url {
        return 301 http://otherdomain.com;
    }
}
```

## 反向代理

```lua
server {
    listen 80;
    server_name yourdomain.com;
    location / {
        proxy_pass http://0.0.0.0:3000;
        # where 0.0.0.0:3000 is your application server (Ex: node.js) bound on 0.0.0.0 listening on port 3000
    }
}
```

## 负载均衡

```lua
upstream node_js {
    server 0.0.0.0:3000;
    server 0.0.0.0:4000;
    server 123.131.121.122;
}

server {
    listen 80;
    server_name yourdomain.com;
    location / {
        proxy_pass http://node_js;
    }
}
```

## SSL 协议

```lua
server {
        listen 443 ssl;
        server_name yourdomain.com;
        ssl on;
        ssl_certificate /path/to/cert.pem;
        ssl_certificate_key /path/to/privatekey.pem;
        ssl_stapling on;
        ssl_stapling_verify on;
        ssl_trusted_certificate /path/to/fullchain.pem;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_session_timeout 1h;
        ssl_session_cache shared:SSL:50m;
        add_header Strict-Transport-Security max-age=15768000;
        }

        # Permanent Redirect for HTTP to HTTPS
        server {
        listen 80;
        server_name yourdomain.com;
        return 301 https://$host$request_uri;
}
```

以上就是用到的一些日常配置，很多时候我们需要打开`nginx.conf`手动修改。

新手在玩Nginx的时候，可能和我一样存在一些顾虑：

- 配置十分多，而且又没有详细的参考文档
- 如果配置错误，那么Nginx就无法启动
- Nginx隐藏的功能该怎么正确使用？



后来在 GitHub 上发现了这款，可以一键生成 Nginx 配置的开源免费神器，目前github已经有 `14.7k star` 了

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/Home/image-20211118224921241.png)

这个项目是 `JavaScript+Vue` 开发的，对前端感兴趣的筒子们可以试着研究一下。



先来说一下它的功能：

反向代理、HTTPS、HTTP/2、IPv6， 缓存、WordPress、CDN、Node.js 支持、 Python (Django) 服务器、日志、限制等等。



只需要在它的网站手动点击你需要的功能：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/Home/image-20211118225406771.png)

跟着网站提示一步一步操作：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/Home/image-20211118225741373.png)

选择你的场景，填写好参数，系统就会自动生成配置文件。



在最后你就可以下载或者复制最终的Nginx配置清单了：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/Home/image-20211118225642177.png)

对于新手来说，就是配置高性能、安全、稳定的NGINX服务器的最简单方法。



github地址：[https://github.com/digitalocean/nginxconfig.io](https://github.com/digitalocean/nginxconfig.io)

在线配置地址：[https://www.digitalocean.com/community/tools/nginx](https://www.digitalocean.com/community/tools/nginx)