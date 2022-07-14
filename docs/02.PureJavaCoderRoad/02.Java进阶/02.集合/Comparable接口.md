---
title: Comparable接口
date: 2022-05-26 17:03:56
permalink: /pages/Comparable%E6%8E%A5%E5%8F%A3
lock: false
categories: 
  - PureJavaCoderRoad
  - Java进阶
  - 集合
tags: 
  - Comparable
  - 接口
---
## 1、Comparable

Java提供了一个Comparable接口，该接口里定义了一个compareTo(Object obj)方法，该方法返回一个整数值，实现该接口的类必须实现该方法，实现了该接口的类必须实现该方法，实现接口的类就可以比较大小了。

当调用一个一个对象调用该方法与另一个对象进行比较时，`obj1.compareTo(obj2)`如果返回0表示两个对象相等；如果返回正整数则表明obj1大于obj2,如果是负整数则相反。

可以看到Comparable接口只有一个方法：

```
public int compareTo(T o);
```



## 2、Comparable有什么作用？

举个例子，

```java
String[] strArr = {"A","B","C","E","D"};
Arrays.sort(strArr);
for (String string : strArr) {
    System.out.print(string+";");
}
```

输出结果：

```
A;B;C;D;E;
```

从中我们可以看出sort方法对数据中的String字符串按照一定规则进行了排序，那为什么会排序呢？

看一下String类的源码：

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
```

它也实现了Comparable接口。里面实现了compareTo方法，所以按照某种规则能够进行排序。



如果我要对自己的对象进行排序，那要怎么操作呢？

这样写？

```java
Student xiaoha = new Student("小哈", 20);
Student erha = new Student("二哈", 19);
Student daha = new Student("大哈", 25);
Student[] studentArray = new Student[]{xiaoha, erha, daha};
Arrays.sort(studentArray);
for (Student student : studentArray) {
    System.out.println(student);
}
```

执行发现：

```java
Exception in thread "main" java.lang.ClassCastException: com.yudianxx.basic.集合.ComparableTest$Student cannot be cast to java.lang.Comparable
	at java.util.ComparableTimSort.countRunAndMakeAscending(ComparableTimSort.java:320)
	at java.util.ComparableTimSort.sort(ComparableTimSort.java:188)
	at java.util.Arrays.sort(Arrays.java:1246)
	at com.yudianxx.basic.集合.ComparableTest.main(ComparableTest.java:45)
```

提示 `Student` 这个类无法 转换为`Comparable`，其实根本原因是因为没有实现自己的比较方法规则（`compareTo()`方法）。

而`String` 类 是重写了`compareTo()`方法的比较规则的。



## 3、自定义排序Array数组 

### 1、实现Comparable接口，重写compareTo方法

完整例子：

```java
public class ComparableTest {
    public static void main(String[] args) {
        Student xiaoha = new Student("小哈", 20);
        Student erha = new Student("二哈", 19);
        Student daha = new Student("大哈", 25);
        Student[] studentArray = new Student[]{xiaoha, erha, daha};
        Arrays.sort(studentArray);
        for (Student student : studentArray) {
            System.out.println(student);
        }
        
    }
    //实现Comparable 接口 
    static class Student implements Comparable<Student> {
        String name;
        Integer age;

        Student(String name, int age) {
            this.name = name;
            this.age = age;
        }

        public Integer getAge() {
            return age;
        }

        @Override
        public int compareTo(Student o2) {
            //降序
            return this.getAge().compareTo(o2.getAge());
        }

        @Override
        public String toString() {
            return "Car{" +
                    "名字='" + name + '\'' +
                    ", 年龄=" + age +
                    '}';
        }
    }
}
```

输出：

```
Car{名字='二哈', 年龄=19}
Car{名字='小哈', 年龄=20}
Car{名字='大哈', 年龄=25}
```

这样就能达到按照年龄升序的排列方式了。



### 2、实现sortComparator接口，重写compare方法

```java
public class ComparatorTest {

    static class Student {
        String name;
        Integer age;

        Student(String name, int age) {
            this.name = name;
            this.age = age;
        }

        public Integer getAge() {
            return age;
        }

        @Override
        public String toString() {
            return "Car{" +
                    "名字='" + name + '\'' +
                    ", 年龄=" + age +
                    '}';
        }
    }

    static class SortComparator implements Comparator<Student> {
        @Override
        public int compare(Student o1, Student o2) {
            //降序
            return o2.getAge().compareTo(o1.getAge());
        }
    }

    public static void main(String[] args) {
        Student xiaoha = new Student("小哈", 20);
        Student erha = new Student("二哈", 19);
        Student daha = new Student("大哈", 25);
        Student[] studentArray = new Student[]{xiaoha, erha, daha};
        //传入实现接口Comparator 的类
        Arrays.sort(studentArray, new SortComparator());
        for (Student student : studentArray) {
            System.out.println(student);
        }
    }
}
```

输出：

```
Car{名字='二哈', 年龄=19}
Car{名字='小哈', 年龄=20}
Car{名字='大哈', 年龄=25}
```

可以看到，这里的`SortComparator`类就是自定义的排序规则。



---

## 4、自定义排序List列表

> list 是有序的，默认按照`add()`的先后顺序遍历

假如没有自定义，是会按照`add()`的顺序先后遍历的。

eg：

```java
List<Student> studentList = new ArrayList<>();
studentList.add(xiaoha);
studentList.add(erha);
studentList.add(daha);
System.out.println(studentList);
```

输出：

```java
[Car{名字='小哈', 年龄=20}, Car{名字='二哈', 年龄=19}, Car{名字='大哈', 年龄=25}]
```



#### List 自定义排序方法

可以声明 `Collections.sort(studentList,new SortComparator());` 排序，即上面的自定义数组排序的第二种

```java
List<Student> studentList = new ArrayList<>();
studentList.add(xiaoha);
studentList.add(erha);
studentList.add(daha);
System.out.println(studentList); //默认的排序
Collections.sort(studentList, new SortComparator()); //自定义排序
System.out.println(studentList);
```

输出：

```
[Car{名字='小哈', 年龄=20}, Car{名字='二哈', 年龄=19}, Car{名字='大哈', 年龄=25}]
[Car{名字='大哈', 年龄=25}, Car{名字='小哈', 年龄=20}, Car{名字='二哈', 年龄=19}]
```



#### 语法糖：（建议使用这种）

如果是List列表，不一定要写的这么复杂的，可以写成这样：

```java
public class ComparatorTest {
    static class Student {
        String name;
        Integer age;
            this.name = name;
            this.age = age;
        }
        public Integer getAge() {
            return age;
        }
        @Override
        public String toString() {
            return "Car{" +
                    "名字='" + name + '\'' +
                    ", 年龄=" + age +
                    '}';
        }
    }
    public static void main(String[] args) {
        Student xiaoha = new Student("小哈", 20);
        Student erha = new Student("二哈", 19);
        Student daha = new Student("大哈", 25);

        List<Student> studentList = new ArrayList<>();
        studentList.add(xiaoha);
        studentList.add(erha);
        studentList.add(daha);
        //核心
        Collections.sort(studentList, new Comparator<Student>() {
            @Override
            //降序
            public int compare(Student o1, Student o2) {
                return o2.getAge().compareTo(o1.getAge());
            }
        });
        System.out.println(studentList);
    }
}
```

