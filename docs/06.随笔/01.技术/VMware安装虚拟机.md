想要拥有一台虚拟机，你有两个方法：

- 购买一台云服务器
- 使用虚拟化软件在物理机虚拟创建



第一种方法最简单，适合电脑配置低的入门选手，而且云服务器也便宜，新用户一年也就几十块钱。



第二种方法比较费电脑，硬件思否兼容取决于运气。



由于我已经薅完了云服务器厂商，所以我这里选择第二种方法，使用虚拟机软件 VMware 进行安装虚拟机。

## 1、VMware 安装

VMware 作为一款优秀的虚拟机软件，在管理虚拟机的情况下，非常方便。

但是，这款软件是 **收费的**，

（VMware workstations 收费，但是 VMware player 个人版免费，区别就是功能不一样）



我这里用的是 14版本的VMware workstations pojie 版，忘了在哪下载了，需要下载的可以看文末。

## 2、安装虚拟机

一步一步安装即可。

这部省略。



## 3、安装虚拟机

安装虚拟机需要先下载 镜像。

镜像一般是 以 `.iso` 文件结尾



常见的Linux系统版本：

| 版本名称     | 网 址                                    | 特 点                                                        | 软件包管理器                                        |
| ------------ | ---------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------- |
| Debian Linux | [www.debian.org](http://www.debian.org/) | 开放的开发模式，且易于进行软件包升级                         | apt                                                 |
| Fedora Core  | [www.redhat.com](http://www.redhat.com/) | 优秀带桌面环境的系统，拥有数量庞人的用户，优秀的社区技术支持. 并且有许多创新 | up2date（rpm），yum （rpm）                         |
| CentOS       | [www.centos.org](http://www.centos.org/) | CentOS 是一种对 RHEL（Red Hat Enterprise Linux）源代码再编译的产物，由于 Linux 是开发源代码的操作系统，并不排斥样基于源代码的再分发，CentOS 就是将商业的 Linux 操作系统 RHEL 进行源代码再编译后分发，并在 RHEL 的基础上修正了不少已知的漏洞 | rpm                                                 |
| SUSE Linux   | [www.suse.com](http://www.suse.com/)     | 专业的操作系统，易用的 YaST 软件包管理系统                   | YaST（rpm），第三方 apt （rpm）软件库（repository） |
| Ubuntu       | [www.ubuntu.com](http://www.ubuntu.com/) | 优秀带桌面环境的系统，基于 Debian 构建，对新款硬件具有极强的兼容能力。 | apt                                                 |



目前市面上用的比较多的是CentOS，个人如果要学习用，建议用Ubuntu，因为是可视化的桌面，操作方便。

（不过现在 centos 也有桌面版了，但是有点大，centos 8都10个G了）

不同的系统命令有所差异，但是不会很大。



### 1、点击创建虚拟机

![](https://cdn.staticaly.com/gh/DogerRain/image@main/2022/img-202207/image-20220731184357797.png)

推荐使用**典型安装。**

### 2、选择你的镜像

选择你下载好的的镜像。



我这里选用Linux centos 为例，在[centos 网站]( https://www.centos.org/download) 下载好需要的镜像到本地即可。



预留一个大一点的硬盘，用来分配空间。



### 3、配置

分配 内存、CPU核心。

![](https://cdn.staticaly.com/gh/DogerRain/image@main/2022/img-202207/image-20220731185758135.png)

![](https://cdn.staticaly.com/gh/DogerRain/image@main/2022/img-202207/image-20220731192034921.png)

配置完成。

点击 `开启该虚拟机` 即可。

如果电脑要关机，只需要 `挂起该虚拟机` 即可，下次点击 `继续运行该虚拟机` 就会恢复上次的使用点。



## 4、其他

### 1、蓝屏

如果你电脑出现蓝屏，极大可能是因为硬件不兼容导致的。

**我本地就是因为每次用了 声卡而蓝盘**



在VMware选用硬件的时候，可以去除不需要的驱动，比如我本地只保留以下的硬件，其他全部移除：

![](https://cdn.staticaly.com/gh/DogerRain/image@main/2022/img-202207/image-20220731113640300.png)

 

---

VMware workstations 版本下载：

链接：https://pan.baidu.com/s/1wUDcvfs_zc5uBfXN-HiIGQ 
提取码：ygt2



如果失效了，请在微信公众号 `HelloCoder` 回复 `vmware`或者 `脚手架`

