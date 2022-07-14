---
title: ThreadLocal的原理
date: 2022-06-02 11:18:17
lock: false
permalink: /pages/ThreadLocal%E7%9A%84%E5%8E%9F%E7%90%86
categories: 
  - LearnJavaToFindAJob
  - 【中级】12k-26k档
  - Java进阶
tags: 
  - ThreadLocal
  - 原理
---
## 1、什么是ThreadLocal ？为什么要用ThreadLocal ？

ThreadLocal 的作用：**为了通过本地化资源来避免共享，避免了多线程竞争导致的锁等消耗。**



举个例子：

1、比如说我现在有多个线程，需要累加一个变量，那么这个变量就需要加锁，因为多个线程会修改一个值，不然最终的累加结果就有问题。这是个资源共享的例子。

2、来个不需要资源共享的例子，比如各自的线程都需要获取某个用户的权限信息，然后进行存储，那么我们可以在这个线程里面定义一个 `List<权限>` ，当然啦这样每个线程进来了都要 new 一个 `List<权限>` 去存储，如果使用 ThreadLocal  就不用这么复杂了。

看一下代码就知道了：

```java
	   ThreadLocal<Integer> threadLocal = new ThreadLocal<>();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try{
                    threadLocal.set(1); //模拟设置权限
                    System.out.println(threadLocal.get());
                }finally {
                    threadLocal.remove();
                }
            }
        }, "Thread1").start();

        new Thread(new Runnable() {
            @Override
            public void run() {
                threadLocal.set(2);
                System.out.println(threadLocal.get());
            }
        }, "Thread2").start();


        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println(threadLocal.get());
            }
        }, "Thread3").start();
```

输出：

```
1
2
null
```

所以每个线程虽然都是使用了 `threadLocal` ，但是各自的线程set、get 的值却是对其他线程不可见的。

每个线程维护自己的变量，互不干扰，实现了变量的线程隔离，同时也满足存储多个本地变量的需求。



## 2、ThreadLocal 的原理

Thread 对象里面有个 ThreadLocalMap ，而这个 ThreadLocalMap ，就是存储本地变量的核心。

ThreadLocalMap 是一个内部类。

```java
 static class ThreadLocalMap {
        static class Entry extends WeakReference<ThreadLocal<?>> {
            Object value;

            Entry(ThreadLocal<?> k, Object v) {
                super(k);
                value = v;
            }
        }
```

这个 Entry  和 HashMap有点类似。这个 Entry 又继承了 WeakReference 弱引用。

> Entry的构造方法有一个super(k)，这里的  key 才是弱引用，而不是整个 Entry 是弱引用。

`threadLocalName.set()` 方法：

```java
private void set(ThreadLocal<?> key, Object value) {
            Entry[] tab = table;
            int len = tab.length;
            int i = key.threadLocalHashCode & (len-1); //获取 hash 值

            for (Entry e = tab[i];
                 e != null;
                 e = tab[i = nextIndex(i, len)]) { //如果Entry数组的下标位置不为空，就返回，如果为空，就下一个
                ThreadLocal<?> k = e.get();

                if (k == key) { //找到了 k ，就返回value
                    e.value = value;
                    return;
                }

                if (k == null) {
                    replaceStaleEntry(key, value, i);
                    return;
                }
            }

            tab[i] = new Entry(key, value); //new 一个 坑位把 i 位置占用了
            int sz = ++size;
            if (!cleanSomeSlots(i, sz) && sz >= threshold)
                //扩容
                rehash();
        }
```

这个逻辑和 HashMap的还真的有点不一样。

先通过 key 的 hash 值计算出一个数组下标，如果被占了看看是否就是要找的 Entry 。

- 如果是则进行更新

- 如果不是则 下标++，即往后遍历数组，查找下一个位置，找到空位就 new 个 Entry 然后把坑给占用了。

`threadLocalName.get()` 方法：

```java
public T get() {
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t);
        if (map != null) {
            ThreadLocalMap.Entry e = map.getEntry(this);
            if (e != null) {
                @SuppressWarnings("unchecked")
                T result = (T)e.value;
                return result;
            }
        }
        return setInitialValue();
    }
```

 `Thread.currentThread()` 就是 ThreadLocalMap 的 key，然后从ThreadLocalMap 中找到 Entry，最终返回 Entry 里面的 value 值。

`getEntry` 获取数组的方法：

```java
private Entry getEntry(ThreadLocal<?> key) {
    int i = key.threadLocalHashCode & (table.length - 1);
    Entry e = table[i];
    if (e != null && e.get() == key)
        return e;
    else
        return getEntryAfterMiss(key, i, e);
}

private Entry getEntryAfterMiss(ThreadLocal<?> key, int i, Entry e) {
    Entry[] tab = table;
    int len = tab.length;

    while (e != null) {
        ThreadLocal<?> k = e.get();
        if (k == key)
            return e;
        if (k == null)
            expungeStaleEntry(i);
        else
            i = nextIndex(i, len);
        e = tab[i];
    }
    return null;
}
```

如果通过 key 的哈希值得到的下标无法直接命中，则会将下标 +1，即继续往后遍历数组查找 Entry ，直到找到或者返回 null。



## 3、ThreadLocal 会造成内存泄漏，为什么还要用弱引用？

GC 的时候，只要是弱引用，就一定会回收。

之前提到过，Entry 对 key 是弱引用，所以GC的时候，就一定会把 ThreadLocal 对象 清理掉。

那为什么 要把 ThreadLocal 回收呢？

我们平时用的线程，一般都是使用线程池，比如 Tomcat、jetty，但是一般来说，线程池的线程一般都是不会清理的，而且还会复用。它并不像我们平时使用的普通线程一样，处理结束了，线程就被处理了。



借用一张图：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-202109/image-20210906113155324.png)

如果设置成强引用，即上图的下面这条调用链，那每次GC的时候，它也不会被回收，内存泄漏就更严重了。

而设置成弱引用，当方法调用结束，`栈-->堆` 断开，GC的时候 ，ThreadLocal 对象就会被回收，key 也回收，虽然 value 没办法回收，也会造成内存泄漏，但是风险却没有强引用这么高。



总结来说就是**为了减少严重内存泄漏的风险**。

既然有这个内存泄漏的风险，ThreadLocal 提供了`remove`方法，我们只需要在用完 set、get 后，调用 remove 方法即可，它会把Entry的value 设置为 null 。



