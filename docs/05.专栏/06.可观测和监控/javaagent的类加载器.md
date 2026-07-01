--javaagent 做字节码织入 ，和主程序 都是同一个类加载器吗？为什么javaagent可以访问到 主程序的代码内容？



你有没有想过这个问题？



## 1. 执行顺序：谁先加载？

要理解它们为什么“同根同源”，得先看 JVM 启动时加载顺序。

1. JVM 启动，初始化 `Bootstrap ClassLoader` 和 `AppClassLoader`。
2. 解析 `-javaagent` 参数，**在加载主程序入口类之前**，先用 `AppClassLoader` 加载 `agent.jar`，并执行其 `premain` 方法。
3. `premain` 执行完毕，再加载主程序的 `Main.class`，同样由 `AppClassLoader` 加载。

**所以，Agent 类和主程序类，都是由 `AppClassLoader` 加载的。它们在 JVM 的同一个类加载器命名空间里，自然可以互相访问。**

## 2. 为什么它们可以互相访问？

基于上面的加载时序，结论就很直接了：

- **Agent 的 `premain` 能访问主程序的类吗？**
  **不能。** 因为 `premain` 执行时，主程序的类还没有加载。`Class.forName("com.example.Main")` 会直接抛 `ClassNotFoundException`。
- **Agent 的 Transformer 能访问主程序的类吗？**
  **能。** 当 `ClassFileTransformer.transform()` 被 JVM 回调时，主程序的类正在被 `AppClassLoader` 加载，Agent 的代码通过方法参数或反射，可以拿到这个类并访问其内容。

## 3. 那为什么要做类加载器隔离？

虽然默认它们能互相访问，但如果你的 Agent 依赖了 Guava 20，而主程序依赖的是 Guava 19，直接放在同一个 `AppClassLoader` 里，它们就会因为**版本冲突**而报 `NoSuchMethodError`。



为了解决这个问题，才会用自定义类加载器（`parent = null`）或 Maven Shade 插件来做**类加载器隔离**。在这些方案下，它们确实会“分属不同的加载器”，但这时就**无法直接访问主程序代码**了，需要借助反射、SPI 或定义接口来通信。



> 当你使用 `parent = null` 时，这个类加载器**不再委托给 `AppClassLoader`**，它的搜索范围被限制在你自己指定的路径。
>
> 字节码织入（Bytecode Weaving）这件事，发生在**类加载阶段**，和**类加载器是谁**没有直接关系。你用 `parent = null` 的自定义类加载器加载 Agent，然后通过 ByteBuddy 去拦截主程序的类，**依然能织入成功。**





**所以，JavaAgent 能访问主程序的代码，是因为它们默认共享同一个 AppClassLoader。如果你想“既能隔离又不丢访问能力”，一般会用“自定义 ClassLoader + 委派模型”的组合方案来实现。**





## 4. 自定义类加载器是否可以获取主程序类？

**反射不需要通过类加载器去查找类名，它只需要一个已经存在的对象。**

- ❌ 直接调用：`Class.forName("com.app.user.UserService")` → **找不到**
- ✅ 间接持有：`UserService obj = (UserService) 外部传入的对象`，然后调用 `obj.getClass()` → **能找到**

`getClass()` 返回的是对象本身的运行时类信息，绕过了“按名字查找类”的过程，所以不依赖当前类加载器能不能看到那个类。



实际工程中不会直接去“找类”，而是通过以下方式“拿到实例”：

| 方式                                        | 说明                                                         |
| :------------------------------------------ | :----------------------------------------------------------- |
| **静态字段传参**                            | 主程序启动时，把自己某个静态字段指向当前对象，Agent 通过反射读取 |
| **`Instrumentation.getAllLoadedClasses()`** | 遍历 JVM 里所有已加载的类，按类名过滤，绕开 ClassLoader 的限制 |
| **Transformer 回调**                        | JVM 在加载类时会主动把 `ClassLoader` 和类名传给 `transform()` 方法，你可以在那里处理 |
| **SPI / 接口桥接**                          | 定义一个由 `AppClassLoader` 加载的接口，主程序传入实例，Agent 通过接口调用 |

其中，`Instrumentation.getAllLoadedClasses()` 是绕过类加载器最常用的方式。



```java
public static void agentmain(String args, Instrumentation inst) {
    for (Class<?> clazz : inst.getAllLoadedClasses()) {
        if (clazz.getName().equals("com.app.user.UserService")) {
            // ✅ 拿到了！即使自定义加载器看不到，它依然在 JVM 里
            Method method = clazz.getMethod("sayHello");
            method.invoke(null); // 如果是静态方法
        }
    }
}
```



## 5、自定义类加载器，为什么ByteBuddy可以在织入的时候，还可以获取到主程序类？

ByteBuddy 的 `AgentBuilder` 通过 `Instrumentation` API 注册 `ClassFileTransformer`，这个 Transformer 是 JVM 级别的回调，**不依赖于 Agent 的类加载器**。

织入：

```java
// 自定义加载器加载 Agent，但 Transformer 注册到 JVM
new AgentBuilder.Default()
    .type(ElementMatchers.named("com.app.user.UserService"))
    .transform((builder, type, classLoader, module) ->
        builder.method(named("sayHello"))
               .intercept(Advice.to(MyAdvice.class))
    )
    .installOn(inst);
```

目标执行：

```java
// MyAdvice 由自定义加载器加载（parent = null）
// 它依赖 Guava 20
public class MyAdvice {
    @Advice.OnMethodEnter
    public static void enter() {
        // 这里用了 Guava 的 Lists
        List<String> list = Lists.newArrayList("a", "b");
    }
}
```

关键在于 `installOn(inst)` 这一步。它把 Transformer 注册到了 `Instrumentation` 实例中。当 JVM 加载 `com.app.user.UserService` 时，会回调所有已注册的 Transformer，**不管这个 Agent 是用什么加载器加载的，Transformer 都会被执行。**

**所以，织入的逻辑不受类加载器隔离的影响。**



## 6、那被织入增强的类是在哪里执行的

**织入后的类，是在主程序的 JVM 中执行的。**

整个过程是这样的：

1. **Agent 启动时**：你用自定义类加载器加载了 ByteBuddy 和 `MyAdvice` 类。
2. **织入时**：ByteBuddy 修改了 `UserService` 的字节码，把 `MyAdvice.enter()` 的调用**硬编码**进了 `UserService.sayHello()` 方法里。
3. **运行时**：当主程序调用 `UserService.sayHello()` 时，JVM 执行的是**已经被修改过的字节码**，会直接调用 `MyAdvice.enter()`。



此时，执行栈已经回到了主程序的 AppClassLoader。 



**风险：**

如果主程序里没有 `Lists`，那么执行到 `MyAdvice.enter()` 时就会报 `NoClassDefFoundError`。

但如果主程序里有 `Lists`，而且版本不同（比如主程序是 Guava 19，Agent 自定义加载器是 Guava 20），会怎样？

主程序的 AppClassLoader 加载了 Guava 19 的 `Lists`，执行 `MyAdvice.enter()` 时，`Lists` 实际上是 Guava 19 的版本。这样能运行，但存在一个潜在风险：如果 Agent 的 `MyAdvice` 在编译时用了 Guava 20 特有的 API（比如 Guava 20 新增的方法），而主程序的 AppClassLoader 加载的是 Guava 19 的 `Lists`，运行时就会因为找不到该方法而抛出 `NoSuchMethodError`。这就是典型的“类路径版本冲突”问题。



## 7、shade之后，Guava类是谁的？

假如我的javaagent使用了shade，变成了 `com.myagent.google.common.collect.Lists`



**经过 Shade 重命名后，在 `MyAdvice.enter()` 里使用的 Guava，已经是 Agent 自己的、被改过包名的版本，跟主程序无关了。**

**而且，即便包名被改了，JVM 依然能找到这个类并正常执行。**



我们分两个阶段来看：

- **编译阶段**：`MyAdvice.enter()` 里引用的 `com.myagent.google.common.collect.Lists`，来自 Agent 自己的依赖（Guava 20，包名被 Shade 插件重命名）。此时，它和主程序的 `com.google.common.collect.Lists` 已经是完全不同的两个类名了。
- **运行时执行**：当主程序执行到 `MyAdvice.enter()` 时，JVM 需要加载 `com.myagent.google.common.collect.Lists`。主程序的 `AppClassLoader` 会在它的 `classpath` 里查找，但显然找不到这个类。



如果 `AppClassLoader` 找不到 `com.myagent.google.common.collect.Lists`，JVM 会**沿着类加载器的链路继续往上找**（双亲委派）。**此时就要看 `MyAdvice` 这个类本身是由哪个类加载器加载的。**



常情况下：

- `MyAdvice` 由 Agent 的自定义类加载器（`parent = null`）加载。
- 当 JVM 需要解析 `MyAdvice` 引用的 `com.myagent.google.common.collect.Lists` 时，**会尝试用加载 `MyAdvice` 的那个加载器来加载这个类**。

因此，这个类会由 Agent 的自定义加载器去加载，**而不需要经过主程序的 `AppClassLoader`**。所以它找得到，不会抛 `ClassNotFoundException`。

> **这里有一个容易被忽略的细节：如果 Agent 的 Advice 类是通过 `AgentBuilder` 的 `installOn(inst)` 注册的，在织入时，ByteBuddy 通常会保留 Advice 类本身的类加载器上下文。因此，在运行时，JVM 会优先使用那个加载器去解析 Advice 里用到的所有依赖。** 这也是为什么 Shade 方案能生效的原因。





## 8、主程序如何访问javaagent的类呢？

**主程序默认访问不到，因为类加载器是隔离的。** 但可以通过一种特殊的手段让它们“见面”，这种手段就是 **`BootStrap ClassLoader` 注入**

```java
当 ByteBuddy 把 MyAdvice.enter() 的调用织入主程序的 UserService.sayHello() 时，主程序的字节码里出现了对 com.myagent.advice.SessionContext 的引用。

java
// 主程序编译后的字节码（逻辑示意）
public String sayHello() {
    long start = System.currentTimeMillis();
    try {
        return "Hello";
    } finally {
        // 模拟javaagent自身的代码
        SessionContext ctx = new SessionContext();   // ⚠️ 需要加载这个类
        MyAgentMetrics.record(ctx, start);           // ⚠️ 需要加载这个类
    }
}
```

JVM 在执行这段织入后的代码时，会尝试解析 `SessionContext` 和 `MyAgentMetrics`，而它使用的类加载器是**主程序当前线程的类加载器（`AppClassLoader`）**。`AppClassLoader` 在自己的搜索路径（主程序的 classpath）里找不到这些类，所以会抛出 `NoClassDefFoundError`。

**这就是问题所在：Agent 的类确实存在于自定义加载器的空间中，但主程序的 `AppClassLoader` 看不到它。**



### 解决方案：把 Agent 的核心类注入到 `BootstrapClassLoader` 的搜索路径中



Java 的 `Instrumentation` 提供了一种绕过普通双亲委派机制的方法：`appendToBootstrapClassLoaderSearch(JarFile)`。这个方法可以把一个 Jar 文件添加到 `BootstrapClassLoader` 的搜索路径里，让所有类加载器都能访问其中的类。



```java
public static void premain(String agentArgs, Instrumentation inst) throws Exception {
    // 1. 找到 Agent 的核心 Jar 包
    File agentCoreJar = new File("agent-core.jar"); 
    
    // 2. 注入到 BootstrapClassLoader 的搜索路径中
    inst.appendToBootstrapClassLoaderSearch(new JarFile(agentCoreJar));
    
    // 3. 正常启动 Agent，注册 Transformer
    new AgentBuilder.Default()
        .type(ElementMatchers.nameContains("UserService"))
        .transform((builder, type, classLoader, module) ->
            builder.visit(Advice.to(MyAdvice.class).on(named("sayHello")))
        )
        .installOn(inst);
}
```





**这样做之后会发生两件事：**

- `SessionContext` 和 `MyAgentMetrics` 所在的 `agent-core.jar` 会被添加到 `BootstrapClassLoader` 的路径里。
- 当主程序的 `AppClassLoader` 执行织入后的字节码时，发现需要加载 `SessionContext`，它会先委托给父加载器，一路向上直到 `BootstrapClassLoader`。
- 由于 `SessionContext` 已经在 `BootstrapClassLoader` 的路径里，`BootstrapClassLoader` 会直接加载它，然后返回。
- 主程序成功拿到了这个类，一切正常。

这个机制把 Agent 的核心类提到了“更高优先级”的加载层级，从而实现了跨类加载器的可见性。



**JVM 里只有一个 BootstrapClassLoader，无论是谁调用**

- `BootstrapClassLoader` 是 JVM 内置的，由 C++ 代码实现，负责加载 JDK 核心类（`rt.jar`、`java.lang.*` 等）
- 它在整个 JVM 生命周期中**只有一份**
- 无论你是通过 `Instrumentation.appendToBootstrapClassLoaderSearch`、ByteBuddy 的 `Target.BOOTSTRAP`，还是 JVM 参数 `-Xbootclasspath/a:`，**操作的都是同一个 `BootstrapClassLoader`**



所以，不管是 JavaAgent 还是主程序，提到 BootstrapClassLoader 时指的都是同一个对象。无论你是自定义实现了多少个类加载器。

```
Bootstrap ClassLoader   ← 最顶层，唯一
    ↑
Extension ClassLoader
    ↑
AppClassLoader
    ├── WebAppClassLoader（Tomcat）
    └── InstrumentationClassLoader（Java Agent 自定义类加载器）
```

**关键点**：

- `AppClassLoader` 有多个实例（每个应用或者每个类加载器可以有一个）
- `BootstrapClassLoader` 只有一个，所有 `AppClassLoader` 的父加载器链条最终都指向它

当你用 `parent = null` 的自定义加载器时，它的父加载器是 `BootstrapClassLoader`，**但`BootstrapClassLoader` 本身还是唯一的那一个**。