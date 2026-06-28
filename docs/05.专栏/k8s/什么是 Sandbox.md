---
title: 什么是 Sandbox
date: 2026-06-21 23:40:20
lock: need
permalink: /pages/%E4%BB%80%E4%B9%88%E6%98%AF%20Sandbox
categories:
  - 专栏
  - k8s
tags:
  - Sandbox
---
## 🧐 什么是 Sandbox（`pause` 容器）？

在 K8s 的体系中，**Pod 是最小的调度单位**，但 Pod 并不是一个真实的物理容器，它是一个**逻辑概念**。一个 Pod 内部可以包含一个或多个业务容器（比如：Hermes 机器人容器 + 日志收集容器）。

由于这些容器属于同一个 Pod，K8s 规定：**它们必须像在同一台物理机上一样，共享完全相同的网络、完全相同的存储卷，并且可以直接通过 `127.0.0.1` 相互通信。**

为了实现这一点，K8s 搬出了 `pause` 容器。它是一个用 C 语言写的、打包后只有几百 KB、启动后处于“永久休眠”状态的超轻量容器。



在pod拉起的时候，可以看到它会拉起一个 `registry.k8s.io/pause:3.6`的 镜像

```
  Warning  FailedCreatePodSandBox  2m55s (x6 over 25m)   kubelet            Failed to create pod sandbox: rpc error: code = Unknown desc = failed to get sandbox image "registry.k8s.io/pause:3.6": failed to pull image "registry.k8s.io/pause:3.6": failed to pull and unpack image "registry.k8s.io/pause:3.6": failed to resolve reference "registry.k8s.io/pause:3.6": failed to do request: Head "https://asia-east1-docker.pkg.dev/v2/k8s-artifacts-prod/images/pause/manifests/3.6": dial tcp [2404:6800:4008:c15::52]:443: i/o timeout
```



## 🛠️ 它到底有什么用？（底层原理拆解）

如果没有 `pause` 容器，我们在架构上会遇到一个巨大的悖论。我们用一个场景来还原它的精妙之处：

### 1. 解决孤儿网络问题（网络占坑）

假设一个 Pod 里有 A（Hermes 机器人）和 B（日志收集）两个业务容器。

- **如果让 A 容器初始化网络：** 那么 B 容器就要强行加入 A 的网络空间（Network Namespace）。如果某天 A 容器因为大模型配置错误挂了、重启了，A 容器的网络空间就会被 Linux 销毁。这时候 B 容器也会瞬间断网跟着一起殉职。这显然不合理。
- **K8s 的天才解法：** 当 Pod 启动时，`kubelet` 率先拉起 `pause` 容器。`pause` 容器启动后，向 Linux 内核申请创建一个专属的独立网络空间（Network Namespace）并拿到集群分发的 IP（如 `10.244.1.5`）。 随后，A 容器和 B 容器启动时，都在底层声明：**“我不创建自己的网络了，我强行加入 `pause` 容器的网络空间！”** 这样一来，无论 A 和 B 怎么崩溃、怎么重启，只要 `pause` 这个地基容器还在，Pod 的网络和 IP 就永远稳如磐石！

### 2. 充当容器死掉后的“收尸人”（孤儿进程回收）

在 Linux 系统中，如果一个父进程死掉了，它的子进程就会变成“孤儿进程”，严重时会疯狂占用系统资源变成“僵尸进程（Zombie Process）”，必须由系统的 `PID 1`（init 进程）来收尸回收。

在容器世界里，`pause` 容器在 Pod 内部就扮演着 **`PID 1`（根进程）** 的至高角色。它在后台永远处于休眠状态，什么都不干，唯一的任务就是死死盯着 Pod 内部。一旦有某个业务容器异常退出了并留下了僵尸进程，`pause` 会在一瞬间完成孤儿进程的回收，防止你的虚拟机节点因为僵尸进程耗尽而宕机。

## 💡 总结：

> **“`pause` 容器是 K8s 内部用于支撑 Pod 共享网络和存储的‘基座’。它通过提前创建并持久持有 Linux Namespace，让同一个 Pod 内的多个业务容器可以天然地共享 IP 和端口，同时它还作为 PID 1 进程负责回收 Pod 内部的僵尸进程，是 K8s 实现容器间紧密协作的基础设施。”**