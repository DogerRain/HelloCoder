---
title: BigDecimal
date: 2022-05-26 17:03:57
permalink: /pages/BigDecimal
lock: false
categories: 
  - PureJavaCoderRoad
  - Java进阶
  - 常用类
tags: 
  - BigDecimal
---
在基本数据类型中，我们可以使用double或者float表示一个浮点数，使用double比较常见，但是在精度要求极高的情况下，比如金额计算，double就会有一个**精度丢失**问题。

eg：

```java
double d =0.03;
double d2 =300.03;
System.out.println(d + d2); 
```

输出：

```java
300.05999999999995
```

各位小伙伴可以尝试一下，两个double的浮点数相加，结果是`300.05999999999995` ，结果理应是  `301.06`。

这就是浮点类型的精度丢失。

> 为什么会有这个问题？
>
> 因为计算机中表示的数据是二进制的 0和1，而不是所有的浮点数都能准确地用二进制表示的。



所以我们在运算**高精度**的数据的时候，可以使用 `java.math.BigDecimal` 类

`BigDecimal`可以表示一个任意大小且精度完全准确的浮点数。



## BigDecimal使用介绍

### 1、初始化

```java
BigDecimal num12 = new BigDecimal("0.005");
BigDecimal num22 = new BigDecimal("1000000");
BigDecimal num32 = new BigDecimal("-1000000");
```

### 2、加、减、乘、除

```java
// 加法
BigDecimal result1 = num1.add(num2);
// 减法
BigDecimal result2 = num1.subtract(num2);
// 乘法
BigDecimal result3 = num1.multiply(num2);
// 除法
BigDecimal result5 = num2.divide(num1,20,BigDecimal.ROUND_HALF_UP);
// 绝对值
BigDecimal result4 = num3.abs();
```

这里可以看到，**除法**是需要用到一个舍入模式的参数，因为一旦除不尽，你没有声明舍入模式，结果是会报错的。

### 3、八种舍入模式

 BigDecimal提供了8种舍入方式

1、ROUND_UP： 直接舍入+1


2、ROUND_DOWN： 直接舍去


3、ROUND_CEILING：接近正无穷大的舍入模式。如果 BigDecimal 为正，则舍入行为与 ROUND_UP 相同;如果为负，则舍入行为与 ROUND_DOWN 相同。
注意，此舍入模式始终不会减少计算值。


4、ROUND_FLOOR：接近负无穷大的舍入模式。如果 BigDecimal 为正，则舍入行为与 ROUND_DOWN 相同;如果为负，则舍入行为与 ROUND_UP 相同。
注意，此舍入模式始终不会增加计算值。


5、**ROUND_HALF_UP**：向“最接近的”数字舍入，如果与两个相邻数字的距离相等，则为向上舍入的舍入模式。
如果舍弃部分 >= 0.5，则舍入行为与 ROUND_UP 相同;否则舍入行为与 ROUND_DOWN 相同。
注意，这是我们大多数人在小学时就学过的舍入模式(四舍五入)。


6、ROUND_HALF_DOWN：向“最接近的”数字舍入，如果与两个相邻数字的距离相等，则为上舍入的舍入模式。
如果舍弃部分 > 0.5，则舍入行为与 ROUND_UP 相同;否则舍入行为与 ROUND_DOWN 相同(五舍六入)。


7、ROUND_HALF_EVEN：向“最接近的”数字舍入，如果与两个相邻数字的距离相等，则向相邻的偶数舍入。
如果舍弃部分左边的数字为奇数，则舍入行为与 ROUND_HALF_UP 相同;
如果为偶数，则舍入行为与 ROUND_HALF_DOWN 相同。
注意，在重复进行一系列计算时，此舍入模式可以将累加错误减到最小。
此舍入模式也称为“银行家舍入法”，主要在美国使用。四舍六入，五分两种情况。如果前一位为奇数，则入位，否则舍去。以下例子为保留小数点1位，那么这种舍入方式下的结果。
1.15>1.2 1.25>1.2


8、ROUND_UNNECESSARY：断言请求的操作具有精确的结果，因此不需要舍入。如果对获得精确结果的操作指定此舍入模式，则抛出ArithmeticException。



**ROUND_HALF_UP** 常用，表示四舍五入。