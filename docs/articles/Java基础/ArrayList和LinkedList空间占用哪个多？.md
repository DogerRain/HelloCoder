一般来说LinkedList的占用空间更大，因为每个节点要维护指向前后地址的两个节点。

但也不是绝对，如果刚好数据量超过ArrayList默认的临时值时，ArrayList占用的空间也是不小的，因为扩容的原因会浪费将近原来数组一半的容量。

不过，因为ArrayList的数组变量是用transient关键字修饰的，如果集合本身需要做序列化操作的话，ArrayList这部分多余的空间不会被序列化。



借用网上一张图：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210801/image-20210830183426190.png)

