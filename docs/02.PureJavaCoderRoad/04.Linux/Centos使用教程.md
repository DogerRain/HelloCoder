---
title: Centos使用教程
date: 2022-05-26 17:04:01
permalink: /pages/Centos%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B
lock: false
categories: 
  - PureJavaCoderRoad
  - Linux
tags: 
  - Centos
  - 使用教程
---
> 本文演示Linux版本：Centos8.8

## 1、Centos介绍

常见的Linux系统版本：

| 版本名称     | 网 址                                    | 特 点                                                        | 软件包管理器                                        |
| ------------ | ---------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------- |
| Debian Linux | [www.debian.org](http://www.debian.org/) | 开放的开发模式，且易于进行软件包升级                         | apt                                                 |
| Fedora Core  | [www.redhat.com](http://www.redhat.com/) | 优秀带桌面环境的系统，拥有数量庞人的用户，优秀的社区技术支持. 并且有许多创新 | up2date（rpm），yum （rpm）                         |
| CentOS       | [www.centos.org](http://www.centos.org/) | CentOS 是一种对 RHEL（Red Hat Enterprise Linux）源代码再编译的产物，由于 Linux 是开发源代码的操作系统，并不排斥样基于源代码的再分发，CentOS 就是将商业的 Linux 操作系统 RHEL 进行源代码再编译后分发，并在 RHEL 的基础上修正了不少已知的漏洞 | rpm                                                 |
| SUSE Linux   | [www.suse.com](http://www.suse.com/)     | 专业的操作系统，易用的 YaST 软件包管理系统                   | YaST（rpm），第三方 apt （rpm）软件库（repository） |
| Ubuntu       | [www.ubuntu.com](http://www.ubuntu.com/) | 优秀带桌面环境的系统，基于 Debian 构建，对新款硬件具有极强的兼容能力。 | apt                                                 |



目前市面上用的比较多的是CentOS，个人如果要学习用，建议用Ubuntu，因为是可视化的桌面，操作方便。

不同的系统命令有所差异，但是不会很大。

##  2、结构

随便进入一个目录，键入 `ls`

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img2/image-20210310172319129.png)

前面一串东西表示：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img2/image-20210310173444937.png)

文件的颜色表示：

- 蓝色 表示文件夹；
- 灰色 表示普通文件；
- 绿色 表示可执行文件；
- 红色 表示压缩文件；
- 天蓝色 表示链接文件（快捷方式）；

常见的目录结构：

- **bin：** 存放普通用户可执行的指令，普通用户也可以执行；
- **dev ：** 设备目录，所有的硬件设备及周边均放置在这个设备目录中；
- **boot ：** 开机引导目录，包括 Linux 内核文件与开机所需要的文件；
- **home：** 这里主要存放你的个人数据，具体每个用户的设置文件，用户的桌面文件夹，还有用户的数据都放在这里。每个用户都有自己的用户目录，位置为： `/home/用户名`。当然，root 用户除外；
- **usr：** 应用程序放置目录；
- **lib：** 开机时常用的动态链接库，bin 及 sbin 指令也会调用对应的 lib 库；
- **tmp：** 临时文件存放目录 ；
- **etc：** 各种配置文件目录，大部分配置属性均存放在这里；

## 3、常见的命令

### 1、目录、文件操作命令

#### 1、touch

创建文件

```bash
[root@VM-8-8-centos ~]# touch HaC.txt
```

#### 2、vi、vim 文件编辑命令

<img src="https://cdn.jsdelivr.net/gh/DogerRain/image@main/img2/image-20210310174401469.png" style="zoom:50%;" />

vi 只能编辑已存在的文件
```bash
[root@VM-8-8-centos ~]# vi HaC.txt
```

vim 假如文件不存在会自动创建文件：

```bash
[root@VM-8-8-centos ~]# vim HaC.txt
```

进入文件编辑模式后，按下 `i 键` ，左下角出现 **INSERT** 即可编辑。

<img src="https://cdn.jsdelivr.net/gh/DogerRain/image@main/img2/image-20210315182357675.png" style="zoom:50%;" />

再按 `Esc 键` ，此时编辑模式消失，左下角输入 

`:w` 表示保存

`:wq` 表示保存并且退出

`:wq!` 表示强制保存并且退出

`:q!` 表示不保存，强制退出

<img src="https://cdn.jsdelivr.net/gh/DogerRain/image@main/img2/image-20210315182853202.png" style="zoom:50%;" />



常用的命令见下：

| 作用                             | 命令             |
| :------------------------------- | :--------------- |
| 切换目录                         | `cd`             |
| 显示当前目录完整路径             | `pwd`            |
| 查看目录下的信息（包括隐藏文件） | `ls`（ `ls -a`） |
| 列出目录下的文件和详细信息       | `ll`  |
| 创建目录                         | `mkdir`          |
| 复制文件（文件夹）               | `cp`  |
| 移动/重命名文件夹和目录          | `mv`             |
| 删除文件（目录）                 | `rm`（ `rm -rf`） |





最后推荐个B站的入门教程：[基于CentOS7的Linux操作系统的入门与服务器的配置](https://www.bilibili.com/video/BV134411G7Jr)

