---
title: Stack
date: 2022-05-26 17:03:56
permalink: /pages/Stack
lock: false
categories: 
  - PureJavaCoderRoad
  - Java进阶
  - 集合
tags: 
  - Stack
---
## Stack介绍

栈是`Vector`的一个子类，它实现了一个标准的**后进先出**的栈。

```java
public class Stack<E> extends Vector<E> {
```

> 和队列Queue恰好相反，队列是先进先出

Vector是通过数组实现的，这就意味着，**Stack也是通过数组实现的**，**而非链表**。

Stack的继承关系：

```java
java.lang.Object
↳     java.util.AbstractCollection<E>
   ↳     java.util.AbstractList<E>
       ↳     java.util.Vector<E>
           ↳     java.util.Stack<E>
```

**Stack和Collection的关系如下图**：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/1112483-20190706143228825-1406445944.png)

## Stack  的API

| 序号 | 方法描述                                                     |
| :--- | :----------------------------------------------------------- |
| 1    | boolean empty()  测试堆栈是否为空。                          |
| 2    | Object peek( ) 查看堆栈顶部的对象，但不从堆栈中移除它。      |
| 3    | Object pop( ) 移除堆栈顶部的对象，并作为此函数的值返回该对象。 |
| 4    | Object push(Object element) 把项压入堆栈顶部。               |
| 5    | int search(Object element) 返回对象在堆栈中的位置，以 1 为基数。 |



使用例子：

```java
public class StackTest {
    public static void main(String[] args) {
        Stack<String> stack = new Stack<>();
        stack.add("0");
        stack.add("1");
        stack.add("2");
        stack.add("3");
        while (stack.size()>0){
            System.out.print(stack.pop()+" ");
        }
    }
}
```

控制台输出：

```
3 2 1 0 
```


