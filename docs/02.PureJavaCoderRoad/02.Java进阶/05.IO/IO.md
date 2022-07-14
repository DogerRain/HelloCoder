---
title: IO
date: 2022-05-26 17:03:55
permalink: /pages/IO
lock: false
categories: 
  - PureJavaCoderRoad
  - Java进阶
  - IO
tags: 
  - IO
---
[toc]

## 1、什么是IO

I/O 是指Input/Output，即输入和输出。

- Input指从外部读入数据到内存，例如，把文件从磁盘读取到内存，从网络读取数据到内存等等。
- Output指把数据从内存输出到外部，例如，把数据从内存写入到文件，把数据从内存输出到网络等等。

Java程序在执行的时候，是在内存进行的，外部的数据需要读写到内存才能处理；而在内存中的数据是随着程序结束就消失的，有时候我们也需要把数据输出到外部文件。

Java中，是通过**流** 处理IO的，这种处理模式称为 **IO流**，IO流是一种顺序读写数据的模式。

你可以想象它是一根水管，数据就像水一样， **起点—终点** 可互相流动。

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210129104236502.png)

> 当然如果站在操作系统的来看，又涉及到用户态、内核态，这里就不聊了。
>
> 还有就是阻塞、非阻塞 IO、IO多路复用，可以看我之前写的：[https://learnjava.baimuxym.cn/#/articles\Java%E5%9F%BA%E7%A1%80\IO%E6%A8%A1%E5%9E%8B%E6%9C%89%E5%93%AA%E4%BA%9B%EF%BC%9F](https://learnjava.baimuxym.cn/#/articles\Java%E5%9F%BA%E7%A1%80\IO%E6%A8%A1%E5%9E%8B%E6%9C%89%E5%93%AA%E4%BA%9B%EF%BC%9F)

### 1.1、流的特点：

1. 先进先出：最先写入输出流的数据最先被输入流读取到。
2. 顺序存取：可以一个接一个地往流中写入一串字节，读出时也将按写入顺序读取一串字节，不能随机访问中间的数据。（`RandomAccessFile`除外）
3. 只读或只写：每个流只能是输入流或输出流的一种，不能同时具备两个功能，输入流只能进行读操作，对输出流只能进行写操作。在一个数据传输通道中，如果既要写入数据，又要读取数据，则要分别提供两个流。



### 1.2、IO流的分类

#### 1.1.1、按方向分

按数据流的方向分为 **输入流、输出流**，是相对内存来说的。

- 输入流：从外部（数据源）把数据输入到程序（内存）。

- 输出流：把程序的数据（内存）输出到外部（数据源）。

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210129105449996.png)

#### 1.1.2、按处理数据类型分

按处理的数据类型可分为 **字节流、字符流** 

> 1字符 = 2字节 、 1字节(byte) = 8位(bit) 

- 字节流：每次读 （写）一个字节，当传输的资源文件有中文时，就会出现乱码，读写的单位是`byte`，在`InputStream`/`OutputStream`中单向流动
- 字符流：每次读取(写出)两个字节，有中文时，使用该流就可以正确传输显示中文，读写的单位是`char`，在`Reader`/`Writer`中单向流动



**字节流和字符流的原理是相同的，只不过处理的单位不同而已。后缀是Stream是字节流，而后缀是Reader，Writer是字符流。**



**为什么要有字符流？**

Java中字符是采用Unicode标准，Unicode 编码中，一个英文为一个字节，一个中文为两个字节。但是编码不同，中文字符占的字节数不一样，而在UTF-8编码中，一个中文字符是3个字节。

如果统一使用字节流处理中文，因为读写是一个字节一个字节，这样就会对中文字符有影响，就会出现乱码。

为了更方便地处理中文这些字符，Java就推出了字符流。

字节流和字符流的其他区别：

1. 字节流一般用来处理图像、视频、音频、PPT、Word等类型的文件。字符流一般用于处理纯文本类型的文件，如TXT文件等，但不能处理图像视频等非文本文件。

> 用一句话说就是：字节流可以处理一切文件，而字符流只能处理纯文本文件。

2. 字节流本身没有缓冲区，**缓冲字节流**相对于**字节流**，效率提升非常高。而**字符流**本身就带有缓冲区，**缓冲字符流**相对于字符流效率提升就不是那么大了。

#### 1.1.3、按功能分

按功能不同分为 **节点流、处理流**

- 节点流：以从或向一个特定的地方（节点）读写数据。如`FileInputStream`

- 处理流：是对一个已存在的流的连接和封装，通过所封装的流的功能调用实现数据读写。如`BufferedReader`。处理流的构造方法总是要带一个其他的流对象做参数。一个流对象经过其他流的多次包装.

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210129110127528.png)

#### 1.1.4、按有无缓冲分

还有一种流是**缓冲流**，区别于没有缓冲的流。

因为程序和内存交互很快，而程序和磁盘交互是很慢的，这样会导致程序出现性能问题。

为了减少程序与磁盘的交互，是提升程序效率，引入了**缓冲流**。

普通流每次读写一个字节，而缓冲流在内存中设置一个缓存区，缓冲区先存储足够的待操作数据后，再与内存或磁盘进行交互。这样，在总数据量不变的情况下，通过提高每次交互的数据量，减少了交互次数。

有缓冲的流，类名前缀是带有Buffer的，比如`BufferedInputStream`、`BufferedReader`

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210129110918410.png)



---



## 2、Java IO 流对象详解



以上说了这么多流，看起来很复杂，但其实只需要记住以下四种流即可：

|            | **输入流**  | **输出流**   |
| ---------- | ----------- | ------------ |
| **字节流** | InputStream | OutputStream |
| **字符流** | Reader      | Writer       |

这四个都是抽象类，都位于 `java.io` 包目录。

我们平时使用流去处理数据，**都是通过这四个流的子类展开的**。

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210129112440603.png)

挑一些常用的放在下面一一讲解。



### 2.1、InputStream ——字节流输入流

`InputStream` 这个**抽象类**是表示以上输入字节流的所有类的超类（父类）。

`InputStream` 中的三个基本的读方法：

- abstract int read() ：读取一个字节数据，并返回读到的数据，如果返回 -1，表示读到了输入流的末尾。
- int read(byte[] b) ：将数据读入一个字节数组，同时返回实际读取的字节数。如果返回-1，表示读到了输入流的末尾。
- int read(byte[] b, int off, int len) ：将数据读入一个字节数组，同时返回实际读取的字节数。如果返回 -1，表示读到了输入流的末尾。off 指定在数组 b 中存放数据的起始偏移位置；len 指定读取的最大字节数。

> `read()`方法 如果已读到末尾，返回`-1`表示不能继续读取了。

 `InputStream` 的子类有：

- ByteArrayInputStream
- **FileInputStream**
- FilterInputStream
- PushbackInputStream
- DataInputStream
- **BufferedInputStream**
- LineNumberInputStream
- ObjectInputStream
- PipedInputStream
- SequenceInputStream
- StringBufferInputStream

这么多子类不需要每一个都记住，只需要记住两个：

**FileInputStream**

`FileInputStream`是文件字节输入流，就是对文件数据以字节的方式来处理，如音乐、视频、图片等。

**BufferedInputStream**

使用方式基本和`FileInputStream`一致。

`BufferedInputStream`有一个内部缓冲区数组，一次性读取较多的字节缓存起来，默认读取`defaultBufferSize = 8192`，作用于读文件时可以提高性能。

### 2.2、OutputStream——字节输出流

`OutputStream` 是相对 `InputStream` 的，既然有输入就有输出。`OutputStream` 这个**抽象类**是表示以上输出字节流的所有类的超类（父类）。

`OutputStream` 中的三个基本的写方法：

- abstract void write(int b)：往输出流中写入一个字节。
- void write(byte[] b) ：往输出流中写入数组b中的所有字节。
- void write(byte[] b, int off, int len) ：往输出流中写入数组 b 中从偏移量 off 开始的 len 个字节的数据。

其它重要方法：

- void flush() ：刷新输出流，强制缓冲区中的输出字节被写出。
- void close() ：关闭输出流，释放和这个流相关的系统资源。



 `OutputStream` 的子类有：

- ByteArrayOutputStream
- **FileOutputStream**
- FilterOutputStream
- **BufferedOutputStream**
- DataOutputStream
- PrintStream
- ObjectOutputStream
- PipedOutputStream

> StringBufferInputStream 和 StringBufferInputStream 已经过时了，这里不介绍了

FileOutputStream、BufferedOutputStream 和 FileInputStream、BufferedInputStream 是相对的。



### 2.3、Reader——字符输入流

`Reader` 是所有的输入字符流的父类，它是一个抽象类。

常见的子类有：

- **BufferedReader**
- LineNumberReader
- CharArrayReader
- FilterReader
- PushbackReader
- **InputStreamReader**
- **FileReader**
- PipedReader
- StringReader



总结：

1. BufferedReader 很明显就是一个装饰器，它和其子类负责装饰其它 Reader 对象。
2. InputStreamReader 是一个连接字节流和字符流的桥梁，它将字节流转变为字符流。



Reader 基本的三个读方法（和字节流对应）：

(1) public int read() throws IOException; 读取一个字符，返回值为读取的字符。

(2) public int read(char cbuf[]) throws IOException; 读取一系列字符到数组 cbuf[]中，返回值为实际读取的字符的数量。

(3) public abstract int read(char cbuf[],int off,int len) throws IOException; 读取 len 个字符，从数组 cbuf[] 的下标 off 处开始存放，返回值为实际读取的字符数量，该方法必须由子类实现。



### 2.4、Writer——字符输出流

Writer 是所有的输出字符流的父类，它是一个抽象类。

常见的子类有：

- **BufferedWriter**
- CharArrayWriter
- FilterWriter
- OutputStreamWriter
- **FileWriter**
- PipedWriter
- PrintWriter
- StringWriter

总结：

1. OutputStreamWriter 是 OutputStream 到 Writer 转换的桥梁，它的子类 FileWriter 其实就是一个实现此功能的具体类。
2. BufferedWriter 是一个装饰器为 Writer 提供缓冲功能。

writer 的主要写方法：

1. public void write(int c) throws IOException； //写单个字符
2. public void write(char cbuf[]) throws IOException； //将字符数组 cbuf[] 写到输出流 。
3. public abstract void write(char cbuf[],int off,int len) throws IOException； //将字符数组cbuf[]中的从索引为off的位置处开始的len个字符写入输出流 。
4. public void write(String str) throws IOException； //将字符串str中的字符写入输出流 。
5. public void write(String str,int off,int len) throws IOException； //将字符串 str 中从索引 off 开始处的 len 个字符写入输出流 。



---

## 3、使用方法

### 3.1、FileOutputStream写文件、FileInputStream读文件

分别为 单个字节写、字节数字写、单个字节读取、字节数组读取、一次性读取：

```java
public class OutputStreamTest {
    public static void main(String[] args) throws IOException {
        writeFile(); //单个字节写、字节数字写
        readFile1();//单个字节读取
        readFile2();//字节数组读取
        readFile3();//一次性读取
    }

    static void writeFile() throws IOException {
        //1、第一种方法写，单个字节写
        //会自动创建文件，目录不存在会报错， true 表示 追加写，默认是false
        FileOutputStream fileOutputStream = new FileOutputStream("F:\\hello.txt", false);
        //往文件里面一个字节一个字节的写入数据
        fileOutputStream.write((int) 'H');
        fileOutputStream.write((int) 'a');
        fileOutputStream.write((int) 'C');

        //2、第二种方法写 字节数组写
        String s = " HelloCoder";
        //入文件里面一个字节数组的写入文件，文件为UTF_8格式
        fileOutputStream.write(s.getBytes(StandardCharsets.UTF_8));
        //刷新流
        fileOutputStream.flush();
        //关闭流
        fileOutputStream.close();
    }

    static void readFile1() throws IOException {
        //1、第一种读的方法，但字节读
        System.out.println("------一个字节读------");
        //传文件夹的名字来创建对象
        FileInputStream fileInputStream = new FileInputStream("F:\\hello.txt");
        int by = 0;
        //一个字节一个字节的读出数据
        while ((by = fileInputStream.read()) != -1) {
            System.out.print((char) by);
        }
        //关闭流
        fileInputStream.close();
    }

    static void readFile2() throws IOException {
        //2、第二种读的方法，字节数组读
        System.out.println();
        System.out.println("------字节数组读------");
        FileInputStream fileInputStream = new FileInputStream("F:\\hello.txt");
        //通过File对象来创建对象
        fileInputStream = new FileInputStream(new File("F:\\hello.txt"));
        int by = 0;
        byte[] bytes = new byte[10];
        //一个字节数组的读出数据，高效
        while ((by = fileInputStream.read(bytes)) != -1) {
            for (int i = 0; i < by; i++) {
                System.out.print((char) bytes[i]);
            }
        }
        //关闭流
        fileInputStream.close();
    }

    static void readFile3() throws IOException {
        //3、第三种读方法，一次性读
        System.out.println();
        System.out.println("------一次性读文件------");
        FileInputStream fileInputStream = new FileInputStream("F:\\hello.txt");
        fileInputStream = new FileInputStream(new File("F:\\hello.txt"));
        //一次性读文件
        int iAvail = fileInputStream.available();
        int by = 0;
        byte[] bytesAll = new byte[iAvail];
        while ((by = fileInputStream.read(bytesAll)) != -1) {
            for (int i = 0; i < by; i++) {
                System.out.print((char) bytesAll[i]);
            }
        }
        fileInputStream.close();
    }
}
```

输出：

```
------一个字节读------
HaC HelloCoder
------字节数组读------
HaC HelloCoder
------一次性读文件------
HaC HelloCoder
```

这里介绍了三种方法读一个文件，详细的介绍都写在了注释里。

> :warning: 字符串如果包含中文，就会出现乱码，这是因为FileOutputStream是字节流，将文本按字节写入。

### 3.2、FileWriter写文件、FileReader读文件

分别为 字符串写、单字符读、字符数组读：

```java
public class ReaderTest {
    public static void main(String[] args) throws IOException {
        write(); //字符串写
        read1();//
        read2();//
    }

    static void write() throws IOException {
        FileWriter fileWriter = new FileWriter("F:\\Hello1.txt");
        //为防止乱码，可以这样写，字符流和字节流互转
//        Writer fileWriter = new BufferedWriter(new OutputStreamWriter(
//                new FileOutputStream("F:\\Hello1.txt"), StandardCharsets.UTF_8));
        fileWriter.write("今天打工你不狠，明天地位就不稳\n" +
                "今天打工不勤快，明天社会就淘汰");
        
        // 如果没有刷新，也没有关闭流的话 数据是不会写入文件的
        fileWriter.flush();
        fileWriter.close();
    }

    static void read1() throws IOException {
        System.out.println("------一个一个char读-------");
        FileReader fileReader = new FileReader("F:\\Hello1.txt");
        int ch = 0;
        String str = "";
        //一个一个char读
        while ((ch = fileReader.read()) != -1) {
            str += (char) ch;
        }
        System.out.println(str);
    }

    static void read2() throws IOException {
        System.out.println("------char数组[]读-------");
        FileReader fileReader = new FileReader(new File("F:\\Hello1.txt"));
        int len = 0;
        char[] chars = new char[10];
        while ((len = fileReader.read(chars)) != -1) {
            //这种读有误
//            System.out.print(new String(chars));
            System.out.print((new String(chars, 0, len)));
        }
        fileReader.close();
    }
}
```

输出：

```
------一个一个char读-------
今天打工你不狠，明天地位就不稳
今天打工不勤快，明天社会就淘汰
------char数组[]读-------
今天打工你不狠，明天地位就不稳
今天打工不勤快，明天社会就淘汰
```

`FileWriter`、`FileReader` 可以用来读写一个含中文字符的文件。

**注意点：**

**1、流转换**

```java
Writer fileWriter = new BufferedWriter(new OutputStreamWriter(
	 new FileOutputStream("F:\\Hello1.txt"), StandardCharsets.UTF_8));
```

这里其实是把字节流转换为字符流，用来解决乱码。

**2、读的位置**

这里的写法需要注意，因为这里读写是一次性读10个char类型的字符，如果换成以下

```java
int len = 0;
char[] chars = new char[10];
while ((len = fileReader.read(chars)) != -1) {
    //不能这样写
    System.out.print(new String(chars));
    //System.out.print((new String(chars, 0, len)));
}
```

则输出：

```
------char数组[]读-------
今天打工你不狠，明天地位就不稳
今天打工不勤快，明天社会就淘汰勤快，明天社会就淘
```



可以看到输出不正确，因为一次性读10个char，

第一次读的是 `今天打工你不狠，明天`

第二次读的是 `地位就不稳\n今天打工`

第三次读的是 `不勤快，明天社会就淘`

第四次输出是 `汰勤快，明天社会就淘` ，其实这一次它只读了`汰` 一个字符，其中 `勤快，明天社会就淘` 是上一个数组的内容，因为它是已存在在数组的旧数据。

所以需要`new String(chars, 0, len)` ，`len` 是这次读到的字符长度，只需要截取这次的字符即可。

---



以上这两个例子中，还需要注意的几个地方：

1、只有在写文件的时候才需要`flush()`方法，而读是不需要的。

2、读、写 完毕都需要调用`close()` 方法关闭流。

3、单个字节、字符读写效率较慢，建议使用字节、字符数组读取。



### 3.3、BufferedInputStream、BufferedOutputStream 缓冲字节流

`BufferedInputStream` 是带缓冲区的，在复制、移动文件操作会快一点。

> 建议使用缓冲字节流这不是普通字节流，但构造方法入参还是InputStream和OutputStream。

Java使用IO 读取文件时，会进入核心态，在调用驱动进行IO，本身就会缓存在系统级别的，当你第二次读取时，会由用户态进入核心态，读取系统缓存。`BufferedInputStream`就一次性读取较多，缓存起来。

这样下次就从缓存中读，而不用在用户态和核心态之间切换，从而提升效率。

eg：

```java
public class InputStrem与BufferenInputStream复制文件 {
    public static void main(String[] args) throws IOException {
        useInputStreamCopyFile(); //缓冲流复制文件
        useBufferenInputStream(); //普通流复制文件
    }

    static void useInputStreamCopyFile() throws IOException {
        File file = new File("F:\\杨超越.png");
        InputStream is = new FileInputStream(file);

        File file2 = new File("F:\\杨超越_copy.png");
        OutputStream os = new FileOutputStream(file2);
        int len = 0;
        byte[] bytes = new byte[1024];
        while ((len = is.read(bytes)) != -1) {
            os.write(bytes);
        }
        is.close();
        os.close();
    }

    static void useBufferenInputStream() throws IOException {
        BufferedInputStream bis = new BufferedInputStream(new FileInputStream("F:\\杨超越.png"));
        BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream("F:\\杨超越_copy2.png"));
        int len = 0;
        byte[] bytes = new byte[1024];
        while ((len = bis.read(bytes)) != -1) {
            bos.write(bytes, 0, len);
        }
        bos.close();
        bis.close();
    }
}
```

结果输出：

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210203141105472.png)



### 3.4、BufferedReader、BufferedWriter 字符缓冲流

`BufferedReader` 有一个好处，就是它提供了`readline()`、`newLine()`方法，可以**按行读取文件**。

eg：

```java
public class BufferedReaderTest {
    public static void main(String[] args) throws IOException {
        useInputStreamCopyFile(); //这种方法适用于任何文件
        //下面两种方法copy的文件变大了，因为是使用字符流处理的
        useBufferedReaderCopyFile(); //这种方法只适用于字符文件
        useFileReaderCopyFile(); //这种方法一步到位，只适用于字符文件

    }

    static void useInputStreamCopyFile() throws IOException {
        File file = new File("F:\\Hello1.txt");
        InputStream is = new FileInputStream(file);

        File file2 = new File("F:\\Hello1_copy1.txt");
        OutputStream os = new FileOutputStream(file2);
        int len = 0;
        byte[] bytes = new byte[1024];
        while ((len = is.read(bytes)) != -1) {
            os.write(bytes, 0, len);
        }
        is.close();
        os.close();
    }

    static void useBufferedReaderCopyFile() throws IOException {
        File file = new File("F:\\Hello1.txt");
        InputStream is = new FileInputStream(file);
        Reader reader = new InputStreamReader(is);
        //创建字符流缓冲区，BufferedReader 的构造入参是一个 Reader
        BufferedReader bufferedReader = new BufferedReader(reader);

        File file2 = new File("F:\\Hello1_copy2.txt");
        OutputStream os = new FileOutputStream(file2);
        Writer writer = new OutputStreamWriter(os);
        //创建字符流缓冲区，BufferedWriter 的构造入参是一个 Writer
        BufferedWriter bufferedWriter = new BufferedWriter(writer);

        String line = null;
        //readLine()方法 是根据\n 换行符读取的
        while ((line = bufferedReader.readLine()) != null) {
            bufferedWriter.write(line);
            //这里要加换行
            bufferedWriter.newLine();
        }
        bufferedReader.close();
        bufferedWriter.close();
    }

    static void useFileReaderCopyFile() throws IOException {
        //使用FileReader、FileWriter 一步到位
        Reader reader = new FileReader("F:\\Hello1.txt");
        BufferedReader bufferedReader = new BufferedReader(reader);
        Writer writer = new FileWriter("F:\\Hello1_copy3.txt");
        BufferedWriter bufferedWriter = new BufferedWriter(writer);
        String line = null;
        while ((line = bufferedReader.readLine()) != null) {
            bufferedWriter.write(line);
            bufferedWriter.newLine();
        }
        bufferedReader.close();
        bufferedWriter.close();
    }
}
```

---

## 4、close() 与flush()

先上个例子：

```java
public class FlushTest {
    public static void main(String[] args) throws IOException {
        FileReader fileReader = new FileReader("F:\\Hello1.txt"); //大文件
        FileWriter fileWriter = new FileWriter("F:\\Hello2.txt");
        int readerCount = 0;
        //一次读取1024个字符
        char[] chars = new char[1024];
        while (-1 != (readerCount = fileReader.read(chars))) {
            fileWriter.write(chars, 0, readerCount);
        }
    }
}
```

这里并没有调用`close()`方法。

> `close()`方法包含`flush()`方法 ，即close会自动flush

结果：

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210202160401298.png)

可以看到，复制的文件变小了。

明显，数据有丢失，丢失的就是**缓冲区“残余”的数据**。

在计算机层面，Java对磁盘进行操作，IO是有缓存的，并不是真正意义上的一边读一边写，底层的落盘（数据真正写到磁盘）另有方法。

所以，最后会有一部分数据在内存中，如果不调用`flush()`方法，数据会随着查询结束而消失，这就是为什么数据丢失使得文件变小了。

> BufferedOutputStream、BufferedFileWriter 同理

再举个例子：

```java
class FlushTest2{
    public static void main(String[] args) throws IOException {
        FileWriter fileWriter = new FileWriter("F:\\Hello3.txt");
        fileWriter.write("今天打工你不狠，明天地位就不稳\n" +
                "今天打工不勤快，明天社会就淘汰");
    }
}
```

不调用flush()方法你会发现，文件是空白的，没有把数据写进来，也是因为数据在内存中而不是落盘到磁盘了。

所以为了实时性和安全性，IO在写操作的时候，需要调用`flush()`或者`close()`

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210202162909660.png)

`close()` 和`flush()`的区别：

- 关`close()`是闭流对象，但是会先刷新一次缓冲区，关闭之后，流对象不可以继续再使用了，否则报空指针异常。
- `flush()`仅仅是刷新缓冲区，准确的说是**"强制写出缓冲区的数据"**，流对象还可以继续使用。



总结一下：

Java的IO有一个 缓冲区 的概念，不是Buffer概念的缓冲区。

如果是文件读写完的同时缓冲区**刚好装满** , 那么缓冲区会把里面的数据朝目标文件自动进行读或写（这就是为什么总剩下有一点没写完） , 这种时候你不调用`close()`方法也0不会出现问题 ; 

如果文件在读写完成时 , 缓冲区**没有装满**，也没有`flush()`， 这个时候装在缓冲区的数据就不会自动的朝目标文件进行读或写 , 从而造成缓冲区中的这部分数据丢失 , 所以这个是时候就需要在`close()`之前先调用`flush()`方法 , 手动使缓冲区数据读写到目标文件。



举个很形象的例子加深理解：

我从**黄桶**（`读`）通过**水泵**（管道）把水抽到**绿桶**（`写`），水管就相当于**缓冲区**，当我看到**黄桶**水没有了，我立马关了水泵，但发现**水管**里还有水没有流到**绿桶**，这些残留的水就相当于内存中丢失的数据。

如果此时我再把**水泵**打开，此时水管里面丢失的水（丢失的数据）又流到了**绿桶**，这就相当于调用了`flush()`方法。

![](https://blog-1253198264.cos.ap-guangzhou.myqcloud.com/image-20210202165332796.png)

---

## 5、总结

写了这么多，IO确实是挺复杂的，一般的业务需求是读写文件，其实更多的是生成文件、复制文件、移动文件。所以如何选择IO流，是需要我们掌握的。

1、字节流是原生的操作，字符流是经过处理后的操作。

输入：`Reader, InputStream`类型的子类

输出：`Writer, OutputStream`类型的子类



2、字节流一般用来处理图像、视频、音频、PPT、Word等类型的文件。字符流一般用于处理纯文本类型的文件，如TXT文件等，但不能处理图像视频等非文本文件。

> 用一句话说就是：字节流可以处理一切文件，而字符流只能处理纯文本文件。

含有汉子的文件就使用字符流处理。

3、需要转换？是，使用转换流；是否需要高效，使用缓冲流。

4、使用流之后一定要`close()`。



> 部分参考来自：
>
> https://blog.csdn.net/mu_wind/article/details/108674284
>
> https://blog.csdn.net/sinat_37064286/article/details/86537354
