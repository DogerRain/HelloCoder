---
title: File类
date: 2022-05-26 17:03:57
permalink: /pages/File%E7%B1%BB
lock: false
categories: 
  - PureJavaCoderRoad
  - Java进阶
  - 常用类
tags: 
  - File
---
##  File类

Java可以对磁盘的文件和目录进行操作，所以Java提供了一个File 类。

File对象代表磁盘中实际存在的文件和目录。

但是，创建了File对象，并不是等于创建了一个文件或者文件夹。

而且，File对象

- 不能用来向文件中写内容。

- 不能用来从文件中读内容。

File类常用API：

| 序号 | 方法描述                                                     |
| :--- | :----------------------------------------------------------- |
| 1    | **public String getName()** 返回由此抽象路径名表示的文件或目录的名称。 |
| 2    | **public String getParent() **返回此抽象路径名的父路径名的路径名字符串，如果此路径名没有指定父目录，则返回 `null`。 |
| 3    | **public File getParentFile()** 返回此抽象路径名的父路径名的抽象路径名，如果此路径名没有指定父目录，则返回 `null`。 |
| 4    | **public String getPath()** 将此抽象路径名转换为一个路径名字符串。 |
| 5    | **public boolean isAbsolute()** 测试此抽象路径名是否为绝对路径名。 |
| 6    | **public String getAbsolutePath()** 返回抽象路径名的绝对路径名字符串。 |
| 7    | **public boolean canRead()** 测试应用程序是否可以读取此抽象路径名表示的文件。 |
| 8    | **public boolean canWrite()** 测试应用程序是否可以修改此抽象路径名表示的文件。 |
| 9    | **public boolean exists()** 测试此抽象路径名表示的文件或目录是否存在。 |
| 10   | **public boolean isDirectory()** 测试此抽象路径名表示的文件是否是一个目录。 |
| 11   | **public boolean isFile()** 测试此抽象路径名表示的文件是否是一个标准文件。 |
| 12   | **public long lastModified()** 返回此抽象路径名表示的文件最后一次被修改的时间。 |
| 13   | **public long length()** 返回由此抽象路径名表示的文件的长度。 |
| 14   | **public boolean createNewFile() throws IOException** 当且仅当不存在具有此抽象路径名指定的名称的文件时，原子地创建由此抽象路径名指定的一个新的空文件。 |
| 15   | **public boolean delete()**  删除此抽象路径名表示的文件或目录。 |
| 16   | **public void deleteOnExit()** 在虚拟机终止时，请求删除此抽象路径名表示的文件或目录。 |
| 17   | **public String[] list()** 返回由此抽象路径名所表示的目录中的文件和目录的名称所组成字符串数组。 |
| 18   | **public String[] list(FilenameFilter filter)** 返回由包含在目录中的文件和目录的名称所组成的字符串数组，这一目录是通过满足指定过滤器的抽象路径名来表示的。 |
| 19   | **public File[] listFiles()**  返回一个抽象路径名数组，这些路径名表示此抽象路径名所表示目录中的文件。 |
| 20   | **public File[] listFiles(FileFilter filter)** 返回表示此抽象路径名所表示目录中的文件和目录的抽象路径名数组，这些路径名满足特定过滤器。 |
| 21   | **public boolean mkdir()** 创建此抽象路径名指定的目录。      |
| 22   | **public boolean mkdirs()** 创建此抽象路径名指定的目录，包括创建必需但不存在的父目录。 |
| 23   | **public boolean renameTo(File dest)**  重新命名此抽象路径名表示的文件。 |
| 24   | **public boolean setLastModified(long time)** 设置由此抽象路径名所指定的文件或目录的最后一次修改时间。 |
| 25   | **public boolean setReadOnly()** 标记此抽象路径名指定的文件或目录，以便只可对其进行读操作。 |
| 26   | **public static File createTempFile(String prefix, String suffix, File directory) throws IOException** 在指定目录中创建一个新的空文件，使用给定的前缀和后缀字符串生成其名称。 |
| 27   | **public static File createTempFile(String prefix, String suffix) throws IOException** 在默认临时文件目录中创建一个空文件，使用给定前缀和后缀生成其名称。 |
| 28   | **public int compareTo(File pathname)** 按字母顺序比较两个抽象路径名。 |
| 29   | **public int compareTo(Object o)** 按字母顺序比较抽象路径名与给定对象。 |
| 30   | **public boolean equals(Object obj)** 测试此抽象路径名与给定对象是否相等。 |
| 31   | **public String toString()**  返回此抽象路径名的路径名字符串。 |



### mkdir()与mkdirs()方法的区别:

`mkdir()` 必须在有父类的文件夹下创建文件。

`mkdirs()` 可以在不知道偶没有父类文件夹的情况下，创建文件夹

## 使用

File类有两个构造方法：

1、通过将给定路径名字符串转换成抽象路径名来创建一个新 File 实例

```java
File(String pathname) 
```

eg：

```java
String fileName1 = "F:\\HelloCoder\\hello.txt";
File file = new File(fileName1);
```

2、根据 parent 路径名字符串和 child 路径名字符串创建一个新 File 实例

```java
File(File parent, String child);
```

 eg：

```java
String filePath2 = "F:\\Hello";
String fileNmae2 = "hello.txt";
File file2 = new File(filePath2,fileNmae2);
file2.createNewFile();
```



## 常见的坑

### 坑1——mkdir()没有成功创建文件夹

eg：

```java
public class FileTest {
    public static void main(String[] args) throws IOException {
        String filePath2 = "F:\\Hello\\hello.txt";
        File file2 = new File(filePath2);
        if (!file2.exists()){
            file2.mkdir();
        }
    }
}
```

执行后发现并没有找到 `F:\\Hello\\hello.txt` 文件，而且程序没有报错。

是因为我这里`F盘`下面没有`Hello` 这个文件夹。

> 解决：`mkdir()`并不会自动生成父类的目录，应该改用`mkdirs()`

### 坑2—— mkdirs()创建了文件夹而不是文件

改成使用`mkdirs()`

eg：

```java
public class FileTest {
    public static void main(String[] args) throws IOException {
        String filePath2 = "F:\\Hello\\hello.txt";
        File file2 = new File(filePath2);
        if (!file2.exists()){
            file2.mkdirs();
        }
    }
}
```

这次就生成了文件，父目录也生成了，但是这是个文件夹不是文件：

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210201170821969.png)

>  解决：`mkdirs()` 是生成文件夹的，并不是生成文件的，创建文件应该是`createNewFile()` 方法。

### 坑3——createNewFile()无法创建文件

接着上一步，这次使用`createNewFile()` 方法试试 。

> 此时我的F盘已经有了Hello的文件夹了

eg：

```java
public class FileTest {
    public static void main(String[] args) throws IOException {
        String filePath2 = "F:\\Hello\\hello.txt";
        File file2 = new File(filePath2);
        boolean flag = file2.createNewFile();
        System.out.println(flag); //false
    }
}
```

你会发现依然没有生成`F:\\Hello\\hello.txt` 文件。

> 这里 `file2.exists()` 一定为true，exists()表示文件或目录是否存在

`file2.createNewFile()` 返回了一个`false`值，表示创建失败，因为已经存在了同名的文件夹了，你无法再创建一个同名的文件，你可以在Windows试一下创建一个同名的文件：

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210201172326048.png)

这是不允许的。



## 坑4——系统找不到指定的路径

接上，这里**把文件夹Hello删除**

eg：

```java
public class FileTest {
    public static void main(String[] args) throws IOException {
        String filePath2 = "F:\\Hello\\hello.txt";
        File file2 = new File(filePath2);
        if (!file2.exists()){
            boolean flag = file2.createNewFile();
            System.out.println(flag);
        }
    }
}
```

发现报错了：

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210201172947437.png)



因为 **Hello文件夹** 不存在，`createNewFile()` 是无法自动创建父类文件夹的。



## 正确例子

这个例子实现在多重目录不存在的情况下创建文件：

```java
public class FileTest {
    public static void main(String[] args) throws IOException {
        String filePath2 = "F:\\Hello\\hello.txt";
        File file2 = new File(filePath2);
        File fileParent2 = file2.getParentFile();
        if (!fileParent2.exists()) {
            fileParent2.mkdirs();
        }
        file2.createNewFile();
    }
}
```

`getParentFile()`获取实例对象的父项的实例对象，如果此路径名未指定父目录，则返回null。

> `createNewFile()` 方法，如果文件已经存在了，是不会重新创建的。

注意：

`String getParent()`   返回此抽象路径名父目录的路径名字符串；如果此路径名没有指定父目录，则返回 null。 
`File getParentFile()`返回此抽象路径名父目录的抽象路径名；如果此路径名没有指定父目录，则返回 null。



## 总结：

1、**mkdir**：只能用来创建文件夹，且只能创建一级目录，如果上级不存在，就会创建失败。 

2、**mkdirs**：只能用来创建文件夹，且能创建多级目录 ，如果上级不存在，就会自动创建。(创建文件夹多用此) 

3、**createNewFile**:只能用来创建文件，且只能在已存在的目录下创建文件，否则会创建失败。

4、应该使用`getParentFile()`和`exists()` 方法判断文件夹是否存在，再创建文件。

 