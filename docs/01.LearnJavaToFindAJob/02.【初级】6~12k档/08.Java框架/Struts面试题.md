---
title: Struts面试题
date: 2022-06-02 11:18:18
lock: false
permalink: /pages/Struts%E9%9D%A2%E8%AF%95%E9%A2%98
categories: 
  - LearnJavaToFindAJob
  - 【初级】6~12k档
  - Java框架
tags: 
  - Struts
  - 面试题
---
个人觉得，Struts框架已经不流行了，传统的项目可能还会使用Struts。这部分可以简单看一下，面试一般不会问Struts，除非你的项目经验有使用过。

### 1、Struts的理解

> 官方解释：它通过采用 Java Servlet/JSP 技术，实现了基于Java EE Web应用的MVC设计模式的应用框架，是MVC经典设计模式中的一个经典产品。

Structs分Struts1、Struts2 ，是一个轻量级的MVC框架，后者在不断的优化，但是风险和漏洞太多，加上Spring MVC的出现，已经代替了Struts了。



在没有Struts的时候，我们都是使用servlet处理请求的，而Struts恰好就是为了解决这个问题的，servlet默认在第一次访问的时候只创建一次对象，是单实例对象；Struts2的action是多实例对象，每次访问的时候都会创建action对象，是多态的。



**与Servlet对比**

优点：业务代码解耦，提高开发效率。提供了对MVC的一个清晰的实现，这一实现包含了很多参与对所以请求进行处理的关键组件，如：拦截器、OGNL表达式语言、堆栈。

缺点：执行效率偏低，需要使用反射、解析XML等技术手段，结构复杂。



**优点：**

​	（1） 实现了MVC模式，层次结构清晰，使程序员只需关注业务逻辑的实现。

​    （2） 丰富的标签库，大大提高了开发的效率。

​    （3） Struts2提供丰富的拦截器实现。

​    （4） 通过配置文件，就可以掌握整个系统各个部分之间的关系。

​    （5） 异常处理机制，只需在配置文件中配置异常的映射，即可对异常做相应的处理。
​    （6） Struts2的可扩展性高。Struts2的核心jar包中由一个struts-default.xml文件，在该文件中设置了一些默认的bean,resultType类型，默认拦截器栈等，所有这些默认设置，用户都可以利用配置文件更改，可以更改为自己开发的bean，resulttype等。因此用户开发了插件的话只要很简单的配置就可以很容易的和Struts2框架融合，这实现了框架对插件的可插拔的特性。

​    （7） 面向切面编程的思想在Strut2中也有了很好的体现。最重要的体现就是拦截器的使用，拦截器就是一个一个的小功能单位，用户可以将这些拦截器合并成一个大的拦截器，这个合成的拦截器就像单独的拦截器一样，只要将它配置到一个、Action中就可以。



**缺点：**

​    （1） 传参麻烦，要经过默认的拦截器，参数过多就会臃肿，而且参数校验繁琐，需要根据不同的参数错误返回给前端，就需要配置多个name。
​    （2） 安全性有待提高，被爆漏洞多。



### 2、Struts2 的核心

Struts2 在 `web.xml` 配置 的核心——`StrutsPrepareAndExecuteFilter`，也是Struts2 的核心。

```xml
<filter>
    <filter-name>Struts2</fileter-name>
    <filter-class>org.apache.struts2.dispatcher.ng.filter.StrutsPrepareAndExecuteFilter</filter-class>
</filter>
<filter-mapping>
    <filter-name>Struts2</filter-name>
    <url-pattern>/*</url-pattern>
<filter-mapping>
```



`struts.xml` 的配置：

```xml
	<package name="admin" extends="admin-default" namespace="/admin">
		<action name="default">
			<result>/WEB-INF/page/admin/frame/default.jsp</result>
		</action>
		<action name="menu">
			<result name="success">/WEB-INF/page/admin/frame/menu.jsp</result>
		</action>
		<action name="top">
			<result>/WEB-INF/page/admin/frame/top.jsp</result>
		</action>
	</package>
```



### 3、Struts的执行流程

1. 客户端浏览器发出HTTP请求。
2. 根据`web.xml`配置，该请求被`StrutsPrepareAndExecuteFilter`接收。如果判断是struts2请求，就把它交给ActioProxy处理
3. `ActionProxy`创建一个`ActionInvocation`的实例（采用动态代理的方式），并进行初始化
4. `ActionInvocation`实例在调用Action的过程前后，涉及到相关拦截器(Intercepter)的调用
5. 根据`struts.xml`配置，找到需要调用的Action类和方法，并通过IoC方式，将值注入给Aciton。
6. Action执行完毕，根据`struts.xml`中的配置找到对应的返回结果result，并跳转到相应页面。
7. 返回HTTP响应到客户端浏览器。