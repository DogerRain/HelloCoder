---
title: Java反射
date: 2022-05-26 17:03:56
permalink: /pages/Java%E5%8F%8D%E5%B0%84
lock: false
categories: 
  - PureJavaCoderRoad
  - Java进阶
  - 反射
tags: 
  - Java
  - 反射
---
## 1、反射概念

要理解Java的反射，首先要知道**正射**。

Java中一切皆对象，我们在获得类的实例化对象的时候，通常都是使用 `new` 一个对象：

```java
WuLingHongGuang wuLingHongGuang = new WuLingHongGuang("五菱宏光");
wuLingHongGuang.getCarName();
```

`wuLingHongGuang` 指向了对`WuLingHongGuang`对象的引用，那么`wuLingHongGuang`就能获取对象的变量、方法 等信息，这种就是 **正射**。

在编译的时候，Java虚拟机就知道这个对象的引用了。



**反射**，即Reflection。

和正射相反，它一开始并不知道要初始化的类对象，无法使用`new` 去创建对象。

> 使用反射要跳出正射的思维方式。

反射需要借助JDK的API进行调用：

```java
Class<?> clz = Class.forName("com.hac.reflect.WuLingHongGuang"); // 取得Class对象
Constructor constructor = clz.getConstructor(String.class);//获得构造方法
Object object = constructor.newInstance("五菱宏光"); //反射实例化对象
Method method = clz.getMethod("getCarName"); //获得get方法
method.invoke(object); //使用invoke， 调用getCarName方法
```

> 下面例子会附上完整代码

上面两段代码执行的结果是一样的，但是思路不一样。

第一段是通过实例化一个`WuLingHongGuang`对象，在编译的时候，就确定了类，自然而然就拥有了类的变量、方法。



第二段是通过类的路径获得的对象，再通过JDK一系列的反射方法得到对象、构造方法、普通方法。



所以说发射就是在代码运行的时候，才知道类是什么。



## 2、反射的原理

**反射机制的概念：**

> 指在运行状态中，对于任意一个类,都能够知道这个类的所有属性和方法，对于任意一个对象，都能调用它的任意一个方法，这种动态获取信息，以及动态调用对象方法的功能叫Java反射机制。

**反射的原理：**

1、Java中一切皆对象，类也是对象（实例化）

2、类包含构造方法、普通方法、变量 ，拥有了类，就拥有了类的属性。

3、类的加载过程，其实也是从磁盘读取一个类文件，如上面的`com.hac.reflect.WuLingHongGuang.class`，把文件读取到内存中，就可以认为这个文件是一个`java.lang.Class` 实例了，进而获得`WuLingHongGuang.class`的所有信息。



## 3、反射的例子

在使用反射前，你需要掌握反射的常用 API ，举个例子来说明一下：

```java
class Car {
    public String carName;
}

//五菱宏光 类
public class WuLingHongGuang extends Car {
    private String userName = "HaC";

    public WuLingHongGuang(String carName) { //构造方法
        this.carName = carName;
    }

    public String getCarName() {
        return this.userName + "的" + this.carName;
    }

    public String getUserName() {
        return userName;
    }
}

class Test {
    //可以看到这里会抛出很多错误
    public static void main(String[] args) throws NoSuchMethodException, IllegalAccessException, InstantiationException, InvocationTargetException, ClassNotFoundException, NoSuchFieldException {
        //正射
        WuLingHongGuang wuLingHongGuang = new WuLingHongGuang("五菱宏光");
        System.out.println(wuLingHongGuang.getUserName());
        System.out.println(wuLingHongGuang.carName);
        System.out.println(wuLingHongGuang.getCarName());

        System.out.println("---------分割线-----------");
        //反射
        // 1、取得Class文件
        Class<?> clz = Class.forName("com.hac.reflect.WuLingHongGuang"); 
        // 2、获取构造方法，String.class 表示 只有一个String 参数的购种方法
        Constructor constructor = clz.getConstructor(String.class);
        // 3、反实例化对象
        Object object = constructor.newInstance("五菱宏光");
        //4、 获取方法
        Method method = clz.getMethod("getCarName");
        //5、 获取变量名称
        Field nameField1= clz.getDeclaredField("userName"); // 获得 userName 属性
        nameField1.setAccessible(true);   //表示可以访问 private 权限
        
        Field nameField2 = clz.getField("carName"); // 获得父类 carName 属性
	
        System.out.println(nameField1.get(object));
        System.out.println(nameField2.get(object));
        //调用getCarName方法
        System.out.println(method.invoke(object));
    }
}
```

输出：

```
HaC
五菱宏光
HaC的五菱宏光
---------分割线-----------
HaC
五菱宏光
HaC的五菱宏光
```

以上正射和发射输出的结果都是一样的。



例子可能有一些绕，来解读一下：

`WuLingHongGuang` 类继承 `Car`类，类有一个`private` 私有的变量 `userName`，现在要通过正射，`new` 一个对象 打印内容。

`WuLingHongGuang`有一个构造方法，一个`getCarName`和一个`getUserName`方法，变量 `carName` 是公共的，子类可以直接访问。



正射的输出结果都很容易理解。

接下来解析一下反射的方法步骤：

### 反射的步骤

#### 1、获取类的 Class 对象实例

获取类的 Class 对象实例 一般有三种方法：

1、加载类的文件

```java
Class<?> clz = Class.forName("com.hac.reflect.WuLingHongGuang");
```

这种比较常见。

2、直接通过一个`class`的静态变量`class`获取

```java
Class clz = WuLingHongGuang.class;
```

3、知道了一个实例变量，可以通过`getClass()`方法获取。

```java
WuLingHongGuang wuLingHongGuang = new WuLingHongGuang("五菱宏光");
Class clz = wuLingHongGuang.getClass();
```



这里可以验证：**static代码块是和对象无关，只和类有关**

我们在`WuLingHongGuang` 类里面加入静态代码：

```java
    static {
        System.out.println("这是一辆五菱宏光");
    }
```

你会发现在**获取类的Class对象实例**这一步，就会把静态代码块的内容执行了。



#### 2、获取构造方法Constructor对象

```java
Constructor constructor = clz.getConstructor(String.class);
```

这里表示获取只有一个String 参数的构造方法，`getConstructor()`API的参数是一个数组，可以指定多个参数，也可以不指定，它会根据参数去找到构造方法。

也可以通过一次性返回构造函数数组：

```java
Constructor[] constructors = clz.getConstructors();
```

#### 3、反实例化方法Object

一切皆对象，对象的父类是Object，我这里是带一个String参数构造方法：

```java
Object object = constructor.newInstance("五菱宏光");
```

这一步也可以一步到位直接强转：

```java
WuLingHongGuang wuLingHongGuang1 = (WuLingHongGuang) object;
System.out.println(wuLingHongGuang1.getCarName());
```



#### 4、获取方法Method 对象

```java
Method method = clz.getMethod("getCarName");
//调用方法

```

表示获取无参数的`getCarName()`方法，还可以写参数

```java
Method method = clz.getMethod("setCarName", String.class);
```

#### 5、调用方法

```java
method.invoke(object);
```

使用 `invoke` 表示调用方法，这里表示执行 `getCarName` 的方法

#### 6、获取变量

```java
Field nameField1= clz.getDeclaredField("userName"); // 获得userName 属性
nameField1.setAccessible(true);   //表示可以访问 private 权限
Field nameField2 = clz.getField("carName"); // 获得父类 carName属性
```

`getDeclaredField()` 只能获取本类的变量，不能获取父类的变量

`getField()` 可以获取父类的变量。

`nameField1.setAccessible(true);` 这里表示可以获取类的私有`private`变量。否则在获取变量值的时候会报错提示找不到变量。

> 这就体现了反射的一点缺陷。
>
> 理论上反射可以访问任何类中的的任何方法或者属性，但这样就导致了不安全的状态。

获取变量值：

```java
nameField1.get(object); // 获取 nameField1 即 userName 的值
nameField2.get(object);
```



反射的包`java.lang.reflect` 还有很多API，比如说获取接口、静态变量，可以去自行研究。



那么反射有什么作用呢？

## 4、反射的作用

`Class.forName()` 其实也是通过调用`ClassLoader`来实现的。

`ClassLoader`就是遵循双亲委派模型最终调用启动类加载器的类加载器，实现的功能是“通过一个类的全限定名来获取描述此类的二进制字节流”，获取到二进制流后放到JVM中。

如果使用：

```java
ClassLoader.getSystemClassLoader().loadClass("com.hac.reflect.WuLingHongGuang");
```

去加载类，是不会初始化类的（不会执行类的静态代码块），最终Class.forName() 是调用：

```java
private static native Class<?> forName0(String name, boolean initialize,
                                            ClassLoader loader,
                                            Class<?> caller)
        throws ClassNotFoundException;
```

需要指定`ClassLoader` ，且初始化（注册）自己。



反射用到最多的地方：

**1、 spring框架**

spring通过xml的配置得到一个类的路径，然后通过反射得到某个实例的对象，这样就能动态配置很多东西了，而不是每次都要在代码里面new 对象，（这可以理解为IOC，就是通过CLassLoader来实现的）。

还有就是Spring的AOP，AOP就用到了动态代理，其底层也是反射。

参考：https://www.cnblogs.com/aspirant/p/9036805.html

Hibernate 框架也是使用了大量的反射，在加载的时候就很方便的初始化了对象。

**2、Mysql的Driver**

通过`Class.forName("com.mysql.jdbc.Driver")`的静态代码块，为自己注册一个对象：

```java
package com.mysql.jdbc;

import java.sql.DriverManager;
import java.sql.SQLException;

public class Driver extends NonRegisteringDriver implements java.sql.Driver {
    public Driver() throws SQLException {
    }

    static {
        try {
            DriverManager.registerDriver(new Driver()); //注册一个自己
        } catch (SQLException var1) {
            throw new RuntimeException("Can't register driver!");
        }
    }
}
```

---

程序员在自己的业务开发很少会使用反射，也尽量少用反射。

反射的性能是需要考虑的，反射相当于一系列解释操作，通知jvm要做的事情，性能比直接的java代码（正射）要慢很多。