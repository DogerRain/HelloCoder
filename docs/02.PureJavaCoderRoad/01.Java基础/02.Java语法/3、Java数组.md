---
title: 3、Java数组
date: 2022-05-24 17:44:33
permalink: /pages/3%E3%80%81Java%E6%95%B0%E7%BB%84
lock: false
categories: 
  - PureJavaCoderRoad
  - Java基础
  - Java语法
tags: 
  - Java
  - 数组
---
## Java 数组

`数组` 是Java中很常见的数据结构。

存储一个整型的数据，我们可以使用以下的方式表示：

```java
int x = 1;
```

如果要存储 10个 、100个不同的整型、布尔型、字符串 数据，如果要定义，是一件效率很低的事情，这时候数组就派上用场了。

## 数组声明

语法：

```java
dataType[] arrays;
//或
dataType arrays[];
```

dataType 表示数据类型，可以是任意类型，arrays是数组的名称。

```java
 String[] StringArrays; //定义一个String 类型的数组
 int[] intArrays;//定义一个int 类型的数组
```

## 创建数组

创建数组的时候，需要指定大小，不然系统不会为它分配内存空间。

```java
int[] intArrays = new int[5]; //指定长度为 5 的数组大小。
intArrays[0] = 100;
intArrays[1] = 200;
```

> Java中数组的起始值下标是从 `0` 开始，末尾下标是 `数组长度-1`，上面的数组范围就是`0~4`

数组所有元素初始化为默认值，如果是 int 数组，那就是 `0` ，如果是 double数组，就是`0.0`，布尔型是`false`；

数组一旦创建后，大小就不可改变。这也是初始化的时候必须声明大小的原因。

可以单独修改数组的某一个值，比如 `intArrays[0] = 100;`

可以使用 `数组名称.length` 获取数组的大小

```java
intArrays.length //5
```

如果数组越界，就会报错：

```java
intArrays[5] =100; //报 java.lang.ArrayIndexOutOfBoundsException
```

数组还可以简写：

```java
int[] intArrays ={100,200};
char[] charArrays ={'a','b','c'};
```

## 多维数组

以二维数组为例：

```java
int[][] intArrays = new int[3][3];
intArrays[0][0] = 1;
intArrays[0][1] = 2;
intArrays[0][2] = 3;
```

`intArrays[0][0]` 表示 第0行0列，你可以理解二维数组是一个矩阵。

下标对应位置：

```
[0][0] 	[0][1] 	[0][2]
[1][0]	[1][1]	[1][2]
[2][0]	[2][1]	[2][2]
```
