---
title: IBM面试题-不借助变量交换两个数
date: 2022-06-02 11:18:20
lock: false
permalink: /pages/IBM%E9%9D%A2%E8%AF%95%E9%A2%98-%E4%B8%8D%E5%80%9F%E5%8A%A9%E5%8F%98%E9%87%8F%E4%BA%A4%E6%8D%A2%E4%B8%A4%E4%B8%AA%E6%95%B0
categories: 
  - LearnJavaToFindAJob
  - 大厂面试题
tags: 
  - IBM
  - 面试题
---
一群里的小伙伴去IBM面试，面试官上来就问了一道开胃菜题目：**不借助变量如何交换两个数？**

这是一道比较简单的题目，但是也颇有意思，如果大家平时有刷LeetCode的习惯，第一次做这个题目应该也能做出来。

平时我们要交换一个数的时候，都是引入一个第三方变量，这样看起来也比较通俗易懂。

但既然强制不能引入新的变量，那应该怎么做呢？

- 方法一，通过**和**去 相减，**交换数的和**是不会变的
- 方法二，异或，一个数异或两次一个相同的数，等于本身 比如说 `5^13^13 = 5`

```java
public class 交换两个数 {

    public static void main(String[] args) {
        exchangeNum1(5, 8);
        System.out.println("-----------");
        exchangeNum2(5, 8);
    }

    static void exchangeNum1(int x, int y) {
        System.out.println("x的值为：" + x);
        System.out.println("y的值为：" + y);
        x = x + y;
        y = x - y;
        x = x - y;
        System.out.println("------交换后------");
        System.out.println("x的值为：" + x);
        System.out.println("y的值为：" + y);

    }

    static void exchangeNum2(int x, int y) {
//        ^ 异或，位相同为0，不同为1 , 可以理解为相加，但是不进位，结果要么是和，要么是差
        //
        System.out.println("x的值为：" + x);
        System.out.println("y的值为：" + y);
        x = x ^ y; // 5 ^ 8 = 0101 ^ 1000 = 1101 = 13
        y = x ^ y; //13 ^ 8 = 1101 ^ 1000 = 1000 = 5
        x = x ^ y; //13 ^ 8 = 1101 ^ 0101 = 1000 = 8
        System.out.println("------交换后------");
        System.out.println("x的值为：" + x);
        System.out.println("y的值为：" + y);
    }
}
```



这两种方法，更好的是第二种——异或，因为**加减有溢出的可能性**，（同样还可以使用乘除），也是面试的时候需要指出的隐患。

