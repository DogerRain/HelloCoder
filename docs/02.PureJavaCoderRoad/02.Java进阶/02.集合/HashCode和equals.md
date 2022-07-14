---
title: HashCode和equals
date: 2022-05-26 17:03:56
permalink: /pages/HashCode%E5%92%8Cequals
lock: false
categories: 
  - PureJavaCoderRoad
  - Java进阶
  - 集合
tags: 
  - HashCode
  - equals
---
## 1、hashcode是什么

HashSet、HashMap、Hashtable 都是通过**hash表**存放元素的地址。

### 1、hash表

hash表也称散列表（Hash table），是根据关键码值(Key value)而直接进行访问的数据结构。也就是说，它通过把关键码值映射到表中一个位置来访问记录，以加快查找的速度。这个映射函数叫做散列函数，存放记录的数组叫做散列表。

hash表包括以下内容：

- 容量：hash表中桶的数量；
- 初始化容量：创建hash表时桶的数量；
- 尺寸：当前hash表中记录的数量；
- 负载因子：负载因子等于0表示空的hash表，0.5表示半满的hash表，轻负载的hash表具有冲突少、适宜插入与查询等特点。
- 负载极限：负载极限是一个0~1之间的数值，决定了hash表的最大填满程度。当hash表的负载因子达到指定负载极限时，hash表会自动成倍地增加容量，并将原有的对象重新分配，放入新的桶中。HashSet、HashMap、Hashtable默认的负载极限是0.75。



### 2、hashcode

每个对象都有hashcode，通过将对象的物理地址转换为一个整数，将整数通过hash函数计算就可以得到hashcode



HashSet、HashMap以及HashTable 也一样，用每个元素的hashCode值来计算其存储位置。

hash表 中每个存储元素的“槽位”通常称为“桶”， 判断每个元素元素是否相等，是通过`hash()`方法判断两者的HashCode 是否相等，如果相等，再调用`equals()`判断值是否相等。

> **hashCode方法的存在是为了减少equals方法的调用次数，从而提高程序效率**

## 2、 hashCode()和equals()

这两个方法都是Object类提供的，都可以被重写。

#### 1. equals方法

Object类中equals()方法实现如下：

```java
public boolean equals(Object obj) {
    return (this == obj);
}
```

所以，只要这个不是同一个对象，那么`equals()`一定返回false

### 2、hashCode 方法

Object类中hashCode()方法的声明如下：

```java
public native int hashCode();
```

> native 是一个本地方法，表示Java的方法，是调用C语言的方法

实际上，该native方法将对象在内存中的地址作为哈希码返回，可以保证不同对象的返回值不同。



JDK中对hashCode()方法的作用，以及实现时的注意事项做了说明：

- （1）hashCode()在哈希表中起作用，如java.util.HashMap。
- （2）如果对象在equals()中使用的信息都没有改变，那么hashCode()值始终不变。
- （3）**如果两个对象使用equals()方法判断为相等，则hashCode()方法也应该相等。**
- （4）如果两个对象使用equals()方法判断为不相等，则不要求hashCode()也必须不相等；但是开发人员应该认识到，不相等的对象产生不相同的hashCode可以提高哈希表的性能。

**重写hashcode()的原则**

- （1）如果重写了equals()方法，检查条件“两个对象使用equals()方法判断为相等，则hashCode()方法也应该相等”是否成立，如果不成立，则重写hashCode ()方法。

- （2）hashCode()方法不能太过简单，否则哈希冲突过多。

- （3）hashCode()方法不能太过复杂，否则计算复杂度过高，影响性能

  

## 3、HashMap中的hash()函数

`hashMap`的`hash()`函数：

```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

> 这里的 `key.hashCode()` 方法其实就是 `Object.hashCode()` 方法

这段代码类似作用是为了增加hashcode的随机性，至于为什么要这么做，是为了降低hash冲突的概率，大家有兴趣可以研究一下。

**hash冲突的问题：**

两个不一样的对象，它们的hashCode是有可能相等的，这叫做**hash碰撞**

hash表的集合（HashMap、HashTable、TreeMap做些）如果出现了hash碰撞，最后还需要通过equals方法去判定是否相等。



>  本文部分参考自：https://www.cnblogs.com/NathanYang/p/9427456.html



## 重写HashCode和equals方法

在HashSet中，它默认是不允许有重复元素的；在HashMap中，它允许key 重复。

如果按照默认的equals方法和`add()`、`put()`方法去调用，是会这样输出的：

```java
class Car {
    String number;
    String carName;

    Car(String number, String carName) {
        this.number = number;
        this.carName = carName;
    }

	//重写 toString 方法
    @Override 
    public String toString() {
        return "Car{" +
                "number='" + number + '\'' +
                ", carName=" + carName +
                '}';
    }

}

public class SetTest {
    public static void main(String[] args) {
        testHashSet();
    }

    static void testHashSet() {
        HashSet<Car> hashSet = new HashSet();
        Car baoMa1 = new Car("粤Z8888", "宝马X5");
        Car baoMa2 = new Car("粤Z8888", "宝马X5");
        System.out.println(baoMa1.equals(baoMa2));
        hashSet.add(baoMa1);
        hashSet.add(baoMa2);
        System.out.println(hashSet);

        Map<Car, String> hashMap = new HashMap<>();
        hashMap.put(baoMa1,"小哈"); 
        hashMap.put(baoMa2,"小明");
        System.out.println(hashMap);
    }
}
```

输出以下：

```java
false
[Car{number='粤Z8888', carName=宝马X5}, Car{number='粤Z8888', carName=宝马X5}]
{Car{number='粤Z8888', carName=宝马X5}=小哈, Car{number='粤Z8888', carName=宝马X5}=小明}
```

虽然`baoma1`、`baoMa2`  是两个不同的对象，但是内容确实是一样的，那假如业务需要，我要如果把这两个对象视为同一个对象，不容许重复`add()`和`put()`呢？



答案就是重写`equals()`和`hashCode()`方法：



```java
class Car {
    String number;
    String carName;

    Car(String number, String carName) {
        this.number = number;
        this.carName = carName;
    }

    @Override
    public String toString() {
        return "Car{" +
                "number='" + number + '\'' +
                ", carName=" + carName +
                '}';
    }
    //重写equals
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Car car = (Car) o;
        //自定义比较判断
        return Objects.equals(this.number, car.number) &&
                Objects.equals(this.carName, car.carName);
    }

    //重写hashCode
    @Override
    public int hashCode() {
        return Objects.hash(number, carName);
    }
}

public class SetTest {
    public static void main(String[] args) {
        testHashSet();
    }

    static void testHashSet() {
        HashSet<Car> hashSet = new HashSet();
        Car baoMa1 = new Car("粤Z8888", "宝马X5");
        Car baoMa2 = new Car("粤Z8888", "宝马X5");
        System.out.println(baoMa1.equals(baoMa2));
        hashSet.add(baoMa1);
        hashSet.add(baoMa2);
        System.out.println(hashSet);

        Map<Car, String> hashMap = new HashMap<>();
        hashMap.put(baoMa1,"小哈");
        hashMap.put(baoMa2,"小明");
        System.out.println(hashMap);
    }

}
```

重写后输出：

```
true
[Car{number='粤Z8888', carName=宝马X5}]
{Car{number='粤Z8888', carName=宝马X5}=小明}
```

