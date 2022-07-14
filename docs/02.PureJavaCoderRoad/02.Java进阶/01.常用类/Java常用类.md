---
title: Java常用类
date: 2022-05-26 17:03:57
permalink: /pages/Java%E5%B8%B8%E7%94%A8%E7%B1%BB
lock: false
categories: 
  - PureJavaCoderRoad
  - Java进阶
  - 常用类
tags: 
  - Java
  - 常用类
---
Java是一门成熟的语言，也是一门包含许多第三方库（jar包）的语言，我们不需要特意的造轮子（封装自己的方法）。

比如说：

我们要比较要使用判断一个字符串是否为空或者空串，如下

```
String name = "   ";
```

你可以这样写：

```java
public static boolean isBlank(String str) {
    if (str != null && str.trim().length() != 0) { //trim() 是String的API， 表示去除空格
        return false;
    }
    return true;
}
```

如果你不想`trim()`，那你需要把`String` 转成一个`char[]` 数组，遍历每一位下标的值是否等于 `''`，如果存在一个不等于空串，就返回`false`，但这样做就太麻烦了。

JDK已经提供了很多很多的API给我们使用，必要时我们应该查看类和方法的说明，尤其是八大数据类型的包装类（下一节会讲到）和String的API。



上面这种判断字符串是否为空也是有点麻烦的。

但是如果我们用了第三方的jar——`org.apache.commons.lang3.StringUtils`

```java
public static boolean isBlank2(String str) {
    return StringUtils.isBlank(str);
}
```

导入包，就直接可以使用`StringUtils.isBlank()` 去判断了。



maven的仓库通过了许多jar供下载：

> https://mvnrepository.com/

搜索 `commons.lang3` 就能下载了，因为项目没有配置`maven`，所以这里先演示导入包的形式：

![点击jar下载](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210120160540203.png)



打开项目结构，点击 **Libraries**  ——> **左上角 +** ——> **Java** ，导入刚刚下载的jar包

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210120162055534.png)

回到项目，你就发现多了一个提示：

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210120162301580.png)

这样就能使用`commons.lang3`这个jar包的API功能了，当然这个包还提供了很多功能，详细的可以自行了解。

`commons.lang3`详细介绍可以参考：https://blog.csdn.net/f641385712/article/details/82468927



如果jar包在项目用的多了，就很难去管理了，这时候就尝试一下使用构建管理工具了，现在流行的常用构建工具有

- Maven
- gradle

早期的ant也不错，不过现在没什么人用了。

这两个不仅可以管理jar，还可以把项目打成jar包，供他人使用或者直接发布到仓库和服务器。

但这里就不介绍了。