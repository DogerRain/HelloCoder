---
title: 谈谈你对CAS的理解
date: 2022-06-02 11:18:21
lock: false
permalink: /pages/%E8%B0%88%E8%B0%88%E4%BD%A0%E5%AF%B9CAS%E7%9A%84%E7%90%86%E8%A7%A3
categories: 
  - LearnJavaToFindAJob
  - 【中级】12k-26k档
  - Java进阶
tags: 
  - CAS
  - 谈谈你对
  - 理解
---
## CAS(Compare And Swap)

## 一、CAS是什么？

CAS 的全称是 Compare And Swap（比较与交换） ，用于实现乐观锁，被广泛应用于各大框架中。CAS 的思想很简单，就是用一个预期值和要更新的变量值进行比较，两值相等才会进行更新。

**CAS是CPU的原子指令**，实现**无锁并发**的核心技术。它的工作模式是：

```javascript
// 逻辑伪代码（不是真实实现）
boolean compareAndSwap(address, expectedValue, newValue) {
    if (*address == expectedValue) {  // 1. 比较：当前值是否等于预期值
        *address = newValue;           // 2. 交换：如果是，更新为新值
        return true;                    // 3. 成功返回true
    }
    return false;                       // 4. 失败返回false
}
```



**一句话概括**：**"我认为现在的值是A，如果是，就改成B，不是就不改"**



确点来说，Java 中 CAS 是 C++ 内联汇编的形式实现的，通过 JNI（Java Native Interface） 调用。因此，CAS 的具体实现与操作系统以及 CPU 密切相关。

CAS 虽然具有高效的无锁特性，但也需要注意 ABA 、循环时间长开销大等问题。



## 二、为什么需要CAS？

### 传统锁的问题

```java
public class CounterProblem {
    private int count = 0;
    
    // 方案1：synchronized（悲观锁）
    public synchronized void increment() {
        count++;  // 即使没有竞争，也要加锁
    }
    
    // 方案2：CAS（乐观锁）
    private AtomicInteger atomicCount = new AtomicInteger(0);
    public void increment() {
        atomicCount.incrementAndGet();  // 无锁，失败重试
    }
}
```



### 对比

| 维度           | synchronized            | CAS                    |
| :------------- | :---------------------- | :--------------------- |
| **思想**       | 悲观（先锁再干）        | 乐观（先干不行再重试） |
| **开销**       | 线程挂起/唤醒（重量级） | 自旋（轻量级）         |
| **竞争激烈**   | 好（线程让出CPU）       | 差（CPU空转）          |
| **竞争不激烈** | 差（不必要切换）        | 好（无上下文切换）     |

## 三、CAS的三个核心操作数



```java
public class CASComponents {
    // 1. 内存地址 V（要操作的位置）
    // 2. 预期值 A（我认为现在是什么）
    // 3. 新值 B（我想改成什么）
    
    private AtomicInteger value = new AtomicInteger(0);
    
    public void increment() {
        // 底层调用 Unsafe.compareAndSwapInt
        int expect;
        int update;
        do {
            expect = value.get();           // 读取当前值
            update = expect + 1;             // 计算新值
        } while (!value.compareAndSet(expect, update));  // CAS尝试
    }
}
```



## 四、CAS在Java中的实现



### 1. **Unsafe类** - CAS的底层入口

`sun.misc`包下的`Unsafe`类提供了`compareAndSwapObject`、`compareAndSwapInt`、`compareAndSwapLong`方法来实现的对`Object`、`int`、`long`类型的 CAS 操作：

```java
public final class Unsafe {
    // native方法，直接调用CPU指令
    public final native boolean compareAndSwapObject(
        Object obj, long offset, Object expect, Object update);
    
    public final native boolean compareAndSwapInt(
        Object obj, long offset, int expect, int update);
    
    public final native boolean compareAndSwapLong(
        Object obj, long offset, long expect, long update);
}
```



`java.util.concurrent.atomic` 包提供了一些用于原子操作的类。

![](http://rainyudianxx.baimuxym.cn/hellocoder/image-20260603115158935.png)

### 2. **CPU指令支持**



```assembly
; x86架构的CMPXCHG指令
lock cmpxchg [addr], eax  ; 原子的比较并交换
; lock前缀保证原子性
; eax寄存器存预期值
; 如果相等，ZF=1，目标操作数←源操作数
; 如果不相等，ZF=0，累加器←目标操作数
```



## 五、CAS的经典应用

### 1. **原子类（AtomicInteger等）**



```java
public class AtomicIntegerDemo {
    private AtomicInteger counter = new AtomicInteger(0);
    
    public int increment() {
        // 实现原理：CAS自旋
        return counter.incrementAndGet();
    }
    
    public int add(int delta) {
        // 典型CAS模式
        int current, next;
        do {
            current = counter.get();
            next = current + delta;
        } while (!counter.compareAndSet(current, next));
        return next;
    }
}
```



### 2. **并发容器（ConcurrentHashMap）**



```java
// ConcurrentHashMap中的CAS使用
static final <K,V> Node<K,V> tabAt(Node<K,V>[] tab, int i) {
    return (Node<K,V>)U.getObjectAcquire(tab, ((long)i << ASHIFT) + ABASE);
}

static final <K,V> boolean casTabAt(Node<K,V>[] tab, int i,
                                    Node<K,V> c, Node<K,V> v) {
    // CAS更新数组元素，无锁并发
    return U.compareAndSetObject(tab, ((long)i << ASHIFT) + ABASE, c, v);
}
```



### 3. **锁的实现（AQS）**



```java
// AbstractQueuedSynchronizer中的CAS
private static final long stateOffset;

static {
    try {
        stateOffset = unsafe.objectFieldOffset
            (AbstractQueuedSynchronizer.class.getDeclaredField("state"));
    } catch (Exception ex) { throw new Error(ex); }
}

protected final boolean compareAndSetState(int expect, int update) {
    // CAS更新AQS状态
    return unsafe.compareAndSwapInt(this, stateOffset, expect, update);
}
```

