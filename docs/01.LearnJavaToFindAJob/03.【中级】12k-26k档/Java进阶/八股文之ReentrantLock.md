---
title: 八股文之ReentrantLock
date: 2022-06-02 11:18:17
lock: false
permalink: /pages/%E5%85%AB%E8%82%A1%E6%96%87%E4%B9%8BReentrantLock
categories: 
  - LearnJavaToFindAJob
  - 【中级】12k-26k档
  - Java进阶
tags: 
  - ReentrantLock
  - 八股文之
---
## ReentrantLock的原理是什么？

“`ReentrantLock` 是 java.util.concurrent 包下基于 AQS 实现的可重入互斥锁。**，通过一个volatile的state状态变量和一个CLH变体的双向等待队列来实现可重入的独占锁。**它主要用于替代 `synchronized`，但在功能上更加灵活和强大。”





## 核心实现机制

`ReentrantLock` 的核心原理可以概括为：**AQS 框架 + CAS 原子操作 + `state` 状态机**

1、AQS (AbstractQueuedSynchronizer)

AQS 维护了一个 volatile int state（同步状态）和一个 FIFO（先进先出）的线程等待队列（CLH 队列）。

> CLH锁其实就是一种基于逻辑队列非线程饥饿的一种自旋公平锁。当多线程竞争一把锁时，获取不到锁的线程，会排队进入CLH队列的队尾，然后自旋等待，直到其前驱线程释放锁。

作用：AQS 负责管理阻塞队列、唤醒线程、维护同步状态，是锁的底层基础设施。

2、 **CAS操作**：

通过Unsafe类的CAS保证state变更的原子性（无锁原子算法）

 

3、state **状态管理**：

使用一个`volatile int state`变量表示锁状态

   - `state = 0`：锁空闲
   - `state > 0`：锁被占用，重入次数
4. **等待队列**：基于CLH队列变体的双向链表，保存等待获取锁的线程



## 加锁流程

非公平锁流程：

> “先CAS插队抢一次，抢不到再走 AQS 排队流程。

步骤 1: 尝试 CAS 抢占（非公平插队）, AQS 的 `state` 状态从 `0` 变为 `1`。

步骤 2: 插队失败后，再次尝试及进入 AQS 核心流程，线程会进入 AQS 的 `acquire(1)`

步骤3: 还是失败，将线程包装成Node加入等待队列，进入自旋，不断尝试获取锁或挂起等待



![](http://rainyudianxx.baimuxym.cn/HelloCoder/blog/reentrantLock-lock-process.png)





公平锁：

![](http://rainyudianxx.baimuxym.cn/HelloCoder/blog/image-20251202164323970.png)



## 与synchronized对比的优势

1. **可中断**：支持`lockInterruptibly()`，等待锁时可响应中断
2. **超时机制**：支持`tryLock(timeout)`，避免无限等待
3. **公平选择**：可选择公平或非公平策略
4. **多条件**：一个锁可以关联多个Condition



## 公平和非公平锁



非公平锁是“先抢再说”。它不关心队列里有没有人，先抢一把，抢不到再排队。

公平锁是“先排队等候”。它确保了等待时间最长的线程优先获取锁。



| **特性**     | **非公平锁（默认）**        | **公平锁**                        |
| ------------ | --------------------------- | --------------------------------- |
| **抢锁时机** | 立即尝试 CAS 抢锁（插队）。 | 只有在队列为空时才尝试 CAS 抢锁。 |
| **队列检查** | 不检查队列，直接尝试抢。    | 严格检查队列，若有人排队则排队。  |
| **性能**     | 吞吐量高。                  | 吞吐量较低。                      |
| **风险**     | 可能导致排队线程“饥饿”。    | 保证了线程的绝对公平性。          |
| **设计理念** | 追求高性能。                | 追求严格的公平性。                |



获取锁时的行为差异：

| 场景           | 公平锁 (FairSync)                            | 非公平锁 (NonfairSync)            |
| :------------- | :------------------------------------------- | :-------------------------------- |
| **锁空闲时**   | 先检查队列是否有等待者 有则排队，无则尝试CAS | 直接尝试CAS抢锁                   |
| **锁被持有时** | 加入队列末尾等待                             | 直接尝试一次tryAcquire 失败才入队 |
| **唤醒后**     | 严格按照队列顺序                             | 新线程可能"插队"抢锁              |

### 公平锁

公平锁核心：

```java
// FairSync.tryAcquire() 方法的关键部分
protected final boolean tryAcquire(int acquires) {
    final Thread current = Thread.currentThread();
    int c = getState();
    
    if (c == 0) {  // 锁空闲时
        // ↓↓↓ 公平性的关键检查 ↓↓↓
        if (!hasQueuedPredecessors() &&  // 检查是否有前驱等待者
            compareAndSetState(0, acquires)) {
            setExclusiveOwnerThread(current);
            return true;
        }
    }
    // 重入逻辑与非公平锁相同...
    return false;
}

// 判断队列中是否有前驱等待者
public final boolean hasQueuedPredecessors() {
    Node t = tail;  // 尾节点
    Node h = head;  // 头节点
    Node s;
    
    // 三种情况返回true（表示有前驱等待者）：
    // 1. h != t 且 (h.next == null)      -> 有其他线程正在入队
    // 2. h != t 且 s.thread != current  -> 队首不是当前线程
    // 3. h == t                          -> 队列为空（实际上不会执行到这里）
    
    return h != t && 
           ((s = h.next) == null || s.thread != Thread.currentThread());
}
```





公平锁的公平性依赖于**AQS的FIFO等待队列**：

1. **入队顺序**：严格按照请求锁的时间顺序
2. **出队顺序**：严格按照入队顺序
3. **唤醒机制**：只唤醒队首线程

```xml
// 等待队列结构示意
HEAD → Node(Thread1) → Node(Thread2) → Node(Thread3) → TAIL
   ↑                                    ↑
持有锁的线程                        最新等待的线程
```



### 非公平锁

非公平锁的锁获取源码如下：

```java
final boolean nonfairTryAcquire(int acquires) {

    final Thread current = Thread.currentThread();
    int c = getState();

    if (c == 0) {
 //这里没有判断 hasQueuedPredecessors() , 直接CAS抢锁
        if (compareAndSetState(0, acquires)) {

            setExclusiveOwnerThread(current);

            return true;

        }

    }

    else if (current == getExclusiveOwnerThread()) {

        int nextc = c + acquires;

        if (nextc < 0) // overflow

        throw new Error("Maximum lock count exceeded");

        setState(nextc);

        return true;

    }

    return false;

}
```



这也就是公平锁和非公平锁的核心区别，如果是公平锁，那么一旦已经有线程在排队了，当前线程就不再尝试获取锁；对于非公平锁而言，无论是否已经有线程在排队，都会尝试获取一下锁，获取不到的话，再去排队。



ReentrantLock 默认是**非公平锁**，因为它允许新来的线程插队尝试 CAS 获取锁，这能利用线程调度的空档期，大幅提升吞吐量。而公平锁严格遵循 FIFO，虽然公平但性能较差。”



**ReentrantLock通过`hasQueuedPredecessors()`方法实现公平性**，在获取锁前先检查是否有更早的等待者。这个简单的检查机制确保了"先来先服务"的原则，但以一定的性能开销为代价。



## tryLock()

当有线程执行 tryLock() 方法的时候，一旦有线程释放了锁，那么这个正在 tryLock 的线程就能获取到锁，即使设置的是公平锁模式，即使在它之前已经有其他正在等待队列中等待的线程，简单地说就是 tryLock 可以插队。

看它的源码就会发现：

```java
public boolean tryLock() {

    return sync.nonfairTryAcquire(1);

}
```

这里调用的就是 nonfairTryAcquire()，表明了是不公平的，和锁本身是否是公平锁无关。综上所述，公平锁就是会按照多个线程申请锁的顺序来获取锁，从而实现公平的特性。