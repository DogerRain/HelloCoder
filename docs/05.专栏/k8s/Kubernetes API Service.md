---
title: Kubernetes API Service
date: 2026-06-21 23:40:20
lock: need
permalink: /pages/Kubernetes%20API%20Service
categories:
  - 专栏
  - k8s
tags:
  - KubernetesAPIService
---
```bash
[root@yudianxx ~]# kubectl get svc | grep

NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE

kubernetes      ClusterIP   10.96.0.1       <none>        443/TCP        7h28m
```

在 K8s 的大本营里，这个躺在列表第一行的 `kubernetes` 服务，就是整个集群的“中央政务大厅入口”（官方黑话叫：**Kubernetes API Service**）。

它是 K8s 在创建集群的第 0 秒，由系统自动生成、**永远不准删除**的神级 Service。它的唯一职责，是**让集群内部所有的 Pod 容器，都能合法、安全地访问到 Master 节点的大脑（ApiServer）**。

我们用一句话戳破它的底层：**`10.96.0.1` 就是 Master 节点上 `kube-apiserver` 组件在集群内部的虚拟代言人。**

## 🧭 为什么需要这个 `10.96.0.1`？（痛点场景）

还记得我们之前聊的 K8s 架构吗？Master 节点的 `apiserver`（物理 IP 是 `192.168.1.50:6443`）是整个集群的唯一指挥官。

现在，假设你要在 Worker 节点上部署一套高级的**容器化自建网关（比如 APISIX）**，或者你未来要跑的 **Hermes 飞书智能体系统**：

- 智能体/网关容器在干活时，必须高频地向 K8s 大脑提问：“老大，现在集群里有哪些健康的 Nginx Pod IP 呀？快把列表发给我，我要做动态路由！”
- 这时候，**容器（Pod）必须要和 ApiServer 通信。**

那么问题来了，容器怎么知道 ApiServer 的物理 IP 是 `192.168.1.50`？如果以后 Master 节点换了物理 IP 怎么办？

为了让容器不需要硬编码 Master 的物理 IP，K8s 出了个绝招：**在集群刚诞生时，就固定分配一个 `10.96.0.1`（443端口）作为 ApiServer 的永恒虚拟化替身。**

## 🧬 物理肉身：它是如何瞒天过海的？

这个 `10.96.0.1` 背后并没有跑专门的“转发容器”，它的背后直接连着 Master 节点的控制面组件。

如果你在 Master 节点上执行这条命令，查看它的底层明细（Endpoints）：



```Bash
kubectl describe svc kubernetes
```

💡 你会看到类似这样的硬核真相：

```Bash
[root@yudianxx ~]# kubectl describe svc kubernetes
Name:              kubernetes
Namespace:         default
Labels:            component=apiserver
                   provider=kubernetes
Annotations:       <none>
Selector:          <none>
Type:              ClusterIP
IP Family Policy:  SingleStack
IP Families:       IPv4
IP:                10.96.0.1
IPs:               10.96.0.1
Port:              https  443/TCP
TargetPort:        6443/TCP
Endpoints:         192.168.1.50:6443
Session Affinity:  None
Events:            <none>
```

看到其中的 `Endpoints` 挂着 **`192.168.1.50:6443`**（你的 Master 物理 IP 和 ApiServer 默认安全端口）了吗？

这物理印证了：集群里的任何 Pod 只要访问 `https://10.96.0.1:443`，流量都会被底层的 `kube-proxy` 瞬间、无缝地平移抛给 Master 节点的 `kube-apiserver` 进程。

## 🔒 进阶彩蛋：任何一个 Pod 刚出生，就知道怎么找它

为了让天底下的所有 Pod 容器都能无缝跟大脑通信，K8s 做到了极致的保姆级服务。

你可以重新“魂穿”进入你的 Nginx 容器内部：

```Bash
kubectl exec -it nginx-deployment-775f57cb68-p6cql -- sh
```

在容器里输入 `env` 命令，查看当前容器的环境变量：



```Bash
/ # env | grep KUBERNETES
```

**💡 你会看到每个容器血管里都流淌着这几行环境变量：**



```Bash
/ # env | grep KUBERNETES
KUBERNETES_PORT=tcp://10.96.0.1:443
KUBERNETES_SERVICE_PORT=443
KUBERNETES_PORT_443_TCP_ADDR=10.96.0.1
KUBERNETES_PORT_443_TCP_PORT=443
KUBERNETES_PORT_443_TCP_PROTO=tcp
KUBERNETES_PORT_443_TCP=tcp://10.96.0.1:443
KUBERNETES_SERVICE_PORT_HTTPS=443
KUBERNETES_SERVICE_HOST=10.96.0.1
```



K8s 在每一个 Pod 诞生时，都会**强行往它的身体里注入这几行环境变量**。这样一来，任何微服务代码（或者高阶的云原生智能体框架），只要在代码里读取 `KUBERNETES_SERVICE_HOST`，就能顺藤摸瓜找到 `10.96.0.1`，直接跟集群大脑开始无缝谈话。

