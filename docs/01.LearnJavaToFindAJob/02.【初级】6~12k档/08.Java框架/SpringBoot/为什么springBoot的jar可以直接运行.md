---
title: 为什么springBoot的jar可以直接运行
date: 2022-06-02 11:18:21
lock: false
permalink: /pages/%E4%B8%BA%E4%BB%80%E4%B9%88springBoot%E7%9A%84jar%E5%8F%AF%E4%BB%A5%E7%9B%B4%E6%8E%A5%E8%BF%90%E8%A1%8C
categories: 
  - LearnJavaToFindAJob
  - 【初级】6~12k档
  - Java框架
  - SpringBoot
tags: 
  - springBoot
  - jar
---
SpringBoot提供了一个插件spring-boot-maven-plugin用于把程序打包成一个可执行的jar包。

这个插件和普通的maven打包工具是不一样的。

**区别：**

Spring Boot 项目最终打包成的 jar 是可执行 jar ，这种 jar 可以直接通过 `java -jar xxx.jar` 命令来运行，但是，这种 jar 不可以被其他项目依赖，即使依赖了也无法使用其中的类。

> 通过jar运行实际上是启动了内置的tomcat

Spring Boot 的 jar 无法被其他项目依赖，主要还是它和普通 jar 的结构不同。

普通的 jar 包，解压后直接就是包名，包里就是我们的代码，而 Spring Boot 打包成的可执行 jar 解压后，在 `BOOT-INFclasses` 目录下才是我们的代码，因此无法被直接引用。



## 1、官方说明

可以看一下springboot官方对这个jar的说明。

链接：https://docs.spring.io/spring-boot/docs/2.3.1.RELEASE/reference/htmlsingle/#executable-jar-launching



打包后的jar的结构是这样的，主要分为三大块内容：

```bash
example.jar
 |
 +-META-INF
 |  +-MANIFEST.MF
 +-org
 |  +-springframework
 |     +-boot
 |        +-loader
 |           +-<spring boot loader classes>
 			+-<spring boot loader2 classes>
 +-BOOT-INF
    +-classes
    |  +-mycompany
    |     +-project
    |        +-XXX.class
    +-lib
       +-abc.jar
       +-abcd.jar
```

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210310112149525.png)

- BOOT-INF/classes：目录存放应用编译后的class文件。（应用程序类目录）
- BOOT-INF/lib：目录存放应用依赖的第三方JAR包文件。
- META-INF：目录存放应用打包信息(Maven坐标、pom文件)和MANIFEST.MF文件。
- org：目录存放SpringBoot相关class文件。
  



如果是war包，目录会有点区别：

```bash
example.war
 |
 +-META-INF
 |  +-MANIFEST.MF
 +-org
 |  +-springframework
 |     +-boot
 |        +-loader
 |           +-<spring boot loader classes>
 +-WEB-INF
    +-classes
    |  +-com
    |     +-mycompany
    |        +-project
    |           +-YourClasses.class
    +-lib
    |  +-dependency1.jar
    |  +-dependency2.jar
    +-lib-provided
       +-servlet-api.jar
       +-dependency3.jar
```

依赖项应该放在嵌套的 WEB-INF/lib 目录中。在运行嵌入式时需要的任何依赖项，但在部署到传统 web 容器时不需要的任何依赖项都应该放在 WEB-INF/lib-provided 中。



**入口：**

在springboot启动类的入口，官方给出了很明确的解释

> The `org.springframework.boot.loader.Launcher` class is a special bootstrap class that is used as an executable jar’s main entry point. It is the actual `Main-Class` in your jar file, and it is used to setup an appropriate `URLClassLoader` and ultimately call your `main()` method.
>
> Springframework.boot.loader.Launcher 类是一个特殊的引导类，用作可执行 jar 的主入口点。它是 jar 文件中的实际 Main-Class，用于设置适当的 URLClassLoader 并最终调用 main ()方法
>
> ---
>
> There are three launcher subclasses (`JarLauncher`, `WarLauncher`, and `PropertiesLauncher`). Their purpose is to load resources (`.class` files and so on) from nested jar files or war files in directories (as opposed to those explicitly on the classpath). In the case of `JarLauncher` and `WarLauncher`, the nested paths are fixed. `JarLauncher` looks in `BOOT-INF/lib/`, and `WarLauncher` looks in `WEB-INF/lib/` and `WEB-INF/lib-provided/`. You can add extra jars in those locations if you want more. The `PropertiesLauncher` looks in `BOOT-INF/lib/` in your application archive by default. You can add additional locations by setting an environment variable called `LOADER_PATH` or `loader.path` in `loader.properties` (which is a comma-separated list of directories, archives, or directories within archives).
>
> 有三个启动器子类(JarLauncher、 WarLauncher 和 PropertiesLauncher)。它们的目的是装载资源(。类文件等)从目录中的嵌套 jar 文件或 war 文件(与类路径中显式的文件相反)。对于 JarLauncher 和 WarLauncher，嵌套路径是固定的。JarLauncher 在 BOOT-INF/lib/中查找，WarLauncher 在 WEB-INF/lib/和 WEB-INF/lib-proved/中查找。如果需要更多，可以在这些位置添加额外的罐子。PropertiesLauncher 默认在应用程序归档中查找 BOOT-INF/lib/。可以通过在 LOADER.properties 中设置一个名为 LOADER _ path 或 LOADER.path 的环境变量来添加其他位置(这是归档文件中目录、归档文件或目录的逗号分隔列表)。

这段话的大概意思就是 `Springframework.boot.loader.Launcher` 相当于一个类加载器，JarLauncher会将`BOOT-INF/classes`下的类文件和`BOOT-INF/lib`下依赖的jar加入到classpath下，后调用`META-INF/MANIFEST.MF`文件Start-Class属性完成应用程序的启动。

`BOOT-INF/lib`就是依赖包了，这里不展开，最后会把依赖包加入classpath。

关键的是这个`META-INF/MANIFEST.MF`，这个文件是程序入口，用来描述jar的信息。

打开这个`META-INF/MANIFEST.MF`文件看看：

```
Manifest-Version: 1.0
Implementation-Title: yudianxx-core
Implementation-Version: 0.0.1-SNAPSHOT
Archiver-Version: Plexus Archiver
Built-By: huangyongwen
Implementation-Vendor-Id: com.yudianxx
Spring-Boot-Version: 1.5.9.RELEASE
Implementation-Vendor: Pivotal Software, Inc.
Main-Class: org.springframework.boot.loader.JarLauncher
Start-Class: com.SpringBootDemoApplication
Spring-Boot-Classes: BOOT-INF/classes/
Spring-Boot-Lib: BOOT-INF/lib/
Created-By: Apache Maven 3.0.5
Build-Jdk: 1.8.0_131
Implementation-URL: http://projects.spring.io/spring-boot/springBootLogback/yudianxx-core/
```

看到这一句：

```
Main-Class: org.springframework.boot.loader.JarLauncher
Start-Class: com.SpringBootDemoApplication
```

- `Main-Class` 配置项：Java 规定的 `jar` 包的启动类，这里设置为 `spring-boot-loader` 项目的 JarLauncher 类，进行 Spring Boot 应用的启动。
- `Start-Class` 配置项：Spring Boot 规定的**主**启动类，这里设置为我们定义的 SpringBootDemoApplication类。



## 2、那么JarLauncher这个类是的作用是什么？

当我们使用java -jar执行jar包的时候会调用JarLauncher的main方法，而不是我们编写的SpringBootDemoApplication。

> 小知识补充：为什么会有 `Main-Class`/`Start-Class` 配置项呢？因为我们是通过 Spring Boot 提供的 Maven 插件 `spring-boot-maven-plugin` 进行打包，该插件将该配置项写入到 `MANIFEST.MF` 中，从而能让 `spring-boot-loader` 能够引导启动 Spring Boot 应用。

SpringBootDemoApplication 本身都项目自带了main方法，为什么就不能直接运行，而要通过JarLauncher 运行呢？

因为它在 `BOOT-INF/classes` 目录下，不符合 Java 默认的 `jar` 包的加载规则。因此，需要通过 JarLauncher 启动加载。

当然实际还有一个更重要的原因，Java 规定可执行器的 `jar` 包禁止嵌套其它 `jar` 包。但是我们可以看到 `BOOT-INF/lib` 目录下，实际有 Spring Boot 应用依赖的所有 `jar` 包。因此，`spring-boot-loader` 项目自定义实现了 ClassLoader 实现类 LaunchedURLClassLoader，支持加载 `BOOT-INF/classes` 目录下的 `.class` 文件，以及 `BOOT-INF/lib` 目录下的 `jar` 包。





在项目里面添加一个依赖配置,就可以看JarLauncher的源码：

```java
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-loader</artifactId>
  <scope>provided</scope>
</dependency>
```

看一下这个 JarLauncher 类的方法：

```java
public class JarLauncher extends ExecutableArchiveLauncher {

	static final String BOOT_INF_CLASSES = "BOOT-INF/classes/";

	static final String BOOT_INF_LIB = "BOOT-INF/lib/";

	public JarLauncher() {
	}

	protected JarLauncher(Archive archive) {
		super(archive);
	}

	@Override
	protected boolean isNestedArchive(Archive.Entry entry) {
		if (entry.isDirectory()) {
			return entry.getName().equals(BOOT_INF_CLASSES);
		}
		return entry.getName().startsWith(BOOT_INF_LIB);
	}

	public static void main(String[] args) throws Exception {
        //项目入口，重点在launch这个方法中
		new JarLauncher().launch(args);
	}
}
```



```java
//launch方法
protected void launch(String[] args) throws Exception {
    JarFile.registerUrlProtocolHandler();
    //创建LaunchedURLClassLoader。如果根类加载器和扩展类加载器没有加载到某个类的话，就会通过LaunchedURLClassLoader这个加载器来加载类。这个加载器会从Boot-INF下面的class目录和lib目录下加载类。
    ClassLoader classLoader = createClassLoader(getClassPathArchives());
    //这个方法会读取jar描述文件中的Start-Class属性，然后通过反射调用到这个类的main方法。
    launch(args, getMainClass(), classLoader);
}
```

这里的launch方法会创建一个LaunchedURLClassLoader，也就是自定义的类加载器。

### 关于自定义的类加载器LaunchedURLClassLoader

LaunchedURLClassLoader重写了loadClass方法，也就是说它修改了默认的类加载方式(先看该类是否已加载这部分不变，后面真正去加载类的规则改变了，不再是直接从父类加载器中去加载)。LaunchedURLClassLoader定义了自己的类加载规则：

```java
@Override
protected Class<?> loadClass(String name, boolean resolve)
      throws ClassNotFoundException {
   Handler.setUseFastConnectionExceptions(true);
   try {
      try {
         definePackageIfNecessary(name);
      }
      catch (IllegalArgumentException ex) {
         // Tolerate race condition due to being parallel capable
         if (getPackage(name) == null) {
            // This should never happen as the IllegalArgumentException indicates
            // that the package has already been defined and, therefore,
            // getPackage(name) should not return null.
            throw new AssertionError("Package " + name + " has already been "
                  + "defined but it could not be found");
         }
      }
      return super.loadClass(name, resolve);
   }
   finally {
      Handler.setUseFastConnectionExceptions(false);
   }
}
```

加载规则：

- 如果根类加载器存在，调用它的加载方法。这里是根类加载是ExtClassLoader
- 调用LaunchedURLClassLoader自身的findClass方法，也就是URLClassLoader的findClass方法
- 调用父类的loadClass方法，也就是执行默认的类加载顺序(从BootstrapClassLoader开始从下往下寻找)

LaunchedURLClassLoader也有自身的definePackage方法（旧版本应该是findClass方法），作用是

- 把类名解析成路径并加上.class后缀
- 基于之前得到的第三方jar包依赖以及自己的jar包得到URL数组，进行遍历找出对应类名的资源，比如path中的spring-boot-loader-1.3.5.RELEASE.jar 



## 简单总结

- Spring Boot 可执行 Jar 包的入口点是 JarLauncher 的 main 方法；
- 这个方法的执行逻辑是先创建一个 LaunchedURLClassLoader（自定义类加载器），这个加载器加载类的逻辑是：先判断根类加载器和扩展类加载器能否加载到某个类，如果都加载不到就从 Boot-INF 下面的 class 和 lib 目录下去加载；
- 读取`Start-Class`属性，通过反射机制调用启动类的 main 方法，这样就顺利调用到我们开发的 Spring Boot 主启动类的 main 方法了。