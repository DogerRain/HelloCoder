---
title: Java8之Stream
date: 2022-05-24 17:44:31
permalink: /pages/Java8%E4%B9%8BStream
lock: false
categories: 
  - PureJavaCoderRoad
  - Java进阶
  - Java新特性
  - steam
tags: 
  - Java
  - Stream
---
## 1、Streams是什么

![](F:\笔记\PureJavaCoderRoad（Java基础教程）\docs\articles\Java新特性\picture\image-20210610140137943.png)

Stream 是 Java8 中处理集合的关键抽象概念，它可以对指定集合进行一些复杂的操作，比如说查找、过滤、分组、求和等等。

你可以理解为MySQL的group by、having、order 等等。

Stream 可以极大提高Java程序员的生产力，让程序员写出更简洁的代码。

其特点是：

- 不是数据结构，也就是说不会保存数据，也不会修改原集合的数据，它会把操作后的数据保存到另外一个对象中
- Stream也是个lambda表达式，具有延迟执行特性，只有调用终端操作时，中间操作才会执行。



## 2、Stream、parallelStream、Iterator的区别

`Stream` 是流的串行处理方式。

`parallelStream`提供了流的并行处理，它是Stream的另一重要特性，其底层使用`Fork/Join`框架实现。简单理解就是多线程异步任务的一种实现。（集合的数据会分成多个段，由多个线程处理），`parallelStream` 作为多线程版的Stream ，如果用法不正确，反而适得其反。

**`stream`和`parallelStream`的简单区分：** `stream`是顺序流，由主线程按顺序对流执行操作，而`parallelStream`是并行流，内部以多线程并行执行的方式对流进行操作，但前提是流中的数据处理没有顺序要求。

![](F:\笔记\PureJavaCoderRoad（Java基础教程）\docs\articles\Java新特性\picture\image-20210610174148178.png)

`Iterator`是一个迭代器。java通过提供`Iterator`和`Iterable`俩个接口来实现集合类的可迭代性，迭代器主要的用法是：首先用`hasNext()`作为循环条件，再用`next()`方法得到每一个元素，最后在进行相关的操作。

迭代提供一种访问一个集合对象各个元素的途径，同时又不需要暴露该对象的内部细节。

如：

```java
    Iterator<String> it = list.iterator();//得到lits的迭代器  
    //调用迭代器的hasNext方法，判断是否有下一个元素  
    while (it.hasNext()) {  
  		//将迭代器的下标移动一位，并得到当前位置的元素值  
    	System.out.println(it.next());    
    }    
```

> 从Java5.0开始，迭代器可以被foreach循环所替代，但是foreach循环的本质也是使用Iterator进行遍历的。



Stream 就如同一个迭代器（Iterator），单向，不可往复，数据只能遍历一次，遍历过一次后即用尽了，就好比流水从面前流过，一去不复返。

三者使用：

```java
List<String> list = Arrays.asList("a", "b", "c");
//创建一个迭代器
Iterator<String> iterator = list.iterator();
// 创建一个串行顺序流
Stream<String> stream = list.stream();
// 创建一个并行流
Stream<String> parallelStream = list.parallelStream();
```



## 3、例子

先来一个公共的类：

```java
@Data
@AllArgsConstructor
class Person{
    String name ;
    int age;
    String sex;
    int salary;
}

List<Person> personList = new ArrayList<>();
personList.add(new Person("醋酸菌",25,"男",12000));
personList.add(new Person("马冬梅",23,"女",8000));
personList.add(new Person("三上悠亚",24,"女",18000));
```

### 3.1、遍历（foreach）

```java
personList.stream().forEach(x-> System.out.println(x.getName()));
```

输出：

```
醋酸菌
马冬梅
三上悠亚
```

> 注意：
>
> foreach不能使用break和continue这两个关键字，通过查资料得知原来foreach和普通的for循环是不同的，它不是普通的遍历，要想实现continue的效果，可以直接使用return即可；
>
> 但是如何实现break的效果呢，然而foreach是无法实现的，只要你使用它，就一定会遍历完的，除非你可以把它放进一个try中，通过抛出异常进行终止它。

### 3.2、过滤（filter）

```java
personList.stream()
	.filter(x -> x.getAge() > 23)
	.filter(x->x.getSalary() > 12000)
	.forEach(x-> System.out.println(x.getName()));
```

把符合的数据丢进一个Map然后再转成List：

```java
        List<String> stringList = personList.stream().filter(x -> x.getAge() > 23)
                .filter(x -> x.getSalary() > 12000)
                .map(person -> person.getName()).collect(Collectors.toList());
        System.out.println(stringList);
```

