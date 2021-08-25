## 1、ConcurrentHashMap跟HashMap，HashTable的对比

- HashMap多线程下是不安全的，扩容时可能会形成闭环

> 1.7 hashMap 扩容过程：https://blog.csdn.net/lkforce/article/details/89521318

-  HashTable是线程安全的，原理和HashMap基本一样，差别在：
  - HashTable不允许key和value为null
  - get/put所有相关操作都是synchronized的，这相当于给整个哈希表加了一把大锁，性能较差

- ConcurrentHashMap是线程安全的，但是它是分段锁，容器中有多把锁，每一把锁锁一段数据，这样在多线程访问时不同段的数据时，就不会存在锁竞争了，这 样便可以有效地提高并发效率。



## 2、ConcurrentHashMap的详细过程



