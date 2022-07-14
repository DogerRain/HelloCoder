---
title: Deque
date: 2022-05-26 17:03:56
permalink: /pages/Deque
lock: false
categories: 
  - PureJavaCoderRoad
  - Java进阶
  - 集合
tags: 
  - Deque
---
## Deque是什么

**Java堆栈Stack类已经过时，Java官方推荐使用`Deque`替代Stack使用。**

Deque是一个**双端队列接口**，继承自Queue接口，Deque的实现类是LinkedList、ArrayDeque、LinkedBlockingDeque，其中LinkedList是最常用的。

> 双向操作，即Deque会更灵活一点，它两端都可以进出，**集合了Stack和Queue的共同点**

```java
Deque deque = new LinkedList();
```



Deque是一个线性collection，支持在两端插入和移除元素。名称 deque 是“double ended queue（双端队列）”的缩写，通常读为“deck”。

大多数 Deque 实现对于它们能够包含的元素数没有固定限制，但此接口既支持有容量限制的双端队列，也支持没有固定大小限制的双端队列。

此接口定义在双端队列两端访问元素的方法。提供插入、移除和检查元素的方法。

每种方法都存在两种形式：

- 一种形式在操作失败时抛出异常
- 另一种形式返回一个特殊值（null 或 false，具体取决于操作）。 

 ![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210512103923684.png)

举个例子你就明白了：

```java
Deque deque = new LinkedList();
// 以下这两个方法一样，只是通过名字区分
deque.peek(); // 返回特殊值 null
deque.peekFirst(); // 返回特殊值 null
deque.getFirst() //抛出错误 NoSuchElementException
```



**下面是Deque的一些API以及 汇集了 队列、栈的替代方法：**

### 1、与队列一样的FIFO（先进先出）行为：

| **Queue方法** | **等效Deque方法** |
| ------------- | ----------------- |
| add add(e)    | addLast(e)        |
| offer(e)      | offerLast(e)      |
| remove()      | removeFirst()     |
| poll()        | pollFirst()       |
| element()     | getFirst()        |
| peek()        | peekFirst()       |

### 2、与栈一样的 LIFO（后进先出）行为：

| **Stack方法** | **等效Deque方法** |
| ------------- | ----------------- |
| push(e)       | addFirst(e)       |
| pop()         | removeFirst()     |
| peek()        | peekFirst()       |



## 总结：

简而言之，这是一个队列、又是一个栈，即保留了栈的操作方法、又保留了队列的方法，但是又引入了自己的方法名（更容易理解，比如 队列的`element()`方法是是什么意思一般很难想起来，但是Deque用了`removeFirst()`这个名字替代，就很显而易见了）