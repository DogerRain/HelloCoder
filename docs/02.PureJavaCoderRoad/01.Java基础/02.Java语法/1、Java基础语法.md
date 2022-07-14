---
title: 1、Java基础语法
date: 2022-05-24 17:44:33
permalink: /pages/1%E3%80%81Java%E5%9F%BA%E7%A1%80%E8%AF%AD%E6%B3%95
lock: false
categories: 
  - PureJavaCoderRoad
  - Java基础
  - Java语法
tags: 
  - Java
  - 基础语法
---
我们在学英语的时候，要讲究 主谓宾，要让听者明白，就要按照英语的语法表述。

Java也是一门语言，要想计算机识别你编写的指令，就要按照Java的语法去编写程序。



## 1、基本语法

在学习Java的时候，首先需要知道的几点：

- **大小写敏感**：Java 是大小写敏感的，这就意味着标识符 Hello 与 hello 是不同的。
- **类名**：对于所有的类来说，类名的首字母应该大写。如果类名由若干单词组成，那么每个单词的首字母应该大写，例如 **Hello** 。
- **方法名**：所有的方法名都应该以小写字母开头。如果方法名含有若干单词，则后面的每个单词首字母大写。
- **源文件名**：源文件名必须和类名相同。当保存文件的时候，你应该使用类名作为文件名保存（切记 Java 是大小写敏感的），文件名的后缀为 **.java**。
- **主方法入口**：所有的 Java 程序由 **public static void main(String[] args)** 方法开始执行。
- **结束**：Java每一行代码，都需要分号 `;` 结尾。



### 关键字

关键字是Java已经使用的语法字，表示起到关键意义的作用。

用户不能用于常量、变量、和任何标识符的名称，所以起名就不能用这些名字了。

> 这是一定要记住的

<table class="wikitable">
<tbody><tr>
<th>类别</th>
<th>关键字</th>
<th>说明
</th></tr>
<tr>
<td rowspan="3" align="center">访问控制</td>
<td>private</td>
<td>私有的
</td></tr>
<tr>
<td>protected</td>
<td>受保护的
</td></tr>
<tr>
<td>public</td>
<td>公共的
</td></tr>
<tr>
<td rowspan="13" align="center">类、方法和变量修饰符</td>
<td>abstract</td>
<td>声明抽象
</td></tr>
<tr>
<td>class</td>
<td>类
</td></tr>
<tr>
<td>extends</td>
<td>扩允,继承
</td></tr>
<tr>
<td>final</td>
<td>最终值,不可改变的
</td></tr>
<tr>
<td>implements</td>
<td>实现（接口）
</td></tr>
<tr>
<td>interface</td>
<td>接口
</td></tr>
<tr>
<td>native</td>
<td>本地，原生方法（非Java实现）
</td></tr>
<tr>
<td>new</td>
<td>新,创建
</td></tr>
<tr>
<td>static</td>
<td>静态
</td></tr>
<tr>
<td>strictfp</td>
<td>严格,精准
</td></tr>
<tr>
<td>synchronized</td>
<td>线程,同步
</td></tr>
<tr>
<td>transient</td>
<td>短暂
</td></tr>
<tr>
<td>volatile</td>
<td>易失
</td></tr>
<tr>
<td rowspan="12" align="center">程序控制语句</td>
<td>break</td>
<td>跳出循环
</td></tr>
<tr>
<td>case</td>
<td>定义一个值以供switch选择
</td></tr>
<tr>
<td>continue</td>
<td>继续
</td></tr>
<tr>
<td>default</td>
<td>默认
</td></tr>
<tr>
<td>do</td>
<td>运行
</td></tr>
<tr>
<td>else</td>
<td>否则
</td></tr>
<tr>
<td>for</td>
<td>循环
</td></tr>
<tr>
<td>if</td>
<td>如果
</td></tr>
<tr>
<td>instanceof</td>
<td>实例
</td></tr>
<tr>
<td>return</td>
<td>返回
</td></tr>
<tr>
<td>switch</td>
<td>根据值选择执行
</td></tr>
<tr>
<td>while</td>
<td>循环
</td></tr>
<tr>
<td rowspan="6" align="center">错误处理</td>
<td>assert</td>
<td>断言表达式是否为真
</td></tr>
<tr>
<td>catch</td>
<td>捕捉异常
</td></tr>
<tr>
<td>finally</td>
<td>有没有异常都执行
</td></tr>
<tr>
<td>throw</td>
<td>抛出一个异常对象
</td></tr>
<tr>
<td>throws</td>
<td>声明一个异常可能被抛出
</td></tr>
<tr>
<td>try</td>
<td>捕获异常
</td></tr>
<tr>
<td rowspan="2" align="center">包相关</td>
<td>import</td>
<td>引入
</td></tr>
<tr>
<td>package</td>
<td>包
</td></tr>
<tr>
<td rowspan="9" align="center">基本类型</td>
<td>boolean</td>
<td>布尔型
</td></tr>
<tr>
<td>byte</td>
<td>字节型
</td></tr>
<tr>
<td>char</td>
<td>字符型
</td></tr>
<tr>
<td>double</td>
<td>双精度浮点
</td></tr>
<tr>
<td>float</td>
<td>单精度浮点
</td></tr>
<tr>
<td>int</td>
<td>整型
</td></tr>
<tr>
<td>long</td>
<td>长整型
</td></tr>
<tr>
<td>short</td>
<td>短整型
</td></tr>
<tr>
<td>null</td>
<td>空
</td></tr>
<tr>
<td rowspan="3" align="center">变量引用</td>
<td>super</td>
<td>父类,超类
</td></tr>
<tr>
<td>this</td>
<td>本类
</td></tr>
<tr>
<td>void</td>
<td>无返回值
</td></tr>
<tr>
<td rowspan="2" align="center">保留关键字</td>
<td>goto</td>
<td>是关键字，但不能使用
</td></tr>
<tr>
<td>const
</td>
<td>是关键字，但不能使用
</td></tr></tbody></table>


### 基本数据类型

Java是一门逻辑语言，我们可以使用Java进行计算，那就必须需要数据类型，数学有 整数、小数 ，中文有字符串，英语有字母。

那在Java中要如何表示呢？

Java中提供了8种基本数据类型，在定义变量的时候，可以使用这8种数据类型去修饰。

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

>Boolean 《Java虚拟机规范》给出了4个字节,但还要看虚拟机实现是否按照规范来，所以1个字节、4个字节都是有可能的。



接下来开始讲一下Java程序的结构。



### 1.1  、类 class

Java是面向对象的语言，一个程序的基本单位就是`class`，`class`是关键字

一个类可以理解为一个文件。

而我们常说的对象就是类的一个实例。

```java
public class Hello { //public 修饰的类只能有一个，且要和文件名相同
}
class HelloCoder{ //可以有多个类
}
```

类的实例化：

```java
Hello hello = new Hello();
HelloCoder helloCoder = new HelloCoder();
```



### 1.2 、方法 

一个类可以有多个方法，方法可以理解为行为。

用`{}` 表示方法的起始。

方法可以自定义参数、返回值。

 `void` 表示方法没有返回值。

> 返回值如果为空则使用void，如果不写则会报错

eg：

```java
public class HelloCoder {
    public void printName() {  //没有返回值方法
        System.out.println("HaC");
    }
    public int printSex() { //有返回值方法
        System.out.println("男");
        return 1;
    }
    public static void printWhatYouInput(String input) { //静态、带参数，无返回值方法
        System.out.println(input);
    }
}
```

方法的调用：

```java
public static void main(String[] args) {
    HelloCoder helloCoder = new HelloCoder(); //实例化
    helloCoder.printName(); //方法的调用
    System.out.println(helloCoder.printSex());
    HelloCoder.printWhatYouInput("任意输入");
}
```

输出：

```
HaC
男
1
任意输入
```



### 1.3 、变量

Java语言变量的特点就是 **先定义，再输出**。

一个类可以有多个变量，在类里面的叫**实例变量**（又叫 **类变量**）。

一个方法也可以有多个变量，在方法里面的叫**局部变量**。 

> 局部变量必须初始化才能使用

```java
public class HelloCoder {
    int age; //定义一个age的全局变量
    public static void printName() {
        String name = "HaC"; //定义一个name的局部变量，必须初始化才能使用
        System.out.println(name); 
        System.out.println(age);  //使用全局变量
    }
}
```



普通方法可以调用**全局变量**，方法不能使用其他方法的局部变量。

> 全局变量，即全局，所有的方法都可以使用的；局部变量，则是属于自己的。



类、方法、变量 三者的关系：

![](F:\笔记\docsifyLearnJavaToFindAJob\docs\articles\Java基础\Java基础\picture\image-20210105112121205.png)





### 1.4 、包

即`package`，可以理解为一个文件夹，一个包可以有多个类。

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210106105230992.png)

如果要引用其他类，就可以使用 `import` 在程序的头部导入

> package 、import 在类的头部 声明

```java
package com.hac.first;  //声明在哪个包

import com.alibaba.fastjson.JSON; //我需要引用的外部类

public class HelloCoder {
}
```



### 1.5、修饰符

修饰符分为两种：

- 访问修饰符
- 非访问修饰符

#### 访问修饰符

有时候我们希望变**量、方法、类** 不允许给外部、其他方法 访问，我们可以使用访问修饰符

| 修饰词              | 本类 | 同一个包的类 | 继承类 | 其他类 |
| ------------------- | ---- | ------------ | ------ | ------ |
| public              | √    | √            | √      | √      |
| protected           | √    | √            | √      | ×      |
| default（无，默认） | √    | √            | ×      | ×      |
| private             | √    | ×            | ×      | ×      |



```java
public class HelloCoder { //public 声明类
    private String name = "HaC"; //private 声明变量
    protected void printName(){ //protected 声明方法
        System.out.println(name);
    }
}
```





#### 非访问修饰符

##### static 修饰符

static 修饰符，可以用来修饰类方法和类变量，用static修饰的方法叫 静态方法 ，修饰的代码块叫静态代码块，修饰的变量叫静态变量

- 静态变量

无论一个类实例化多少对象，它的静态变量只有一份拷贝。 静态变量也被称为类变量。

**局部变量不能被声明为 static 变量**。

- 静态方法

**静态方法不能使用类的非静态变量**

**非静态变量则可以使用静态方法**

- 静态代码块

静态代码块的执行在方法初始化前就会执行，代码中一般很少用到。

> 对类变量和方法的访问可以直接使用 `类名.方法名` ，`类名.变量名` 直接访问

```java
public class HelloCoder {
    static String name = "HaC"; //静态变量

    static   //静态代码块
    {
        System.out.println(name);
    }

    //静态方法
    public static void printName(){
        System.out.println(name);
    }
}
```



##### final 修饰符

###### 1）final变量

final的意思是最终的，变量一旦被final修饰，就必须初始化，且不能被重新赋值，一般配合 static 使用。

所以被`final`修饰的又叫做`常量`。

```java
public class HelloCoder {
    static final String WEIXIN_ID = "HelloCoder";
    public static void main(String[] args) {
        WEIXIN_ID = "HelloCoder200"; //重新赋值，报错
    }
}
```

> final 什么时候使用呢？
>
> 不可变的变量就可以修饰，比如说我的微信公众号ID 是 HelloCoder ，则可以使用final修饰，常用的身份证信息、URL 也可以使用。

###### 2）final 方法

父类中的 final 方法可以被子类继承，但是不能被子类重写。

接下来会讲到继承、重写、重载。

##### abstract 修饰符

用来声明一个抽象类，这里不介绍，接下来慢慢讲。

##### synchronized 修饰符

线程同步锁，这里不介绍，接下来慢慢讲。

##### volatile 修饰符

线程变量可见，这里不介绍，接下来慢慢讲。



---



新建一个HelloCoder的类，把以上所学的融合到一个类中：

```java
package com.hac.first;

public class Hello {
    static int age; //全局变量、类变量
    private static String name ; //静态变量，没有初始化值
    static final String WEIXIN_ID = "HelloCoder";

    public static void main(String[] args) {
        Hello.printName();  //static 的方法可以直接使用 类名.方法名 调用
        printSex(); // 同一个类的static方法 则 可以直接调用
//        WEIXIN_ID = "HelloCoder200"; //报错的
    }

    private static void printName() {  //private static 方法
        System.out.println(name);  //static方法调用的方法、变量必须也是static的
        System.out.println(age);  //static方法调用的方法、变量必须也是static的
        System.out.println(WEIXIN_ID); 
    }

    private static void printSex() {
        String sex = "男";
        System.out.println(sex); //局部变量sex要想使用，必须初始化
    }
}
```

> Java规定，某个类定义的`public static void main(String[] args)`是Java程序的固定入口方法，因此，Java程序总是从`main`方法开始执行

输出：

```java
null
0
HelloCoder 
男
```



main方法的入口调用了两个方法`printName()`和`printSex()`

printName() 方法输出类变量age、name的值，因为没有初始化，所以会输出默认值 `0` 和 `null`



以上一知半解不重要，坚持继续往下学习。

