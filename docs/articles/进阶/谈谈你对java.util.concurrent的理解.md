java.util.concurrent  也就是我们常说的JUC，主要包含三大块内容：

- **Atomic** 原子类，常见的如AtomicInteger
- **Locks** 锁，常见的如 ReentrantLock
- **Concurrent**  
  - 线程池相关，如 ThreadPoolExecutor、ExecutorService、Callable
  - collection相关 ，并发容器相关，高性能集合，如ConcurrentMap、CopyOnWriteArrayLis、BlockingDeque
  - 工具类相关 ，如信号量 Semaphore，CountDownLatch

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210625104229408.png)