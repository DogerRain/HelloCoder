---
title: k8s的DNS
date: 2026-06-21 23:40:20
lock: need
permalink: /pages/k8s%E7%9A%84DNS
categories:
  - 专栏
  - k8s
tags:
  - ks
  - DNS
---
当你master登入一个pod后，可以看到它的DNS

```bash
[root@yudianxx docker-app]# kubectl exec -it nginx-deployment-775f57cb68-p6cql -- sh

/ # cat /etc/resolv.conf 

search default.svc.cluster.local svc.cluster.local cluster.local

nameserver 10.96.0.10

options ndots:5
```



`nameserver 10.96.0.10` 这个DNS就是这个集群的DNS服务。



在 K8s 中，`10.96.0.10` 是一个特殊的、雷打不动的虚拟 IP，叫做 **`kube-dns` 的 Service IP**。

你可以直接在 Master 节点上运行这条命令来验证它的真身：`kubectl get svc -n kube-system`

```
[root@yudianxx ]# kubectl get svc -n kube-system
NAME       TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)                  AGE
kube-dns   ClusterIP   10.96.0.10   <none>        53/UDP,53/TCP,9153/TCP   6h58m
```



## 1、解密这个DNS IP

为什么不直接把那两个 CoreDNS 的 Pod IP 写进 `/etc/resolv.conf`？

我们看到这是各个worker的 dns-core 服务：

```bash
[root@yudianxx ~]# kubectl get pods -n kube-system -l k8s-app=kube-dns -o wide
NAME                       READY   STATUS    RESTARTS   AGE     IP           NODE        NOMINATED NODE   READINESS GATES
coredns-6554b8b87f-gq9pm   1/1     Running   0          3m20s   10.244.2.4   k8s-node2   <none>           <none>
coredns-6554b8b87f-xvdc8   1/1     Running   0          3m20s   10.244.1.4   k8s-node1   <none>           <none>
```

这两个 CoreDNS Pod（`vnjvd` 和 `smnx5`），由于我们之前清理了旧网络，它们重启后会拿到全新的 Pod IP。



如果 K8s 偷懒，直接把这两个具体的 IP 写进用户的 Nginx 容器里，会发生灾难性的后果：

1. **单点故障**：如果其中一个 CoreDNS 的 Pod 崩溃了，Nginx 容器里的一半请求就会直接超时卡死。
2. **销毁重建**：一旦 CoreDNS 升级或重启，Pod IP 100% 会发生改变。K8s 总不可能去把集群里成百上千个业务容器的 `/etc/resolv.conf` 文件全部暴力修改一遍。



为了解决这个问题，K8s 采用了一套“反向代理”的负载均衡架构：

```
               ┌───> [CoreDNS Pod 1] (10.244.1.4)
               │
Nginx 容器 ───────> 虚拟 Service IP (10.96.0.10) ───┤ 自动负载均衡
               │
               └───> [CoreDNS Pod 2] (10.244.2.4)
```

1. 当你的 Nginx 容器尝试解析域名时，它会盲目地把请求发给老大哥 **`10.96.0.10`**。
2. 宿主机上的 **`kube-proxy`** 组件早就在底层网卡处设下了埋伏（通过 iptables 或 ipvs 规则）。
3. 当它看到有去往 `10.96.0.10` 的流量时，会瞬间施展“移花接木”，**以 50% 的概率随机挑选**你那两个活跃的 CoreDNS Pod（`vnjvd` 或 `smnx5`）的真实物理 IP，把请求转发过去。



这个就像是 pod 的 `service name`。



## 2、 Service IP (10.96.0.10)在哪里

`nameserver 10.96.0.10` 这个 DNS 服务部署在哪里？是真实的服务吗？

```bash
[root@yudianxx]#  kubectl exec -it nginx-deployment-775f57cb68-p6cql -- sh
/ # cat /etc/resolv.conf 
search default.svc.cluster.local svc.cluster.local cluster.local
nameserver 10.96.0.10
```

**它是真实存在的，而且它采用了一种“影分身”的高可用架构。**

你可能会疑惑：我们刚才查到，真正的 CoreDNS 容器 IP 明显是 `10.244.x.x`，而且跑在 Master 节点上。那这个 `10.96.0.10` 到底实体在哪？

答案是：**在集群的每一台机器上，都有它的一部分肉身。**

### 1. 它在哪里？

- **名义上的它**：在控制面。它其实是 K8s 官方在集群刚初始化时，为你强行创建的一个名为 `kube-dns` 的 **Service**。这个 `10.96.0.10` 就是这个 Service 的虚拟 IP。
- **物理上的它**：在**每一台虚拟机（Master、node1、node2）的 Linux 内核网络内核红黑树（iptables/ipvs）里**。



**它既不是一个跑在系统里的进程，也不单纯是一张静态的路由表。它是一条由 Linux 内核动态生成的“强行拦截并改写流量的规则”（在 Linux 里叫 Netfilter 规则）。**

### 2. 它是怎么工作的？

当你在 Nginx 容器内（我的pod）发起域名解析，数据包（源IP: Pod IP -> 目的IP: `10.96.0.10:53`）欢快地冲出容器，进到**宿主机 Linux 内核**的那一刹那：

1. **内核大网管（Netfilter）瞬间把数据包按在地上。**

2. 内核查阅了一张由 **`kube-proxy`** 组件预先在内核里布下的“天罗地网（iptables/ipvs 规则表）”。

3. 这张表里写着一条霸道的强盗逻辑：

   > “凡是看到目的 IP 是 `10.96.0.10`、目的端口是 `53` 的数据包，**不管它同不同意，立刻把它的‘目的 IP’抹掉，强行改写为那两个真正的 CoreDNS Pod IP 之一（比如 `10.244.0.5:53`）**，然后放行！”

这个过程在网络技术里叫 **DNAT（动态目的地址转换）**。

也就是说，`10.96.0.10` 只是一个被强行塞进内核网络流水线里的“匹配诱饵”。数据包在还没来得及在网络上寻找 `10.96.0.10` 的物理位置时，它的“目的地”就已经在 Linux 内核内部被魔改成了真正的 CoreDNS 容器 IP。

### 3. 为什么说它是“神级设计”？

因为通过这种设计，K8s 实现了**绝对的解耦**： 不管你未来的 CoreDNS 容器是扩容成了 10 个，还是从 Master 节点漂移到了 `node2` 节点，或者它的 Pod IP 怎么变，**所有业务容器里死死写着的 `10.96.0.10` 永远不需要改**。

它是一个由 `kube-proxy` 在全集群所有节点底层织成的一张**虚拟网络保护网**，是真正意义上的“云原生软件定义网络（SDN）”。





### 4、 真正的 DNS 进程在哪？

它跑在控制面（你查到的那两个 `coredns-xxx` Pod 容器里）。在那个容器内部，有一个真正叫 `coredns` 的 Go 语言编译出来的**二进制进程**，它在实打实地监听着 `0.0.0.0:53` 端口，随时准备接收并解析域名。



