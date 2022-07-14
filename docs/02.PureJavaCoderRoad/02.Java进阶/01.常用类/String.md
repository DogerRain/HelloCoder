---
title: String
date: 2022-05-26 17:03:57
permalink: /pages/String
lock: false
categories: 
  - PureJavaCoderRoad
  - Java进阶
  - 常用类
tags: 
  - String
---
前几章说过，String是一个很特殊的类。

在Java中，`String`是一个引用类型，它本身也是一个`class`。

## String 源码

看一下String的源码：

> 我本地为jdk1.8版本

![final类、char[]数组](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-202112image-20210120173256307.png)

可以看到String是一个final修饰的类，所以String是一个不可变的类。

jdk1.8（含）版本之前，String使用的是char数组，jdk1.9及以后使用的是byte数组。

> 因为开发人员发现人们使用的字符串值是拉丁字符居多而之前使用的char数组每一个char占用两个字节而拉丁字符只需要一个字节就可以存储，剩下的一个字节就浪费了，造成内存的浪费，gc的更加频繁。
>
> 因此在jdk9中将String底层的实现改为了byte数组。

因此：

> 以下都是在方法内的局部变量

```java
class Test {
    public static void main(String[] args) {
        String name1 = "HaC";
        String name2 = new String(new char[] {'H', 'a', 'C'});
        String name3 = new String("HaC");
    }
}
```

这三种写法都是一样的。

首先要明白，String 的值是存放在**常量池**（JVM运行区域的其中一块区域）的，假如String的值被重新赋值了（和八大基本数据类型一样）：

```java
String name1 = "HaC";
name1 = "HelloCoder";
```

它在JVM运行区域是这样的：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-202112image-20210121144951658.png)

> JVM内存区域可以阅读：

首先要知道，JAVA在程序运行时，在内存中划分5片空间进行数据的存储。分别是：

1：寄存器。

2：本地方法区。

3：方法区。

4：栈。

5：堆。

基本数据类型、局部变量都是存放在栈内存中的，用完就消失。

new创建的实例化对象及数组，是存放在堆内存中的，用完之后靠垃圾回收机制不定期自动消除。

**1， 堆：**

存放所有new出来的对象，new出来的类对象是存放在堆中的，而对象包含的成员不管是对象还是基本数据都一起放在堆中的。

new int[]{1,2} // 1、2 都是在堆

**2， 栈**

栈是一种先入后出的数据结构。

存放基本类型的变量数据和对象的**引用**。对象引用即指向对象值的**地址存在栈中**，而**对象值则存放在堆中或者常量池中**（**字符串常量对象存放在常量池中**）

**3，** **常量池**

存放基本类型常量和字符串常量。

 **所以堆与栈的区别很明显：**

1. 栈内存存储的是局部变量而堆内存存储的是全局变量；
2. 栈内存的更新速度要快于堆内存，因为局部变量的生命周期很短；
3. 栈内存存放的变量生命周期一旦结束就会被释放，而堆内存存放的实体会被垃圾回收机制不定时的回收。
4. 栈和常量池中的对象可以共享，堆中的对象不可以共享。

**对于字符串来说，其对象的引用都是存储在栈中，如果是编译期就已建好的（没有new）就存在常量池中，如果是运行期（有new）则存在堆中。**



## String重要的API

### 1、字符串比较

字符串比较有两种方法分别是

- **==**
- **equals**

但是这两者是不一样的，

####  == 

1. 八大基本类型数据，byte,short,char,int,long,float,double,boolean ，==比较的是它们的值。
2. 引用类型(new出来的对象、接口、数组、String)  ，==比较的是他们在内存中的存放地址；对象是放在堆中的，栈中存放的是对象的引用（地址），**所以==是比较栈中的地址，判断两个对象是不是同一个对象**。

####  equals 

默认没有重写equals的情况下，equals方法都是调用Object类的equals方法，而Object的equals方法主要用于判断对象的内存地址引用是不是同一个地址，简单的说，**equals方法用于比较对象的内容是否相等，即指向的是不同一个值**。（注意是 **值**）。

eg：

```java
class Test {
    public static void main(String[] args) {
        String name1 ="HaC";
        String name2 = "HaC";
        String name3 = new String("HaC");
        String name4 = new String("HaC");
        System.out.println(name1 == name2);
        System.out.println(name1.equals( name2));
        System.out.println(name2 == name3);
        System.out.println(name2.equals(name3));
        System.out.println(name3.== name4);
    }
}
```

输出：

```
true
true
false
true
false
```



它的过程是这样的：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-202112image-20210121150102127.png)

1、`String name1 ="HaC";` 常量池没有找到**HaC**，所以新建一个值

2、`String name2 ="HaC";` 常量池有HaC，直接指向常量池

3、name3 、name4 都是指向各自 new String("HaC") 的堆地址，new 的过程中 它们先去常量池找有没有**HaC，如果有就copy一份到堆，如果没有就新建一个，再copy到堆，但是这两个的地址是不一样的。**

> 所以你就很容易理解==比较的是地址，equals 比较的是值 



### 2、去除首尾空白字符

使用`trim()`方法可以移除字符串首尾空白字符。空白字符包括 空格，`\t`，`\r`，`\n`、空格字符（`\u3000`）

eg：

```java
"  \tHelloCoder\r\n".trim(); // "HelloCoder"
"\u3000HelloCoder\u3000".strip(); // "HelloCoder"
```



### 3、判空  

String 提供了`isEmpty()`、`isBlank()` 判断空串。

但是两者有区别，`isEmpty()`是判断长度，`isBlank()` 是判断空白字符串，在jdk1.8中，我找不到isBlank()方法，估计是被撤掉了。

判断字符串是否为空，建议使用`common.lang.StringUtils` 类的`isEmpty()`、`isBlank()` 方法。

```java
" ".isEmpty(); //false
StringUtils.isBlank(" "); //true
```



### 4、字符串分割

分割字符串，使用`split()`方法，并且传入的也是正则表达式，返回一个切割的数组。

eg：

```java
String hello = "HelloCoder,Hello,HaC";
String[] arr =hello.split(","); //{"HelloCoder","Hello","HaC"}
```



### 5、拼接字符串

拼接字符串使用静态方法`join()`，它用指定的字符串连接字符串数组：

```java
String[] arr = {"Hello", "HaC", "C"};
String s = String.join("***", arr); // "Hello***HaC"
```

### 5、格式化字符串

String 提供 `format()`方法格式化字符串，它会替换%号占位符的位置，常见的占位符：

- `%s`：字符串；
- `%d`：整数；
- `%x`：十六进制整数；
- `%f`：浮点数。

eg：

```java
System.out.println(String.format("你好呀！%s，今天的心情是%d分","HaC",100));
```

输出：

```
你好呀！HaC，今天的心情是100分
```



### 6、截取

`substring(int beginIndex, int endIndex)` 

`beginIndex` 表示起始位置（不含）

`endIndex`表示末位置（含）

如果不写第二个参数，表示截取到末位。

```java
String name = "Hello!I am HaC.,";
System.out.println(name.substring(0, name.length() - 1)); // Hello!I am HaC.
System.out.println(name.substring(1));  //ello!I am HaC.,
```



### 7、替换

replace()、replaceFirst()

```java
String name = "Hello!I am HaC.";
System.out.println(name.replace("H","")); // ello!I am aC.
System.out.println(name.replaceFirst("H","")); // ello!I am HaC.
```



## 其他常用的API

API可以理解为一个方法，String 是JDK提供的一个类，在`java.lang`这个包下面；一个类肯定用很多方法，而String 这个类就提供了很多方法给我们开发者使用。

在IDEA中，我们可以按住`Ctrl键`，鼠标点击 `String` 跳转到这个类

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210108101209502.png)

然后就会跳转到这个类：

点击 **View→Tool Windows→Structure**，快捷键为`Alt+7`

就会出现 structure ，右侧这里就是String的API了

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210108101424894.png)

String 常见的API有以下：

| 返回参数 | 描述                                                         |
| -------- | ------------------------------------------------------------ |
| ` int`   | length()  <br />          返回此字符串的长度。               |
| String   | valueOf(int i)<br/>          返回 int 参数的字符串表示形式。 |
| ` int`   | hashCode()<br/>          返回此字符串的哈希码。              |
| ` int`   | indexOf(int ch)<br/>          返回指定字符在此字符串中第一次出现处的索引。 |
| int      | indexOf(String str)<br/>          返回指定子字符串在此字符串中第一次出现处的索引。 |

eg:

```java
String str = "HelloCoder";
System.out.println(str.length()); //10 长度
System.out.println(str.hashCode()); //420845203  hash地址，唯一
System.out.println(str.indexOf("C")); //5  字母C 的索引
```



String 还有很多API，可以自行了解。

除了String 之外，比如int、Integer，还有成千上百的类，都有很多API，我们不需要去记住，只需要在用到的时候，我们能看懂这个API文档就行了。

所以说，Java是一个封装、面向对象的语言，你只需要拥有了这个类，就能使用这个类去操作，得到你需要的数据。

而恰恰JDK就提供了很多封装的库，它们有足够多的API供我们使用。



JDK1.8中文的API文档下载地址：



## String总结

**特点：**

1. String类是final的，不可被继承。

2. String类是的本质是字符数组char[]（1.8及以前，1.9 是byte[]）， 并且其值不可改变。

3. Java运行时会维护一个String Pool（String池），JavaDoc翻译很模糊“字符串缓冲区”。String池用来存放运行时中产生的各种字符串，并且池中的字符串的内容不重复。而一般new 对象不存在这个缓冲池，并且创建的对象仅仅存在于方法的堆栈区。