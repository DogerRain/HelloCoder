## spring的事务失效场景有哪些？

在spring框架中，使用事务还是很简单的，只需要在对应的方法上加上`@Transactional`注解即可，但并不是加了注解事务就会生效，开发者在使用该注解的时候，需要注意的地方还是很多的，所以这也是面试中经常会问到的。



简单总结一下spring事务失效的场景：

1、注解@Transactional配置的方法非public权限修饰；

2、注解@Transactional所在类中，注解修饰的方法被类内部方法调用；

2、业务代码抛出异常类型`非RuntimeException`，事务失效；

3、业务代码中存在异常时，使用try…catch…语句块捕获，而catch语句块没有throw new RuntimeExecption异常;（相对于正常处理了）

4、注解@Transactional中Propagation属性值设置错误即`Propagation.NOT_SUPPORTED`（一般不会设置此种传播机制），或者使用`PROPAGATION_REQUIRES_NEW`起一个新的事务，旧的事务报错了回滚，新的事务没有回滚。

5、mysql关系型数据库不支持，且存储引擎是MyISAM而非InnoDB，则事务会不起作用(基本开发中不会遇到)；



下面详细来说明一下事务的场景：



## 1、非public权限修饰方法

spring事务也是通过动态代理来实现的，它在方法进来的时候判断当前method是否是public。（是spring对非public方法的过滤，其实jdk、cglib还是可以为非public方法生成代理对象的）

> 如果要用在非 public 方法上，可以开启 AspectJ 代理模式

## 2、内部方法调用

```java
@Service
public class OrderServiceImpl implements OrderService {
    @Transactional
    public void update(Order order) {
        updateOrder(order);
    }
   // @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Transactional(propagation = Propagation.REQUIRED)
    public void updateOrder(Order order) {
        // update order
    }
}
```

为什么会失效呢？其实原因很简单，Spring在扫描Bean的时候会自动为标注了@Transactional注解的类生成一个代理类（proxy）,当有注解的方法被调用的时候，实际上是代理类调用的，代理类在调用之前会开启事务，执行事务的操作，但是同类中的方法互相调用，相当于`this.updateOrder()`，此时的updateOrder方法并非是代理类调用，而是直接通过原有的Bean直接调用，所以注解会失效。


即使被调用方法用了 `Propagation.REQUIRES_NEW`也不会生效。

**解决方法：**

```java
@Service
public class OrderServiceImpl implements OrderService {
     @Autowired
    OrderServiceImpl orderService;
    
    @Transactional
    public void update(Order order) {
        orderService.updateOrder(order);
    }
   // @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Transactional(propagation = Propagation.REQUIRED)
    public void updateOrder(Order order) {
        // update order
    }
}
```



## 5、mysql不支持事务

从 MySQL 5.5.5 开始的默认存储引擎是：InnoDB，之前默认的都是：MyISAM，所以这点要值得注意，底层引擎不支持事务，spring也没有办法，毕竟spring的事务就是建立在数据库的事务之上的。