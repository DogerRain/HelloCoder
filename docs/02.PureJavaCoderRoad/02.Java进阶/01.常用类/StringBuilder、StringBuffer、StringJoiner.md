---
title: StringBuilder、StringBuffer、StringJoiner
date: 2022-05-26 17:03:57
permalink: /pages/StringBuilder%E3%80%81StringBuffer%E3%80%81StringJoiner
lock: false
categories: 
  - PureJavaCoderRoad
  - Java进阶
  - 常用类
tags: 
  - StringBuilderStringBufferStringJoiner
---
我们在使用字符串拼接的时候，可能会用到`String  +` 进行拼接：

```java
String name = "HaC ";
for (int i = 0; i < 100000; i++) {
    name += "HaC ";
}
```
但是这种方法有一个弊端：**浪费内存，十分耗时**

在循环中，`name = name + "HaC ";` 每次都要把name取出来，然后再赋值给新的name，相当于 每次都创建新的字符串对象，然后扔掉旧的字符串。



## StringBuilder

为了解决这种鸡肋的问题，Java标准库提供了`StringBuilder`，特点是：

1、 `StringBuilder`是一个可变对象，当对他进行修改的时候不会像String那样重新建立对象

2、它只能通过构造函数来建立，如 ： `StringBuilder sb = new StringBuilder();`

3、对象被建立以后,在内存中就会分配内存空间,并初始保存一个null.向StringBuilder 赋值的时候可以通过它的append方法

eg：

```java
StringBuilder sb = new StringBuilder();
// sb = "HaC "; // 错误
sb.append("HaC ");
```



## StringBuffer

`StringBuffer` 和 `StringBuilder`  的用法一样，两者差异 就是 `StringBuffer`  的 `append()` 方法加了 `synchronized` 修饰符。

看一下两者源码，对比一下：

`StringBuilder`  的`append()`方法：

```java
@Override
public StringBuilder append(String str) {
    super.append(str);
    return this;
}
```

`StringBuffer`  的`append()`方法：

```java
@Override
public synchronized StringBuffer append(String str) {
    toStringCache = null;
    super.append(str);
    return this;
}
```

> synchronized 表示同步，是一种同步锁
>
> 建议 学完多线程系列再回来看看

可以说`StringBuffer`  是 `StringBuilder` 的安全版本，但是两者的选择，取决于业务代码的需要， 使用了 `synchronized`  去修饰的方法，效率会慢一点。



## StringJoiner

虽然`StringBuilder` 提供了拼接，但有时候并不是都是需要拼接在末尾的，

比如说我需要  使用 `-`进行拼接 成 `Hello-HaC-HelloCoder` ;

这时候就可以使用`StringJoiner`了，只需要声明分隔的字符串，再调用`add()`方法即可。

eg：

```java
StringJoiner sj = new StringJoiner("-");
sj.add("Hello");
sj.add("HaC");
sj.add("HelloCoder");
```

输出：

```
Hello-HaC-HelloCoder
```

还可以指定前面和后面拼接字符串。

eg：

```java
StringJoiner sj = new StringJoiner("-","Welcome,","!"); //参数分别为 分隔符、前、后
sj.add("Hello");
sj.add("HaC");
sj.add("HelloCoder");
```

输出：

```
Welcome,Hello-HaC-HelloCoder!
```



## String、StringBuffer、StringBuilder 区别 

`String` 是一个字符串常量，final修饰，当创建之后即不能更改，不可被继承，线程不安全，在做大量字符串拼接的时候效率低。

`StringBuffer` 线程安全，效率低。

`StringBuilder` 线程不安全，效率高。



## 拓展：

### 1、耗时对比

```java
public class StringBufferTest {
    public static void main(String[] args) {
        useString();
        userStringBuilder();
    }

    static void useString() {
        String name = "HelloCoder ";
        long timeStart = System.currentTimeMillis(); //起始时间
        for (int i = 0; i < 100000; i++) {
            name += "HaC ";
        }
        long timeEnd = System.currentTimeMillis(); //结束时间
        System.out.println(timeEnd - timeStart);
    }

    static void userStringBuilder() {
        StringBuilder sb = new StringBuilder("HelloCoder ");
        long timeStart = System.currentTimeMillis();
        for (int i = 0; i < 100000; i++) {
            sb.append("HaC ");
        }
        long timeEnd = System.currentTimeMillis();
        System.out.println(timeEnd - timeStart);
    }
}
```

输出：

```
17733
3
```

可以看到，循环10w次进行拼接， `String`的拼接耗时是`StringBuilder`的数千倍。



### 2、String 拼接的底层原理

还是以上面这个类为例子，我们看看String的拼接字节码：

在IDEA中右击该文件，选择 **open in terminal**

先编译，再使用`javap` 进行查看编译后的字节码：

```shell
E:\projet\springBootLogback\yudianxx-first\src\main\java\com\hac\常用类>javac -encoding "utf-8" StringBufferTest.java
E:\projet\springBootLogback\yudianxx-first\src\main\java\com\hac\常用类>javap -c StringBufferTest
```

输出一大串东西，我们找到个 `useString` 方法：

```java
static void useString();
    Code:
       0: ldc           #8                  // String HelloCoder
       2: astore_0
       3: invokestatic  #9                  // Method java/lang/System.currentTimeMillis:()J
       6: lstore_1
       7: iconst_0
       8: istore_3
       9: iload_3
      10: ldc           #10                 // int 100000
      12: if_icmpge     41
      15: new           #11                 // class java/lang/StringBuilder
      18: dup
      19: invokespecial #12                 // Method java/lang/StringBuilder."<init>":()V
      22: aload_0
      23: invokevirtual #13                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
      26: ldc           #6                  // String HaC
      28: invokevirtual #13                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
      31: invokevirtual #14                 // Method java/lang/StringBuilder.toString:()Ljava/lang/String;
      34: astore_0
      35: iinc          3, 1
      38: goto          9
      41: invokestatic  #9                  // Method java/lang/System.currentTimeMillis:()J
      44: lstore_3
      45: getstatic     #15                 // Field java/lang/System.out:Ljava/io/PrintStream;
      48: lload_3
      49: lload_1
      50: lsub
      51: invokevirtual #16                 // Method java/io/PrintStream.println:(J)V
      54: return

```



String 字符串使用+ 拼接的时候，如果存在变量拼接，jvm是会进行特殊处理的，看到这句

```java
    15: new           #10                 // class java/lang/StringBuilder
```

在循环体内，这个String的拼接其实是一个`StringBuilder`的对象创建，不断的去new 对象，再去拼接。

`useString()`处理后，相当于：

```java
static void useString(){
    String name = "HelloCoder ";
    long timeStart = System.currentTimeMillis(); //起始时间
    for (int i = 0; i < 100000; i++) {
        StringBuffer sb = new StringBuffer(name); //每次创建一个对象
        sb.append("HaC ");
        name = sb.toString();
    }
    long timeEnd = System.currentTimeMillis(); //结束时间
    System.out.println(timeEnd - timeStart);
}
```

这样循环下来了，相当于创建了 10w个对象，耗时又耗内存。