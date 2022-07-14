---
title: 2、Java数据变量和类型
date: 2022-05-24 17:44:33
permalink: /pages/2%E3%80%81Java%E6%95%B0%E6%8D%AE%E5%8F%98%E9%87%8F%E5%92%8C%E7%B1%BB%E5%9E%8B
lock: false
categories: 
  - PureJavaCoderRoad
  - Java基础
  - Java语法
tags: 
  - Java
  - 数据变量
  - 类型
---
Java的变量的类型分为两种

- 基本数据类型
- 引用数据类型

变量，就像数学的表达式一样， y = x + 1，y 和 x 都是变量。

在Java中，变量必须先定义后使用。



## 基本数据类型

再来回顾一下java的8大基本数据类型。

8种基本数据按类型分可以分为

- 4个 整数型：byte、short、int、long
- 2个浮点型：float、double
- 1个字符类型：char
- 1个布尔型：boolean

| 基本数据类型 | 默认值   | 大小（字节） | 取值范围     | 示例            |
| ------------ | -------- | ------------ | ------------ | --------------- |
| byte         | 0        | 1            | -2^7—2^7-1   | byte a=10;      |
| boolean      | false    | 1            | true\false   | boolean b=true; |
| char         | '\u0000' | 2            | 0—2^16-1     | char c='c';     |
| short        | 0        | 2            | -2^15—2^15-1 | short d=10;     |
| int          | 0        | 4            | -2^31—2^31-1 | int e=10;       |
| long         | 0        | 8            | -2^63—2^63-1 | long f=10L;     |
| float        | 0.0f     | 4            | -2^31—2^31-1 | float g=10.0F;  |
| double       | 0.0d     | 8            | -2^63—2^63-1 | double h=10.0;  |

> 1KB = 1024Bytes(字节)，1 Bytes = 8 Bit (位)
>
> 计算机内存的最小存储单元是字节（byte），一个字节就是一个8位二进制数，即8个Bit 。它的二进制表示范围从`00000000`~`11111111`，换算成十进制是0~255，换算成十六进制是`00`~`ff`。

### int

整数型，简称 整型，就是表示整数型的数据，int是最常见的整型数据，也是Java中默认的整型数据。

定义一个int的数据类型：

```java
int  x = 10;
```

> `=` 在 Java中表示赋值的意思

就这样一个 名称 为 `x` 的 `int` 类型数据就定义了，赋予的值是`10`，如果不写初始值，就相当于给它指定了默认值。默认值总是`0`。

既然是变量，会变才行，Java的变量确实会变，特点是可以重新赋值。

```java
int  x = 10;
x = 20;
```

`x`被重新赋值后，就变成 `20` 了。

因为 `x` 已经被赋予了一个int类型的名称，那么`x`就不能重新定义了：

```java
int  x = 10;
x = 20;
int x = 30; //报错，提示变量x已经定义了
```

变量还可以赋值给其他变量，称为 **值传递**：

```java
int x = 100;
System.out.println(x);
int y = x; // 新建一个 y 变量，赋值为 x，即 100
x = 200;  // x 重新赋值
System.out.println(x); //打印x
System.out.println(y);//打印y ， y并没有受到x重新赋值的影响
```

输出结果：

```
100
200
100
```

`x` 、`y` 的赋值过程其实是这样的：

![](F:\笔记\docsifyLearnJavaToFindAJob\docs\articles\Java基础\Java基础\picture\image-20210106145934674.png)

> 在Java的底层， x、100 都有属于存储他们的地址，该地址的值会指向存储的值

### short 、long、byte

short 是 int 的缩小版，long 是 int 的加长版，byte是 int 的mini版，区别就是范围不同。

> 为了区分整型int，ong 的后缀可以加上`大写字母L`或者`小写字母l`，为了和`数字1` 区分开，还是用大写字母L规范一点。

```java
short x = 100;
long y = 1000L; //后缀 加上大写字母L
byte z = 1;
```



### float、double

整型表示的是整数，如果要表示小数，可以使用 float、double。

```java
float x = 5.0f; //后缀 加上 小写字母f 或者 大写字母F
double y = 2.0d; //后缀 加上 小写字母d 或者 大写字母D
```

> Java规定，默认的整型是int，默认的浮点数是double，为了区分到底是`double`还是`float`，Java提供后缀 `d` 和 `f`

所以说，如果写成这样是会报错的：

```java
float z = 10.0; //报错，如果不加后缀表示是double的，但前面声明了float 是会报错的
```

### boolean

boolean表示 `真` 或者 `假`，只有两个取值：`true` 、`false`。

```java
boolean flag = true;
// boolean flag =false;
```



### 类型转换与强转

既然都是数据类型，那可不可以相互转换呢？

答案是可以的，但是要注意一个精度丢失问题

不同类型的数据在运算的时候，会自动向高精度的数据类型转换。如图：

![ ](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201109140944146.png)

**自动转换：**

eg：

```java
int x = 1;
double y = x;
System.out.println(y); // 1.0
```

如果高精度向低精度转换时，需要**强转**

```java
double x = 1.7;
int y =(int) x; //当然 long y = (long) x 也是一样的道理;
System.out.println(y); // 1
```

可以在数据前面使用`(int)`进行强转转换，因为 double是相对高精度，int 是相对低精度，强转就会**丢失精度**。

> int 只能表示正数，只会保留整数位，并不是四舍五入。



变量是可以使用 `修饰符` 修饰的：

eg：

```java
int x = 1;
static int y = 2;
static final int z = 3;
```



## 引用数据类型

引用数据类型，先学完数组和面向对象再详细讲一下。

