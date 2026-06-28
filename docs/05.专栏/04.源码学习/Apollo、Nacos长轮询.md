---
title: Apollo、Nacos长轮询
date: 2026-06-21 23:40:20
lock: need
permalink: /pages/Apollo%E3%80%81Nacos%E9%95%BF%E8%BD%AE%E8%AF%A2
categories:
  - 专栏
  - 源码学习
tags:
  - Apollo
  - Nacos
  - 长轮询
---
如果要实现一个配置中心的更新通知操作，用户在管理后台修改某个配置后，服务端即可马上通知客户端更新，这种架构应该如何设计？





## 一、核心设计思路

配置更新的通知机制本质上是一个**发布-订阅**模型：

- **配置中心服务端**：管理配置，感知变更，作为消息发布者
- **业务应用（客户端）**：订阅关心的配置，作为消息消费者
- **通信通道**：连接服务端和客户端的桥梁



常见的方案：

| 场景               | 推荐方案               | 理由                   |
| :----------------- | :--------------------- | :--------------------- |
| 中小规模，快速实现 | 长轮询 (Apollo)        | 成熟稳定，开箱即用     |
| 大规模微服务       | gRPC双向流 / WebSocket | 性能好，连接开销低     |
| 已有 MQ 基础设施   | 消息队列               | 复用现有组件，解耦彻底 |
| 配置实时性要求极高 | WebSocket              | 毫秒级推送             |



### 长轮询（Long Polling）

这是 Apollo、Nacos 的方案。，核心是“推拉结合”：**长轮询负责实时通知“配置变了”，定时拉取负责兜底保证“最终一致”**，两者通过事件机制联动

> 长轮询的关键设计在于**服务端可以主动唤醒挂起的请求**，而不是被动等待超时。



长轮询思想：

![](http://rainyudianxx.baimuxym.cn/hellocoder/deepseek_mermaid_20260617_2ac497.svg)

## 二、Apollo 核心机制分析

Apollo 的长轮询实现，可以拆解为服务端的挂起与唤醒，以及客户端的请求与拉取。

#### 客户端：RemoteConfigLongPollService

它负责向服务端发起长轮询请求，并处理响应。

```java
// 核心伪代码逻辑，基于 RemoteConfigLongPollService
public void startLongPolling() {
    // 1. 构造请求，携带当前已知的 notificationId
    String url = assembleLongPollRefreshUrl(notificationIds);
    
    // 2. 发起HTTP请求，设置较长的超时时间（如60秒）
    //    服务端会利用Servlet 3.0的异步特性将请求挂起
    HttpRequest request = buildLongPollRequest(url);
    
    // 3. 处理响应
    try {
        HttpResponse response = httpClient.execute(request);
        if (response.getStatusCode() == 200) {
            // 服务端返回了变更的Namespace列表
            List<String> changedNamespaces = parseResponse(response);
            // 4. 触发配置拉取
            for (String namespace : changedNamespaces) {
                // 通知对应的 RemoteConfigRepository 去拉取最新配置
                remoteConfigRepository.onLongPollNotified(namespace);
            }
        } else if (response.getStatusCode() == 304) {
            // 配置无变化，正常超时，立即发起下一次长轮询
        }
    } catch (Exception e) {
        // 异常处理，指数退避重试
    } finally {
        // 5. 无论成功或超时，立即发起下一次长轮询请求
        startLongPolling(); 
    }
}
```



这里的关键是`notificationId`，它是服务端用来判断配置是否变更的版本标识。长轮询只负责通知“哪个Namespace变了”，并不直接传输配置内容，这样可以保证接口的幂等性，避免因网络顺序问题导致数据错乱。

#### 服务端：NotificationController 与 NotificationManager



服务端通过`DeferredResult`（基于Servlet 3.0）来挂起请求，等待事件唤醒。

```java
// 服务端核心伪代码逻辑
@PostMapping("/notifications/v2")
public DeferredResult<List<Notification>> pollNotifications(
        @RequestParam String notifications, ...) {
    
    // 1. 解析客户端传来的 notificationId 列表
    List<Notification> clientNotifications = parseNotifications(notifications);
    
    // 2. 创建 DeferredResult，超时时间通常为60秒
    DeferredResult<List<Notification>> deferredResult = 
            new DeferredResult<>(60_000L);
    
    // 3. 检查当前是否有更新
    List<Notification> readyNotifications = checkForUpdates(clientNotifications);
    if (!readyNotifications.isEmpty()) {
        // 有更新则立即返回
        deferredResult.setResult(readyNotifications);
        return deferredResult;
    }
    
    // 4. 无更新，将 DeferredResult 注册到 NotificationManager 中等待唤醒
    notificationManager.addListener(clientNotifications, deferredResult);
    
    // 5. 设置超时回调，清理资源
    deferredResult.onTimeout(() -> notificationManager.removeListener(deferredResult));
    
    return deferredResult; // 请求被挂起
}

// NotificationManager 中的唤醒逻辑
public void onConfigPublished(String namespace) {
    // 当有配置发布事件发生时，找到所有监听该namespace的 DeferredResult
    List<DeferredResult> listeners = findListeners(namespace);
    for (DeferredResult listener : listeners) {
        // 唤醒挂起的请求，返回变更的namespace信息
        listener.setResult(createNotification(namespace));
    }
}
```



服务端的核心是**事件驱动**。配置发布后，`ReleaseMessageScanner`会扫描到新事件，并通过`NotificationManager`唤醒所有匹配的`DeferredResult`，从而实现毫秒级的推送通知



时序图：

![](http://rainyudianxx.baimuxym.cn/hellocoder/mermaid-diagram-1781670462436.svg)



## 三、Nacos 核心机制分析

Nacos 的实现思路和 Apollo 类似，但在客户端任务拆分和服务端数据比较上有些细节差异。

#### 客户端：ClientWorker 与 LongPollingRunnable

Nacos 客户端将长轮询任务封装为`LongPollingRunnable`，并支持按配置集数量进行拆分，以提升并发能力。



```java
// 核心伪代码逻辑，基于 ClientWorker.LongPollingRunnable
public void run() {
    List<CacheData> cacheDatas = getCacheDataForTask();
    
    // 1. 先检查本地文件是否有变更
    for (CacheData cacheData : cacheDatas) {
        checkLocalConfig(cacheData);
    }
    
    // 2. 发起长轮询请求，检查服务端变更
    //    请求路径：/v1/cs/configs/listener
    List<String> changedGroupKeys = checkUpdateDataIds(cacheDatas);
    
    if (!changedGroupKeys.isEmpty()) {
        // 3. 有变更，逐个拉取最新配置
        for (String groupKey : changedGroupKeys) {
            String content = getServerConfig(groupKey);
            // 更新缓存，触发监听器
            cacheData.setContent(content);
        }
    }
    
    // 4. 继续执行下一次长轮询任务
    ClientWorker.this.executorService.execute(this);
}
```



注意，Nacos 的长轮询请求`/v1/cs/configs/listener`，默认超时时间是**30秒**，服务端会提前约500ms返回响应，以避免客户端超时。

#### 服务端：LongPollingService 与 ClientLongPolling

Nacos 服务端通过`LongPollingService`管理所有长轮询连接，并使用`ConcurrentLinkedQueue`存储任务。



```java
// 服务端核心伪代码逻辑
public void addLongPollingClient(HttpServletRequest req, HttpServletResponse rsp, ...) {
    // 1. 获取客户端期望的超时时间（默认30秒）
    long timeout = getLongPollingTimeout(req);
    
    // 2. 立即检查MD5，判断配置是否有变更
    List<String> changedGroups = MD5Util.compareMd5(req, rsp, clientMd5Map);
    if (!changedGroups.isEmpty()) {
        // 有变更，直接返回
        sendResponse(changedGroups);
        return;
    }
    
    // 3. 无变更，创建 ClientLongPolling 异步任务
    final AsyncContext asyncContext = req.startAsync();
    asyncContext.setTimeout(0L); // 由调度线程控制超时
    
    // 提交一个调度任务，在 (timeout - 500ms) 后执行超时逻辑
    ConfigExecutor.scheduleLongPolling(() -> {
        // 超时后，返回空响应（304）
        sendResponse(null);
    }, timeout - 500, TimeUnit.MILLISECONDS);
    
    // 4. 将 ClientLongPolling 任务放入队列，等待配置变更事件唤醒
    allSubs.add(new ClientLongPolling(asyncContext, clientMd5Map, ...));
}
```

 



## 四、异步处理

这里面还有一个问题，1000个客户端接入，应用服务器要保持1000个请求的处理线程吗 ？

如果按传统同步请求处理，1000个客户端确实会占用1000个Tomcat工作线程，资源很快就会耗尽。



这就要提到上面说的 `DeferredResult`。Apollo和Nacos都利用了**Servlet 3.0的异步处理机制**（Apollo用`DeferredResult`，Nacos用`AsyncContext`），**在请求被挂起时，会立即释放Tomcat的工作线程**，让它可以去处理其他请求

> `DeferredResult`和`AsyncContext`是基于Servlet 3.0异步特性构建的，但它们在设计和使用上有所不同，**`DeferredResult`是Spring MVC对底层`AsyncContext`的更高级封装，提供了更便捷的编程模型**



关键在于将“接收请求”和“处理业务”解耦，分成了几个阶段：

1. **接收请求，立即释放线程**：客户端发起长轮询请求，服务端在`Controller`中返回一个`DeferredResult`或调用`request.startAsync()`获得`AsyncContext`后，**这个请求的处理方法就结束了，Tomcat工作线程会被立即释放回线程池**。此时，请求并未结束，而是被“挂起”在内存中，但不再占用宝贵的线程资源。

2. **线程池资源对比**：如果没有异步处理（同步阻塞），1000个请求就会占用1000个线程，并且都在等待。Tomcat默认的工作线程池通常是200个，新请求就会排队甚至被拒绝。而使用异步处理后，1000个长轮询请求，**在挂起等待期间，几乎不占用工作线程**。

   > 不过需要留意，像Tomcat这类容器，其`AsyncContext.start()`方法可能依然会使用工作线程池来执行业务逻辑，所以最好自己维护一个独立的业务线程池。

3. **等待唤醒与响应**：每个被挂起的请求，都包含了一个`AsyncContext`或`DeferredResult`对象以及客户端关心的配置信息。当配置发生变更时，服务端会通过事件监听机制找到所有相关的挂起请求，调用`asyncContext.complete()`或`deferredResult.setResult()`方法，异步地完成响应。

### Nacos 和 Apollo 的处理细节

- **Nacos**：`LongPollingService`会创建一个`ClientLongPolling`任务提交给线程池处理。它会先通过MD5比对，快速判断有无配置变更。若无变更，则通过`AsyncContext`将请求挂起。其服务端会提前约500ms结束等待，以避免客户端超时。
- **Apollo**：`NotificationController`使用`DeferredResult`将请求挂起，并交给`NotificationManager`管理。配置变更事件触发后，会通过唤醒对应的`DeferredResult`来返回变更通知。



简单来说，**1000个长轮询请求在等待时，并不会占用1000个工作线程**。Servlet 3.0的异步特性允许它们被“挂起”并释放线程，只占用少量内存来保存请求上下文，因此不会导致连接池耗尽。



### Servlet 3.0 的 `AsyncContext`

`AsyncContext`是Servlet 3.0规范提供的核心异步处理接口。它的工作流程可以概括为：

1. **开启异步**：在Servlet或Filter中，通过调用`request.startAsync()`来开启异步模式，并获得一个`AsyncContext`对象。
2. **释放线程**：调用`startAsync()`后，当前的Servlet容器线程（如Tomcat工作线程）会立即结束并被释放回线程池，这使得它能够去处理其他请求。
3. **异步处理**：你可以将耗时的任务交给另一个线程（或由`AsyncContext.start(Runnable)`启动的线程）去执行。
4. **完成响应**：当异步任务处理完毕，通过调用`AsyncContext.complete()`来通知容器，此时响应才会被提交给客户端；或者使用`AsyncContext.dispatch()`将请求重新分派回容器，由常规的Servlet逻辑来完成响应。

`AsyncContext`是相对底层的API，直接使用它，你需要自己处理线程管理、异常、超时等细节

### Spring MVC 的 `DeferredResult`

`DeferredResult`是Spring 3.2开始提供的一个高级封装，它基于`AsyncContext`，但极大地简化了异步编程模型。

两者最核心的区别是**谁在控制结果的返回**：

- **`AsyncContext`**：更像一个**“主动型”**的异步处理器。你需要在线程中获取到`AsyncContext`实例，并在任务完成后手动调用`complete()`或`dispatch()`来完成响应。
- **`DeferredResult`**：更像一个**“被动型”**的**异步结果占位符**。你可以把它想象成一个可以存放结果的“盒子”。Controller返回这个“盒子”后，主线程就释放了。**任何其他线程**（比如一个消息监听线程、定时任务线程等）在获得结果后，只需要将结果`setResult()`到这个“盒子”里，Spring MVC就会自动完成后续的响应分派和返回。

```java
// 使用 DeferredResult 的典型示例
@GetMapping("/async")
public DeferredResult<String> asyncRequest() {
    // 1. 创建一个“结果盒子”
    DeferredResult<String> deferredResult = new DeferredResult<>();

    // 2. 将“盒子”交给其他线程去处理
    someOtherThreadPool.submit(() -> {
        // ... 执行耗时操作，获取结果 result ...
        // 3. 将结果放入“盒子”，Spring会自动完成响应
        deferredResult.setResult(result);
    });

    // 4. Controller方法返回，Tomcat工作线程被释放
    return deferredResult;
}
```



从代码可以看出，使用`DeferredResult`时，你不需要关心`AsyncContext`、不需要手动调用`complete()`，也无需进行请求分派，Spring MVC全盘接管了底层细节。

| 特性             | `AsyncContext` (Servlet API)              | `DeferredResult` (Spring MVC)                 |
| :--------------- | :---------------------------------------- | :-------------------------------------------- |
| **所属层级**     | Servlet 3.0 规范底层API                   | Spring MVC 框架封装                           |
| **编程模型**     | 命令式，需手动调用`complete` / `dispatch` | 声明式，通过`setResult`设置结果，框架自动完成 |
| **与Spring集成** | 差，需要手动处理                          | 优秀，原生集成，支持超时、回调等              |
| **代码复杂度**   | 较高，需处理更多细节                      | 较低，使用简洁直观                            |

`DeferredResult`在开发效率和编程体验上远胜于直接操作`AsyncContext`，这也是Apollo这类优秀的开源项目选择使用`DeferredResult`来实现长轮询的原因之一