---
title: JVM面试题库（一）
date: 2022-06-02 11:18:16
lock: true
permalink: /pages/JVM%E9%9D%A2%E8%AF%95%E9%A2%98%E5%BA%93%EF%BC%88%E4%B8%80%EF%BC%89
categories: 
  - LearnJavaToFindAJob
  - 【初级】6~12k档
  - 牛客网题库
tags: 
  - JVM
  - 面试题库一
---
##### 1.假定str0,...,str4后序代码都是只读引用。Java 7中，以下述代码为基础，在发生过一次FullGC后，上述代码在Heap空间（不包括PermGen）保留的字符数为（）

```java
static String str0="0123456789";
static String str1="0123456789";
String str2=str1.substring(5);
String str3=new String(str2);
String str4=new String(str3.toCharArray());
str0=null;
```



**15**

str0和str1 在常量池。

str2，substring实际是new，5字符

str3和str4也都是new，每个5字符

以上三个分别都会创建新的对象，存放在堆。

常量池是PermGen的。（永久代：存储的是final常量，static变量，常量池。）

经过fullgc之后，年老区的内存回收，则年轻区的占了15个，不算PermGen，因此一共15字符



##### 2、对语句行 test.hello(). 描述正确的有（）

```java
package NowCoder;
class Test {
	public static void hello() {
	    System.out.println("hello");
	}
}
public class MyApplication {
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Test test=null;
		test.hello();
	}
}
```

A	能编译通过，并正确运行

B	因为使用了未初始化的变量，所以不能编译通过

C	以错误的方式访问了静态方法

D	能编译通过，但因变量为null，不能正常运行



 **A** 

静态方法属于静态绑定，编译器根据引用类型所属的静态类型为它绑定其对应的方法。

此语句会翻译成invokestatic，该指令的调用中不会涉及this,所以不会依赖对象！ 还有引用类型=null，其实就是指该引用在堆中没有对应的对象，但是编译的时候还是能根据声明找到其所属的静态类型。



##### 3、java运行时内存分为“线程共享”和“线程私有”两部分，以下哪些属于“线程共享”部分

A	程序计算器

B	方法区

C	java虚拟机栈

D	java堆



**BD**

私有:java虚拟机栈，程序计数器，本地方法栈 

共享:java堆，方法区





##### 4、JVM内存不包含如下哪个部分( )

A	Stacks

B	PC寄存器

C	Heap

D	Heap Frame



**D**

pc寄存器 就是 程序计数器

java只有栈帧 没有堆帧 



##### 5、假如某个JAVA进程的JVM参数配置如下：

```
-Xms1G 
-Xmx2G 
-Xmn500M 
-XX:MaxPermSize=64M 
-XX:+UseConcMarkSweepGC 
-XX:SurvivorRatio=3
```

请问eden区最终分配的大小是多少？

A	64M

B	500M

C	300M

D	100M



**C**

java -Xmx2G -Xms1G -Xmn500M -Xss128k

-Xmx2G：设置JVM最大可用内存为2G。

-Xms1G：设置JVM促使内存为1G。此值可以设置与-Xmx相同，以避免每次垃圾回收完成后JVM重新分配内存。

-Xmn500M：设置年轻代大小为2G。整个JVM内存大小= 年轻代大小 + 年老代大小 + 持久代大小。

-XX:SurvivorRatio=3:新生代中又会划分为 Eden 区，from Survivor、to Survivor 区。

其中 Eden 和 Survivor 区的比例默认是 8:1:1，当然也支持参数调整 -XX:SurvivorRatio=3的话就是3:1:1。

故该题为500*（3/5）=300M



##### 6、关于OutOfMemoryError，下面说法正确的是（）？

A	`java.lang.OutOfMemoryError: PermGen space` 增加-XX:MaxPermSize这个参数的值的话，这个问题通常会得到解决。

B	`java.lang.OutOfMemoryError: Requested array size exceeds VM limit`当你正准备创建一个超过虚拟机允许的大小的数组时，这条错误将会出现

C	 `java.lang.OutOfMemoryError: Java heap space` 一般情况下解决这个问题最快的方法就是通过-Xmx参数来增加堆的大小

D	`java.lang.OutOfMemoryError: nativeGetNewTLA`这个异常只有在jRockit虚拟机时才会碰到



**A B C**

A：运行时常量池导致的溢出

PermGen space 即永久代，Java8中移到了元数据区，XX:MaxPermSize 可以增大永久代空间。

B：属于堆空间不足导致的错误，属于数组过长导致堆内存溢出，加大堆内存或者减少数组长度。和C一样。

C：堆内存不足，直接增大堆内存。

D：java.lang.OutOfMemoryError: nativeGetNewTLA指当虚拟机不能分配新的线程本地空间(Thread Local Area）的时候错误信息，此错误是线程申请一个新的TLA时产生的，这个异常一般只会发生在jRockit虚拟机，但是**只有**过于绝对。



##### 7、判断一块内存空间是否符合垃圾收集器收集的标准有哪些？

A	给对象赋予了空值null,以下再没有调用过

B	对象重新分配了内存空间

C	给对象赋予了空值null

D	给对象赋予了新值



**A B D**

在java语言中，判断一块内存空间是否符合垃圾收集器收集标准的标准只有两个：

1.给对象赋值为null，以下没有调用过。

2.给对象赋了新的值，重新分配了内存空间。



##### 8、jvm中 full GC触发的条件可能有哪些？

A	栈空间满

B	年轻代空间满

C	老年代满

D	持久代满

E	System.gc()



**C D E** 

Full GC触发机制：

　　（1）调用System.gc时，系统建议执行Full GC，但是不必然执行

　　（2）老年代空间不足

　　（3）方法区空间不足

　　（4）通过Minor GC后进入老年代的平均大小大于老年代的可用内存

　　（5）由Eden区、survivor space1（From Space）区向survivor space2（To Space）区复制时，对象大小大于To Space可用内存，则把该对象转存到老年代，且老年代的可用内存小于该对象大小

![ ](https://images-1253198264.cos.ap-guangzhou.myqcloud.com/ef6b51c229a19ac5dd2ce52b8d4c3480.jpg)



##### 9、下列Java代码中的变量a、b、c分别在内存的____存储区存放？

```java
class A {
    private String a = "aa";
    public boolean methodB() {
        String b = "bb";
        final String c = "cc";
    }
}
```



**堆区、栈区、栈区**

堆区：只存放类对象，线程共享；

方法区：又叫静态存储区，存储JVM加载的类信息、常量、静态变量，即使编译器编译后的代码等数据，线程共享;

栈区：存放方法局部变量，基本类型变量区、执行环境上下文、操作指令区，线程不共享;

a在堆区，但是aa在常量池。bb、cc 也在常量池。



##### 10、 关于Java中的ClassLoader下面的哪些描述是错误的：(     )

A	默认情况下，Java应用启动过程涉及三个ClassLoader: Boostrap, Extension, System

B	一般的情况不同ClassLoader装载的类是不相同的，但接口类例外，对于同一接口所有类装载器装载所获得的类是相同的

C	类装载器需要保证类装载过程的线程安全

D	ClassLoader的loadClass在装载一个类时，如果该类不存在它将返回null

E	ClassLoader的父子结构中，默认装载采用了父优先

F	所有ClassLoader装载的类都来自CLASSPATH环境指定的路径



**BDF**

A、java中类的加载有5个过程，加载、验证、准备、解析、初始化；这便是类加载的5个过程，而类加载器的任务是根据一个类的全限定名来读取此类的二进制字节流到JVM中，然后转换为一个与目标类对应的java.lang.Class对象实例，在虚拟机提供了3种类加载器，引导（Bootstrap）类加载器、扩展（Extension）类加载器、系统（System）类加载器（也称应用类加载器）。A正确

B、一个类，由不同的类加载器实例加载的话，会在方法区产生两个不同的类，彼此不可见，并且在堆中生成不同Class实例。所以B前面部分是正确的，后面接口的部分真的没有尝试过，等一个大佬的讲解吧；

C、类加载器是肯定要保证线程安全的；C正确

D、装载一个不存在的类的时候，因为采用的双亲加载模式，所以强制加载会直接报错，D错误

E、双亲委派模式是在Java 1.2后引入的，其工作原理的是，如果一个类加载器收到了类加载请求，它并不会自己先去加载，而是把这个请求委托给父类的加载器去执行，如果父类加载器还存在其父类加载器，则进一步向上委托，依次递归，请求最终将到达顶层的启动类加载器，如果父类加载器可以完成类加载任务，就成功返回，倘若父类加载器无法完成此加载任务，子加载器才会尝试自己去加载，这就是双亲委派模式，即每个儿子都很懒，每次有活就丢给父亲去干，直到父亲说这件事我也干不了时，儿子自己想办法去完成，所以默认是父装载，E正确

F、自定义类加载器实现 继承ClassLoader后重写了findClass方法加载指定路径上的class，F错误



##### 11、下面代码的输出是什么？

```java
public class Base
{
    private String baseName = "base";
    public Base()
    {
        callName();
    }

    public void callName()
    {
        System.out.println(baseName);
    }

    static class Sub extends Base
    {
        private String baseName = "sub";
        public void callName()
        {
            System.out.println (baseName) ;
        }
    }
    public static void main(String[] args)
    {
        Base b = new Sub();
    }
}
```

A	null

B	sub

C	base



**A**

这不是内部类的原因，这是类加载的顺序问题

类加载顺序：

父类的静态代码块>子类的静态代码块>父类的代码块>父类的构造方法>子类的代码块>子类的构造方法

因为 父类的构造方法 > 子类的代码块  ,所以子类还没有代码块 `private String baseName = "sub";` baseName还没初始化，默认为null，如果是int则为0（baseName已经分配了空间，但是还没有值）





同样类型的题目：

有：

```java
class StaticStuff {
    static int x = 10;

    static {
        x += 5;
    }

    public static void main(String args[]) {
        System.out.println("x = " + StaticStuff.x);
    }

    static {
        x /= 3;
    }
}
```

输出结果 **x = 5**



有：

```java
class X {
    Y y = new Y();

    public X() {
        System.out.print("X");
    }
}

class Y {
    public Y() {
        System.out.print("Y");
    }
}

class Z extends X {
    Y y = new Y();

    public Z() {
        System.out.print("Z");
    }

    public static void main(String[] args) {
        new Z();
    }
}
```

输出结果：**YXYZ**