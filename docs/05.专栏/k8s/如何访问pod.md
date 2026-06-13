在你的 Master 虚拟机上，新建一个文件叫 `nginx-demo.yaml`：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment    # 1. 声明控制器的名字
  labels:
    app: my-nginx
spec:
  replicas: 2               # 🌟 重点：我们直接启动 2 个副本，让它自动漂移到 node1 和 node2 上！
  selector:
    matchLabels:
      app: my-nginx         # 告诉 Deployment 必须死死盯着带有这个标签的 Pod
  template:
    metadata:
      labels:
        app: my-nginx       # 给下面吐出来的 Pod 贴上对应的身份证标签
    spec:
      containers:
      - name: nginx
        image: nginx:1.25-alpine # 使用超轻量的 nginx 镜像
        ports:
        - containerPort: 80 # Nginx 容器内部默认监听的端口

---

apiVersion: v1
kind: Service
metadata:
  name: nginx-service       # 2. 声明网络通道的名字
spec:
  type: NodePort            # 🌟 核心：NodePort 模式会强制在每一台虚拟机上开辟一个完全一样的物理端口
  selector:
    app: my-nginx           # 路由靶心：把流量精准转发给上面那些带有 app: my-nginx 标签的 Pod
  ports:
    - protocol: TCP
      port: 80              # Service 内部虚拟端口
      targetPort: 80        # 对应 Nginx 容器的端口
      nodePort: 30080       # 🌟 物理机暴露端口：你可以自己指定（范围必须在 30000-32767 之间）
```

执行 `kubectl apply -f nginx-service.yaml` 后，启动它。

## 1、如何访问这个服务

命令 `kubectl get svc` 用于**查看当前 Kubernetes 集群中所有 Service（服务）**

```
[root@yudianxx ~]# kubectl get svc
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
kubernetes      ClusterIP   10.96.0.1       <none>        443/TCP        6h22m
nginx-service   NodePort    10.100.253.82   <none>        80:30080/TCP   5h14m
```

这里`PORT(S)` 有两个端口，要特别注意一下。

### 1. 内部端口（Port: `80`）

- **管辖边界**：**仅限集群内部。**

- **原理**：它是 Service 的虚拟 IP（`CLUSTER-IP: 10.100.253.82`）真正监听的端口。所以在集群内部，不管是 Master 还是 Worker，你只要 `curl 10.100.253.82:80`，流量就能畅通无阻地送进 Nginx。

  ```bash
  # 任意一台集群机器直接访问
  [root@yudianxx ~]# curl 10.100.253.82:80
  <!DOCTYPE html>
  <html>
  <head>
  <title>Welcome to nginx!</title>
  ```

  

### 2. 外部端口（NodePort: `30080`）



普通的 Service（ClusterIP）只能在 K8s 集群那几台虚拟机内部通信，你的物理笔记本电脑（宿主机）是根本无法感知 `10.244` 或 `10.96` 网段的。

要从宿主机打通访问，最快、最原生的方式是把 Service 类型修改为 **`NodePort`**。启动后你会看到端口那一栏变成了类似 `80:31234/TCP` 的格式。



- **管辖边界**：**集群外部（宿主机物理网络）。**
- **原理**：K8s 会在集群的所有宿主机（`yudianxx`、`node1`、`node2`）的**真实物理网卡上**强行开放这个 `30080` 端口。它是为了让集群外的流量进来的“安全通道”

```bash
# 我直接使用宿主机的IP去访问
[root@yudianxx ~]# curl 192.168.1.50:30080
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
```



### 3、service name

Service 是 K8s 实现**内部负载均衡和服务发现**的核心组件。它会向 CoreDNS 注册一个永久的域名（Service Name），无论底层的 Pod IP 怎么变，访问这个域名都会被自动分发到健康的 Pod 上。

```
[root@yudianxx ]#  kubectl exec -it nginx-deployment-775f57cb68-p6cql -- sh
/ # curl http://nginx-service:80
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
```





我们进入 这个 pod ，可以看到整个 service name 就是解析到 cluster ip ，也可以直接使用cluster ip访问。

```bash
[root@yudianxx ]#  kubectl exec -it nginx-deployment-775f57cb68-p6cql -- sh
/ # ping nginx-service
PING nginx-service (10.100.253.82): 56 data bytes


/ # curl 10.100.253.82:80
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>



[root@yudianxx ~]# kubectl get svc | grep nginx
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
nginx-service   NodePort    10.100.253.82   <none>        80:30080/TCP   6h21m
```



> 你输入 `ping nginx-service` 后，应该会发现它打印出了 IP，但是**没有任何 `64 bytes from...` 的丢包回显**，只能按 `Ctrl + C` 强行中止。
>
> > **原理：** 不要慌，这不是网络坏了，而是**正常的底层物理限制**。 `10.100.253.82` 是一个由系统的 `iptables` 或 `ipvs` 规则凭空捏造出来的**虚拟 IP（VIP）**，它在节点上并没有物理网卡。K8s 只让它监听和转发 **TCP/UDP** 端口流量（比如 80 端口）。 而 `ping` 命令使用的是 **ICMP 协议**（没有端口的概念），K8s 底层的 `kube-proxy` 根本没有为这个虚拟 IP 配置 ICMP 的转发规则。因此，**在 K8s 中，永远不要用 `ping` 去检测 Service IP 的连通性，它天然是不通的！** 验证 Service 必须使用 `curl`。





## 🏗️ 总结：K8s 网络的三界隔离

通过你的集群，我们可以清晰地看到 K8s 内部三套各司其职的网段。只要记住这三个“约定俗成”，你也就具备了架构师级的法眼：



```Plaintext
 1. 物理机网段 ──────> 192.168.1.x    (你虚拟机的真实物理 IP，用来给物理机访问)
 2. Service网段 ─────> 10.100.x.x     (K8s 的虚拟大总管 IP，永不改变，比如 10.96.0.10)
 3. Pod/容器网段 ────> 10.244.x.x     (Flannel 负责的容器短命 IP，比如你的 Nginx)
```

