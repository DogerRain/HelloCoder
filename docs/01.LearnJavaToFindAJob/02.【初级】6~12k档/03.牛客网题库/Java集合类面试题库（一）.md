---
title: Java集合类面试题库（一）
date: 2022-06-02 11:18:16
lock: true
permalink: /pages/Java%E9%9B%86%E5%90%88%E7%B1%BB%E9%9D%A2%E8%AF%95%E9%A2%98%E5%BA%93%EF%BC%88%E4%B8%80%EF%BC%89
categories: 
  - LearnJavaToFindAJob
  - 【初级】6~12k档
  - 牛客网题库
tags: 
  - Java
---
##### 1、下面哪个Set类是排序的？

A	LinkedHashSet

B	TreeSet

C	HashSet

D	AbstractSet



**B**

注意，不是有序是排序。

TreeSet 使用二叉树的原理对新 add()的对象按照指定的顺序排序（升序、降序），每增加一个对象都会进行排序，将对象插入的二叉树指定的位置。



##### 2、Java 中的集合类包括 ArrayList 、 LinkedList 、 HashMap 等，下列关于集合类描述正确的是？（）

A	ArrayList和LinkedList均实现了List接口

B	ArrayList访问速度比LinkedList快

C	随机添加和删除元素时，ArrayList的表现更加快速

D	HashMap实现Map接口，它允许任何类型的键和值对象，并允许将NULL用作键或值



 **A B D** 



##### 3、ArrayList和LinkList的描述，下面说法错误的是？

A	LinkedeList和ArrayList都实现了List接口

B	ArrayList是可改变大小的数组，而LinkedList是双向链接串列

C	LinkedList不支持高效的随机元素访问

D	在LinkedList的中间插入或删除一个元素意味着这个列表中剩余的元素都会被移动；而在ArrayList的中间插入或删除一个元素的开销是固定的



**D**

D这个说法说反了。



##### 4、如果一个list初始化为{5，3，1}，执行以下代码后，其结果为（）？

```java
nums.add(6);
nums.add(0,4);
nums.remove(1);
```

A	[5, 3, 1, 6]

B	[4, 3, 1, 6]

C	[4, 3, 6]

D	[5, 3, 6]



**B**

list{5,3,1}

nums.add(6); //往后边加一个6，{5，3，1，6}

nums.add(0,4);//往下标为0的数加一个4，其他元素后移 {4，5，3，1，6}

nums.remove(1); // 移除下标为1 的元素，{4，3，1，6}



##### 5、List、Set、Map是否继承自Collection接口？

List、Set 是，Map 不是。

List、Set 是add操作，Map是put的k-v操作。



##### 6、关于java集合下列说法不正确的有哪些（）

A	HashSet 它是线程安全的，不允许存储相同的对象

B	ConcurrentHashMap 它是线程安全的，其中存储的键对象可以重复，值对象不能重复

C	Collection接口是List接口和Set接口的父接口，通常情况下不被直接使用

D	ArrayList线程安全的，允许存放重复对象



**A B D**



线程安全(Thread-safe)的集合对象：

Vector 线程安全

HashTable 线程安全

StringBuffer 线程安全

非线程安全的集合对象：

ArrayList 

LinkedList

HashMap

HashSet

TreeMap

TreeSet

StringBulider



HashSet和ArrayList一样线程不安全，ConcurrentHashMap、HashMap **键不能重复，值可以重复**



##### 7、 下面哪些具体实现类可以用于存储键，值对，并且方法调用提供了基本的多线程安全支持：()

A	java.util.ConcurrentHashMap

B	java.util.Map

C	java.util.TreeMap

D	java.util.SortMap

E	java.util.Hashtable

F	java.util.HashMap



**A E**



##### 8、Java中的集合类包括ArrayList、LinkedList、HashMap等类，下列关于集合类描述正确的是（）

A	ArrayList和LinkedList均实现了List接口

B	ArrayList的访问速度比LinkedList快

C	添加和删除元素时，ArrayList的表现更佳

D	HashMap实现Map接口，它允许任何类型的键和值对象，并允许将null用作键或值



**A B D**

ArrayList插入和现有项的删除开销很大,除非在末端，但是随机访问速度快。LinkedList插入和删除开销很小。



##### 9、请问运行主要的程序会打印出的是什么（）

```java
public class Test{ 
    public static void main(String [] args){ 
        List list=new ArrayList(); 
        list.add("a");
        list.add("b");
        list.add("a");
        Set set=new HashSet(); 
        set.add("a"); 
        set.add("b"); 
        set.add("a"); 
        System.out.println(list.size()+","+set.size()); 
    } 
}
```



**3,2**



list有序可重复，set无序不可重复


##### 9、Java中的集合类包括ArrayList、LinkedList、HashMap等类，下列关于集合类描述正确的是（）

A	ArrayList和LinkedList均实现了List接口

B	ArrayList的访问速度比LinkedList快

C	添加和删除元素时，ArrayList的表现更佳

D	HashMap实现Map接口，它允许任何类型的键和值对象，并允许将null用作键或值



**A B D**

ArrayList插入和现有项的删除开销很大,除非在末端，但是随机访问速度快。LinkedList插入和删除开销很小。