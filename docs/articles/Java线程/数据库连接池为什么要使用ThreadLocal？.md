ThreadLocal 不知道大家日常有没有用到，反正HaC我是没有用过，但是这个东西确实是挺重要的，我之前在多线程的专题里面写过一篇。

常见的就是现在的C3P0、Druid线程池也会用到。

最近面试竟然被问到了ThreadLocal在线程池里面的作用，心态崩了呀~



**先来说一下ThreadLocal的原理：**

1、每个Thread维护着一个ThreadLocalMap的引用

2、ThreadLocalMap是ThreadLocal的内部类，用Entry来进行存储

3、调用ThreadLocal的set()方法时，实际上就是往ThreadLocalMap设置值，key是ThreadLocal对象，值是传递进来的对象

4、调用ThreadLocal的get()方法时，实际上就是往ThreadLocalMap获取值，key是ThreadLocal对象

5、**ThreadLocal本身并不存储值**，它只是**作为一个key来让线程从ThreadLocalMap获取value**。



其为变量在每个线程中都创建了一个副本，每个线程都访问和修改本线程中变量的副本，但每个线程之间的变量是不能相互访问的，只能访问自己的。

如果你不用，那么可以维护一个全局变量（消耗资源），或者进行参数传递（得写多少无用代码，万一改了名字）

好吧，回到面试上面，问题是逐步引出的，先来看第一个问题。

## 1、为什么要引入数据库连接池？

数据库连接池大家可能不知道，但是线程池大家一定听过，其实数据库的连接池就是一个线程池，原生的JDBC，我们一般是这有操作数据库的：

```java
Class.forName("com.mysql.jdbc.Driver");
java.sql.Connection conn = DriverManager.getConnection("jdbcUrl");
```

需要用到了就获取连接，不需要了就`close()`

C3P0、Druid 这种数据库工具都引入了线程池，把所有的数据库操作都交给线程池操作，这样的好处有：





https://blog.csdn.net/u010386139/article/details/79131256