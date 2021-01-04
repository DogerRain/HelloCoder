## 编写第一个Java程序

### 1、新建一个txt文本

输入下面的代码内容：

```java
public class Hello { 
    public static void main(String[] args) {
        System.out.println("Hello, world!,I am HaC.");
    }
}
```

`public class Hello` 表示是一个类，叫做 `Hello`

`public static void main(String[] args)`  是程序的入口，方法名是`main`

`System.out.println("Hello, world!,I am HaC.");` 表示打印，`;`表示该语句结束。

以上不明白不重要，下面会详细介绍Java的语法。

### 2、保存

另存为 `Hello.java` 文件。 `.java`是java文件的标识

这里必须保存为与 代码中 `public class Hello` 的class名字一样，即 `Hello`

### 3、编译

`.java` 文件是用户编写的文件，但是计算机是无法识别的，所以需要先编译，编译的命令是`javac`

```
javac Hello.java
```

编译成功后会出现 一个 `.class` 文件， `.class` 是一个二进制文件，是能被JVM识别的文件。

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210104163638568.png)

### 4、执行

注意：`java命令`不需要带文件后缀

```java
java Hello
```

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210104180530916.png)

执行成功就会输入该java文件编写好的内容。





`.java、.class、jvm` 的关系，以及跨平台的理解：

![ java程序执行流程](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201014154245544.png)



