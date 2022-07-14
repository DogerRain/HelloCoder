---
title: 1、Java异常
date: 2022-05-26 17:04:09
permalink: /pages/1%E3%80%81Java%E5%BC%82%E5%B8%B8
lock: false
categories: 
  - PureJavaCoderRoad
  - Java基础
  - 异常处理
tags: 
  - Java
  - 异常
---
我们在写代码的过程中，并不是所有的代码都是语法正确的，编译器在编译前就会报错。

而且在Java代码在运行过程中，并不是都能正确执行的，这时候jvm在执行过程中就会抛出错误。



Java中错误有很多种，比如我们定义了一个整型`int`数据，一个`String`类型的数据强转失败；继承的时候父类无法向下转型为子类；运算中被除数为0 等等。

这些异常有的是因为用户错误输入引起，有的是程序执行错误引起的，还有其它一些是因为物理硬件错误引起的。



## Java的异常

`Throwable`有两个子类：`Error（错误）`和`Exception（异常）`，这两个子类又包含了各自的子类。

Java的异常`Throwable`也是`class`，是异常体系的爸爸。

 ![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/Home/image-20210115172917862.png)



我们**常说的异常**一般是指 `Exception`，因为这类异常可以捕获和解决，`Exception`又分为两大类

- **RuntimeException异常**

  指的是图中的`RuntimeException`，属于`CheckedException`，Error也属于`CheckedException`

- **非RuntimeException异常**

  即`非RuntimeException`，属于`CheckedException`，这种异常必须由程序员手动处理，**否则不通过编译**

而`Error` 很难捕获，而且难以排查和解决。所以一般不会捕捉Error。



### 为什么要对unchecked异常和checked异常进行区分？

其实很简单，**unchecked异常** 表示 程序员不需要显式地捕获错误，你可能知道你的代码会报错，也可能不会报错。

**checked异常**是编译器必须要你处理的异常，如果你**不处理这个异常，就无法提供编译**。



这样说可能无法理解，下面细说这几种**“异常”**的区别。



## Error

代表的是严重错误，这种错误程序员无法进行处理，例如操作系统崩溃、jvm出错（栈堆溢出）、 类文件被删了找不到等等。

> 注：Error并不是异常，它是错误。



举个栗子。

有一天哈C的五菱宏光，启动了之后忘记熄火了，发动机一直在运行中：

```java
class WuLingHongGuang {
    void drive() {
        System.out.println("五菱宏光发动机正在运行中......");
        drive(); //发动机不断运行
    }
}

class HaC {
    public static void main(String[] args) {
        WuLingHongGuang wuLingHongGuang = new WuLingHongGuang();
        wuLingHongGuang.drive();
    }
}
```

输出：

```java
五菱宏光发动机正在运行中......
五菱宏光发动机正在运行中......
五菱宏光发动机正在运行中......
五菱宏光发动机正在运行中......
五菱宏光发动机正在运行中......
Exception in thread "main" java.lang.StackOverflowError
	at sun.nio.cs.UTF_8$Encoder.encodeLoop(UTF_8.java:691)
	at java.nio.charset.CharsetEncoder.encode(CharsetEncoder.java:579)
	at sun.nio.cs.StreamEncoder.implWrite(StreamEncoder.java:271)
	at sun.nio.cs.StreamEncoder.write(StreamEncoder.java:125)
	at java.io.OutputStreamWriter.write(OutputStreamWriter.java:207)
	at java.io.BufferedWriter.flushBuffer(BufferedWriter.java:129)
	at java.io.PrintStream.write(PrintStream.java:526)
	at java.io.PrintStream.print(PrintStream.java:669)
	at java.io.PrintStream.println(PrintStream.java:806)
	at com.hac.异常.WuLingHongGuang.drive(Car.java:14)
```

一段时间后，发现五菱宏光发动机报障了，然后整辆车就自动挂了~

看到日志报了`java.lang.StackOverflowError`，这就表示**栈溢出**了。

`drive()`方法不断的递归调用自己，而方法是存储在**JVM内存模型**中的**虚拟机栈**的，而**虚拟机栈**是深度的，当方法越来越多，存不下了就会溢出，就会报`StackOverflowError`



这类错误程序员一般是无法控制的，五菱宏光的发动机炸了我也不知道为什么会炸，毕竟我只是个会开车的（Java程序员），发动机什么时候炸了我是不知道的（JVM）。

但是作为老司机，我可以更换的发动机机油、更好发动机皮带（设置 JVM 栈的大小）。



## Exception

**Exception**是Java程序员必须要掌握的，也是需要处理的异常。

上面讲到，**Exception**分为 **RuntimeException异常** 和 **非RuntimeException异常**。



### RuntimeException异常

`RuntimeException`，即程序运行时会抛出的异常，也可能是不抛出异常

有可能是用户输出了错误的参数、null空指针、类型转换报错等等。

>  如果出现了RuntimeException，就一定是程序(员)自身的问题

举个栗子。

哈C我终于把发动机修好了，但是我发现我的五菱宏光只能有5条轮胎（4条原始胎+1条备胎），它们分别是`{"左1", "左2", "后1", "后2","备胎1"}`

我打算把这5条轮胎换下来，但是我发现我换的位置不正确，导致五菱宏光直接歇菜了~

```java
class WuLingHongGuang  {
    private String[] weels = {"左1", "左2", "后1", "后2","备胎1"}; //五个位置

    void changeWeel(int index, String weelName) {
        weels[index] = weelName;
    }

    void drive() {
        System.out.println("五菱宏光发动机正在运行中......");
    }
}

class HaC {
    public static void main(String[] args) {
        WuLingHongGuang wuLingHongGuang = new WuLingHongGuang();
        wuLingHongGuang.changeWeel(10, "备胎2"); //把 备胎2换到第10个位置
    }
}
```

输出：

```java
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: 10
	at com.hac.异常.WuLingHongGuang.addWeel(Car.java:16)
	at com.hac.异常.HaC.main(Car.java:27)
```

控制台日志输出`java.lang.ArrayIndexOutOfBoundsException`表示数组越界了，`weels[]`数组只有5个位置，最大的下标是`weels[4]`，`weels[10]`就是越界了。

五菱宏光表示，你换备胎的位置不正确，我根本没有第10个位置，导致我车（程序）直接无法运行了。



这种就是在运行Runtime的时候会出现的异常，如果是这种那肯定是没问题的：

```java
wuLingHongGuang.changeWeel(4, "备胎2"); //把 备胎2 换到第5个位置
```



### 非RuntimeException异常

非RuntimeException异常属于 `CheckedException`，需要程序员处理，**要么直接抛出异常，要么直接捕获**。否则代码无法通过编译。

这就涉及到几个Java的关键字了：

- throws、throw
- try-catch-finally

异常在出现的时候，会导致程序的逻辑发生改变，如果异常没有**捕获**、**抛出**，则会直接返回调用程序的上一层，如果上一层调用者也没有捕获，就会一直往上抛出。