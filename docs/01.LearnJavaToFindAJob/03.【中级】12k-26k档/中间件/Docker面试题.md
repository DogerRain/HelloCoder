---
title: Docker面试题
date: 2022-06-02 11:18:17
lock: false
permalink: /pages/Docker%E9%9D%A2%E8%AF%95%E9%A2%98
categories: 
  - LearnJavaToFindAJob
  - 【中级】12k-26k档
  - 中间件
tags: 
  - Docker
  - 面试题
---
### 1、什么是Docker，对Docker的理解？

Docker是一个容器化平台，它以容器的形式将您的应用程序及其所有依赖项打包在一起，以确保应用程序在任何环境中无缝运行。

Docker 技术最初是基于 LXC 技术构建（大多数人都会将这一技术与“传统的”Linux 容器联系在一起），但后来它逐渐摆脱了对这种技术的依赖。

![ ](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20201210172914269.png)

除了运行容器之外，Docker 技术还具备其他多项功能，包括简化用于构建容器、传输镜像以及控制镜像版本的流程。

传统的 Linux 容器使用 init 系统来管理多种进程。这意味着，所有应用都作为一个整体运行。

与此相反，Docker 技术力争让应用各自独立运行其进程，并提供相应工具，帮助实现这一功能。这种精细化运作模式自有其优势。



**简单的说：Docker是一种轻量级的操作系统虚拟化解决方案，它想达到一次构建到处运行，类似于Java虚拟机的效果。**



### 2、容器（Docker）和虚拟机的区别？

- [虚拟化](https://www.redhat.com/zh/topics/virtualization)使得您的操作系统（Windows 或 Linux）可同时在单个硬件系统上运行。

虚拟机在本质上就是在模拟一台真实的计算机设备，同时遵循同样的程序执行方式。虚拟机能够利用“虚拟机管理程序”运行在物理设备之上。反过来，虚拟机管理程序则可运行在主机设备或者“裸机”之上。

- 容器则可共享同一个操作系统内核，将应用进程与系统其他部分隔离开。例如：x86 Linux 系统运行 x86 Linux 容器，x86 Windows 系统运行 x86 Windows 容器。Linux 容器具有极佳的可移植性，但前提是它们必须与底层系统兼容。

Docker守护进程可以直接与主操作系统进行通信，为各个Docker容器分配资源；它还可以将容器与主操作系统隔离，并将各个容器互相隔离。

![ ](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20201210171716057.png)



容器与虚拟机间的最大区别在于：**各容器系统共享主机系统的内核**。



### 3、docker常用命令

```
docker pull 拉取或者更新指定镜像
docker push 将镜像推送至远程仓库
docker rm 删除容器
docker rmi 删除镜像
docker images 列出所有镜像
docker ps 列出所有容器
```



### 4、什么是Docker镜像，和容器有什么区别？

**Docker镜像是Docker容器的源代码。**

两者可以互相转换。

换句话说，Docker镜像用于创建容器。使用build命令创建镜像，并且在使用run启动时它们将生成容器。镜像存储在Docker注册表中，`registry.hub.docker.com`（一个镜像仓库）因为它们可能变得非常大，镜像被设计为由其他镜像层组成，允许在通过网络传输镜像时发送最少量的数据。



### 5、Docker有多少种状态？

四种。

运行、已暂停、重新启动、已退出。