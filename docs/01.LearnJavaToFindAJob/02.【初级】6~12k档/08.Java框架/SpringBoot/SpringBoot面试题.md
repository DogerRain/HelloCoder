---
title: SpringBoot面试题
date: 2022-06-02 11:18:20
lock: false
permalink: /pages/SpringBoot%E9%9D%A2%E8%AF%95%E9%A2%98
categories: 
  - LearnJavaToFindAJob
  - 【初级】6~12k档
  - Java框架
  - SpringBoot
tags: 
  - SpringBoot
  - 面试题
---
### 1、什么是SpringBoot？和传统的Spring有什么区别？

Spring Boot 是 Spring 开源组织下的子项目，是 Spring 组件**一站式解决方案，主要是简化了使用 Spring 的难度，简省了繁重的配置，提供了各种启动器，开发者能快速上手。**

Spring在传统上要集成mybatis、maven、MVC 需要配置一大堆的xml，而且部署还需要servlet容器（Tomcat、Jetty等）。

所以Spring Boot 的 优点就出来了：

- 简化配置

  比如说一个`spring-boot-starter-web` 就包含了很多依赖组件，不需要像Spring那样逐个添加依赖。

- 独立运行

  Spring Boot而且内嵌了各种servlet容器，Tomcat、Jetty等，现在不再需要打成war包部署到容器中，Spring Boot只要打成一个可执行的jar包就能独立运行，所有的依赖包都在一个jar包内。

  而已一个main方法就可以运行了。

- 无代码生成和XML配置、自动配置

  Spring Boot配置过程中无代码生成，也无需XML配置文件就能完成所有配置工作，这一切都是借助于条件注解完成的。核心配置文件是 application 和 bootstrap 配置文件。

缺点也有：

- 管理复杂、部署复杂

  随着服务数量增加，每次部署都要重启验证，服务之间调用、通信也会造成服务器的压力，而且运维工作量也增大，服务监测的工作量也增大。

  

**面试中也经常会问到什么是微服务？**

我们误以为微服务就是springboot，其实不是的，dubbo也是一个微服务框架。微服务突出在一个微字上面。微服务部署在不同的机器上 服务之间进行相互调用。

你可以理解为医院是一个大项目，在医院建立初期，没有科室的的概念，只要病人进来了，一律治。随着医院发展，病人激增，通过划分科室，每个科室就是微服务，每个科室只负责自己的专科看诊，让医院不再是乱糟糟的。科室之间可以相互通信，比如说可以借设备、科室联合决定是否马上需要手术（同步：RPC、REST 、异步：消息队列）。



### 2、Spring Boot 的配置文件有哪几种格式？它们有什么区别？

.properties 和 .yml，它们的区别主要是书写格式不同。

1).properties

```properties
app.user.name = HaC
```

2).yml

```properties
app:
  user:
    name: HaC
```

> YAML是一种人类可读的数据序列化语言。它通常用于配置文件。
> 与属性文件相比，如果我们想要在配置文件中添加复杂的属性，YAML文件就更加结构化，而且更少混淆。可以看出YAML具有分层配置数据。



### 3、Spring Boot 的核心注解是什么，自动配置的原理是什么？

首先要知道，springboot 的启动可以通过main方法启动，它的关键注解是 `@SpringBootApplication` 。

它包括：

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = {
		@Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
		@Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {
```

所以，**SpringBoot启动会加载大量的自动配置类。**

`@SpringBootApplication`包含以下三个注解：

- `@SpringBootConfiguration`：我们点进去以后可以发现底层是**Configuration**注解，说白了就是支持**JavaConfig**的方式来进行配置(**使用Configuration配置类等同于XML文件**)。
- `@EnableAutoConfiguration`：开启**自动配置**功能。
- `@ComponentScan`：这个就是**扫描**注解，默认是扫描**当前类下**的package。将`@Controller/@Service/@Component/@Repository`等注解加载到IOC容器中。学过spring的就知道配置xml需要扫描包。

最重要的注解就是 `@EnableAutoConfiguration`，注解内使用到了`@import`注解来完成导入配置的功能。为什么我们不用写很多配置，就可以直接运行，就是这个注解的功劳。

然后扫描`META-INF/spring.factories`文件的jar包，该文件中定义了关于初始化，监听器等信息，而真正使自动配置生效的key是`org.springframework.boot.autoconfigure.EnableAutoConfiguration`

在启动过程中会解析对应类配置信息。每个Configuation类都定义了相关bean的实例化配置。都说明了哪些bean可以被自动配置，什么条件下可以自动配置，并把这些bean实例化出来。



### 4、什么是 Spring Boot Stater ？

可以理解为这是一个启动器，这个启动器会自动依赖其他组件，一站式获取你需要的与spring有关的组件。

举个例子：

如果你想使用 Sping 和 JPA 访问数据库，只需要你的项目包含 `spring-boot-starter-data-jpa`、`spring-boot-starter-jdbc`  依赖项，你就可以完美进行。

如果你想开发一个web应用程序，只需要你的项目包含 `spring-boot-starter-web` 依赖项就可以了。

```
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

然后就会自动依赖其他组件：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210220112427605.png)

而不是像spring那样，你需要在pom单独引入spring-core、spring-beans、spring-aop 等等，最最最重要的是，**可以省去了版本冲突的问题。**还可以通过`spring-boot-starter-parent` 统一控制版本。



### 5、spring-boot-starter-parent 的作用是什么？

前面说到 ，`spring-boot-starter-parent` 可以统一控制版本。

还有以下作用：

- 使用Java编译、打包版本

```
<properties>
  <java.version>1.8</java.version>
</properties>
```

- 指定编码

```
<properties>
 <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>
```

- 统一版本

一个引用管理的功能，在dependencies里的部分配置可以不用填写version信息，这些version信息会从spring-boot-dependencies里得到继承。

继承默认版本：

```
<dependency>
   <groupId>com.alibaba</groupId>
   <artifactId>fastjson</artifactId>
 </dependency>
```

- 识别过来资源过滤

例如，打包的时候把src/main/resources下所有文件都打包到包中：

```
<includes>
  <include>**/*.*</include>
</includes>
  <filtering>true</filtering>
</resource>
```

---

**为什么可以统一版本？**

可以看一下`spring-boot-starter-parent`  ，我这里是`2.4.1`版本，它的parent是 `spring-boot-dependencies`

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210220114501787.png)

再根据`spring-boot-dependencies` 跳过去，发现该版本下的`spring-boot-starter-parent` 会有很多默认的依赖包的版本：

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210220135510468.png)

现在你就知道 `spring-boot-starter-parent` 不需要其他依赖包指定版本了吧，这里都有默认的版本，你可以不需要考虑依赖包的版本了 ，完美解决包冲突问题。

### 6、SpringBoot、Spring MVC和Spring有什么区别？

**Spring**

Spring最重要的特征是依赖注入。所有Spring Modules不是依赖注入就是IOC控制反转。

当我们恰当的使用DI或者是IOC的时候，可以开发松耦合应用。

**Spring MVC**

Spring MVC提供了一种分离式的方法来开发Web应用。通过运用像DispatcherServelet，MoudlAndView 和 ViewResolver 等一些简单的概念，开发 Web 应用将会变的非常简单。

**SpringBoot**

Spring和Spring MVC的问题在于需要配置大量的参数。

SpringBoot通过一个自动配置和启动的项来解决这个问题。



### 7、spring-boot-maven-plugin 的作用是什么？

一般的maven项目的打包命令，不会把依赖的jar包也打包进去的，只是会放在jar包的同目录下，能够引用就可以了，但是spring-boot-maven-plugin插件，会将依赖的jar包全部打包进去。

spring-boot-maven-plugin 提供了一些像 jar 一样打包或者运行应用程序的命令：

- spring-boot:run 运行你的 SpringBooty 应用程序。
- spring-boot：repackage 重新打包你的 jar 包或者是 war 包使其可执行
- spring-boot：start 和 spring-boot：stop 管理 Spring Boot 应用程序的生命周期（也可以说是为了集成测试）。
- spring-boot:build-info 生成执行器可以使用的构造信息。

这是springboot的默认打包插件和命令：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210220164501305.png)

**spring-boot-maven-plugin 会打包成一个可以直接运行的JAR文件，使用"`java -jar`"命令就可以直接运行。**

repackage 功能的 作用，就是在打包的时候，多做一点额外的事情：

1. 首先 `mvn package` 命令 对项目进行打包，打成一个 `jar`，这个 `jar` 就是一个普通的 `jar`，可以被其他项目依赖，但是不可以被执行
2. `repackage` 命令，对第一步 打包成的 `jar` 进行再次打包，将之打成一个 可执行 `jar` ，通过将第一步打成的 `jar` 重命名为 `*.original` 文件

### 8、SpringBoot 打成jar和普通的jar有什么区别？

Spring Boot 项目最终打包成的 jar 是可执行 jar ，这种 jar 可以直接通过 `java -jar xxx.jar` 命令来运行，但是，这种 jar 不可以被其他项目依赖，即使依赖了也无法使用其中的类。

> 通过jar运行实际上是启动了内置的tomcat

Spring Boot 的 jar 无法被其他项目依赖，主要还是它和普通 jar 的结构不同。

普通的 jar 包，解压后直接就是包名，包里就是我们的代码，而 Spring Boot 打包成的可执行 jar 解压后，在 `BOOT-INFclasses` 目录下才是我们的代码，因此无法被直接引用。



如果A模块包依赖了B模块，在B模块的pom文件，加入如下配置即可：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <skip>true</skip>
            </configuration>
        </plugin>
    </plugins>
</build>
```



或者你要打成的jar需要被其他模块依赖，需要这样配置：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <classifier>exec</classifier>
            </configuration>
        </plugin>
    </plugins>
</build>
```

这样会打成两个jar，一个是可以直接运行的，一个exec是可以被其他项目依赖的：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210220164955457.png)

我觉得这样没必要，你要打成一个依赖包给其他项目用，那你没必要把这个项目打成可运行的jar，最好的方法就是把依赖项目重新放到一个新的项目，使用`<skip>true</skip>`被其他项目依赖即可。