---
title: Spring拦截器和过滤器有什么区别？
date: 2022-06-02 11:18:18
lock: false
permalink: /pages/Spring%E6%8B%A6%E6%88%AA%E5%99%A8%E5%92%8C%E8%BF%87%E6%BB%A4%E5%99%A8%E6%9C%89%E4%BB%80%E4%B9%88%E5%8C%BA%E5%88%AB%EF%BC%9F
categories: 
  - LearnJavaToFindAJob
  - 【初级】6~12k档
  - Java框架
tags: 
  - Spring
  - 拦截器
---
Spring的拦截器和过滤器大家或多或少都会用到，那**Spring拦截器和过滤器有什么区别呢？** 



## 1、什么是拦截器、什么是过滤器?

过滤器 和 拦截器 都是AOP的编程思想，功能也大致一样，可以用来实现日志记录、登录鉴权、过滤等等，但是它们的不同点也很多，所以应用场景也不一样。

 **拦截器(Interceptor):** 用于在某个方法被访问之前进行拦截，然后在方法执行之前或之后加入某些操作，**其实就是AOP的一种实现策略**。

 **过滤器(Filter):** 在某个请求进入前进行过滤，依赖于Servlet容器，属于Servlet规范的一部分。

## 1、实现原理不一样

1、Filter是依赖于Servlet容器，属于Servlet规范的一部分，而拦截器Interceptor则是独立存在的，比如Spring MVC的HandlerMethod、可以在任何情况下使用。

2、Filter的执行由Servlet**函数回调**完成，而拦截器Interceptor通常通过**动态代理**的方式来执行。

3、Filter的生命周期由Servlet容器管理，而拦截器Interceptor则可以通过IoC容器来管理，因此可以通过注入等方式来获取其他Bean的实例，因此使用会更方便。

4、在action的生命周期中，拦截器可以多次被调用，而过滤器只能在容器初始化时被调用一次

5、拦截器可以访问action上下文、值栈里的对象，而过滤器不能访问。





## 2、触发的时间点不同

借用一张图：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210517160625816.png)

过滤器Filter是在请求进入容器后，但**在进入servlet之前进行预处理**，请求结束是在servlet处理完以后。

拦截器 Interceptor 是在请求进入servlet后，在进入Controller（也可以说是Action，方法触发前）之前进行预处理的，Controller 中渲染了对应的视图之后请求结束。

所以，Filter是Servlet规范规定的，只能用于Web程序中，而拦截器既可以用于Web程序，也可以用于Application、Swing程序中。



## 3、加载顺序不一样

拦截器加载的时间点在SpringContext之前，所以在自定义一个拦截器的时候，不要使用`@Autowired`注入一个bean，此时bean还没有实例化，是拿不到的

过滤器更不可能拿到，过滤器加载比拦截器还要早。

**但是如果多个过滤器和多个拦截器一起混合使用呢？它们的加载顺序是怎么样的？**

如果过滤器和拦截器有且仅各一个的情况下，运行的流程如下：

![](https://img-blog.csdnimg.cn/2018112819593016.png)

多个拦截器和过滤器的运行流程如下（以两个为例）：

![多拦截器、过滤器运行流程](https://img-blog.csdnimg.cn/20181128200003636.png)

## 4、使用不一样

一般来说使用**拦截器**进行**微观**处理，比如说拦截是否有权限操作、记录操作的日志等等，常见的方法是preHandle、postHandle

```java
@Component
public class MyInterceptor implements HandlerInterceptor{
    static public final Logger logger = LoggerFactory.getLogger(sanZangInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o) throws Exception {
		//TODO
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {
       //TODO	
    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {
      //TODO
    }
}
```

一般来说**过滤器**是**宏观**上面的过滤，比如说过滤URI、用户是否登录等等，常见的方法是init、doFilter、destroy：

```java
public class MyFilter implements Filter {
    @Autowired
    private PointService pointService;
 
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        //TODO
    }
 
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
       //TODO
    }
 
    @Override
    public void destroy() {
        //TODO
    }
}
```

> 注意，以上只是简单的使用，除此之外要使用它们还需要配置过滤、拦截的路径

---

参考：

- https://blog.csdn.net/jacksonary/article/details/84572701
- https://www.zhihu.com/question/30212464/answer/1786967139
- https://www.cnblogs.com/paddix/p/8365558.html