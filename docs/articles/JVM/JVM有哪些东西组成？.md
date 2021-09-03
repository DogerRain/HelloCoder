JVM可以分为4大部分：类加载器，运行时数据区、执行引擎、Native Interface(本地接口)。

![](https://pic4.zhimg.com/80/v2-3d4525b0b3eba26b9270ada761fb4953_720w.jpg)

## 1、类加载器

这部分见上面。

## 2、Java运行数据区域

这部分见上面

## 3、执行引擎

类加载器将字节码载入内存后，执行引擎以java字节码为单元，读取java字节码。java字节码机器读不懂，必须将字节码转化为平台相关的机器码。这个过程就是由执行引擎完成的。



![](https:////upload-images.jianshu.io/upload_images/1876023-6f8d0fddbf930520.png?imageMogr2/auto-orient/strip|imageView2/2/w/538/format/webp)

在执行方法时JVM提供了四种指令来执行：

invokestatic:调用类的static方法。

invokevirtual:调用对象实例的方法。

invokeinterface：将属性定义为接口来进行调用。

invokespecial：JVM对于初始化对象（Java构造器的方法为：）以及调用对象实例的私有方法时。



## 4、本地方法接口

Native Interface

比如说Unsafe类就是一个本地方法接口，都不是Java实现的，所以它属于JVM的范畴，一般都是C语言实现的。

