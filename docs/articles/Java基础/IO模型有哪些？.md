IO 即输入输出，根据冯诺依曼体系结构，计算机结构分为 5 大部分：**运算器、控制器、存储器、输入设备、输出设备**

<img src="https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210407175139315.png" style="zoom:50%;" />

站在我们程序员的角度来看：

IO就是**计算机系统与外部设备之间通信的过程**，比如说把读写文件，一行一行遍历。

站在计算机操作系统的角度：

其实IO是分为 **用户空间（User space）** 和 **内核空间（Kernel space ）** 的，我们在程序发起IO操作，其实操作系统是需要从**用户空间**（程序）进入到**内核空间**（操作系统指令），这样才能访问文件。

IO的模型一般分为四种：

- ①同步阻塞IO（Blocking IO）：即BIO，传统的IO模型。
- ②同步非阻塞IO（Non-blocking IO）， 即NIO，默认创建的socket都是阻塞的，非阻塞IO要求socket被设置为NONBLOCK。注意这里所说的NIO并非Java的NIO（New IO）库。
- ③多路复用IO（IO Multiplexing）：即经典的Reactor设计模式，有时也称为**异步阻塞IO**，Java中的Selector和Linux中的epoll都是这种模型（Redis单线程为什么速度还那么快，就是因为用了多路复用IO和缓存操作的原因）
-  ④异步IO（Asynchronous IO）：即经典的Proactor设计模式，也称为***\*异步非阻塞IO\****。

### 图解： 

![](https://img-blog.csdnimg.cn/20190809100213430.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x6YjM0ODExMDE3NQ==,size_16,color_FFFFFF,t_70)

我们目前使用较多的也是这种BIO，比如说InputStream的wirte和read，都是同步阻塞的，只有等待文件读写完毕，我们才能进行下一步。



![img](https://img-blog.csdnimg.cn/20190809100722996.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x6YjM0ODExMDE3NQ==,size_16,color_FFFFFF,t_70)

著名的Netty 就是使用NIO。

![img](https://img-blog.csdnimg.cn/20190809100538991.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x6YjM0ODExMDE3NQ==,size_16,color_FFFFFF,t_70)

Redis就是这种多路复用IO

![img](https://img-blog.csdnimg.cn/20201016154144678.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x6YjM0ODExMDE3NQ==,size_16,color_FFFFFF,t_70)


