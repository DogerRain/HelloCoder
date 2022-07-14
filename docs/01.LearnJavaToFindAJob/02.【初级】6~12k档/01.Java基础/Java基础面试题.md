---
title: Java基础面试题
date: 2022-06-02 11:18:17
lock: false
permalink: /pages/Java%E5%9F%BA%E7%A1%80%E9%9D%A2%E8%AF%95%E9%A2%98
categories: 
  - LearnJavaToFindAJob
  - 【初级】6~12k档
  - Java基础
tags: 
  - Java
  - 基础面试题
---
### 1、Java的三大特性是什么，谈谈你的理解，设计原则、设计模式有哪些？

**Java三大特性：**

封装、继承、多态。

**面向对象的四大特征：**

封装、继承、多态、抽象。

**面向对象7大设计原则：**

1. 单一职责原则——SRP

> 让每个类只专心处理自己的方法。功能不需要太多，但要专注（高内聚，低耦合）

2. 开闭原则——OCP

> 软件中的对象(类，模块，函数等)应该对于扩展是开放的，但是对于修改是关闭的。
>
> 比如说A模块被其他模块调用，如果A模块不允许修改，那么应该考虑把A模块关闭

3. 里式替换原则——LSP

> 子类可以去扩展父类，但是不能改变父类原有的功能。

比如说可以继承、可以实现接口，但是不能修改原来具体的方法。

4. 依赖倒置原则——DIP

> 应该通过调用接口或抽象类(比较高层)，而不是调用实现类(细节)。

5. 接口隔离原则——ISP

> 把接口分成满足依赖关系的最小接口，实现类中不能有不需要的方法。

6. 迪米特原则——LOD

> 高内聚,低耦合，降低各个对象之间的耦合（不要），提高系统的可维护性。

7. 合成复用原则

> 尽量使用对象组合，而不是继承来达到复用的目的

**面向对象的23种设计模式：**

常见的有 抽象工厂模式、工厂方法模式、建造者模式、单例模式。

![ ](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/401339-20170928225241215-295252070.png)



### 2、8种基本数据类型

> String不是基本类型。

双等号（==），比较的是他们的值。基本数据类型没有equals方法。

![ ](https://images-1253198264.cos.ap-guangzhou.myqcloud.com/clipboard-1601965896460.png)

拆箱和装箱：

```java
//自动装箱
Integer total = 99;
//自定拆箱
int totalprim = total;
```

```java
Integer i = 400; 
Integer j = 400; 
System.out.println(i==j);  //false
```

- 使用Integer去创建一个数，虚拟机自动为代码做了这个操作 Integer.valueOf()，源码如下：

```java
public static Integer valueOf(int i) {
    if (i >= IntegerCache.low && i <= IntegerCache.high)
        return IntegerCache.cache[i + (-IntegerCache.low)];
    return new Integer(i);
}
```

如果值的范围在-128到127之间，它就从高速缓存返回实例。否则 new 一个Integer对象。new Integer 就是一个装箱的过程了，装箱的过程会创建对应的对象，这个会消耗内存，所以装箱的过程会增加内存的消耗，影响性能。

**Integer和int 的区别：**

int是java的原始数据类型，Integer是java为int提供的封类。

Integer的默认值是null；int的默认值是0。



总结：

- **两个通过new生成的Integer变量永远是不相等的**。因为new生成的是两个对象，其内存地址不同。
- **Integer与new Integer不会相等**。因为非new生成的Integer变量指向的是java常量池中的对象，而new Integer()生成的变量指向堆中新建的对象，两者在内存中的地址不同。
- 两个都是非new出来的Integer，（即Integer total = 99 这种 ）如果数在-128到127之间，则是true,否则为false。
- **Integer变量和int变量比较时，只要两个变量的值是相等的，则结果为true。**（因为包装类Integer和基本数据类型int比较时，java会自动拆箱为int，然后进行比较，实际上就变为两个int变量的比较）



### 3、访问修饰符

![ ](https://images-1253198264.cos.ap-guangzhou.myqcloud.com/7010483_1495588925759_ACED241801E307EE7A39612F85A94EBF.png)

public：所有地方的类都可以访问。
private：只能在当前类中进行访问。
protected：可以在当前类、当前包、子类中进行访问
不写默认为default：可以在当前类，当前包中进行访问。



### 4、==、equals、hashcode区别

- ==比较的是两个引用在内存中指向的是不是同一对象（即同一内存空间，可以说 == 等于 hashcode） 

- equals用来比较 两个对象的内容（值）是否相等。

> 注意：八个基本数据类型==比较都是 **值**。

**有没有可能两个不相等的对象有相同的hashcode？**

有可能。称为hash冲突。

总结：

(1) 同一对象上多次调用hashCode()方法，总是返回相同的整型值。

(2) 如果 a.equals(b)，则一定有 a.hashCode() 一定等于 b.hashCode()

(3)如果 !a.equals(b)，则 a.hashCode() **不一定等于** b.hashCode()。

(4)a.hashCode()==b.hashCode() 则 a.equals(b) 可真可假。

(5)a.hashCode()！= b.hashCode() 则 a.equals(b)一定为假。 





### 5、重载（Overload）和重写（Override）的区别

方法的重载和重写都是实现多态的方式，区别在于：

重载实现的是编译时的多态性。
重写实现的是运行时的多态性。

- 重载发生在一个类中，同名的方法如果有不同的参数列表（参数类型不同、参数个数不同或者二者都不同）则视为重载；**重载对返回类型没有特殊的要求，但不能根据返回类型进行区分。**
- 重写发生在子类与父类之间，重写要求子类被重写方法与父类被重写方法有相同的参数列表，有兼容的返回类型，比父类被重写方法更好访问，不能比父类被重写方法声明更多的异常（里氏代换原则）。



### 6、抽象类和接口的区别

抽象类特点：

1. 抽象类是抽象的，不是具体的，所以抽象类**不能被实例化**。**但是它仍然具有类的功能，成员变量、成员方法和构造方法的访问方式和普通类一样，也可以实现接口、继承类。**
2. 由于抽象类不能实例化对象，所以**抽象类必须被继承，才能被使用**。所以，**类的声明、方法体**  就不能使用`final`去修饰，final表示不可继承和修改，但是变量可以使用final修饰。

3. 抽象类可以有非抽象方法。
4. 抽象类中的抽象方法的访问类型可以是public，protected和默认类型。

  ```java
  public abstract class Employee extends Person implements People{
  {
  public final String a ="1";
  
   static {
       System.out.println("我是抽象类的static代码块");
   }
  
   public static void test(){
       System.out.println("我是抽象类的static方法");
   }
  
   public abstract void abstrartMethod();
  
   public void abstrartMethod2() {
       System.out.println("抽象类也可以拥有非抽象方法");
   }
  }
  ```

  


接口的特点：

1. 接口中方法默认是`public abstract` （只能是这两个关键字，或其中一个或都省略）。因为要被继承，所以是public的。
2. 接口中的变量默认是`public static final`（只能是这三个关键字，或其中两个/一个或都省略）。接口中有成员变量意义不大，实现类可以通过 `接口名称.变量名称` 来调用。
3. java中一个类只能继承一个类，但一个接口可以继承多个接口。
4. 接口不能实现接口
5. 接口中不能有构造方法。（因为它不是一个类）
6. 1.8中及以后，接口中可以有default默认方法（普通方法），可以有静态方法和方法体了。

```java
public interface People {
    public static String a ="1";
    public static final String b ="2";
    public static void test(){
        System.out.println("我是接口的静态方法");
    }
    //普通方法
    default void testA2() {
            System.out.println("A");
    }
    public void test1();
}
```

**两者总结：**

| 参数         | 抽象类                                                       | 接口                                                         |
| ------------ | :----------------------------------------------------------- | ------------------------------------------------------------ |
| 声明         | 抽象类使用abstract关键字声明                                 | 接口使用interface关键字声明                                  |
| 实现         | 子类使用extends关键字来继承抽象类。如果子类不是抽象类的话，需要实现父类的所有方法 | 子类使用implements关键字来实现接口。 需要实现所有接口的方法。 |
| 构造器       | 抽象类可以有构造器（但是没啥用）                             | 接口不能有构造器                                             |
| 多继承       | 一个类最多只能继承一个抽象类                                 | 一个类可以实现多个接口，一个接口可以继承多个接口，但是接口不能实现接口 |
| 普通字段声明 | 抽象类的字段声明可以是任意的，但是不能是`static`，因为抽象类是要被实现的，静态类是不能被修改的；可以使用`final`修饰 | 默认是`public static final`（默认；只能是这三个关键字，或其中两个/一个或都省略） |
| 普通方法声明 | 同上                                                         | 1.8中及以后，也可以普通方法了（仅 default），<br />也可以有静态方法（仅 public static） |
| 实例化       | 不是具体类，不能实例化                                       | 不是类，不能实例化                                           |
| 方法体       | 抽象方法访问类型**不能是private**，不能是 static、final修饰（需要实现的~），而且默认是 abstract 修饰 | 接口中方法默认是`public abstract`（只能是这两个关键字，或其中一个或都省略）。因为要被继承，所以是public的。 |

> 接口可以看作一个更特殊的抽象类，修饰符和限制都更多了，但是自从1.8中及以后，接口的**普通方法**要比抽象类要灵活了，跟普通类一样使用；而抽象类不能使用static其他基本无异



### 7、&和&&的区别

 &是位运算符，表示按位 与运算。（两个操作数中位都为1，结果才为1，否则结果为0）

 &&是逻辑运算符，表示逻辑与（and）。



### 8、switch中能否使用string做参数?

在JDK 1.7之前,switch只能支持byte,short,char,int或者其对应的包装类以及Enum类型.从JDK 1.7之后switch开始支持String类型.但到目前为止,switch都不支持long类型。

**还有break的坑：**

只要没有break ，就一直往下渗透，包括default。

```java
public class SwitchCaseTest {
    public static void main(String[] args) {
        int num = 2;
        switch (num) {
            case 1:
                num++;
            case 2:
                num++;
            case 3:
                num++;
            default:
                num++;
                break;
        }
        System.out.println(num); //5
    }
}
```



### 9、String、StringBuffer、StringBuilder区别

- 可变性
  简单的来说：String 类中使用 final 关键字字符数组保存字符串， `private final char value[]` ，所以 String
  对象是不可变的。而StringBuilder 与 StringBuffer 都继承自 AbstractStringBuilder 类，在 AbstractStringBuilder
  中也是使用字符数组保存字符串`char[] value` 但是没有用 final 关键字修饰，所以这两种对象都是可变的。

- 安全性

  String 是一个字符串常量，final修饰，当创建之后即不能更改，不可被继承，线程安全 

  StringBuffer 用了`synchronized`修饰，线程安全；反之 StringBuilder 线程不安全

```java
   @Override
    public synchronized StringBuffer append(String str) {
        toStringCache = null;
        super.append(str);
        return this;
    }
```

- 效率

  StringBuffer很多方法都加了 synchronized ， 也就是同时刻只能有一个线程去执行一个方法 （加锁，需要等待），效率就低。



对于三者使用的总结：

1. 操作少量的数据 --->>> String
2. **单线程**操作字符串缓冲区下操作大量数据 --->>> StringBuilder
3. **多线程**操作字符串缓冲区下操作大量数据 --->>> StringBuffer



留个题目：

```Java
public class Test {
    public static void main(String[] args) {
        StringBuffer a = new StringBuffer("A"); 
        StringBuffer b = new StringBuffer("B"); 
        operator(a, b); 
        System.out.println(a + "," + b); 
    } 
    public static void operator(StringBuffer x, StringBuffer y) { 
        x.append(y); 
        y = x; 
    }
}
```

输出是  **AB,B**



### 10、Math.round(11.5) 等于多少？Math.round(-11.5)等于多少？

Math.round(11.5)的返回值是12，Math.round(-11.5)的返回值是-11。

四舍五入的原理是在参数上加0.5然后进行下取整。



### 11、String s = "xyz"和String s = new String("xyz");区别

`String s = new String("hello");`**可能创建两个对象也可能创建一个对象**。如果常量池中有`hello`字符串常量的话，则仅仅在堆中创建一个对象。如果常量池中没有`hello`对象，则堆上和常量池都需要创建。

`String s = "hello"`这样创建的对象，JVM会直接检查字符串常量池是否已有`"hello"`字符串对象，如没有，就分配一个内存存放"`hello"`，如有了，则直接将字符串常量池中的地址返回给栈。(没有new，没有堆的操作)

**一个String的经典题目：**

```java
String test="javaandpython"; 
String str1="java"; 
String str2="and"; 
String str3="python"; 
System. out. println(test=="java"+"and"+"python"); //true
System. out. println(test ==str1 + str2 + str3); //false
```

这是因为字符串字面量拼接操作是在Java编译器编译期间就执行了，也就是说编译器编译时，直接把"java"、"and"和"python"这三个字面量进行"+"操作得到一个"javaandpython" 常量，并且直接将这个常量放入字符串池中，这样做实际上是一种优化，将3个字面量合成一个，避免了创建多余的字符串对象（只有一个对象"javaandpython"，在字符串常量池中）。



而字符串引用的"+"运算是在Java运行期间执行的，即str1 + str2 + str3在程序执行期间才会进行计算，它会在堆内存中重新创建一个拼接后的字符串对象。且在字符串常量池中也会有str1,str2与str3，这里创建多少个新的对象与原来字符串常量池中有没有str1、str2、str3有关，如果之前存在就不会创建新的对象。



```java
String str=new String("tarena");
String str2=new String("tarena");
System. out. println(str==str2); //false
```

这是因为str和str2是在堆中的两个不同地址，最后都指向了常量池的 "tarena"



### 12、 异常

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/Home/image-20210115172917862.png)

Throwable 分为Exception（异常） 和 Error（错误） ，二者都是 Java 异常处理的重要子类，各自都包含大量子类。

**Error（错误）**: 是程序无法处理的错误。

**Exception（异常）**: 是程序本身可以处理的异常。常见的有RuntimeException、NullPointerException、ArrayIndexOutOfBoundsException （下标越界异常）。

 

##### **Exception异常分类**

Java 的所有异常可以分为受检异常（checked exception）和非受检异常（unchecked exception）。

**受检异常（checked exception）：**

编译时必须需要处理的异常，否则编译不通过，除 RuntimeException 及其子类外，其他的 Exception 异常都属于受检异常。比如 调用 sleep()方法

处理的方法为 使用try-catch捕获或者 用 throws 关键字抛出。

**非受检异常（unchecked exception）：**

当程序中出现此类异常时，即使我们没有try-catch捕获它，也没有使用throws抛出该异常，编译也会正常通过。**该类异常包括运行时异常（RuntimeException极其子类）和错误（Error）。**比如 1/0；



##### 常见的 RuntimeException 有哪些？

- ClassCastException(类转换异常)
- IndexOutOfBoundsException(数组越界)
- NullPointerException(空指针)
- ArrayStoreException(数据存储异常，操作数组时类型不一致)
- 还有IO操作的BufferOverflowException异常



### 13、Throw 和 throws 的区别：

​	  **位置不同：**

1. throws 用在函数上，后面跟的是异常类，可以跟多个；而 throw 用在函数内，后面跟的是异常对象。

**功能不同：**

2. throws 用来声明异常，让调用者只知道该功能可能出现的问题，可以给出预先的处理方式；throw抛出具体的问题对象，执行到throw，功能就已经结束了，跳转到调用者，并将具体的问题对象抛给调用者。也就是说 throw 语句独立存在时，下面不要定义其他语句，因为执行不到。

3. throws 表示出现异常的一种可能性，并不一定会发生这些异常；throw 则是抛出了异常，执行 throw 则一定抛出了某种异常对象。

4. 两者都是消极处理异常的方式，只是抛出或者可能抛出异常，但是不会由函数去处理异常，真正的处理异常由函数的上层调用处理





### 14、java中4种类型的流

字节输入流：InputStream, （读取原始数据） 

字节输出流：OutputStream（读取原始数据） 

字符输入流：Reader

字符输出流：Writer



1，字节流：以 8 位（即 1 byte，8 bit）作为一个数据单元，数据流中最小的数据单元是字节。

2，字符流：以 16 位（即 1 char，2 byte，16 bit）作为一个数据单元，数据流中最小的数据单元是字符， Java 中的字符是 Unicode 编码，一个字符占用两个字节。



 字节流没有缓冲区，是直接输出的，而字符流是输出到缓冲区的。因此在输出时，字节流不调用colse()方法时，信息已经输出了，而字符流只有在调用close()方法关闭缓冲区时，信息才输出。要想字符流在未关闭时输出信息，则需要手动调用flush()方法。

·    读写单位不同：字节流以字节（8bit）为单位，字符流以字符为单位，根据码表映射字符，一次可能读多个字节。

·    处理对象不同：字节流能处理所有类型的数据（如图片、avi等），而字符流只能处理字符类型的数据。

**结论：只要是处理纯文本数据，就优先考虑使用字符流。除此之外都使用字节流。**



### 15、final, finally, finalize的区别。

- final 用于声明属性，方法和类，分别表示属性不可变，方法不可覆盖，类不可继承。

- finally是异常处理语句结构的一部分，表示总是执行。

- finalize是Object类的一个方法，在垃圾收集器执行的时候会调用被回收对象的此方法，可以覆盖此方法提供垃圾收集时的其他资源回收，例如关闭文件等。

  

### 16 、构造器Constructor是否可被重写？

构造器Constructor不能被继承，所以不能被重写。

但是可以重载，因为一个类可以不止一个构造函数，如果没有声明构造函数，会默认生成一个无参的构造函数。



### 17、BIO,NIO,AIO的区别

- BIO，即平时所说的IO，同步阻塞式 IO，IO 面向流，阻塞。单线程一次只能应付一个连接。数据的读取写入必须阻塞在一个线程内等待其完成。适用于单机低并发的情况。
- NIO，同步非阻塞式 IO，面向缓存，非阻塞，拥有选择器。可以单线程管理多个连接。在Java 1.4 中引入，提供了与传统BIO模型中的 Socket 和 ServerSocket 相对应的 SocketChannel 和 ServerSocketChannel 两种不同的套接字通道实现,两种通道都支持阻塞和非阻塞两种模式。适用于对于高负载、高并发的（网络）应用。
- AIO，异步非阻塞式IO，Java 7 中引入，基于事件和回调机制实现的，也就是应用操作之后会直接返回，不会堵塞在那里，当后台处理完成，操作系统会通知相应的线程进行后续的操作。



### 18、Object中常见的方法

Object 是所有类的父类，Object中文又叫对象，所以又有Java一切皆对象的说法，而Object又提供了很多常见的API，如下：

- getClass()  //返回此 Object 的运行类。
- hashCode()  //用于获取对象的哈希值。
- equals(Object obj)   //用于确认两个对象是否“相同”。
- clone()  //创建并返回此对象的一个副本。
- toString()  //返回该对象的字符串表示。  
- notify()  //唤醒在此对象监视器上等待的单个线程。  
- notifyAll()   //唤醒在此对象监视器上等待的所有线程。  
- wait(long timeout)  //在其他线程调用此对象的 notify() 方法或 notifyAll() 方法，或    者超过指定的时间量前，导致当前线程等待。  
- wait(long timeout, int nanos)  //在其他线程调用此对象的 notify() 方法或 notifyAll() 方法，或者其他某个线程中断当前线程，或者已超过某个实际时间量前，导致当前线程等待。
- wait()  //用于让当前线程失去操作权限，当前线程进入等待序列
- finalize()  //当垃圾回收器确定不存在对该对象的更多引用时，由对象的垃圾回收器调用此方法。



### 19、JDK8新特性有哪些

1、lambda表达式
2、接口的默认方法，default方法
3、Comparator 接口
4、Stream 接口
5、Filter 过滤
6、Sort 排序
7、Date API，包含了一组全新的时间日期API



### 20、float num = 1.2 正确吗？

不正确。Java中浮点数默认是double 的。

可以这样声明float类型：

```java
float num = 1.2f;
```

或者类型转换：

```java
float num = (float) 1.2
```



### 21、Java注释和注解的区别

这是两个不同的概念。

**注释：**

对代码的解释，方便别人阅读你的代码

注释分为：

- 单行注释
  格式： // 注释文字
- 多行注释
  格式： /* 注释文字 */
- 文档注释
  格式：/** 注释文字 */

**注解：**

注解 ，参与代码编译，以@开头的，与工具一起使用。对于位置、语法、内容有一定的限制。注释 ，可以随意在任务位置填写内容，对代码任何没有影响。

例如 `@SuppressWarnings(value=”unchecked”)`



### 22、this与super的区别

this是自身的一个对象，代表对象本身，可以理解为：指向对象本身的一个指针。

super可以理解为是指向自己超（父）类对象的一个指针，而这个超类指的是离自己最近的一个父类。

其他：

- super()在子类中调用父类的构造方法，this()在本类内调用本类的其它构造方法。
- super()和this()均需放在构造方法内第一行。
- 都是关键字。
- 均不可以在static环境中使用



### 23、break ,continue ,return 的区别及作用

- return的功能是结束一个方法。 一旦在循环体内执行到一个return语句，return语句将会结束该方法，循环自然也随之结束。
- continue 跳出本次循环，继续执行下次循环(结束正在执行的循环 进入下一个循环条件)。
- break 跳出 上一层循环，结束当前循环体，不再执行当前循环。



### 24、Java获取反射的三种方法

1. 通过new对象实现反射机制（ `对象.getClass()` ）
2. 通过路径实现反射机制（ `Class.forName("包名.类名")` ）
3. 通过类名实现反射机制 （ `类名.Class` ）

demo：

```java
class Student {
    private int id;
    String name;
    protected boolean sex ;
    pub1ic f1oat score;
}
 
pub1ic class Get {
    //获取反射机制三种方式
    public static void main(String[] args) throws ClassNotFoundException {
        //方式一(通过建立对象)
        Student stu = new StudentO ;
        Class classobj1 = stu. getClassO;
        System. out. print1n(classobj1. getNameO);
        //方式二(所在通过路径-相对路径)
        Class classobj2 = Class . forName (" fanshe . Student") ;
        System. out. println(classobj2. getName0) ;
        //方式三(通过类名)
        Class classobj3 = Student.class;
        System. out. println(classobj3. getName0) ;
    }
}
```



### 25、Java的四种引用

| 引用类型 | 被垃圾回收时间 | 用途               | 生存时间          |
| -------- | -------------- | ------------------ | ----------------- |
| 强引用   | 从来不会       | 对象的一般状态     | JVM停止运行时终止 |
| 软引用   | 当内存不足时   | 对象缓存           | 内存不足时终止    |
| 弱引用   | 正常垃圾回收时 | 对象缓存           | 垃圾回收后终止    |
| 虚引用   | 正常垃圾回收时 | 跟踪对象的垃圾回收 | 垃圾回收后终止    |

```java
Object o=new Object();   //  强引用
SoftReference<String> softRef=new SoftReference<String>(str);     // 软引用
WeakReference<String> abcWeakRef = new WeakReference<String>(str); //弱引用
```



### 26、junit用法，before,beforeClass,after, afterClass的执行顺序

BeforeClass 》 before 》test 》 after 》 afterClass

有多个before，多个after ，它们的执行顺序是怎么样的呢？

我猜测是方法名的大小比较（和位置无关），我本地实验结果：

before3》before2》before1

after1》after2》after3 

