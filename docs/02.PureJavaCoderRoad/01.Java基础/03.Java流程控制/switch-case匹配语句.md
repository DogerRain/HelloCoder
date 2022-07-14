---
title: switch-case匹配语句
date: 2022-05-24 17:44:33
permalink: /pages/switch-case%E5%8C%B9%E9%85%8D%E8%AF%AD%E5%8F%A5
lock: false
categories: 
  - PureJavaCoderRoad
  - Java基础
  - Java流程控制
tags: 
  - switchcase
  - 匹配语句
---
switch case 合理运用可以降低if-else的工作量。

## switch case匹配语句

语法结构：

```java
switch(expression){
    case value :
       //语句
       break; //可选
    case value :
       //语句
       break; //可选
    //你可以有任意数量的case语句
    default : //可选
       //语句
}
```

switch的规则：

switch 语句中的变量类型可以是（即上面的expression）： byte、short、int 或者 char。

> 从 Java SE 7 开始，switch 支持字符串 String 类型了

switch 语句可以拥有多个 case 语句。每个 case 后面跟一个要比较的值和冒号。且case后面必须是常量

当变量的值与 case 语句的值相等时，case 语句开始执行，**直到 break 语句出现才会跳出 switch 语句。**（所以说如果没有break会一直执行）

> break 和 default 是非必须的。default是没有匹配就会执行

switch-case例子：

```java
String grade = "B";
switch (grade) {
    case "A":
        System.out.println("优秀");
        break;
    case "B":
    case "C":
        System.out.println("良好");
        break;
    case "D":
        System.out.println("及格");
        break;
    case "F":
        System.out.println("不及格");
        break;
    default:
        System.out.println("回家小心点");
}
```

输出：

```
良好
```



如果语句没有break，会输出配到到第一个case以及往下的所有case，直到遇到第一个case。

eg2：

```java
int i = 1;
switch(i){
    case 0:
        System.out.println("0");
    case 1:
        System.out.println("1");
    case 2:
        System.out.println("2");
    default:
        System.out.println("default");
}
```

输出：

```
1
2
default
```

