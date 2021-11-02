## 1、k8s有哪些组件构成？

![](https://img-blog.csdnimg.cn/20200315200407893.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQwMzc4MDM0,size_16,color_FFFFFF,t_70)

### 1）、Master

K8S中的Master是集群控制节点，负责整个集群的管理和控制

在Master上运行着以下关键进程：

kube-apiserver：提供了HTTP Rest接口的关键服务进程，是K8S里所有资源的增删改查等操作的唯一入口，也是集群控制的入口进程

kube-controller-manager：K8S里所有资源对象的自动化控制中心，集群内各种资源Controller的核心管理者，针对每一种资源都有相应的Controller，保证其下管理的每个Controller所对应的资源始终处于期望状态

kube-scheduler：负责资源调度（Pod调度）的进程，通过API Server的Watch接口监听新建Pod副本信息，并通过调度算法为该Pod选择一个最合适的Node

etcd：K8S里的所有资源对象以及状态的数据都被保存在etcd中

### 2）、Node

Node是K8S集群中的工作负载节点，每个Node都会被Master分配一些工作负载，当某个Node宕机时，其上的工作负载会被Master自动转移到其他节点上

在每个Node上都运行着以下关键进程：

kubelet：负责Pod对应的容器的创建、启停等任务，同时与Master密切协作，实现集群管理的基本功能

kube-proxy：实现Kubernetes Service的通信与负载均衡机制的重要组件

Docker Engine：Docker引擎，负责本机的容器创建和管理工作
在默认情况下Kubelet会向Master注册自己，一旦Node被纳入集群管理范围，kubelet进程就会定时向Master汇报自身的信息（例如机器的CPU和内存情况以及有哪些Pod在运行等），这样Master就可以获知每个Node的资源使用情况，并实现高效均衡的资源调度策略。而某个Node在超过指定时间不上报信息时，会被Master判定为失败，Node的状态被标记为不可用，随后Master会触发工作负载转移的自动流程



### 2、简述 Kubernetes 和 Docker 的关系

Docker是一个容器化平台，它以容器的形式将您的应用程序及其所有依赖项打包在一起，以确保应用程序在任何环境中无缝运行。

它的主要优点是将将软件/应用程序运行所需的设置和依赖项打包到一个容器中，从而实现了可移植性等优点。（容器化）

Kubernetes 用于关联和编排在多个主机上运行的容器，可以实现容器集群的自动化部署、自动扩缩容、维护等功能。（为了让容器更高效）



### 3、 Kubernetes 中 Minikube、Kubectl、Kubelet 分别是什么？

Minikube 是一种可以在本地轻松运行一个单节点 Kubernetes 群集的工具。

Kubectl 是一个命令行工具，可以使用该工具控制 Kubernetes 集群管理器，如检查群集资源，创建、删除和更新组件，查看应用程序。

Kubelet 是一个代理服务，它在每个节点上运行，并使从服务器与主服务器通信。