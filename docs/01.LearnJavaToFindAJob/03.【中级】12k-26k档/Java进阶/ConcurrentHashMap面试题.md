---
title: ConcurrentHashMap面试题
date: 2022-06-02 11:18:17
lock: false
permalink: /pages/ConcurrentHashMap%E9%9D%A2%E8%AF%95%E9%A2%98
categories: 
  - LearnJavaToFindAJob
  - 【中级】12k-26k档
  - Java进阶
tags: 
  - ConcurrentHashMap
  - 面试题
---
## 1、ConcurrentHashMap跟HashMap，HashTable的对比

- HashMap多线程下是不安全的，扩容时可能会形成闭环

> 1.7 hashMap 扩容过程：https://blog.csdn.net/lkforce/article/details/89521318

-  HashTable是线程安全的，原理和HashMap基本一样，差别在：
  - HashTable不允许key和value为null
  - get/put所有相关操作都是synchronized的，这相当于给整个哈希表加了一把大锁，性能较差

- ConcurrentHashMap是线程安全的，但是它是分段锁，容器中有多把锁，每一把锁锁一段数据，这样在多线程访问时不同段的数据时，就不会存在锁竞争了，这 样便可以有效地提高并发效率。



## 2、ConcurrentHashMap的底层原理

### 事先需要明白JDK1.7、1.8加锁的区别

1.7是使用segements(16个segement)，每个segement都有一个table(Map.Entry数组)，相当于16个HashMap，同步机制为分段锁，每个segment继承`ReentrantLock`；

1.8只有1个table(Map.Entry数组)，同步机制为`CAS + synchronized`保证并发更新

总的来说就是锁的粒度更细，减少了冲突，提高了并发度。

（以下是详细的介绍）

**jdk1.7中：**

ConcurrentHashMap 是由 `Segment 数组结构 + HashEntry 数组结构 + 链表` 组成。Segment 是一种可重入锁 ReentrantLock（Segment 继承了ReentrantLock），在 ConcurrentHashMap 里扮演锁的角色，HashEntry 则用于存储键值对数据。

Segment数组的意义就是将一个大的table分割成多个小的table来进行加锁，也就是上面的提到的锁分离技术，而每一个Segment元素存储的是`HashEntry数组+链表`，这个和HashMap的数据存储结构一样。

![ ](https://images-1253198264.cos.ap-guangzhou.myqcloud.com/image-20201020000216865.png)





**jdk1.8中：**

放弃了Segment，直接用 `Node数组+链表+红黑树` 的数据结构来实现，并发控制使用`Synchronized + CAS`来操作，整个看起来就像是优化过且线程安全的HashMap。

> 取消segments字段，采用table数组元素作为锁（使用synchronized锁住），从而实现了对每一行数据进行加锁，进一步减少并发冲突的概率。
>
> 可以说将segment和数组合二为一

![ ](https://images-1253198264.cos.ap-guangzhou.myqcloud.com/20180522155453418.png)

![img](https://axin-soochow.oss-cn-hangzhou.aliyuncs.com/18-10-9/axin-concur.png)

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

每个段（segment）就是一个小型的HashMap，调用 put 方法时，就会调用 segment 的put，segment 继承 ReentrantLock，加锁成功才会 put，否则一直循环等待。





## 4、JDK 1.8 ConcurrentHashMap 读操作为什么不用加锁？

读的时候如果不是恰好读到写线程写入相同Hash值的位置(可以认为我们的操作一般是读多写少，这种几率也比较低)

ConcurrentHashMap 的 get 方法会调用 `tabAt` 方法，这是一个Unsafe类volatile的操作，保证每次获取到的值都是最新的。（强制将修改的值立即写入主存）

```java
static final <K,V> Node<K,V> tabAt(Node<K,V>[] tab, int i) {
	return (Node<K,V>)U.getObjectVolatile(tab, ((long)i << ASHIFT) + ABASE);
}
```



## 5、什么时候链表转为红黑树？

和 HashMap 一模一样：

- 链表长度超过 8 
- 数组（桶）的长度超过 64





## 6、1.8 中 ConcurrentHashMap put操作为什么用synchronized？

源码如下：

```java
final V putVal(K key, V value, boolean onlyIfAbsent) {
    //无论key还是value,不允许空
    if (key == null || value == null) throw new NullPointerException();
    //此处获取hash值的方法与HashTable类似
    int hash = spread(key.hashCode());
    int binCount = 0;
    //无限循环
    for (Node<K,V>[] tab = table;;) {
        Node<K,V> f; int n, i, fh;
        //如果节点数组为null，或者长度为0，初始化节点数组
        if (tab == null || (n = tab.length) == 0)
            tab = initTable();
        //如果节点数组的某个节点为null，则put的时候就会采用无锁竞争来获取该节点的头把交椅
        else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {
            if (casTabAt(tab, i, null,
                         new Node<K,V>(hash, key, value, null)))
                break;                   // no lock when adding to empty bin
        }
        //需要扩容的时候先扩容，再写入
        else if ((fh = f.hash) == MOVED)
            tab = helpTransfer(tab, f);
        else { //如果hash冲突的时候，即多线程操作时，大家都有一样的hash值
            V oldVal = null;
            synchronized (f) { //锁定节点数组的该节点
                if (tabAt(tab, i) == f) {
                    //如果当前该节点为链表形态
                    if (fh >= 0) {
                        binCount = 1;
                        for (Node<K,V> e = f;; ++binCount) {
                            K ek;
                            //找链表中找到相同的key，把新value替代老value
                            if (e.hash == hash &&
                                ((ek = e.key) == key ||
                                 (ek != null && key.equals(ek)))) {
                                oldVal = e.val;
                                if (!onlyIfAbsent)
                                    e.val = value;
                                break;
                            }
                            Node<K,V> pred = e;
                            //如果找不到key，就添加到链表到末尾
                            if ((e = e.next) == null) {
                                pred.next = new Node<K,V>(hash, key,
                                                          value, null);
                                break;
                            }
                        }
                    }
                    //如果当前为红黑树形态，进行红黑树到查找和替代(存在相同的key)，或者放入红黑树到新叶节点上(key不存在)
                    else if (f instanceof TreeBin) {
                        Node<K,V> p;
                        binCount = 2;
                        if ((p = ((TreeBin<K,V>)f).putTreeVal(hash, key,
                                                       value)) != null) {
                            oldVal = p.val;
                            if (!onlyIfAbsent)
                                p.val = value;
                        }
                    }
                }
            }
            if (binCount != 0) {
                //如果链表长度超过了8，链表转红黑树
                if (binCount >= TREEIFY_THRESHOLD)
                    treeifyBin(tab, i);
                if (oldVal != null)
                    return oldVal;
                break;
            }
        }
    }
    //统计节点个数，检查是否需要扩容
    addCount(1L, binCount);
    return null;
}
```

有两个原因：

1. 减少内存开销
   假设使用可重入锁来获得同步支持，那么每个节点都需要通过继承AQS来获得同步支持。但并不是每个节点都需要获得同步支持的，只有链表的头节点（红黑树的根节点）需要同步，这无疑带来了巨大内存浪费。
2. 获得JVM的支持
   可重入锁毕竟是API这个级别的，后续的性能优化空间很小。 
   synchronized则是JVM直接支持的，JVM能够在运行时作出相应的优化措施：锁粗化、锁消除、锁自旋等等。这就使得synchronized能够随着JDK版本的升级而不改动代码的前提下获得性能上的提升。

---

参考：

- [https://blog.csdn.net/zzu_seu/article/details/106675596](https://blog.csdn.net/zzu_seu/article/details/106675596)