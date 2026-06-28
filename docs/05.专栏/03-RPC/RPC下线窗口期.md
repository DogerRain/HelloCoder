从服务端下线到客户端感知，哪怕只有几秒钟，在微服务高并发场景下也足以导致成千上万的请求失败。



这个在分布式系统中被称为“下线窗口期（Window of Vulnerability）”**，也就是注册中心的数据同步延迟导致客户端出现**服务地址脏数据的现象。





https://cloud.tencent.com/developer/article/1518747





## 一、问题根源：一个时间窗口

服务端正常或者非正常下线引发的客户端延迟，本质上是服务提供者（Provider）实际已经不可用，但消费者（Consumer）的本地缓存尚未更新，在这个时间差内发起的请求就可能超时或失败。Dubbo 的策略就是**尽力缩短这个窗口期，并为窗口期内可能发生的失败提供补偿**。





## 二. Dubbo：尽力而为的“优雅停机”

这里以Dubbo为例，来分析一下它是如何实现的。





当 Provider 正常关闭时，它会触发一个 JVM ShutdownHook 钩子函数，执行 `ProtocolConfig.destroyAll()` 方法。

> 注意：必须使用kill -15 才能触发，kill -9 无法触发钩子函数



### 阶段一：注销与断流（对应的想法：先剔除节点）

**主动摘除**：`destroyAll()` 会调用 `AbstractRegistryFactory.destroyAll()`，它会立马向**主动向注册中心发起取消注册（unregister）请求**，将自己从服务列表中移除。这是最理想的情况，注册中心会立刻将变更推送给所有订阅的 Consumer。

```java
// AbstractConfig 静态块中注册 ShutdownHook
static {
    Runtime.getRuntime().addShutdownHook(new Thread(() -> {
        // ...
        ProtocolConfig.destroyAll(); // 核心入口
    }, "DubboShutdownHook"));
}

// ProtocolConfig.destroyAll() 关键步骤
public static void destroyAll() {
    // 1. 销毁所有注册中心，主动取消注册服务
    AbstractRegistryFactory.destroyAll();
    // 2. 等待一定时间，让注册中心能处理完通知（新增的优化）[citation:12]
    Thread.sleep(ConfigUtils.getServerShutdownTimeout());
    // 3. 关闭协议端口和连接
    // ... protocol.destroy();
}
```



具体流程：

Dubbo 会像多米诺骨牌一样，按顺序关闭所有核心组件（主要通过 `DubboProtocol.destroy()` 和 `NettyServer.close()` 方法）：

1. **关闭业务线程池：** 调用 `ExecutorService.shutdown()`。此时线程池不再接受新任务，并等待正在执行的线程执行完。

2. **关闭网络通道（Channel）：** 遍历所有跟客户端建立的 Netty Channel，主动调用 `channel.close()`，向客户端发送 TCP `FIN` 包。客户端收到后，彻底断开与该服务端的连接。

   它会通过现有的 Netty 通道，向所有连接着的客户端广播发送一个特殊的**只读事件（ReadOnly Event）**。

   - **客户端收到后的反应：** 客户端的 Dubbo 框架收到这个 `ReadOnly` 信号后，会立刻在本地把这个服务端的节点标记为“不可用（ReadOnly 状态）”

3. **关闭监听端口（Server）：** 调用 `nettyServer.close()`，解绑（Unbind）比如 `20880` 端口。此时操作系统不再允许任何流量进入这个端口。

4. **释放所有内存对象：** 清空本地缓存、各种 Map 映射表。

当上述 4 步全部执行完毕，Dubbo 的 `ShutdownHook` 线程执行结束，向 JVM 汇报：“我撤退完毕了。”



### 阶段二：安全静默期

1. 节点剔除后，Dubbo **不会立刻关闭 Netty 端口**。
2. 它在后台启动一个定时器，开始检查本地的**计数器**。**这个计数器记录了当前有多少个“已经进来了、但还没执行完”的业务请求（存量请求）。
3. Dubbo 会一边等待这些老请求执行完毕并返回，一边拒绝在这期间通过旧连接强行塞进来的极少数新请求。
4. **如果存量请求全部处理完毕，或者超过了最大等待时间（默认 10 秒）**，**服务端才会最终关闭底层网络通道**，彻底退出 JVM。

**如果存量请求全部处理完毕，或者超过了最大等待时间**，服务端才会最终关闭底层网络通道，彻底退出 JVM。



关于第2点：

Dubbo 的等待并不是盲目地让整个线程 `Thread.sleep(10000)`，因为那样太傻了（如果 0.5 秒内请求就处理完了，剩下时间就是纯浪费）。

Dubbo 采用的是“计数器检测 + 循环尝试”的自旋等待机制。

```java
// HeaderExchangeServer.close() 核心逻辑伪代码 (来源: [citation:4][citation:5])
while (HeaderExchangeServer.this.isRunning() // 检查是否还有正在处理的请求
        && System.currentTimeMillis() - start < max) { // 检查是否超时
    try {
        Thread.sleep(10); // 没有完成且未超时，则等待10毫秒后再次检查
    } catch (InterruptedException e) {
        // ...
    }
}
doClose(); // 关闭心跳等
server.close(timeout); // 最终关闭网络连接
```



总结：在最后关闭网络连接（如 Netty 连接）时，Dubbo 会**检查当前连接上是否还有正在处理中的请求**。如果有，它会等待这些请求处理完成或超时，才会真正关闭连接，这被称为**优雅停机**，避免了强制关闭导致的请求失败。



### 阶段三、Consumer 端的容错与重试

这是最后的防线，即使上述机制都完美工作，网络抖动依然可能导致极小概率的调用失败。因此，Consumer 侧必须有一个**“兜底”策略**。

- **集群容错（Cluster）**：Dubbo 默认的集群容错策略是 `FailoverCluster`，它会在调用失败时进行**自动重试（Retry）**。
- **源码中的重试逻辑**：在 `FailoverClusterInvoker` 的 `doInvoke()` 方法中，可以看到清晰的重试循环。它会根据配置的 `retries` 参数（默认重试2次，即总共尝试3次），在每次失败后，通过负载均衡组件**重新选择**一个新的 Provider 地址进行调用，而不是死磕一个节点。



```java
// FailoverClusterInvoker.java 核心逻辑 (来源: 搜索到的源码分析) [citation:1]
@Override
protected Result doInvoke(Invocation invocation, List<Invoker<?>> invokers, LoadBalance loadbalance) {
    // ...
    int len = getUrl().getMethodParameter(invocation.getMethodName(), Constants.RETRIES_KEY, Constants.DEFAULT_RETRIES);
    // 循环重试
    for (int i = 0; i <= len; i++) {
        // 每次都重新选择 Invoker
        Invoker<T> invoker = select(loadbalance, invocation, copyinvokers, invoked);
        try {
            Result result = invoker.invoke(invocation);
            // 调用成功，返回结果
            return result;
        } catch (RpcException e) {
            // ... 异常处理，如果是业务异常则不重试
            exception = e;
        }
    }
    // 所有重试都失败，抛出最后的异常
    throw exception;
}
```

## 三. 如何自定义退出命令（主导下线时机）？

如果你是在本地测试，或者在写自己的运维脚本，想要手动触发这个优雅停机流程，有几种标准做法：

### 做法一：发送标准系统信号（最常用）

在 Linux 环境下，绝对不要使用 `kill -9 `，因为 `-9` 是强杀，会直接剥夺 JVM 执行注销和等待的机会。 你应该使用：

```Bash
kill -15 <PID>   # 或者直接 kill <PID>，默认就是 -15 信号
```

`kill -15` (SIGTERM) 会通知 JVM 开始执行所有的 `ShutdownHook`。Dubbo 监听到这个信号后，就会开启你期望的“剔除 -> 等待 3 秒 -> 关闭”流程。

### 做法二：结合 Spring Boot Actuator 的 /shutdown 端点

如果你使用了 Spring Boot，可以开启自带的优雅停机端点。通过向服务端发送一个 POST 请求来命令它安全退出：

```Bash
curl -X POST http://localhost:8080/actuator/shutdown
```

Spring 会先通知 Dubbo 关闭，然后再关闭自己，同样能完美触发你的方案。

### 做法三：Kubernetes (K8s) 环境下的最佳实践

如果你未来将 Dubbo 部署到 K8s 中，K8s 默认会给 Pod 发送 `SIGTERM` 信号，并给予 30 秒的宽限期（`terminationGracePeriodSeconds`）。这与 Dubbo 的 `shutwait` 配合得天衣无缝。





## 四、总结

可以概括为：

- **正常下线**：依赖优雅停机流程，**主动摘除**并**延迟关闭**连接。
- **异常下线**：依赖注册中心的**临时节点**或 K8s 的**探针机制**进行兜底感知。
- **快速通知**：利用注册中心的**事件推送**和 Consumer 端的 `RegistryDirectory` 监听器，**及时更新**本地列表。
- **兜底容错**：最后，通过 `FailoverClusterInvoker` 的**自动重试**机制，为窗口期内的失败调用提供最终补偿。

