---
title: Mybatis面试题
date: 2022-06-02 11:18:18
lock: false
permalink: /pages/Mybatis%E9%9D%A2%E8%AF%95%E9%A2%98
categories: 
  - LearnJavaToFindAJob
  - 【初级】6~12k档
  - Java框架
tags: 
  - Mybatis
  - 面试题
---
### 1、MyBatis的工作原理

![ ](https://images-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201018163315846.png)

1）读取 MyBatis 配置文件：mybatis-config.xml 为 MyBatis 的全局配置文件，配置了 MyBatis 的运行环境等信息，例如数据库连接信息。

2）加载映射文件。映射文件即 SQL 映射文件，该文件中配置了操作数据库的 SQL 语句，需要在 MyBatis 配置文件 mybatis-config.xml 中加载。mybatis-config.xml 文件可以加载多个映射文件，每个文件对应数据库中的一张表。

3）构造会话工厂：通过 MyBatis 的环境等配置信息构建会话工厂 SqlSessionFactory。

4）创建会话对象：由会话工厂创建 SqlSession 对象，该对象中包含了执行 SQL 语句的所有方法。

5）Executor 执行器：MyBatis 底层定义了一个 Executor 接口来操作数据库，它将根据 SqlSession 传递的参数动态地生成需要执行的 SQL 语句，同时负责查询缓存的维护。

6）MappedStatement 对象：在 Executor 接口的执行方法中有一个 MappedStatement 类型的参数，该参数是对映射信息的封装，用于存储要映射的 SQL 语句的 id、参数等信息。

7）输入参数映射：输入参数类型可以是 Map、List 等集合类型，也可以是基本数据类型和 POJO 类型。输入参数映射过程类似于 JDBC 对 preparedStatement 对象设置参数的过程。

8）输出结果映射：输出结果类型可以是 Map、 List 等集合类型，也可以是基本数据类型和 POJO 类型。输出结果映射过程类似于 JDBC 对结果集的解析过程。

### 2、Mybatis  缓存

Mybatis中有一级缓存和二级缓存，默认情况下一级缓存是开启的，而且是不能关闭的。

一级缓存是指 SqlSession 级别的缓存，当在同一个 SqlSession 中进行相同的 SQL 语句查询时，第二次以后的查询不会从数据库查询，而是直接从缓存中获取，一级缓存最多缓存 1024 条 SQL。

二级缓存是指可以跨 SqlSession 的缓存。是 mapper 级别的缓存，对于mapper 级别的缓存不同的sqlsession 是可以共享的。

<img src="https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20200925165917288.png" alt=" "  />



### 3、Mybatis  的一级缓存原理 （ sqlsession 级别 ）

第一次发出一个查询 sql，sql 查询结果写入 sqlsession 的一级缓存中，缓存使用的数据结构是一个 map。

key：MapperID+offset+limit+Sql+所有的入参
value：用户信息

同一个 sqlsession 再次发出相同的 sql，就从缓存中取出数据。如果两次中间出现 commit 操作
（修改、添加、删除），本 sqlsession 中的一级缓存区域全部清空，下次再去缓存中查询不到所
以要从数据库查询，从数据库查询到再写入缓存。



### 4、二级缓存原理 （ mapper 级别）

二级缓存的范围是 mapper 级别（mapper同一个命名空间，Namespace），mapper 以命名空间为单位创建缓存数据结构，结构是 map。mybatis 的二级缓存是通过 CacheExecutor 实现的。CacheExecutor其实是 Executor 的代理对象。所有的查询操作，在 CacheExecutor 中都会先匹配缓存中是否存在，不存在则查询数据库。
key：MapperID+offset+limit+Sql+所有的入参

具体使用需要配置：

1. Mybatis 全局配置中启用二级缓存配置

2. 在对应的 Mapper.xml 中配置 cache 节点

3. 在对应的 select 查询节点中添加 useCache=true

   

### 5、`#{}`和`${}`的区别是什么

`#{}`是预编译处理，对应的变量**自动加上**单引号 ''

`${}`是字符串替换，对应的变量**不会加上**单引号 ''

Mybatis在处理`#{}`时，会将sql中的`#{}`替换为`?`号，调用`PreparedStatement`的set方法来赋值；

Mybatis在处理`${}`时，就是把`${}`替换成变量的值。

使用`#{}`可以有效的防止SQL注入，提高系统安全性。



预编译语句的优势在于归纳 为：**一次编译、多次运行，省去了解析优化等过程；此外预编译语句能防止sql注入。**

> 使用`#{}`预编译会更好一点

### 6、什么是MyBatis的接口绑定？有哪些实现方式？

接口绑定，就是在MyBatis中任意定义接口，然后把接口里面的方法和SQL语句绑定，我们直接调用接口方法就可以，这样比起原来了SqlSession提供的方法我们可以有更加灵活的选择和设置。

接口绑定有两种实现方式：

- 通过注解绑定，就是在接口的方法上面加上 @Select、@Update等注解，里面包含Sql语句来绑定；

- 通过xml里面写SQL来绑定， 在这种情况下，要指定xml映射文件里面的namespace必须为接口的全路径名。当Sql语句比较简单时候，用注解绑定， 当SQL语句比较复杂时候，用xml绑定，一般用xml绑定的比较多。



### 7、Mybatis是如何将sql执行结果封装为目标对象并返回的？都有哪些映射形式？

- 第一种是使用`<resultMap>`标签，逐一定义列名和对象属性名之间的映射关系。

- 第二种是使用sql列的别名功能，将列别名书写为对象属性名，比如`T_NAME AS NAME`，对象属性名一般是name，小写，但是列名不区分大小写，Mybatis会忽略列名大小写，智能找到与之对应对象属性名，你甚至可以写成`T_NAME AS NaMe`，Mybatis一样可以正常工作。

有了列名与属性名的映射关系后，Mybatis通过反射创建对象，同时使用反射给对象的属性逐一赋值并返回，那些找不到映射关系的属性，是无法完成赋值的。



### 8、Mybatis一对一、一对多的查询

MyBatis 中使用`collection`标签来解决一对多的关联查询，collection标签可用的属性如下：

> property:指的是集合属性的值.
> ofType:指的是集合中元素的类型.
> column:所对应的外键字段名称.
> select:使用另一个查询封装的结果.

MyBatis 中使用`association`标签来解决一对一的关联查询，association标签可用的属性如下：

>property:对象属性的名称.
>javaType:对象属性的类型.
>column:所对应的外键字段名称.
>select:使用另一个查询封装的结果！

如：

```xml
<mapper namespace="com.lcb.mapping.userMapper">  

    <!--collection  一对多关联查询 -->  
    <select id="getClass2" parameterType="int" resultMap="ClassesResultMap2">  
        select * from class c,teacher t,student s where c.teacher_id=t.t_id and c.c_id=s.class_id and c.c_id=#{id}  
    </select>  
    <resultMap type="com.lcb.user.Classes" id="ClassesResultMap2">  
        <id property="id" column="c_id"/>  
        <result property="name" column="c_name"/>  
        <association property="teacher" javaType="com.lcb.user.Teacher">  
            <id property="id" column="t_id"/>  
            <result property="name" column="t_name"/>  
        </association>  
        <collection property="student" ofType="com.lcb.user.Student">  
            <id property="id" column="s_id"/>  
            <result property="name" column="s_name"/>  
        </collection>  
    </resultMap>  
    
    <!--association  一对一关联查询 -->  
    <select id="getClass" parameterType="int" resultMap="ClassesResultMap">  
        select * from class c,teacher t where c.teacher_id=t.t_id and c.c_id=#{id}  
    </select>  
    <resultMap type="com.lcb.user.Classes" id="ClassesResultMap">  
        <!-- 实体类的字段名和数据表的字段名映射 -->  
        <id property="id" column="c_id"/>  
        <result property="name" column="c_name"/>  
        <association property="teacher" javaType="com.lcb.user.Teacher">  
            <id property="id" column="t_id"/>  
            <result property="name" column="t_name"/>  
        </association>  
    </resultMap>  
</mapper>  
        
 <!-- 参考自：https://www.cnblogs.com/xdp-gacl/p/4264440.html -->  
```

个人觉得，发送一个sql去查询，使用`List<Object>` 作为回参也可以做到。

上面这段代码，也是面试经常问到的 **将sql执行结果封装为目标对象并返回**，其实现的过程就是通过`resultMap`进行封装，而`property`和 `column` 进行映射，使数据库的列名和对象的名称对应。Mybatis也会智能匹配，比如可以指定驼峰，如果找不到映射对应的关系，就是默认值。



### 9、Mybatis的分页原理

Mybatis使用RowBounds对象进行分页，它是针对ResultSet结果集执行的内存分页，而非物理分页，可以在sql内直接书写带有物理分页的参数来完成物理分页功能，也可以使用分页插件来完成物理分页。

分页插件的原理就是使用MyBatis提供的插件接口，实现自定义插件，在插件的拦截方法内，拦截待执行的SQL，然后根据设置的dialect（方言），和设置的分页参数，重写SQL ，生成带有分页语句的SQL，执行重写后的SQL，从而实现分页。

举例：`select * from student`，拦截sql后重写为：`select t.* from （select * from student）t limit 0，10`



### 10、什么是Mybatis的动态SQL？

1) 传统的JDBC的方法，在组合SQL语句的时候需要去拼接，稍微不注意就会少少了一个空格，标点符号，都会导致系统错误。Mybatis的动态SQL就是为了解决这种问题而产生的；Mybatis的动态SQL语句值基于OGNL表达式的，方便在SQL语句中实现某些逻辑；可以使用标签组合成灵活的sql语句，提供开发的效率。 

2) Mybatis的动态SQL标签主要由以下几类： 

If语句（简单的条件判断） 

Choose(when/otherwise)，相当于java语言中的switch，

 Trim(对包含的内容加上prefix，或者suffix)

 Where(主要是用来简化SQL语句中where条件判断，能智能的处理and/or 不用担心多余的语法导致的错误) 

Set(主要用于更新时候) 

Foreach(一般使用在mybatis in语句查询时特别有用)



### 11、Mybatis的批量操作数据的方法

一般三种：

1、使用for循环在java代码中insert （不推荐）

2、foreach