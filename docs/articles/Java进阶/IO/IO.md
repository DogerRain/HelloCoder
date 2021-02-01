[toc]

## 1、什么是IO

I/O 是指Input/Output，即输入和输出。

- Input指从外部读入数据到内存，例如，把文件从磁盘读取到内存，从网络读取数据到内存等等。
- Output指把数据从内存输出到外部，例如，把数据从内存写入到文件，把数据从内存输出到网络等等。

Java程序在执行的时候，是在内存进行的，外部的数据需要读写到内存才能处理；而在内存中的数据是随着程序结束就消失的，有时候我们也需要把数据输出到外部文件。

Java中，是通过**流** 处理IO的，这种处理模式称为 **IO流**，IO流是一种顺序读写数据的模式。

你可以想象它是一根水管，数据就像水一样， **起点—终点** 可互相流动。

![](F:\笔记\docsifyLearnJavaToFindAJob\docs\articles\Java进阶\IO\picture\image-20210129104236502.png)

### 1、流的特点：

1. 先进先出：最先写入输出流的数据最先被输入流读取到。
2. 顺序存取：可以一个接一个地往流中写入一串字节，读出时也将按写入顺序读取一串字节，不能随机访问中间的数据。（`RandomAccessFile`除外）
3. 只读或只写：每个流只能是输入流或输出流的一种，不能同时具备两个功能，输入流只能进行读操作，对输出流只能进行写操作。在一个数据传输通道中，如果既要写入数据，又要读取数据，则要分别提供两个流。



### 2、IO流的分类

#### 1、按方向分

按数据流的方向分为 **输入流、输出流**，是相对内存来说的。

- 输入流：从外部（数据源）把数据输入到程序（内存）。

- 输出流：把程序的数据（内存）输出到外部（数据源）。

![](F:\笔记\docsifyLearnJavaToFindAJob\docs\articles\Java进阶\IO\picture\image-20210129105449996.png)

#### 2、按处理数据类型分

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

#### 3、按功能分

按功能不同分为 **节点流、处理流**

- 节点流：以从或向一个特定的地方（节点）读写数据。如`FileInputStream`

- 处理流：是对一个已存在的流的连接和封装，通过所封装的流的功能调用实现数据读写。如`BufferedReader`。处理流的构造方法总是要带一个其他的流对象做参数。一个流对象经过其他流的多次包装.

![](F:\笔记\docsifyLearnJavaToFindAJob\docs\articles\Java进阶\IO\picture\image-20210129110127528.png)

#### 4、按有无缓冲分

还有一种流是**缓冲流**，区别于没有缓冲的流。

因为程序和内存交互很快，而程序和磁盘交互是很慢的，这样会导致程序出现性能问题。

为了减少程序与磁盘的交互，是提升程序效率，引入了**缓冲流**。

普通流每次读写一个字节，而缓冲流在内存中设置一个缓存区，缓冲区先存储足够的待操作数据后，再与内存或磁盘进行交互。这样，在总数据量不变的情况下，通过提高每次交互的数据量，减少了交互次数。

有缓冲的流，类名前缀是带有Buffer的，比如`BufferedInputStream`、`BufferedReader`

![](F:\笔记\docsifyLearnJavaToFindAJob\docs\articles\Java进阶\IO\picture\image-20210129110918410.png)



## 2、Java IO 流对象详解

---

以上说了这么多流，看起来很复杂，但其实只需要记住以下四种流即可：

|            | **输入流**  | **输出流**   |
| ---------- | ----------- | ------------ |
| **字节流** | InputStream | OutputStream |
| **字符流** | Reader      | Writer       |

这四个都是抽象类，都位于 `java.io` 包目录。

我们平时使用流去处理数据，都是通过这四个流的子类展开的。

![](F:\笔记\docsifyLearnJavaToFindAJob\docs\articles\Java进阶\IO\picture\image-20210129112440603.png)

挑一些常用的放在下面一一讲解。



### 1、InputStream ——字节流输入流

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

#### FileInputStream

`FileInputStream`是文件字节输入流，就是对文件数据以字节的方式来处理，如音乐、视频、图片等。

#### BufferedInputStream

使用方式基本和`FileInputStream`一致。

`BufferedInputStream`有一个内部缓冲区数组，一次性读取较多的字节缓存起来，默认读取`defaultBufferSize = 8192`，作用于读文件时可以提高性能。

### 2、OutputStream——字节输出流

`OutputStream` 是相对 `InputStream` 的，既然有输入就有输出。`OutputStream` 这个**抽象类**是表示以上输出字节流的所有类的超类（父类）。

`OutputStream` 中的三个基本的写方法：

- abstract void write(int b)：往输出流中写入一个字节。
- void write(byte[] b) ：往输出流中写入数组b中的所有字节。
- void write(byte[] b, int?off, int?len) ：往输出流中写入数组 b 中从偏移量 off 开始的 len 个字节的数据。

其它重要方法：

- void flush() ：刷新输出流，强制缓冲区中的输出字节被写出。
- void close() ：关闭输出流，释放和这个流相关的系统资源。

> 参考：https://blog.csdn.net/qq_38129062/article/details/87115620

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



> 部分参考来自：
>
> https://blog.csdn.net/mu_wind/article/details/108674284
>
> https://blog.csdn.net/sinat_37064286/article/details/86537354