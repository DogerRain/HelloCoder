---
title: Iterator与Collection
date: 2022-05-26 17:03:56
permalink: /pages/Iterator%E4%B8%8ECollection
lock: false
categories: 
  - PureJavaCoderRoad
  - Java进阶
  - 集合
tags: 
  - Iterator
  - Collection
---
> 版本：jdk1.8

回顾一下Java集合的关系：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/Home/image-20210128105508292.png)

Java的集合都是实现Iterator接口，主要的三个集合是：

- Map
- List
- Set

这三个接口又衍生出很多实现类。

这个`Iterator`到底是个啥呢？

## Iterator

即 `java.util.Iterator`

可以看到这个接口只有三个方法：

```java
public interface Iterator {  
　　boolean hasNext();  
　　Object next();  
　　void remove();  
}   
```

 其中：

​    `Object next()`：返回迭代器刚越过的元素的引用，返回值是Object，需要强制转换成自己需要的类型

​    `boolean hasNext()`：判断容器内是否还有可供访问的元素

​    `void remove()`：删除迭代器刚越过的元素



常用的就是用来遍历一个集合：

```java
    //Iterator 迭代器 遍历
    Iterator<Map.Entry<Integer, String>> it = map.entrySet().iterator();
    while (it.hasNext()) {
        Map.Entry<Integer, String> entry = it.next();
        Integer key = entry.getKey();
        String value = entry.getValue();
        System.out.println(key + " = " + value);
    }
```




## Collection 

```java
public interface Collection<E> extends Iterable<E> {

}
```

Collection 接口有 3 种子类型集合: `List`、`Set` 和 `Queue`

> `Queue`是一个队列，元素先进先出。

Collection 的API：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/Home/image-20210128153543008.png)

Collection 是一个对集合操作的接口，定义了未实现的方法，这也是接口的一种编程思想，只要实现类实现Collection 接口，就必须实现这些方法。

 这也是集合的共同操作，比如插入insert、删除delete、遍历、清空等等。