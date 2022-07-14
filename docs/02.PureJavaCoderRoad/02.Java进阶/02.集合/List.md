---
title: List
date: 2022-05-26 17:03:56
permalink: /pages/List
lock: false
categories: 
  - PureJavaCoderRoad
  - Java进阶
  - 集合
tags: 
  - List
---
## List介绍

`List` 是 **有序、可为null、可重复**的集合

 `List`和数组类似，可以动态增长，根据实际存储的数据的长度自动增长List的长度。

`List`是一个有序的集合（插入和遍历的顺序是一样的），每个元素都可以通过索引确定自己的位置，`List`的索引和数组一样，从`0`开始。



`List` 存放的是**单元素**，并不像 `Map` 那样是通过 **键-值**存放，但是`List`每个元素 都可以通过索引确定位置。

使用：

```java
import java.util.List;
```



## List  接口的API

### 1、add()

将元素插入到指定位置的 arraylist 中，如果不知道位置，默认是添加到最后的位置。

```java
arrayList.add("五菱宏光");
arrayList.add(1,"五菱宏光"); //第1个 位置
```

### 2、addAll()

添加集合中的所有元素到 arraylist 中

```java
ArrayList<String> arrayList = new ArrayList<>();
ArrayList<String> arrayList1 = new ArrayList<>();
arrayList.addAll(arrayList1);
```

### 3、clear()

删除 arraylist 中的所有元素。

### 4、contains(Obeject)

判断元素是否在 arraylist

### 5、remove (Obeject)

删除 arraylist 里的单个元素，如果有多个元素，只删除一个。

### 6、forEach()

遍历数组

### 7、toArray()

将 arraylist 转换为数组



## List接口的实现类

`List`也是一个接口，常见的实现类有三个：

- **ArrayList**
- **LinkedList**
- **Vector**



### ArrayList

使用前引入即可：

```java
import java.util.ArrayList; // 引入 ArrayList 类
```

因为`ArrayList`实现`List`接口，两种初始化方法都可以：

```java
List<String> list = new ArrayList<String>();  // 初始化1
ArrayList<String> arrayList = new ArrayList<>();　 // 初始化2
```

使用：

```java
 ArrayList<String> arrayList = new ArrayList<>();
        arrayList.add("五菱宏光");
        arrayList.add("五菱宏光");
        arrayList.add("宝马");
        arrayList.add(null);

        for (String str : arrayList) {
            System.out.println(str);
        }
```

输出：

```
五菱宏光
五菱宏光
宝马
null
```



### LinkedList

```java
List<String> linkedList = new LinkedList<>();
```

LinkedList间接的实现了List接口（说明LinkedList是有list的特性的，add，remove等）、实现了Cloneable（可复制）、Serializable（进行了序列化），除此之外还有一个东西还实现了Queue（队列，说明应该是有队列的一些特性，pop等）



**ArrayList 与 LinkedList 异同：**

同：两者都是线程不安全的。

区别：

1. Arraylist 底层使用的是Object数组；**LinkedList 底层使用的是双向循环链表数据结构；**

2. ArrayList 采用数组存储，所以插入和删除元素的时间复杂度受元素位置的影响。插入末尾还好，如果是中间，则（add(int index, E element)）接近O（n）；LinkedList 采用链表存储，所以插入，删除元素时间复杂度不受元素位置的影响，都是近似 O（1）而数组为近似 O（n）。对于随机访问get和set，ArrayList觉得优于LinkedList，因为LinkedList要移动指针。

3. LinkedList 不支持高效的随机元素访问，而ArrayList 实现了RandmoAccess 接口，所以有随机访问功能。快速随机访问就是通过元素的序号快速获取元素对象(对应于`get(int index)`方法)。

4. ArrayList的空 间浪费主要体现在在list列表的结尾会预留一定的容量空间，而LinkedList的空间花费则体现在它的每一个元素都需要消耗比ArrayList更多的空间（因为要存放直接后继和直接前驱以及数据）。

### Vector

```java
Vector<String> vector = new Vector();
```

`Vector`是线程安全的，即线程同步，`ArrayList`是不安全的，如果有多个线程访问到集合，最好使用`Vector`，因为不需要我们自己再去考虑和编写线程安全的代码。

如果只有一个线程会访问到集合，那最好是使用`ArrayList`，因为它不考虑线程安全，效率会高些。





## 奇淫异巧

### 1、List和Array转换

> 以下 array 表示数组，list 表示列表

#### **数组转List：**

##### 1、方法一，List.of(array )

```java
String[] strArray = new String[]{"1","2"};
List<String> list = List.of(strArray);
```

> 注意：List.of() 是jdk1.9 才有的

##### 2、方法二，List list = Arrays.asList(strArray)

```java
String[] strArray = new String[]{"1","2"};
List<String> list = Arrays.asList(strArray);
//对转换后的list插入一条数据
list.add("1");
```

以上这种 **只能查改，不能对List增删** 否则会报 `java.lang.UnsupportedOperationException`

> **原因解析**：
> `Arrays.asList(strArray)`返回值是`java.util.Arrays`类中一个私有静态内部类`java.util.Arrays.ArrayList`，它并非`java.util.ArrayList`类。`java.util.Arrays.ArrayList`类具有 set()，get()，contains()等方法，但是不具有添加`add()`或删除`remove()`方法，所以调用`add()`方法会报错。

优化一下，改成以下这种：

```java
String[] strArray = new String[]{"1","2"};
ArrayList<String> list = new ArrayList<>(Arrays.asList(strArray)) ;
```

##### 3、方法三，暴力转换

```java
String[] strArray = new String[]{"1", "2"};
List<String> list = new ArrayList<>(strArray.length);
for (String s : strArray) {
    list.add(s);
}
```

这种方法不推荐，耗时慢。

##### 4、方法四，使用Collections.addAll()

```java
String[] strArray = new String[]{"1", "2"};
List<String> list = new ArrayList<>(strArray.length);
Collections.addAll(list, strArray);
```

Collections是一个集合工具类，这种方法**最高效**。



#### **List转数组：**

直接使用`arrayList.toArray()`

```java
ArrayList<String> arrayList = new ArrayList<>();
arrayList.add("五菱宏光");
String[] strs = arrayList.toArray(new String[arrayList.size()]);
```



### 2、初始化一个List

#### 1、匿名内部类

```java
List<String> names = new ArrayList<>() {{ //匿名内部类
    add("Tom");
    add("Sally");
    add("John");
}};
```

#### 2、Arrays 工具类

```java
List<String> jdks = Arrays.asList("JDK6", "JDK8", "JDK10");
```

> 其他多种方法参考：https://www.cnblogs.com/heqiyoujing/p/10765860.html



### 3、遍历List的几种方法

```javascript
// 初始化一个 ArrayList
List<String> list = new ArrayList<String>() {{ //匿名内部类
    add("Tom");
    add("Sally");
    add("John");
}};

//方法一  暴力循环
for (int i = 0; i < list.size(); i++) {
    System.out.println(list.get(i));
}


// 方法二 迭代器
Iterator it1 = list.iterator();
while (it1.hasNext()) {
    System.out.println(it1.next());
}


// 方法三：foreach
for (String str : list) {
    System.out.println(str);
}
```



## 总结：

1、 对于需要快速随机访问元素，应该使用ArrayList

2、对于需要快速插入，删除元素，应该使用LinkedList。

3、对于需要线程安全要求的，应该使用Vector。