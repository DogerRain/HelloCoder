---
title: Maven的介绍
date: 2022-05-26 17:04:01
permalink: /pages/Maven%E7%9A%84%E4%BB%8B%E7%BB%8D
lock: false
categories: 
  - PureJavaCoderRoad
  - 开发辅助工具
  - Maven
tags: 
  - Maven
  - 介绍
---
Maven是一个跨平台的项目管理工具。作为Apache组织的一个颇为成功的开源项目，其主要服务于基于Java平台的项目创建，依赖管理和项目信息管理。

## 1、Maven的安装：

Maven下载地址：https://maven.apache.org/download.cgi

Maven的安装需要依赖jdk，所以本地需要先安装jdk。

安装Maven之后，打开项目的`setting.xml`,可以配置本地仓库地址（默认在C盘），本地仓库地址就是你需要用到的jar的储存位置：

![ ](https://fastly.jsdelivr.net/gh/DogerRain/image@main/img-202205/image-20200526234043294.png)

然后配置环境变量：

1. 新建系统变量 `MAVEN_HOME` ,值为你的maven安装目录，例如我的是 `G:\apache-maven-3.5.4-bin`
2. 在 `path`后面加上 `%MAVEN_HOME%\bin`

window系统快捷键 Ctrl+R 输入cmd  ，回车 ，输入` mvn -v`, 输出以下即安装成功：

![ ](https://fastly.jsdelivr.net/gh/DogerRain/image@main/img-202205/image-20200526231731305.png)

安装成功后就可以在IDEA中配置Maven了，之后使用就可以使用Maven进行项目开发和打包了。



## 2、Maven有什么用？

###  1. 依赖管理

我们平时使用的各种jar，例如连接MySQL，需要下载`mysql-connector-java-5.1.5-bin.jar`,使用spring框架，需要下载下面这堆jar

![ ](https://fastly.jsdelivr.net/gh/DogerRain/image@main/img-202205/image-20200526230328308.png)

下载了jar之后，你还需要手动添加进项目，这样子你的项目就可以使用jdbc、spring的API了，这样做太麻烦了，如果你使用Maven，就可以省去以上的工作，你只需要在项目的pom.xml文件引入依赖即可：

```xml
    <!-- 数据库驱动 -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        <version>5.1.35</version>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-web</artifactId>
            <version>4.0.2.RELEASE</version>
        </dependency>
```

groupId、artifactId、version 就是这个依赖的坐标，能确定唯一的jar，简称GAV。

这样子Maven就会自动帮你去Maven的中央仓库下载jar到本地。

> 可以自行百度配置阿里的镜像，这样下载更快

maven的中央仓库地址：[https://mvnrepository.com/](https://mvnrepository.com/ )  ，这里收集了所有的开源依赖，只需要在这里找到GAV即可下载。

### 2. 一键构建

我们的服务器要运行我们的项目，我们需要把项目打成jar或者war放到服务器的目录，例如Tomcat就是webaaps目录下面，Tomcat会自动识别war或者jar包（自动解压），我们只需要访问项目的路径即可进入到我们的项目。

如果你不想打成jar或者war，可以把编译后的.class文件直接放在webapps项目也是一样的效果，但是这种方法不高效。

打开IDEA，我们可以看到这里有很多maven的命令：

![ ](https://fastly.jsdelivr.net/gh/DogerRain/image@main/img-202205/image-20200526233020062.png)

你也可以自定义maven命令，进入项目的目录，输入`mvn clean package ` ，我们可以看到项目的输出目录就生成了jar

![ ](https://fastly.jsdelivr.net/gh/DogerRain/image@main/img-202205/image-20200526233320788.png)

   这个jar就可以直接使用`java -jar MeiziTu-0.0.1-SNAPSHOT.jar` 命令运行了。

### 3. 项目拆分

有时候我们一个大项目，存在很多子项目，就可以使用maven进行拆分，让不同的子项目负责不同的功能模块。

![ ](https://fastly.jsdelivr.net/gh/DogerRain/image@main/img-202205/image-20200526232738803.png)

只需要在父项目的`pom.xml`文件加入配置即可：

![ ](https://fastly.jsdelivr.net/gh/DogerRain/image@main/img-202205/image-20200526233705682.png)



看到这里你大概知道maven有什么用了，你看到一个项目有`pom.xml`文件，就知道这个项目是使用的maven来管理的啦~



下面讲一下maven深入的用法：

## 3、Maven深入用法

### 1. maven的jar使用流程

 

公司一般都有自己的私有仓库，毕竟公司项目都需要打包发布上线的，我们写的项目一般都会把代码上传到git仓库，使用第三方工具把代码构建形成一个jar，再丢到私有仓库。

这涉及maven的另外一个功能，就是maven在构建项目的时候，我们可以配置本地仓库地址，构建完成后就可以把jar上传到仓库，供大家使用，虽然本地也可以上传，比如下图的程序员A，但是这样子很危险，一般需要先提交代码到git，代码审核通过了，最后才能打成jar丢到私有仓库。

流程如下：

![ ](https://fastly.jsdelivr.net/gh/DogerRain/image@main/img-202205/%E6%B5%81%E7%A8%8B.png)

**私有仓库**：存放我们需要的jar、我们在`pom.jar`可以引用，私有仓库找不到会去中央仓库下载。

**Git仓库**：Git是用来存放和管理代码的地方。私有仓库是管理jar。

**Jenkins**：可以理解为一个中介（功能很强大），打包、发布，用来持续集成。



### 2. 几个maven命令的区别

```xml
1、mvn compile  项目编译
2、mvn test 执行单元测试
3、mvn clean 清除jar、class文件

4、mvn pakage 打成一个jar或者war,一般在target目录
5、mvn install 打成一个jar或者war，布署到本地maven仓库
6、mvn deploy  打成一个jar或者war，布署到本地maven仓库和远程maven私服仓库


7、mvn versions:set -DnewVersion=xxxx  设置Maven的版本  
8、mvn dependency:tree  查看maven的依赖树（排查依赖很有效）
```



比如命令：

```bash
clean package -Dmaven.test.skip=true -P pro
```

执行`clean` ，跳过单元测试打包到target目录，并且选择 `pro`作为节点，这是Maven选择profile的功能，这里指定到pro环境：

> 即 `<id>pro</id>` 这里

```xml
<profiles>
        <!--开发环境 -->
        <profile>
            <id>dev</id>
            <properties>
                <!--自定义常量参数-->
                <spring.profiles.active>dev</spring.profiles.active>
            </properties>
            <activation>
                <activeByDefault>true</activeByDefault>
            </activation>
        </profile>
        <!--测试环境 -->
        <profile>
            <id>test</id>
            <properties>
                <spring.profiles.active>test</spring.profiles.active>
            </properties>
        </profile>
        <!--生产环境 -->
        <profile>
            <id>pro</id>
            <properties>
                <spring.profiles.active>pro</spring.profiles.active>
            </properties>
            <repositories>
                <repository>
                    <!--仓库id，repositories可以配置多个仓库，保证id不重复-->
                    <id>nexus</id>
                    <!--仓库地址，即nexus仓库组的地址-->
                    <url>http://localhost:8081/nexus/content/groups/public/</url>
                    <!--是否下载releases构件-->
                    <releases>
                        <enabled>true</enabled>
                    </releases>
                    <!--是否下载snapshots构件-->
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </repository>
            </repositories>
            <pluginRepositories>
                <!-- 插件仓库，maven的运行依赖插件，也需要从私服下载插件 -->
                <pluginRepository>
                    <!-- 插件仓库的id不允许重复，如果重复后边配置会覆盖前边 -->
                    <id>public</id>
                    <name>Public Repositories</name>
                    <url>http://localhost:8081/nexus/content/groups/public/</url>
                </pluginRepository>
            </pluginRepositories>
        </profile>
    </profiles>
```



所以个人本地不需要执行`mvn deploy`命令，只需要`install` 就会把jar生成到我们的本地的仓库地址，其他项目就可以引用了。

## 4、其他概念

一个约定俗成的Maven项目的目录结构：

```xml
HelloWorld					工程名
|---src						源码
|---|---main				放主程序
|---|---|---java			存放java源文件
|---|---|---resources		存放框架或其他工具的配置文件
|---|---test				存放测试程序
|---|---|---java			存放java源文件
|---|---|---resources		存放框架或其他工具的配置文件
|---pom.xml					Maven的核心配置文件
```

### 构建配置文件的类型

构建配置文件大体上有三种类型

| 类型                  | 在哪定义                                                     |
| --------------------- | ------------------------------------------------------------ |
| 项目级（Per Project） | 定义在项目的POM文件pom.xml中                                 |
| 用户级 （Per User）   | 定义在Maven的设置xml文件中 (%USER_HOME%/.m2/settings.xml)    |
| 全局（Global）        | 定义在Maven全局的设置xml文件中 (%M2_HOME%/conf/settings.xml) |

### 仓库

Maven仓库有三种类型：

- 本地仓库（local）
- 中央仓库（central）
- 远程仓库（remote）

#### 本地仓库

Maven本地仓库是你电脑上的某个目录地址。

Maven的`conf/setting.xml`文件可以配置：

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 
   http://maven.apache.org/xsd/settings-1.0.0.xsd">
      <localRepository>C:/MyLocalRepository</localRepository>
</settings>
```

Maven本地仓库保存着你项目所有的依赖（库的、插件的jar包等等）。当你运行Maven构建时，Maven会自动下载所有依赖的jar包到本地仓库中，这会帮助避免每次项目构建时项目的依赖参考都存储在远程的主机上。

使用`mvn install` 则可以把本地的包推到本地仓库，这样可以被本地其他项目引用。

#### 中央仓库

Maven中央仓库是由Maven社区提供的仓库。它包含大量的常用库。 Maven 当未在本定仓库中找到任何的依赖时，Maven会使用下面的URL在中央仓库中搜索：[https://mvnrepository.com/](https://mvnrepository.com/ ) 

中央仓库几个关键概念：

- 中央仓库仓库是由Maven社区管理。　
- 中央仓库不需要配置。
- 搜索中央仓库需要接入互联网。

Maven社区提供了一个URL [**http://search.maven.org/#browse** ](http://search.maven.org/#browse)供用户浏览Maven中央仓库的内容。用这种方法，开发者可以搜索中央仓库中所有可用的库。

#### 远程仓库

有时Maven在中央仓库中也找不到指定的依赖，这时Maven会停止构建进程并且输出错误信息到控制台。为了防止这样的情况，Maven提出了**远程仓库**的概念，即开发者自己定制的包含库或者其他项目jar包的仓库。

一般公司都有自己的远程仓库。

可以在pom.xml进行配置：

```xml
   <repositories>
      <repository>
         <id>companyname.lib1</id>
         <url>http://download.companyname.org/maven2/lib1</url>
      </repository>
      <repository>
         <id>companyname.lib2</id>
         <url>http://download.companyname.org/maven2/lib2</url>
      </repository>
   </repositories>
```

这个一般都是配置在全局文件 `settings.xml` 中的 	



当我们执行Maven构建命令时，Maven将开始按照下面的顺序搜索依赖库。

- 第1步 - 搜索本地仓库中的依赖，如果没有找到，进入第2步，否则若找到则进行后续的处理。
- 第2步 - 搜索中央仓库中的依赖，如果没有找到并且指定了远程仓库，则进入第4步，否则若找到，则下载依赖到本地仓库进行后续的查询。
- 第3步 - 如果远程仓库没有指定，Maven将简单地停止构建并且抛出异常（找不到依赖）。
- 第4步 - 搜素远程仓库中的依赖，如果找到则下载依赖到本地仓库进行后续的查询，否则Maven按预想地停止构建并且抛出异常（找不到依赖）。



### 镜像

在maven中不配置mirror时默认使用的是maven的中央库。

maven的中央仓库因为是国外镜像，可以配置阿里的镜像，这样下载jar就会很快：

> 配置参考：https://maven.aliyun.com/mvn/guide

如果不想看上面的参考，你可以像我这样操作：

打开 maven 的配置文件（ windows 机器一般在 maven 安装目录的 **conf/settings.xml** ），在`<mirrors></mirrors>`标签中添加 阿里云的 mirror 子节点:

```xml
<mirror>
  <id>aliyunmaven</id>
  <mirrorOf>*</mirrorOf>
  <name>阿里云公共仓库</name>
  <url>https://maven.aliyun.com/repository/public</url>
</mirror>
```



`mirrorOf`可以设置为不同的 仓库id， 一般设置 为 `central` 或者 `*` 

 `*` 表示所有的请求地址都被拦截，所有的请求都去这个地址拉取，如果在私服（公司内），不要这样配置。**若依赖包不存在也不会去中央仓库获取**。因为这里表示后面就没有备库了。

 `central` 表示只拦截 central 仓库，（在maven的父pom文件当中，配置了一个默认的远程仓库，即中央仓库，ID为：central），本来嘛，找不到就会去Maven中央仓库找，但是很慢；现在用阿里的，阿里直接拦截了，阿里的表示先去我这里找吧，我比较快，找不到你再去Maven中央仓库找。



mirror相当于一个拦截器，它会拦截maven对remote repository的相关请求，把请求里的remote repository地址，重定向到mirror里配置的地址。



## 5、一些疑难点

**对于Maven而言，同一个groupId同一个artifactId下，只能使用一个version**！

工程中需要引入A、B，而A依赖1.0版本的C，B依赖2.0版本的C，那么问题来了，C使用的版本将由引入A、B的顺序而定？这显然不靠谱！如果A的依赖写在B的依赖后面，将意味着最后引入的是1.0版本的C，很可能在运行阶段出现类（**ClassNotFoundException**）、方法（**NoSuchMethodError**）找不到的错误（因为B使用的是高版本的C）！

**这里其实涉及到了2个概念：依赖传递（transitive）、Maven的最近依赖策略。**

**依赖传递：如果A依赖B，B依赖C，那么引入A，意味着B和C都会被引入。**

Maven的最近依赖策略：如果一个项目依赖相同的groupId、artifactId的多个版本，那么在依赖树（`mvn dependency:tree`，现在idea也有这个依赖包查看工具）中**离项目最近的那个版本将会被使用**。（从这里可以看出Maven是不是有点小问题呢？能不能选择高版本的进行依赖么？据了解，Gradle就是选择最高version策略）

现在，我们可以想想如何处理依赖冲突呢？

**想法1：要使用哪个版本，我们是清楚的，那么能不能不管如何依赖传递，都可以进行版本锁定呢？**

使用 `<dependencyManagement>` 这种主要用于子模块的版本一致性中

**想法2：在依赖传递中，能不能去掉我们不想依赖的？**

使用 `<exclusions>` 在实际中我们可以在IDEA中直接利用插件帮助我们生成

如：

```xml
<dependency>
    <groupId>log4j</groupId>
    <artifactId>log4j</artifactId>
    <version>1.2.15</version>
    <scope>compile</scope>
    <exclusions>
        <exclusion>
            <groupId>com.sun.jmx</groupId>
            <artifactId>jmxri</artifactId>
        </exclusion>
        <exclusion>
            <groupId>com.sun.jdmk</groupId>
            <artifactId>jmxtools</artifactId>
        </exclusion>
        <exclusion>
            <groupId>javax.jms</groupId>
            <artifactId>jms</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

**想法3：既然是最近依赖策略，如果我不想使用默认的版本怎么办？**

可以使用`<dependency>`指定你需要的版本



## 6、一些高级用法

**关于引入的一些参数**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-tomcat</artifactId>
    <scope>provided</scope>
    <optional>true</optional>
</dependency>
```

有时候会看到引入依赖的时候有一个 scope 参数

scope的值有以下几种可能，进行分情况讲解：

**1、compile**

默认就是compile，什么都不配置也就是意味着compile。compile表示被依赖项目需要参与当前项目的编译，当然后续的测试，运行周期也参与其中，是一个比较强的依赖。打包的时候通常需要包含进去。默认的scope,在部署的时候将会打包到lib目录下，项目在编译，测试，运行阶段都需要

**2、test**

scope为test表示依赖项目仅仅参与测试相关的工作，在编译和运行环境下都不会被使用，更别说打包了。

**3、runntime**

runntime这个scope，仅仅适用于运行环境，在编译和测试环境下都不会被使用

**4、provided**

provided适合在编译和测试的环境，他和compile很接近，但是provide仅仅需要在编译和测试阶段，同样provide将不会被打包到lib目录下。

**5、system**

从参与度来说，也provided相同，不过被依赖项不会从maven仓库抓，而是从本地文件系统拿，一定需要配合systemPath属性使用。

scope的依赖传递

A–>B–>C。当前项目为A，A依赖于B，B依赖于C。知道B在A项目中的scope，那么怎么知道C在A中的scope呢？答案是： 

当C是test或者provided时，C直接被丢弃，A不依赖C； 

否则A依赖C，C的scope继承于B的scope。

**optional标签**

`<optional>true</optional>`的话，其他项目依赖此项目也不会进行传递，只能本项目使用。

**optional**：设置指依赖是否可选，默认为false,即子项目默认都继承；如果为true,则子项目必需显示的引入，与dependencyManagement里定义的依赖类似 。与dependencyManagement里定义的依赖类似 。

比如说，A项目依赖B项目，项目B有fastjson，那么默认情况下A也会有fastjson，如果B写了 `<optional>true</optional>` ，则A不会有fastjson

但是，如果是子项目使用这个parent，optional 为 true 是会失效的。，即dependencyManagement 会被继承：

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>2.9.9</version>
            <optional>true</optional>
        </dependency>
    </dependencies>
</dependencyManagement>
```

**exclusions和exclusion标签**

**exclusions**：如果X需要A,A包含B依赖，那么X可以声明不要B依赖，只要在exclusions中声明exclusion。

**exclusion**：将B从依赖树中删除，如上配置，alibaba.apollo.webx不想使用com.alibaba.external ,但是alibaba.apollo.webx是集成了com.alibaba.external,所以就需要排除掉。

```xml
	<exclusions>
		<exclusion>
			<artifactId>org.slf4j.slf4j-api</artifactId>
			<groupId>comma.alibaba.external</groupId>
		</exclusion>
	</exclusions>
```

**parent标签**

**parent**：如果一个工程作为父类工程，那就必须添加pom,子系统要继承父类，也必须使用**parent**标签

```xml
<parent> 
    	<groupId>org.codehaus.mojo</groupId> 
    	<artifactId>my-parent</artifactId> 
    	<version>2.0</version> 
    	<relativePath>../my-parent</relativePath> 
</parent>
```

> **relativePath**：为可选项，maven会首先搜索该地址，然后再搜索远程仓库。

## 7、常用命令

比如说我常用的自定义命令：

```
clean package -Dmaven.test.skip=true -U -P dev
```

mvn package 会调用 maven-jar-plugin 这个插件进行打包。打成war或者jar

不想用mvn clean又想保证jar包最新，建议添加 -Djar.forceCreation 参数

为了保险起见,建议package,install,deploy前均先clean，但最保险还是用 mvn clean install 生成最新的包

```
mvn –version

mvn -v
```

显示maven安装版本信息

```
mvn clean
```

清理项目打包文件，即项目下的target目录

```
mvn compile
```

编译项目下的src/main/Java目录源代码

```
mvn package
```

项目打包，在项目target目录下生成编译后的jar或war等文件

```
mvn install
```

项目打包并发布到本地仓库

```
mvn deploy
```

项目打包并发布到远程仓库

```
mvn test
```

单元测试命令，执行src/test/java/下的junit的单元测试用例

```
mvn site
```

生成项目相关信息的网站

```
mvn eclipse:eclipse
```

将项目转化eclipse项目

```
mvn dependency:tree
```

打印出项目的整个依赖关系树

```
mvn archetype:generate
```

创建一个maven普通java项目

```
mvn tomcat:run
```

在tomcat容器中运行web应用，需要在pom文件中配置tomcat插件

```
mvn jetty:run
```

在jetty容器中运行web应用，需要在pom文件中配置jetty插件

还有一些参数：

| 参数 | 全称                   | 释义                                                         | 说明                                                         |
| ---- | ---------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| -pl  | --projects             | Build specified reactor projects instead of all projects     | 选项后可跟随{groupId}:{artifactId}或者所选模块的相对路径(多个模块以逗号分隔)， 编译指定 module |
| -am  | --also-make            | If project list is specified, also build projects required by the list | 表示同时处理选定模块所依赖的模块                             |
| -amd | --also-make-dependents | If project list is specified, also build projects that depend on projects on the list | 表示同时处理依赖选定模块的模块                               |
| -N   | --Non-recursive        | Build projects without recursive                             | 表示不递归子模块                                             |
| -rf  | --resume-from          | Resume reactor from specified project                        | 表示从指定模块开始继续处理                                   |

> 如：-pl !admin-service  表示跳过admin-service 模块

