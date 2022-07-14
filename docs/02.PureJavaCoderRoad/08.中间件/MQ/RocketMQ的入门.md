---
title: RocketMQ的入门
date: 2022-05-26 17:04:02
permalink: /pages/RocketMQ%E7%9A%84%E5%85%A5%E9%97%A8
lock: false
categories: 
  - PureJavaCoderRoad
  - 中间件
  - MQ
tags: 
  - RocketMQ
  - 入门
---
[RocketMQ的介绍](https://rain.baimuxym.cn/article/49)

[RocketMQ(1)-架构原理](https://www.cnblogs.com/qdhxhz/p/11094624.html)

[rocketmq-常见问题总结(消息的顺序、重复、消费模式)](https://www.cnblogs.com/xuwc/p/9034352.html)



> 本文是通过以下学习而总结的
>
> 《RocketMQ从入门到实践》——丁威
>
> 《Apache RocketMQ源码解析》——丁威
>
>   B站 
>

# 1、RocketMQ是什么

RcoketMQ 是一款低延迟、高可靠、可伸缩、易于使用的**消息中间件**。

什么是中间件，可以参考： [消息队列入门.md](消息队列入门.md) 

# 2、RocketMQ的组成

> RocketMQ官方文档：https://github.com/apache/rocketmq/blob/master/docs/cn/README.md

RocketMQ主要由 Producer、Broker、Consumer 三部分组成，其中Producer 负责生产消息，Consumer 负责消费消息，Broker 负责存储消息。

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-202109/image-20211012091010457.png)

### 1、Client

消息客户端，包括 Producer(消息发送者)和 Consumer(消费消费者)．

#### Producer

消息发布的角色，支持分布式集群方式部署。Producer通过MQ的负载均衡模块选择相应的Broker集群队列进行消息投递，投递的过程支持快速失败并且低延迟。

#### Consumer

消息消费的角色，支持分布式集群方式部署。支持以push推，pull拉两种模式对消息进行消费。同时也支持**集群方式**和**广播方式**的消费，它提供实时消息订阅机制，可以满足大多数用户的需求。

客户端在同一 时间只会连接一台 nameserver，只有在连接出现异常时才会向尝试连接另外一台。客户端每隔 30s 向 Nameserver 发起 topic 的路由信息查询。

### 2、Nameserver 

topic 的路由注册中心（类似于zookeeper），为客户端根据 Topic 提供路由服务，从而引导客户端向 Broker （支持Broker的动态注册与发现）发送消息。Nameserver 之间的节点不通信。路由信息在 Nameserver 集群中数据一致性采取的最终一致性。 主要有两个功能：

- Broker管理，NameServer接受Broker集群的注册信息并且保存下来作为路由信息的基本数据。然后提供心跳检测机制，检查Broker是否还存活
- 路由信息管理，每个NameServer将保存关于Broker集群的整个路由信息和用于客户端查询的队列信息。然后Producer和Conumser通过NameServer就可以知道整个Broker集群的路由信息，从而进行消息的投递和消费

NameServer通常也是集群的方式部署，**各实例间相互不进行信息通讯**。**Broker是向每一台NameServer注册自己的路由信息，所以每一个NameServer实例上面都保存一份完整的路由信息。**当某个NameServer因某种原因下线了，Broker仍然可以向其它NameServer同步其路由信息，Producer,Consumer仍然可以动态感知Broker的路由的信息。

### 3、Broker 

消息存储服务器，Broker主要负责消息的存储、投递和查询以及服务高可用保证，分为两种角色：Master 与 Slave，上图中呈现的就是 2 主 2 从的部署架构。

在 RocketMQ 中，主服务承担读写操作，从服务器作为一个备份，当主服务器存在压力时，从服务器可以承担读服务（消息消费）。所有 Broker，包含 Slave 服务器每隔 30s 会向 Nameserver 发送心跳包，心跳包中会包含存在在 Broker 上所有的 topic 的路由信息。



结合部署架构图，描述集群工作流程：

- 启动NameServer，NameServer起来后监听端口，等待Broker、Producer、Consumer连上来，相当于一个路由控制中心。
- Broker启动，跟所有的NameServer保持长连接，定时发送心跳包。心跳包中包含当前Broker信息(IP+端口等)以及存储所有Topic信息。注册成功后，NameServer集群中就有Topic跟Broker的映射关系。
- 收发消息前，先创建Topic，创建Topic时需要指定该Topic要存储在哪些Broker上，也可以在发送消息时自动创建Topic。
- Producer发送消息，启动时先跟NameServer集群中的其中一台建立长连接，并从NameServer中获取当前发送的Topic存在哪些Broker上，轮询从队列列表中选择一个队列，然后与队列所在的Broker建立长连接从而向Broker发消息。
- Consumer跟Producer类似，跟其中一台NameServer建立长连接，获取当前订阅Topic存在哪些Broker上，然后直接跟Broker建立连接通道，开始消费消息。



借用一张图：

![](F:\笔记\PureJavaCoderRoad（Java基础教程）\docs\articles\MQ\picture\image-20210930103755270.png)



RocketMQ消息丢失问题：

- https://blog.csdn.net/u014634309/article/details/105086687
- https://blog.csdn.net/leeasony/article/details/104857576

# 3、基本概念

在熟悉RocketMQ前，我在RocketMQ的官方网站直接复制以下概念过来，便于理解：

------

## 1 消息模型（Message Model）

RocketMQ主要由 Producer、Broker、Consumer 三部分组成，其中Producer 负责生产消息，Consumer 负责消费消息，Broker 负责存储消息。Broker 在实际部署过程中对应一台服务器，每个 Broker 可以存储多个Topic的消息，每个Topic的消息也可以分片存储于不同的 Broker。Message Queue 用于存储消息的物理地址，每个Topic中的消息地址存储于多个 Message Queue 中。ConsumerGroup 由多个Consumer 实例构成。

## 2 消息生产者（Producer）

负责生产消息，一般由业务系统负责生产消息。一个消息生产者会把业务应用系统里产生的消息发送到broker服务器。RocketMQ提供多种发送方式，同步发送、异步发送、顺序发送、单向发送。同步和异步方式均需要Broker返回确认信息，单向发送不需要。

## 3 消息消费者（Consumer）

负责消费消息，一般是后台系统负责异步消费。一个消息消费者会从Broker服务器拉取消息、并将其提供给应用程序。从用户应用的角度而言提供了两种消费形式：拉取式消费、推动式消费。

## 4 主题（Topic）

表示一类消息的集合，每个主题包含若干条消息，每条消息只能属于一个主题，是RocketMQ进行消息订阅的基本单位。

## 5 代理服务器（Broker Server）

消息中转角色，负责存储消息、转发消息。代理服务器在RocketMQ系统中负责接收从生产者发送来的消息并存储、同时为消费者的拉取请求作准备。代理服务器也存储消息相关的元数据，包括消费者组、消费进度偏移和主题和队列消息等。

## 6 名字服务（Name Server）

名称服务充当路由消息的提供者。生产者或消费者能够通过名字服务查找各主题相应的Broker IP列表。多个Namesrv实例组成集群，但相互独立，没有信息交换。

## 7 拉取式消费（Pull Consumer）

Consumer消费的一种类型，应用通常主动调用Consumer的拉消息方法从Broker服务器拉消息、主动权由应用控制。一旦获取了批量消息，应用就会启动消费过程。

## 8 推动式消费（Push Consumer）

Consumer消费的一种类型，该模式下Broker收到数据后会主动推送给消费端，该消费模式一般实时性较高。

## 9 生产者组（Producer Group）

同一类Producer的集合，这类Producer发送同一类消息且发送逻辑一致。如果发送的是事务消息且原始生产者在发送之后崩溃，则Broker服务器会联系同一生产者组的其他生产者实例以提交或回溯消费。

## 10 消费者组（Consumer Group）

同一类Consumer的集合，这类Consumer通常消费同一类消息且消费逻辑一致。消费者组使得在消息消费方面，实现负载均衡和容错的目标变得非常容易。

**要注意的是，消费者组的消费者实例必须订阅完全相同的Topic。**

RocketMQ 支持两种消息模式：`集群消费（Clustering）`和`广播消费（Broadcasting）`。



## 11 集群消费（Clustering）

集群消费模式下，相同Consumer Group的每个Consumer实例**平均分摊消息**。

## 12 广播消费（Broadcasting）

广播消费模式下，相同Consumer Group的每个Consumer实例都接收**全量的消息**。



## 13 普通顺序消息（Normal Ordered Message）

普通顺序消费模式下，消费者通过同一个消息队列（ Topic 分区，称作 Message Queue） 收到的消息是有顺序的，不同消息队列收到的消息则可能是无顺序的。

## 14 严格顺序消息（Strictly Ordered Message）

严格顺序消息模式下，消费者收到的所有消息均是有顺序的。

## 15 消息（Message）

消息系统所传输信息的物理载体，生产和消费数据的最小单位，每条消息必须属于一个主题。RocketMQ中每个消息拥有唯一的Message ID，且可以携带具有业务标识的Key。系统提供了通过Message ID和Key查询消息的功能。

## 16 标签（Tag）

为消息设置的标志，用于同一主题下区分不同类型的消息。来自同一业务单元的消息，可以根据不同业务目的在同一主题下设置不同标签。标签能够有效地保持代码的清晰度和连贯性，并优化RocketMQ提供的查询系统。消费者可以根据Tag实现对不同子主题的不同消费逻辑，实现更好的扩展性。

# 4、搭建环境

https://blog.csdn.net/weidong22/article/details/79246726



为什么有序？

如果不指定MessageQueue，默认是轮流发到不同的 MessageQueue上的，所以消费的时候就可能回乱序。

如果指定了，就会把这批消息放在同一个MessageQueue。

https://blog.csdn.net/leexide/article/details/80035470

# 5、使用

## 1、简单使用

### 5.1、 加入依赖

maven:

```xml
<dependency>
    <groupId>org.apache.rocketmq</groupId>
    <artifactId>rocketmq-client</artifactId>
    <version>4.3.0</version>
</dependency>
```


gradle

```properties
compile 'org.apache.rocketmq:rocketmq-client:4.3.0'
```



### 5.2、消息发送

producer消息的发送分为三种：同步消息、异步消息、单向消息。前两者的消息是可靠的，因为会有ACK应答，而单向消息 只管发送。

#### 1、Producer端发送同步消息

同步消息使用广泛，如短信，一些重要的消息。

```java
public class SyncProducer {
	public static void main(String[] args) throws Exception {
    	// 实例化消息生产者Producer
        DefaultMQProducer producer = new DefaultMQProducer("please_rename_unique_group_name");
    	// 设置NameServer的地址
    	producer.setNamesrvAddr("localhost:9876");
    	// 启动Producer实例
        producer.start();
    	for (int i = 0; i < 100; i++) {
    	    // 创建消息，并指定Topic，Tag和消息体
    	    Message msg = new Message("TopicTest" /* Topic */,
        	"TagA" /* Tag */,
        	("Hello RocketMQ " + i).getBytes(RemotingHelper.DEFAULT_CHARSET) /* Message body */
        	);
        	// 发送消息到一个Broker
            SendResult sendResult = producer.send(msg);
            // 通过sendResult返回消息是否成功送达
            System.out.printf("%s%n", sendResult);
    	}
    	// 如果不再发送消息，关闭Producer实例。
    	producer.shutdown();
    }
}
```

#### 2、发送异步消息

异步消息通常用在对响应时间敏感的业务场景，即发送端不能容忍长时间地等待Broker的响应。

```java
public class AsyncProducer {
	public static void main(String[] args) throws Exception {
    	// 实例化消息生产者Producer
        DefaultMQProducer producer = new DefaultMQProducer("please_rename_unique_group_name");
    	// 设置NameServer的地址
        producer.setNamesrvAddr("localhost:9876");
    	// 启动Producer实例
        producer.start();
        producer.setRetryTimesWhenSendAsyncFailed(0);
	
	int messageCount = 100;
        // 根据消息数量实例化倒计时计算器
	final CountDownLatch2 countDownLatch = new CountDownLatch2(messageCount);
    	for (int i = 0; i < messageCount; i++) {
                final int index = i;
            	// 创建消息，并指定Topic，Tag和消息体
                Message msg = new Message("TopicTest",
                    "TagA",
                    "OrderID188",
                    "Hello world".getBytes(RemotingHelper.DEFAULT_CHARSET));
                // SendCallback接收异步返回结果的回调
                producer.send(msg, new SendCallback() {
                    @Override
                    public void onSuccess(SendResult sendResult) {
                        System.out.printf("%-10d OK %s %n", index,
                            sendResult.getMsgId());
                    }
                    @Override
                    public void onException(Throwable e) {
      	              System.out.printf("%-10d Exception %s %n", index, e);
      	              e.printStackTrace();
                    }
            	});
    	}
	// 等待5s
	countDownLatch.await(5, TimeUnit.SECONDS);
    	// 如果不再发送消息，关闭Producer实例。
    	producer.shutdown();
    }
}
```

#### 3、单向发送消息

这种方式主要用在不特别关心发送结果的场景，例如日志发送。

```java
public class OnewayProducer {
	public static void main(String[] args) throws Exception{
    	// 实例化消息生产者Producer
        DefaultMQProducer producer = new DefaultMQProducer("please_rename_unique_group_name");
    	// 设置NameServer的地址
        producer.setNamesrvAddr("localhost:9876");
    	// 启动Producer实例
        producer.start();
    	for (int i = 0; i < 100; i++) {
        	// 创建消息，并指定Topic，Tag和消息体
        	Message msg = new Message("TopicTest" /* Topic */,
                "TagA" /* Tag */,
                ("Hello RocketMQ " + i).getBytes(RemotingHelper.DEFAULT_CHARSET) /* Message body */
        	);
        	// 发送单向消息，没有任何返回结果
        	producer.sendOneway(msg);

    	}
    	// 如果不再发送消息，关闭Producer实例。
    	producer.shutdown();
    }
}
```

### 5.3 、消息消费

```java
public class Consumer {

	public static void main(String[] args) throws InterruptedException, MQClientException {

    	// 实例化消费者
        DefaultMQPushConsumer consumer = new DefaultMQPushConsumer("please_rename_unique_group_name");

    	// 设置NameServer的地址
        consumer.setNamesrvAddr("localhost:9876");

    	// 订阅一个或者多个Topic，以及Tag来过滤需要消费的消息
        consumer.subscribe("TopicTest", "*");
    	// 注册回调实现类来处理从broker拉取回来的消息
        consumer.registerMessageListener(new MessageListenerConcurrently() {
            @Override
            public ConsumeConcurrentlyStatus consumeMessage(List<MessageExt> msgs, ConsumeConcurrentlyContext context) {
                System.out.printf("%s Receive New Messages: %s %n", Thread.currentThread().getName(), msgs);
                // 标记该消息已经被成功消费
                return ConsumeConcurrentlyStatus.CONSUME_SUCCESS;
            }
        });
        // 启动消费者实例
        consumer.start();
        System.out.printf("Consumer Started.%n");
	}
}
```





## 2、顺序消息样例

消息有序指的是可以按照消息的发送顺序来消费(FIFO)。RocketMQ可以严格的保证消息有序，可以分为分区有序或者全局有序。

顺序消费的原理解析，在默认的情况下消息发送会采取Round Robin轮询方式把消息发送到不同的queue(分区队列)；而消费消息的时候从多个queue上拉取消息，这种情况发送和消费是不能保证顺序。但是如果控制发送的顺序消息只依次发送到同一个queue中，消费的时候只从这个queue上依次拉取，则就保证了顺序。**当发送和消费参与的queue只有一个，则是全局有序；如果多个queue参与，则为分区有序，即相对每个queue，消息都是有序的。**

下面用订单进行分区有序的示例。一个订单的顺序流程是：创建、付款、推送、完成。订单号相同的消息会被先后发送到同一个队列中，消费时，同一个OrderId获取到的肯定是同一个队列。

### 2.1 顺序消息生产

###  2.2顺序消费消息

代码参考：https://github.com/apache/rocketmq/blob/master/docs/cn/RocketMQ_Example.md#22-%E9%A1%BA%E5%BA%8F%E6%B6%88%E8%B4%B9%E6%B6%88%E6%81%AF



# 6、故障

## 1、nameserver 挂掉

1. NameServer互相独立，彼此没有通信关系，单台NameServer挂掉，不影响其他NameServer；
2. broker与所有NameServer进行定时注册，以便告知NameServer自己还活着。**Broker每隔30秒向所有NameServer发送心跳**，心跳包含了自身的topic配置信息。NameServer每隔10秒，扫描所有还存活的broker连接，如果某个连接的最后更新时间与当前时间差值超过2分钟，则断开此连接。如果nameserver全挂了，则导致无法确定哪些broker存活，哪些broker宕机，如果broker宕机则导致消息发送失败。
3. consumer随机与一个NameServer建立长连接，如果该NameServer宕机，则从NameServer列表中查找下一个进行连接。consumer主要从NameServer中根据topic查询broker的地址，查到就会缓存到客户端，并向提供topic服务的master、slave建立长连接，且定时向master、slave发送心跳。如果broker宕机，则NameServer会将其剔除，而consumer端的定时任务每30秒执行一次，会将topic对应的broker地址拉取下来，**因此尽管nameserver全部宕机了，consumer依然能消费;**
4. Producer随机与一个NameServer建立长连接，默认每隔30秒从NameServer获取topic的最新队列情况并缓存，这就表示如果某个broker master宕机，producer最多30秒才能感知，在这个期间，发往该broker master的消息将会失败。Producer会向提供topic服务的master建立长连接，且定时向master发送心跳。**Producer与所有的master连接，但不能向slave写入**。 



## 2、broker挂掉

broker挂掉需要根据不同的部署方式进行分析：

- 单个 Master
- 多 Master（无salve）
- 多Master多Slave（异步复制）
- 多Master多Slave模式（同步双写）

### 1、单个 Master

这种挂掉就无了，一旦Broker重启或者宕机时，会导致整个服务不可用，也不推荐使用。

### 2、多 Master（无salve）

例如 2 个 Master 或者 3 个 Master。

当单台机器宕机期间，这台机器上**未被消费的消息**在机器恢复之前不可订阅，消息实时性会受到受到影响。

假如有两个master：broker-a 和 broker-b ，假如 broker-a 宕机了，生产者和消费者都不能通信，但是消息不会丢失，应用也不会报错，只有 broker-a 重启后，才能完成消费。

### 3、多Master多Slave（异步复制）

每个 Master 配置一个 Slave，有多对Master-Slave，这是一种HA（高可用）模式。

这种模式是对上一种模式 **多 Master（无salve）**  的优化，即使磁盘损坏，消息丢失的非常少，且消息实时性不会受影响，因为Master 宕机后，消费者仍然可以从 Slave 消费。（不需要人工干预，master挂了，消费者会自动找到 slave ）

但是Master的宕机，在复制的过程中会导致丢失掉极少量的消息。

### 4、多Master多Slave模式（同步双写）

 这种模式和上面类似，但在 写入的过程中，先写入master，master再写入slave，主从都写入成功了，再返回给应用。

所以性能比异步复制模式略低，大约低 10%左右，但Master宕机情况下，消息无延迟，服务可用性与数据可用性都非常高。



## 结论

1. **多master（无slave）模式**是所有模式中性能最高的，但是存在当broker宕机，其未被消费的消息在节点恢复之前不可用，消息实时性受到影响；
2. **多master多slave（异步复制）模式** master节点可读可写，但是slave只能读不能写，在master宕机时，消费者可以从slave中读取消息，消息实时性不会受到影响，但是可能会有消息丢失的问题；
3. **多master多slave（同步双写）模式** 能保证数据不丢失，但是性能较低；

> 要保证数据可靠，需采用 同步刷盘 和 同步双写 的方式，但性能会较其他方式低，可通过配置brokerRole和flushDiskType来实现数据可靠性；



# 7、实践问题

## 1、生产者

### 1 Tags的使用

一个应用尽可能用一个Topic，而消息子类型则可以用tags来标识。tags可以由应用自由设置，只有生产者在发送消息设置了tags，消费方在订阅消息时才可以利用tags通过broker做消息过滤：message.setTags("TagA")。

假如订阅了该toptic，但是tag不符合，这条消息的最终结果还是已经被消费状态（`CONSUMED_BUT_FILTERED`）。

### 2 Keys的使用

每个消息在业务层面的唯一标识码要设置到keys字段，方便将来定位消息丢失问题。服务器会为每个消息创建索引（哈希索引），应用可以通过topic、key来查询这条消息内容，以及消息被谁消费。由于是哈希索引，请务必保证key尽可能唯一，这样可以避免潜在的哈希冲突。

```java
// 订单Id   
String orderId = "20034568923546";   
message.setKeys(orderId);   
```

### 3 消息发送失败处理

Producer的send方法本身支持内部重试，重试逻辑如下：

- 至多重试2次。
- 如果同步模式发送失败，则轮转到下一个Broker，如果异步模式发送失败，则只会在当前Broker进行重试。这个方法的总耗时时间不超过sendMsgTimeout设置的值，默认10s。
- 如果本身向broker发送消息产生超时异常，就不会再重试。

以上策略也是在一定程度上保证了消息可以发送成功。如果业务对消息可靠性要求比较高，建议应用增加相应的重试逻辑：比如调用send同步方法发送失败时，则尝试将消息存储到db，然后由后台线程定时重试，确保消息一定到达Broker。

### 4、日志打印

消息发送务必打印SendResult和key字段，send消息方法只要不抛异常，就代表发送成功。发送成功会有多个状态，在sendResult里定义：

```java
public enum SendStatus {
    SEND_OK,
    FLUSH_DISK_TIMEOUT,
    FLUSH_SLAVE_TIMEOUT,
    SLAVE_NOT_AVAILABLE,
}
```

- SEND_OK

消息发送成功。要注意的是消息发送成功也不意味着它是可靠的。要确保不会丢失任何消息，还应启用同步Master服务器或同步刷盘，即SYNC_MASTER或SYNC_FLUSH。

- FLUSH_DISK_TIMEOUT

消息发送成功但是服务器刷盘超时。此时消息已经进入服务器队列（内存），只有服务器宕机，消息才会丢失。消息存储配置参数中可以设置刷盘方式和同步刷盘时间长度，如果Broker服务器设置了刷盘方式为同步刷盘，即FlushDiskType=SYNC_FLUSH（默认为异步刷盘方式），当Broker服务器未在同步刷盘时间内（默认为5s）完成刷盘，则将返回该状态——刷盘超时。

- FLUSH_SLAVE_TIMEOUT

消息发送成功，但是服务器同步到Slave时超时。此时消息已经进入服务器队列，只有服务器宕机，消息才会丢失。如果Broker服务器的角色是同步Master，即SYNC_MASTER（默认是异步Master即ASYNC_MASTER），并且从Broker服务器未在同步刷盘时间（默认为5秒）内完成与主服务器的同步，则将返回该状态——数据同步到Slave服务器超时。

- SLAVE_NOT_AVAILABLE

消息发送成功，但是此时Slave不可用。如果Broker服务器的角色是同步Master，即SYNC_MASTER（默认是异步Master服务器即ASYNC_MASTER），但没有配置slave Broker服务器，则将返回该状态——无Slave服务器可用。



## 2、消费者

### 2.1 消费过程幂等

RocketMQ无法避免消息重复（Exactly-Once），所以如果业务对消费重复非常敏感，务必要在业务层面进行去重处理。可以借助关系数据库进行去重。首先需要确定消息的唯一键，可以是msgId，也可以是消息内容中的唯一标识字段，例如订单Id等。在消费之前判断唯一键是否在关系数据库中存在。如果不存在则插入，并消费，否则跳过。（实际过程要考虑原子性问题，判断是否存在可以尝试插入，如果报主键冲突，则插入失败，直接跳过）

msgId一定是全局唯一标识符，但是实际使用中，可能会存在相同的消息有两个不同msgId的情况（消费者主动重发、因客户端重投机制导致的重复等），这种情况就需要使业务字段进行重复消费。



