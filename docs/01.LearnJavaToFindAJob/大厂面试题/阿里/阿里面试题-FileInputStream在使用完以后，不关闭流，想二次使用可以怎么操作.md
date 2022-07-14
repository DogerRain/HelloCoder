---
title: 阿里面试题-FileInputStream在使用完以后，不关闭流，想二次使用可以怎么操作
date: 2022-06-02 11:18:21
lock: false
permalink: /pages/%E9%98%BF%E9%87%8C%E9%9D%A2%E8%AF%95%E9%A2%98-FileInputStream%E5%9C%A8%E4%BD%BF%E7%94%A8%E5%AE%8C%E4%BB%A5%E5%90%8E%EF%BC%8C%E4%B8%8D%E5%85%B3%E9%97%AD%E6%B5%81%EF%BC%8C%E6%83%B3%E4%BA%8C%E6%AC%A1%E4%BD%BF%E7%94%A8%E5%8F%AF%E4%BB%A5%E6%80%8E%E4%B9%88%E6%93%8D%E4%BD%9C
categories: 
  - LearnJavaToFindAJob
  - 大厂面试题
  - 阿里
tags: 
  - FileInputStream
  - 阿里面试题
---
## 题目

这道题是在网上看到的，据说是阿里的面试题，真假不知道，但是挺有意思的，大概意思是这样的：

> FileInputStream 在使用完以后，不关闭流，想二次使用可以怎么操作



我这里简单解释一下这个题目的意思，我们使用IO，都是要先打开：

```java
//打开流
FileInputStream fileInputStream = new FileInputStream(new File(fileName));
```

读写：

```java
int by = 0;
byte []bytes = new byte[10];
//        一个字节数组的读出数据
while ((by = fileInputStream.read(bytes)) != -1){
	System.out.print((new String(bytes, 0, by)));
}
```

使用完毕了就要关闭：

```java
//关闭流
fileInputStream.close();
```



IO的使用大概就是这三个过程。

---

## 首先来一个正常的IO完整操作：



我来复现这个操作，我预先在`F:\\HelloCoder-HaC.txt` 文件写入以下内容：

```tex
HelloCoder ,I am HaC
My webSite is https://rain.baimuxym.cn
```

> 注意这里是`FileInputStream`，是一个字节流不要出现中文字符否则会乱码

写一下代码：

```java
public class InputStreamTest {
    public static void main(String[] args) throws IOException {
        String fileName = "F:\\HelloCoder-HaC.txt";
        File file = new File(fileName);
        if (!file.exists()) {
            file.mkdir();
        }
        FileInputStream fileInputStream = new FileInputStream(new File(fileName));
        int by = 0;
        byte[] bytes = new byte[10];
//        一个字节数组的读出数据
//        第一次读写        
        while ((by = fileInputStream.read(bytes)) != -1) {
            System.out.print((new String(bytes, 0, by)));
        }

        //关闭流后如何打开，利用反射
        System.out.println();
        System.out.println("-------重新复用流-------");
//		第二次 重新读写
        bytes = new byte[10];
        while ((by = fileInputStream.read(bytes)) != -1) {
            System.out.print((new String(bytes, 0, by)));
        }
    }
}
```

输出：

```
HelloCoder ,I am HaC
My webSite is https://rain.baimuxym.cn
-------重新复用流-------

```

很明显看到这个第二次的输出是没有任何结果的。

## 回到题目：

要重新复用流，那肯定就不能重新`new FileInputStream`，我想到的是使用反射，如果对反射不熟悉的，建议看一下：

[Java的反射是个什么东西？？？](https://purejava.baimuxym.cn/#/articles//Java%E8%BF%9B%E9%98%B6//%E5%8F%8D%E5%B0%84//Java%E5%8F%8D%E5%B0%84)

那反射要实现，需要获取哪个方法呢？我们看一下`FileInputStream` 的源码：

```java
    public FileInputStream(File file) throws FileNotFoundException {
        String name = (file != null ? file.getPath() : null);
        SecurityManager security = System.getSecurityManager();
        if (security != null) {
            security.checkRead(name);
        }
        if (name == null) {
            throw new NullPointerException();
        }
        if (file.isInvalid()) {
            throw new FileNotFoundException("Invalid file path");
        }
        fd = new FileDescriptor();
        fd.attach(this);
        path = name;
        open(name);
    }
    private void open(String name) throws FileNotFoundException {
        open0(name);
    }
     /**
     * Opens the specified file for reading.
     * @param name the name of the file
     */
	private native void open0(String name) throws FileNotFoundException;
```

`FileInputStream` 在最后会通过`open(name)` 这个方法打开文件，`open()`会调用`open0()`， `open0()`是一个native方法，实现不是java，看到注释，大概的意思就是指定文件路径，然后可以打开进行读操作。

既然知道`open()` 方法，那就可以用反射了，注意这个方法是`private`。

知道方法那就很容易了。

## 解决：

代码如下：

```java
public class InputStreamTest {
    public static void main(String[] args) throws IOException, NoSuchMethodException, InvocationTargetException, IllegalAccessException {

        String fileName = "F:\\HelloCoder-HaC.txt";
        File file = new File(fileName);
        if (!file.exists()) {
            file.mkdir();
        }
        FileInputStream fileInputStream = new FileInputStream(new File(fileName));
        int by = 0;
        byte[] bytes = new byte[10];
//        一个字节数组的读出数据
//        第一次读写  
        while ((by = fileInputStream.read(bytes)) != -1) {
            System.out.print((new String(bytes, 0, by)));
        }
//        //关闭流，这里关闭也不影响
        fileInputStream.close();

        //关闭流后如何打开，利用反射
        System.out.println();
        System.out.println("-------重新复用流-------");
//		第二次 重新读写
        Class in = fileInputStream.getClass();
        Method openo = in.getDeclaredMethod("open", String.class);
        //因为是private
        openo.setAccessible(true);
        openo.invoke(fileInputStream, fileName);
        bytes = new byte[10];
        while ((by = fileInputStream.read(bytes)) != -1) {
            System.out.print((new String(bytes, 0, by)));
        }
    }
}
```

输出：

```
HelloCoder ,I am HaC
My webSite is https://rain.baimuxym.cn
-------重新复用流-------
HelloCoder ,I am HaC
My webSite is https://rain.baimuxym.cn
```

----

以上。

这个面试题真的是妙啊~

**不但考察了你对IO的理解，还考察了反射的用法。**

大概率还会一步一步来引申以下问题：

- IO的分类和结构
- flush方法的作用
- BIO和NIO的区别
- 什么是反射

