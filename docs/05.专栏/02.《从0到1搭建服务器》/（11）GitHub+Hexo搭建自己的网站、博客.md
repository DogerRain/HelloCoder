---
title: （11）GitHub+Hexo搭建自己的网站、博客
date: 2022-07-14 16:13:16
permalink: /pages/%EF%BC%8811%EF%BC%89GitHub+Hexo%E6%90%AD%E5%BB%BA%E8%87%AA%E5%B7%B1%E7%9A%84%E7%BD%91%E7%AB%99%E3%80%81%E5%8D%9A%E5%AE%A2
categories: 
  - 专栏
  - 《从0到1搭建服务器》
tags: 
  - GitHubHexo
  - 搭建自己
  - 网站
  - 博客
lock: need
---
前面提到的都是有个人服务器和域名的，那在没有服务器又没有域名的情况下，我们想搭建自己的网站，该如何做呢？

GitHub托管了每个用户的仓库，利用这个仓库可以免费为用户提供一个静态网站，你甚至不需要申请域名，这就是我们常说的GitHubPages。

---

Hexo 是一个静态博客框架，基于 Node.js，将 Markdown 文章通过渲染引擎，生成一个静态网页。

两者结合则可以搭建自己的博客了。

hexo官网：[https://hexo.io/zh-cn/docs/themes.html](https://hexo.io/zh-cn/docs/themes.html)

## 1、安装git

git下载地址：[https://git-scm.com/downloads](https://git-scm.com/downloads)

git安装完成后，右击文件夹出现`Git Gui Here`、`Git Bash Here` 选项表示安装成功：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210104205559254.png)

## 2、安装Node

下载：[https://nodejs.org/en/download/](https://nodejs.org/en/download/)

新版的Node都是安装了 `npm` 模块

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210102165648499.png)

如果执行 `node -v` 报错的话，那么手动将 Node.js 的安装路径添加到环境变量中。



如果npm很慢，可以配置taobao的镜像：

```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

配置后，使用 `cnpm` 代替 `npm` 命令即可。

## 3、注册GitHub，新建仓库

新建仓库要 带上`README.md`

新建完成则查看仓库 的 `setting`，拉到最后，找到`GitHub Pages`，选中分支：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210102170646197.png)

保存后你发现你的网站的URL就生成了，点击网站就直达你的`README.md`首页了。



格式都是 **用户名.github.io + 仓库名**

但是现在GitHubPage还没有样式，下一步可以配合Hexo下载自己的主题。

## 4、下载Hexo

### 1、安装hexo

执行：`npm install hexo -g`

```java
F:\笔记\LearnJavaToFindAJob>npm install hexo -g
npm WARN deprecated fsevents@2.1.3: Please update to v 2.2.x
C:\Users\Administrator\AppData\Roaming\npm\hexo -> C:\Users\Administrator\AppData\Roaming\npm\node_modules\hexo\bin\hexo
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@~2.1.2 (node_modules\hexo\node_modules\chokidar\node_modules\fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.1.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"x64"})

+ hexo@5.3.0
added 92 packages from 370 contributors in 588.186s
```



### 2、检查是否安装成功 

输入 `hexo -v`

```java
F:\笔记\LearnJavaToFindAJob>hexo -v
(node:17708) ExperimentalWarning: The fs.promises API is experimental
hexo-cli: 4.2.0
os: Windows_NT 10.0.18362 win32 x64
http_parser: 2.8.0
node: 10.16.0
v8: 6.8.275.32-node.52
uv: 1.28.0
zlib: 1.2.11
brotli: 1.0.7
ares: 1.15.0
modules: 64
nghttp2: 1.34.0
napi: 4
openssl: 1.1.1b
icu: 64.2
unicode: 12.1
cldr: 35.1
tz: 2019a
```

如果找不到 hexo 命令，检查一下Node的环境变量。

### 3、初始化

本地新建一个存放你博客项目的文件夹，我这里新建一个`LearnJavaToFindAJob`，输入 `hexo init`

过程比较长。

```Java
F:\笔记\LearnJavaToFindAJob> hexo init
(node:18480) ExperimentalWarning: The fs.promises API is experimental
INFO  Cloning hexo-starter https://github.com/hexojs/hexo-starter.git
INFO  Install dependencies
added 188 packages from 443 contributors and audited 194 packages in 246.397s
found 0 vulnerabilities

INFO  Start blogging with Hexo!
```

出现 `INFO  Start blogging with Hexo!` 表示成功了。

### 4、部署

（1）清除缓存文件 (`db.json`) 和已生成的静态文件 (`public`)。

```
 hexo clean
```

（2）生成静态文件。

```
hexo g
```

即generate。

（3）启动

```
hexo s
```

启动服务器。默认情况下，访问网址为： `http://localhost:4000/`

如果端口被占用，可以使用 `hexo server -p 端口号` 来启动。



> 更多hexo命令，参考官方文档：[https://hexo.io/zh-cn/docs/commands](https://hexo.io/zh-cn/docs/commands)



我这里使用

 `hexo -g`

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210102191014586.png)

`hexo -s` 启动hexo

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210102200300027.png)

访问：`http://localhost:4000/`，表示成功启动，这是默认的hexo主题：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210102200340757.png)

> 可以使用 `hexo clean && hexo g && hexo s`  一步到位

## 5、绑定Github page

打开本地博客目录，修改 `_config.yml` 文件

加上你的GitHub项目地址：

```java
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type: git
  repo: https: https://github.com/DogerRain/LearnJavaToFindAJob.git
  branch: master
```

> 如果你是第一次使用Git，需要先把你本地的账户密码配置好。



推送到GitHub仓库：

```
deploy d
```

如果报错：`Deployer not found: git`

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210102213400048.png)

解决方法：

执行：`npm install --save hexo-deployer-git`

但是这个太慢了，建议配置taobao的镜像源（上面提到），然后执行`cnpm install --save hexo-deployer-git` 



出现以下发布成功：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210102214310193.png)

可能需要配置GitHub的账户密码。

输入即可，然后再打开你的GitHubPage 的URL，发现你的博客就部署完成了。

## 6、配置分类、标签

### 1、创建“分类”选项

hexo默认是按时间（年月日）分类，如果自定义分类：

```
hexo new page categories
```

生成文件`\source\categories\index.md`

```
F:\笔记\LearnJavaToFindAJob>hexo new page categories
(node:4940) ExperimentalWarning: The fs.promises API is experimental
INFO  Validating config
INFO  Created: F:\笔记\LearnJavaToFindAJob\source\categories\index.md
```

打开这个`index.md`文件，加入 categories ：

```
title: categories
date: 2021-01-02 20:52:32
type: "categories"
```



### 2、创建“标签”选项

默认是没有标签的，生成标签：

```
hexo new page tags
```

生成文件`\source\tags\index.md`

```
F:\笔记\LearnJavaToFindAJob>hexo new page tags
(node:20492) ExperimentalWarning: The fs.promises API is experimental
INFO  Validating config
INFO  Created: F:\笔记\LearnJavaToFindAJob\source\tags\index.md
```

打开这个`index.md`文件，加入 tags：

```
title: tags
date: 2021-01-02 21:09:10
type: "tags"
```



### 3、打开你要部署的md文件

我这里要部署一篇文章，打开文章，在头部声明分类和标签

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210102211223252.png)

```java
---
title: HaC教你搭建服务器（一）
date: 2021-01-02 20:52:32
categories: 
- HaC的建站
tags:
- 服务器
- 建站
---
```

> categories 只能有一个，如果有多个默认取第一个；tags 可以有多个



执行 `hexo clean && hexo g && hexo s`



再打开，就发现分类、标签 出来了：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210102211852179.png)

> 要添加更多的归档或者自定义分类，参考：https://www.jianshu.com/p/ebbbc8edcc24

## 7、切换主题

默认的主题可能不好看，如果要切换主题怎么办呢？

打开：https://hexo.io/themes/

这里有很多hexo的主题。

到了这里，你基本就可以搭建自己的GitHubPage了，hexo还有很多有趣的功能，比如说评论、代码高亮、订阅，喜欢的筒子们可以自己捣鼓。

其他主题的预览可以参考一下这个：

[https://blog.csdn.net/zgd826237710/article/details/99671027](https://blog.csdn.net/zgd826237710/article/details/99671027)

比如说Butterfly主题：

![](https://img-blog.csdnimg.cn/20190816091627682.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3pnZDgyNjIzNzcxMA==,size_16,color_FFFFFF,t_70)

Hexo搭建出来的博客颜值都是蛮高的。



除此之外，还有很多静态博客的生成工具，比如说 jekyll、Hugo 等等，可以在这里选择你想要的静态博客工具：

[https://www.cnblogs.com/buyz/p/10935831.html](https://www.cnblogs.com/buyz/p/10935831.html)

