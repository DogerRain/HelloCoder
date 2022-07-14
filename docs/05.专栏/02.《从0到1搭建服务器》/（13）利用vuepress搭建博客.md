---
title: （13）利用vuepress搭建博客
date: 2022-07-14 16:13:16
lock: true
permalink: /pages/%EF%BC%8813%EF%BC%89%E5%88%A9%E7%94%A8vuepress%E6%90%AD%E5%BB%BA%E5%8D%9A%E5%AE%A2
categories:
  - 专栏
  - 《从0到1搭建服务器》
tags:
  - vuepress
  - 利用
  - 搭建博客
---
VuePress 由两部分组成：第一部分是一个极简静态网站生成器 (opens new window)，它包含由 Vue 驱动的主题系统和插件 API，另一个部分是为书写技术文档而优化的默认主题，它的诞生初衷是为了支持 Vue 及其子项目的文档需求。



简单来说，VuePress 可以渲染你的 Markdown 文件，按照约定俗成的配置，生成一个 html 网站，从而更加方便的生成技术文档。



此前我的文档网站是通过 docsify 生成的，非常简单，但是用户每次访问网站，都需要把 `.md`渲染一遍，性能较差，而且还不能定制化开发。

所以我打算把它换成 vuepress。 



## 1、选型

官方的 VuePress 主题风格并不是每个人都喜欢的。

基于 VuePress 主题，国内开发者开发出了很多好看的主题，加入了许多功能，例如：

|      | vuepress-theme-vdoing                              | vuepress-theme-hope                         | vuepress-theme-reco                      |
| ---- | -------------------------------------------------- | ------------------------------------------- | ---------------------------------------- |
| 网站 | https://doc.xugaoyi.com                            | https://vuepress-theme-hope.github.io/v1/zh | https://vuepress-theme-reco.recoluan.com |
| 技术 | 基于 Vue                                           | 基于typescript                              | 基于typescript                           |
| 优点 | 自动生成 frontmatter，支持文档、博客风格，安装方便 | 插件多，支持seo                             | 插件多，支持seo，支持RSS                 |
| 缺点 | 不支持多语言，不支持seo，                          | 需要自定义侧边栏                            | 需要自定义侧边栏                         |



因为我只对 Vue 熟悉，所以我的网站是基于 **vuepress-theme-vdoing** 搭建的，其中做了一些二次开发，体验地址：

https://learnjava.baimuxym.cn

所以我这里只对 **vuepress-theme-vdoing** 主题的搭建进行演示。



## 2、安装和启动

 **vuepress-theme-vdoing**  的作者已经做了一个demo，我们只需要把仓库拉取下来即可：

```sh
# 拉取 文档风格主题 的代码仓库，作者提供了3种风格的文档类型，可以参考官网或者本地自行修改配置
git clone https://github.com/xugaoyi/vuepress-theme-vdoing-doc.git

# 进入安装目录
cd vuepress-theme-vdoing-doc

# install dependency 注意：需要安装node环境，如安装不成功请关闭淘宝源。也可以使用 yarn 进行安装
npm install # yarn install

# develop
npm run dev #  yarn dev
```

npm install 的过程比较久，占用内存较大，失败了可以尝试 淘宝源。

> 注意，node、npm的版本不能太低，我这里的 node版本为 16 ，npm 版本为 8.5

执行完毕，出现以下提示表示成功，打开链接，即可浏览生成的文档网站：

```js
success [10:48:43] Build 3b8cfd finished in 20236 ms!
> VuePress dev server listening at http://localhost:8080/
```

![](https://fastly.jsdelivr.net/gh/DogerRain/image@main/img-202207/image-20220711134815091.png)





## 3、采坑点

作者已经在官方文档写明了约定俗成的配置，以及 frontmatter，但新手在使用的时候可能会遇到一些坑。

### 3.1、侧边栏

![](https://fastly.jsdelivr.net/gh/DogerRain/image@main/img-202207/image-20220711105549597.png)

侧边栏是需要按照序号的排列生成。

否则不会出现在侧边栏和目录栏。`getSidebarData.js` 这个js工具会遍历这些目录生成侧边栏。

> 需要注意的是， .md 文件不要超过两个二级目录，否则目录栏无法正确跳转。

### 3.2、<>标签

对于一些自定义的非 vue、html 标签，如 `<dependeny>`、`<properties>`，需要使用 **``** 行内语法块，否则会导致内容渲染失败。

### 3.3、图片

支持图片的相对路径。markdown中若使用了图片的相对路径，需要将 `/` 改为 `./`

### 3.4、打包

打包部署到NGINX，可能会引起样式错乱，需要将 `config.js` ：

```js
base: '/',
```

如果路径没有错误，可能是 Nginx 的问题，我遇到过在windows部署错乱，在Linux部署就正常了。



## 4、基于vuepress-theme-vdoing的修改

Vuepress基于Vue，所以如果有一些不满意的地方，都可以DIY修改。

### 4.1、加入 阅读全文模块

为了对特别的用户开放，我做了个文章加锁的功能，通过 frontmatter 设定值，来判断文章是否需要加锁。

![](https://fastly.jsdelivr.net/gh/DogerRain/image@main/img-202207/image-20220714144128606.png)

点击弹出 窗口需要输入密码验证：

![](https://fastly.jsdelivr.net/gh/DogerRain/image@main/img-202207/image-20220714144208230.png)

主要还是防止被人盗文章。

### 4.2、基于分词器做标签分类

首页生成的分类需要 frontmatter 定义的tags才能显示出来。

但是自定义的tag比较麻烦，所以我写了个方法，自动根据标题截取分词，这样首页就有了智能生成的标签：

![](https://fastly.jsdelivr.net/gh/DogerRain/image@main/img-202207/image-20220714144927804.png)

### 4.3、侧栏自定义

文章左边可以生成侧栏，右侧可以生成目录。

原作者是通过一个js脚本遍历 `01.`、`02.` 这种带序号的目录和文件生成的，以替代原来Vuepress手动自定义json的形式。

我觉得每次都要这样命名太麻烦了，而且如果要插入到中间的序号之间......

所以我把原来作者自动生成侧栏的逻辑改了，按照系统自动排序的规则，读取所有文件夹和文件，然后生成侧边栏。



## 5、总结

Vuepress相对 hexo、hugo、gitbook ，更方便，插件也多，主题也多。

相对 docsify，功能更强大，docsify则很简单但是性能差加载慢。

Vuepress的主题，也丰富多彩，每个主题都要自己的特色，而 vuepress-theme-vdoing 又非常符合程序员搭建技术文档，非常感谢 vuepress-theme-vdoing 的作者。

最后附上我的个人网站：https://learnjava.baimuxym.cn

---

参考：

-  vuepress-theme-vdoing主题：https://doc.xugaoyi.com/

