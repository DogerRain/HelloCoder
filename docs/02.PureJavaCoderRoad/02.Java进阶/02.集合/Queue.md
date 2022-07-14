---
title: Queue
date: 2022-05-26 17:03:56
permalink: /pages/Queue
lock: false
categories: 
  - PureJavaCoderRoad
  - Java进阶
  - 集合
tags: 
  - Queue
---
## Queue介绍

Queue 是我们常说的队列，队列是一种**先进先出**的数据结构，元素在队列末尾添加，在队列头部删除。

Queue接口扩展自Collection，并提供插入、提取、检验等操作。



## Queue 接口的API

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210407113029806.png)

`add()`、`offer()`表示向队列添加一个元素

`poll()`与`remove()`方法都是**移除队列头部的元素并返回该元素**

> 两者的区别在于如果队列为空，那么poll()返回的是null，而remove()会抛出一个NoSuchElementException异常。

`element()`与`peek()`主要是**获取头部元素，不删除**。

> 以上6个方法，规律就是 同一个功能有两个方法，区别就是是否抛出异常

|          | 抛出异常  | **返回特殊值** |
| -------- | --------- | -------------- |
| **插入** | add(e)    | offer(e)       |
| **删除** | remove()  | poll()         |
| **检查** | element() | peek()         |



## Queue 接口的实现类

Queue 接口的实现类的实现类比较多。常见的有：

- LinkedList
- PriorityQueue
- CustomLinkedQueue
- DelayQueue

LinkedList支持在两端插入和删除元素，因为LinkedList类实现了Deque接口，所以通常我们可以使用LinkedList来创建一个队列。

> LinkedList底层是双向链表的结构，得益于实现了Deque

PriorityQueue类实现了一个优先队列，优先队列中元素被赋予优先级，拥有高优先级的先被删除。

```java
public class QueueTest {
    public static void main(String[] args) {
        Queue<String> queue = new LinkedList<String>();
        queue.add("1");
        queue.add("2");
        queue.add("3");
        queue.add("3");
        queue.offer("0");
        while (queue.size()>0){
            System.out.print(queue.remove()+" ");
        }
    }
}
```

控制台打印：

```
1 2 3 3 0 
```



## 总结：

Queue 是一个**先进先出**的数据结构，常见的用法是

```java
Queue<String> queue2 = new LinkedList<String>();
```

在使用方法时，只有6个API，可以看情况是否需要抛出异常进行选择。