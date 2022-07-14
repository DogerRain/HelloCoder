---
title: 为什么在lambda中使用的局部变量必须是final或有效final
date: 2022-06-02 11:18:17
lock: false
permalink: /pages/%E4%B8%BA%E4%BB%80%E4%B9%88%E5%9C%A8lambda%E4%B8%AD%E4%BD%BF%E7%94%A8%E7%9A%84%E5%B1%80%E9%83%A8%E5%8F%98%E9%87%8F%E5%BF%85%E9%A1%BB%E6%98%AFfinal%E6%88%96%E6%9C%89%E6%95%88final
categories: 
  - LearnJavaToFindAJob
  - 【中级】12k-26k档
  - Java进阶
tags: 
  - lambda
  - final
  - 为在
  - 中使用
  - 或有效
---
**Q：为什么在lambda中使用的局部变量必须是final或有效final?**

## 直接的答案

JLS给了我们一些提示，它说对有效final变量的限制禁止对动态更改的本地变量的访问，捕获本地变量可能会引入并发问题。但是，这是什么意思呢？

简单的说：**java为了防止数据不同步而规定的，也就是防止你在lambda内使用的外层局部变量被外层代码修改了，但是lambda内部无法同步这个修改。**

> 使用final修饰的属性，一旦初始化后就不能修改 ，可以理解该属性只能读不能改。

Java提示必须制定final才行：

```java
public static void main(String[] args) {
        int[] nums = new int[]{1,2,4};
        int num = 1;
    
        //外部发生修改
        num--;
        nums = new int[]{1};
        Thread thread= new Thread(()->{
            nums[0] = 0;
            int result = num -1;
        });
    }
```



## lambda函数的本质

没有用过lambda表达式的，你应该也用过匿名函数，lambda表达式的本质其实也是一个匿名函数，再精确一点，就是一个函数式接口实现的实例。



既然是一个接口的实现，那么外部变量是如何传递进来的？

很显然 是通过构造器

> 为什么不是普通方法而且构造器？因为lambda是要指明参数的，但不能是任意的，它的参数列表需要依靠接口的构造器而定。

lambda表达式实例化的时候，编译器会创建一个新的class文件（想一下你是不是在工程编译之后见到过类似于`Main$1.class`的文件），该文件就是lambda实例化的类的字节码文件，在该文件中，编译器帮我们创建了一个构造器，该构造器的入参中就包含了你要使用的外层局部变量，所以外层局部变量就通过lambda的构造器传入实例内部供其使用。



## 值传递和引用传递

既然你是通过构造器传参，构造器也是方法，

如果这个变量是基本类型，那肯定是值传递，也就是传递一个副本，你在外层代码修改了这个变量，那lambda内肯定就无法感知了。

> 这也是官方为了避免误会，这其实是一个副本，并不是原来的值

只要外部一发生改变，匿名函数，lambda函数内就会报错 ：

```java
public static void main(String[] args) {
        int num = 1;
        //外部发生修改
        num--;
        Thread thread= new Thread(()->{
            int result = num - 1;	//报错
        });
    }
```



 如果是引用传递，其实就不存在这个问题了，因为final关键字只是维护引用的地址，而不会维护引用的对象内部的属性值，这样是可以的：

```java
public static void main(String[] args) {
        int[] nums = new int[]{1,2,4};
        //外部发生修改
        nums[0] = 0;
    //	nums = new int[]{1}; 这样是会报错的，nums地址发生改变
        Thread thread= new Thread(()->{
            nums[0] = 1;
        });
    }
```

但如果 `nums`的地址发生了改变，依然会报错，这个就和上面的值传递一个意思了。



## lambda只是声明 ，不代表执行

无论是lambda还是匿名内部类，在写lambda表达式的时候，是不会直接去执行这个lambda表达式的，lambda只是一种声明，和声明变量一样，你声明一个int x;仅仅是声明，可能在很多行代码之后才去调用这个lambda表达式的执行

接着上面的例子继续继续讲：

```java
public static void main(String[] args) {
        int num = 1;
        Thread thread= new Thread(()->{	//3
            int result = num - 1;	//报错
        });
        thread.start();	//6
        num -- ;	//7
    }
```

这里的第3行是个lambda的声明，并不是马上执行。

第6行启动线程，才是执行这个lambda

很有可能第7行先执行，把num的值修改了变成`0`，然后你lambda内的函数，拿到了就是旧的值 `1`，这样造成了数据不同步的问题，这也解释了开头说的：**捕获本地变量可能会引入并发问题**。