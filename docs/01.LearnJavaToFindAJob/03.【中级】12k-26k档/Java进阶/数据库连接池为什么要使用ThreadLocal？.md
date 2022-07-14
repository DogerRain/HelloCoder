---
title: 数据库连接池为什么要使用ThreadLocal？
date: 2022-06-02 11:18:18
lock: false
permalink: /pages/%E6%95%B0%E6%8D%AE%E5%BA%93%E8%BF%9E%E6%8E%A5%E6%B1%A0%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81%E4%BD%BF%E7%94%A8ThreadLocal%EF%BC%9F
categories: 
  - LearnJavaToFindAJob
  - 【中级】12k-26k档
  - Java进阶
tags: 
  - ThreadLocal
---
ThreadLocal 不知道大家日常有没有用到，反正HaC我是没有用过，但是这个东西确实是挺重要的，我之前在多线程的专题里面写过一篇。

常见的就是现在的C3P0、Druid线程池也会用到。

最近面试竟然被问到了ThreadLocal在线程池里面的作用，心态崩了呀~

复盘一下，如下。

## 1、为什么要引入数据库连接池？

数据库连接池大家可能不知道，但是线程池大家一定听过，其实数据库的连接池就是一个线程池，原生的JDBC，我们一般是这有操作数据库的：

```java
Class.forName("com.mysql.jdbc.Driver");
java.sql.Connection conn = DriverManager.getConnection("jdbcUrl");
```

需要用到了就获取连接，不需要了就`close()`

C3P0、Druid 这种数据库工具都引入了线程池，把所有的数据库操作都交给线程池操作，这样的好处有：

1、 资源重用，假如一个请求频繁的操作数据库，每次都new 一个连接是十分消耗资源的。

2、更快的响应，建立连接是需要时间的，对于业务请求处理而言，直接利用现有可用连接，避免了数据库连接初始化和释放过程的时间开销，从而缩减了系统整体响应时间。

3、统一管理， 可根据预先的连接占用超时设定，防止强制收回被占用连接，避免在操作期间出错。

> 数据库连接池就是典型的用空间换时间的思想
>
> 虽然创建了多个连接对象丢在池里，会占用一定的内存空间，但是可以省去接下来每一次的创建连接、关闭连接时间。

在数据库的连接上，也是一个TCP的三次握手，其中还需要验证账户、密码、权限什么的，可想而知多耗时。

好比你每次写代码都要开机、打开IDEA；如果不关电脑下次直接就可以用IDEA写代码了，虽然费点“电脑”，但是效率却高了。



## 2、数据库的连接池是如何管理的？

上面**为什么要引入数据库连接池**这个问题还是很容易回答的，但是**线程池是如何管理的**这个问题就破防，大意了，我并不是很了解，现在来总结一下。

我以Durid为例（其实不止durid），线程池是通过 `ThreadLocal` 来管理的。

**先来说一下ThreadLocal的原理：**

1、每个Thread维护着一个ThreadLocalMap的引用

2、ThreadLocalMap是ThreadLocal的内部类，用Entry来进行存储

3、调用ThreadLocal的set()方法时，实际上就是往ThreadLocalMap设置值，key是ThreadLocal对象，值是传递进来的对象

4、调用ThreadLocal的get()方法时，实际上就是往ThreadLocalMap获取值，key是ThreadLocal对象

5、**ThreadLocal本身并不存储值**，它只是**作为一个key来让线程从ThreadLocalMap获取value**。



其为变量在每个线程中都创建了一个副本，每个线程都访问和修改本线程中变量的副本，但每个线程之间的变量是不能相互访问的，只能访问自己的。

如果你不用，那么可以维护一个全局变量（消耗资源），或者进行参数传递（得写多少无用代码，万一改了名字）

**使用ThreadLocal的好处有：**

1、代码调用DruidDataSource来管理conn连接，同时声明了`ThreadLocal`对象来保存每次线程请求所获取的连接，这样可以避免每个new一个JDBCUtils对象，将conn对象放在`ThreadLocal`对象中缓存起来，下次调用直接从`ThreadLocal`中获取来实现性能的提高。

2、保证事务的一致性。

每个线程保存的是该对象的一个副本，不同线程之间不会互相影响，假如一个DAO，你每次执行SQL操作的时候，是不是都要获取connection连接呢？如果有多个DAO操作，我们可以传参一个connection，但是这样写太麻烦了，而使用`ThreadLocal`，则在`datasource.getConnection();`的时候，直接就可以获取了，而且它可以保证当前线程中任何地方的Connection数据库连接都是相同的，也保证了事务的一致性。

来个例子：

```java
//一个方法有两个dao操作
//方法一
DruidPooledConnection connection = datasource.getConnection();
PreparedStatement ps = connection.prepareStatement("select * from  user");
ResultSet resultSet = ps.executeQuery();
            
//方法二
DruidPooledConnection connection = datasource.getConnection();
PreparedStatement ps = connection.prepareStatement("update user set name = 'HaC' where id = 1");
Integer result = ps.executeUpdate();
```

这样的话Druid的`getConnection()`方法是从`ThreadLocal`获取的。

> 我们使用一些ORM框架，比如Mybatis、JPA等等无法感知这个过程，其实这些框架的底层也是如此。

当然Druid的功能不只是引入了`ThreadLocal`，还有线程池的大小控制、拒绝、超时管理等等很强大的功能。



可以尝试手写一个ThreadLocal来管理连接池：

```java
public class C3P0Utils {
 
	private static DataSource source;//数据源
	static{
		source = new ComboPooledDataSource("mysql");//根据配置文件初始化数据源
	}
	
	/**
	 * 获取数据库连接
	 * @return
	 * @throws SQLException
	 */
	public static Connection getConnection() throws SQLException{
		return source.getConnection();
	}
}
```

```java
public class TransactionThreadLocal {
 
	private static ThreadLocal<Connection> tc = new ThreadLocal<>();
	/**
	 * 返回当前线程的数据库连接
	 * @return
	 * @throws SQLException
	 */
	public static Connection getConnection() throws SQLException{
		Connection connection = tc.get();
		if(connection == null){
			connection = C3P0Utils.getConnection();
			tc.set(connection);
		}
		return connection;
	}
	
	/**
	 * 开启事务
	 * @throws SQLException
	 */
	public static void startTransaction() throws SQLException{
		getConnection().setAutoCommit(false);
	}
	/**
	 * 提交事务
	 * @throws SQLException
	 */
	public static void commit() throws SQLException{
		getConnection().commit();
	}
	
	/**
	 * 事务回滚
	 * @throws SQLException
	 */
	public static void rollback() throws SQLException{
		getConnection().rollback();
	}
	
	/**
	 * 关闭数据库
	 * @throws SQLException
	 */
	public static void close() throws SQLException{
		getConnection().close();//关闭数据库
		tc.remove();//将该线程的connection对象移除
	}
}
```

```java
public class BookDaoImp implements BookDao{
    @Override
	public void edit(Book book) throws Exception {
		Connection conn = TransactionThreadLocal.getConnection();
		String sql = "update book set name=? where id=?";
		PreparedStatement pst = conn.prepareStatement(sql);
		pst.setString(1, "name");
		pst.setString(2, id);
		pst.execute();
	}
}
```

当然这个线程池的只放了一个连接，而Druid是可以自定义放很多个的，但是这个例子使用了`ThreadLocal`，可以避免每次都new 一个Connection，也不需要每次都把Connection作为参数传递。