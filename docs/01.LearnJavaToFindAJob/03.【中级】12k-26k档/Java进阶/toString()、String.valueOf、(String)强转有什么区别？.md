---
title: valueOf、(String)强转有什么区别？
date: 2022-06-02 11:18:17
lock: false
permalink: /pages/valueOf%E3%80%81(String)%E5%BC%BA%E8%BD%AC%E6%9C%89%E4%BB%80%E4%B9%88%E5%8C%BA%E5%88%AB%EF%BC%9F
categories: 
  - LearnJavaToFindAJob
  - 【中级】12k-26k档
  - Java进阶
tags: 
  - 
  - StringValueOf
  - 强转有区别
---
先说结论：
edis分布式事务锁的原理.md
**1、toString()**

**可能会抛空指针异常**

基本上各自的类都有自己的 toString 方法，以覆盖父类Object的toString方法。

>  注意，必须保证object不是null值，否则将抛出NullPointerException异常。

**2、String.valueOf()**

**推荐使用。**

它不会出现空指针异常，而且是静态的方法，直接通过String调用即可。

> 注意，String.valueOf(null) 返回的是字符串 “`null`”

**3、(String)强转**

**不推荐使用**

（String）是标准的类型转换，将Object类型转为String类型，使用(String)强转时，最好使用instanceof做一个类型检查，以判断是否可以进行强转，否则容易抛出ClassCastException异常。需要注意的是编写的时候，编译器并不会提示有语法错误，所以这个方法要谨慎的使用。



下面讲一下用法和源码：

## 1、toString()

toString() 这个方法，**每个类都不一样**，需要注意的是**基本数据类型是没有 toString()方法 的**（基本数据类型不是类，自然就没有方法可言）

Object 类 的toString()方法是这样的：

```java
public String toString() {
	return getClass().getName() + "@" + Integer.toHexString(hashCode());
}
```

大多数情况下，都会重写Object类的 toString 方法。

 例如 Integer类 的 toString 方法是这样的：

```java
    public static String toString(int i) {
        if (i == Integer.MIN_VALUE)
            return "-2147483648";
        int size = (i < 0) ? stringSize(-i) + 1 : stringSize(i);
        char[] buf = new char[size];
        getChars(i, size, buf);
        return new String(buf, true);
    }
```



所以 toString() 方法，对象如果是null，就会抛出空指针。

## 2、String.valueOf

**String.valueOf 方法可以把任意的 对象、基本数据类型 转换 为一个String对象**。

要注意重载方法：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-202203/image-20210930175313816.png)

常用的源码：

```java
public static String valueOf(Object obj) {
    return (obj == null) ? "null" : obj.toString();
}
```

使用的时候要注意，如果对象为空，返回的是 `null` 字符串 。

使用例子：

```java
Object myObject = null;
System.out.println(String.valueOf(myObject)); //null
Float b = 2.4f;
String.valueOf(b);  // 2.4
System.out.println(String.valueOf(null)); //报错NullPointerException，调用的是String.valueOf(char data[]) 
```



## 3、(String)强转

强转的话，一般很少用到，而且还会报错（RuntimeException 编译不会提示，java.lang.ClassCastException），所以不推荐使用。