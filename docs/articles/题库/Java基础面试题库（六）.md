##### 51、下列关于修饰符混用的说法，错误的是( )

A	abstract不能与final并列修饰同一个类
B	abstract 类中不建议有private的成员
C	abstract 方法必须在abstract类或接口中
D	static方法中能直接处理非static的属性



**D**
A、abstract修饰的类，不可实例化，所以需要子类去继承，然后重写其中的抽象方法。但是final修饰类是不可继承的。两者属性相冲。
B、看清楚，人家说的是不建议有，不是不能有。
C、抽象类中可以没有抽象方法，但是抽象方法必须在抽象类中或者接口中
D、static不可以修饰非static的属性，因为类加载的时候，static属性比非static先初始化，那么一个存在的总不能访问一个没有存在的吧。



##### 51、Java中基本的编程单元为：

A	类
B	函数
C	变量
D	数据



 **A**

java的基本编程单元是类，基本存储单元是变量。



##### 53、下列哪个类的声明是正确的？

A	abstract final class HI{}
B	abstract private move(){}
C	protected private number;
D	public abstract class Car{}



**D**

A选项，final是最终类，不能被继承；abstrct类是抽象类，只能被继承，两者冲突。 
B选项，private修饰符定义的属性及方法不能被子类实现，而抽象类的子类必须实现所有的抽象方法。两者冲突。 C选项，修饰符重复，而且没有定义数据类型。 

