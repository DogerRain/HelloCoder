---
title: Math类
date: 2022-05-26 17:03:57
permalink: /pages/Math%E7%B1%BB
lock: false
categories: 
  - PureJavaCoderRoad
  - Java进阶
  - 常用类
tags: 
  - Math
---
`java.lang.Math` 是Java库提供的一个计算数学相关的类。

包括 指数、对数、随机数、平方根、三角函数等等。



### 1、求绝对值

```java
Math.abs(-10); // 10
```

### 2、取最大或最小值

```java
Math.max(100, 1); // 100
Math.min(1.2, 2.3); // 1.2
```

### 3、计算x^y次方

```java
Math.pow(2, 3); // 2的3次方 8
```

### 4、计算√x

```java
Math.sqrt(4) // 2
```

### 5、三角函数

```
Math.sin(3.14); // 0.00159...
Math.cos(3.14); // -0.9999...
Math.tan(3.14); // -0.0015...
Math.asin(1.0); // 1.57079...
Math.acos(1.0); // 0.0
```

计算以e为底的对数：

```
Math.log(4); // 1.386...
```

计算以10为底的对数：

```
Math.log10(100); // 2
```

### 6、常量

Math还提供了几个数学常量：

```
double pi = Math.PI; // 3.14159...
double e = Math.E; // 2.7182818...
Math.sin(Math.PI / 6); // sin(π/6) = 0.5
```

### 7、随机数

#### 不带种子

生成一个随机数x，x的范围是`0 <= x < 1`：

```
Math.random(); // 0.53907... 每次都不一样
```

`random()函数`默认是返回一个double的浮点类型的随机数，其范围是：`[ 0 , 100 )`

**如果要指定范围**，这里指定`[ 0 , 100 )`，可以这样写：

```java
int num = (int) (Math.random() * 100); // 注意不要写成(int)Math.random()*3，这个结果为0，因为先执行了强制转换
```

还可以这样写，通过`nextInt()` 指定范围，同时输出一个整型的随机数，**每次执行都是不一样的结果：**

```java
Random randNoSeed = new Random();
for (int i = 0; i < 10; i++)
    System.out.print(randNoSeed.nextInt(100)+" ");
```



#### 带种子

 Java中生成随机数，也是通过某一种算法实现的，其真正意义上，不是随机数，只是通过一种算法实现的伪随机数。

带种子的：

```java
Random randSeed = new Random(47);
for (int i = 0; i < 10; i++)
    System.out.print(randSeed.nextInt(100) +" ");
```



以上第一次执行都是输出：

```
58 55 93 61 61 29 68 0 22 7 
```

第二次执行输出：

```
58 55 93 61 61 29 68 0 22 7 
```

你会发现**每次执行，输出都是同样的一组数字**。

所以说随机数也是按照某种算法进行的，只要给一个初始值，同一台机器上每次都是相同的结果。

> 参考：https://www.liaoxuefeng.com/wiki/1252599548343744/1260473555087392