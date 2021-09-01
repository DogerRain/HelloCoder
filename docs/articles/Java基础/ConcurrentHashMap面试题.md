## 1、ConcurrentHashMap跟HashMap，HashTable的对比

- HashMap多线程下是不安全的，扩容时可能会形成闭环

> 1.7 hashMap 扩容过程：https://blog.csdn.net/lkforce/article/details/89521318

-  HashTable是线程安全的，原理和HashMap基本一样，差别在：
  - HashTable不允许key和value为null
  - get/put所有相关操作都是synchronized的，这相当于给整个哈希表加了一把大锁，性能较差

- ConcurrentHashMap是线程安全的，但是它是分段锁，容器中有多把锁，每一把锁锁一段数据，这样在多线程访问时不同段的数据时，就不会存在锁竞争了，这 样便可以有效地提高并发效率。



## 2、ConcurrentHashMap的底层原理



**jdk1.7中：**

ConcurrentHashMap 是由 `Segment 数组结构 + HashEntry 数组结构 + 链表` 组成。Segment 是一种可重入锁 ReentrantLock（Segment 继承了ReentrantLock），在 ConcurrentHashMap 里扮演锁的角色，HashEntry 则用于存储键值对数据。

Segment数组的意义就是将一个大的table分割成多个小的table来进行加锁，也就是上面的提到的锁分离技术，而每一个Segment元素存储的是`HashEntry数组+链表`，这个和HashMap的数据存储结构一样。

![ ](https://images-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201020000216865.png)





**jdk1.8中：**

放弃了Segment，直接用 `Node数组+链表+红黑树` 的数据结构来实现，并发控制使用`Synchronized + CAS`来操作，整个看起来就像是优化过且线程安全的HashMap。

> 取消segments字段，采用table数组元素作为锁（使用synchronized锁住），从而实现了对每一行数据进行加锁，进一步减少并发冲突的概率。

![ ](https://images-1253198264.cos.ap-guangzhou.myqcloud.com/20180522155453418.png)



jdk1.7、1.8 中，核心的方法是使用了Unsafe类中的各种native本地方法。

主要的几个方法是`Unsafe.putObjectVolatile(obj,long,obj2)`、 `Unsafe.getObjectVolatile`、 `Unsafe.putOrderedObject`（1.8没有用了）

```c
void sun::misc::Unsafe::putObjectVolatile (jobject obj, jlong offset, jobject value)
　　{
　　write_barrier ();
　　volatile jobject *addr = (jobject *) ((char *) obj + offset);
　　*addr = value;
　　}

void sun::misc::Unsafe::putObject (jobject obj, jlong offset, jobject value)
　　{
　　jobject *addr = (jobject *) ((char *) obj + offset);
　　*addr = value;
　　}//用于和putObjectVolatile进行对比

jobject sun::misc::Unsafe::getObjectVolatile (jobject obj, jlong offset)
　　{
　　volatile jobject *addr = (jobject *) ((char *) obj + offset);
　　jobject result = *addr;
　　read_barrier ();
　　return result;
　　}

void sun::misc::Unsafe::putOrderedObject (jobject obj, jlong offset, jobject value)
　　{
　　volatile jobject *addr = (jobject *) ((char *) obj + offset);
　　*addr = value;
　　}
```

`putObjectVolatile` 和 `getObjectVolatile` 分别用到了`write_barrier`和`read_barrier`这两个内存屏障，写屏障和读屏障。

> java内存模型中使用的所谓的LoadLoad、LoadStore、StoreStore、StoreLoad这几个屏障就是基于这两个屏障实现的

通过内存屏障保证了有序性，再通过volatile保证将对指定地址的操作是马上写入到共享的主存中而不是线程自身的本地工作内存中，这样配合下面的`getObjectVolatile`方法，返回前加了`read_barrier`，这个读屏障的作用就是强制去读取主存中的数据而不是线程自己的本地工作内存，就可以确保每次读取到的就是最新的数据。



## 3、JDK 1.7 ConcurrentHashMap是如何保证线程安全的？

**jdk1.7中**，总体来说，ConcurrentHashMap利用了 **unsafe操作+ReentrantLock**，主要使用了：

- compareAndSwapObject
- putObjectVolatile
- getObjectVolatile

见字如意，通过分段思想，锁住需要的区间，提高了并发量，分段数越多，支持的并发量就越高。

每个段（segment）就是一个小型的HashMap，调用 put 方法时，就会调用 segment 的put，segment 继承 ReentrantLock，加锁成功才会



## 4、JDK 1.8 ConcurrentHashMap 读操作为什么不用加锁？

ConcurrentHashMap 的 get 方法会调用 tabAt 方法，这是一个Unsafe类volatile的操作，保证每次获取到的值都是最新的。（强制将修改的值立即写入主存）

```java
static final <K,V> Node<K,V> tabAt(Node<K,V>[] tab, int i) {
	return (Node<K,V>)U.getObjectVolatile(tab, ((long)i << ASHIFT) + ABASE);
}
```



![img](https://axin-soochow.oss-cn-hangzhou.aliyuncs.com/18-10-9/axin-concur.png)

---

参考：

- [https://blog.csdn.net/zzu_seu/article/details/106675596](https://blog.csdn.net/zzu_seu/article/details/106675596)