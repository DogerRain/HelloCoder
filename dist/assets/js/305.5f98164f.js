(window.webpackJsonp=window.webpackJsonp||[]).push([[305],{703:function(a,v,t){"use strict";t.r(v);var _=t(7),s=Object(_.a)({},(function(){var a=this,v=a._self._c;return v("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[v("p",[a._v("线程的使用目的是提高运行速度，提高运行的速度是要充分使用CPU和I/O 的利用率。")]),a._v(" "),v("p",[a._v("这就涉及到CPU密集型程序和I/O密集型程序的区别了。")]),a._v(" "),v("h2",{attrs:{id:"cpu-密集型"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#cpu-密集型"}},[a._v("#")]),a._v(" CPU 密集型")]),a._v(" "),v("p",[a._v("CPU密集型也叫计算密集型，指的是系统的硬盘、内存性能相对CPU要好很多，此时，系统运作大部分的状况是CPU Loading 100%，CPU要读/写I/O(硬盘/内存)，I/O在很短的时间就可以完成，而CPU还有许多运算要处理，CPU Loading很高。")]),a._v(" "),v("p",[a._v("比如说要计算1+2+3+.....+ 1亿、计算圆周率后几十位、数据分析。\n都是属于CPU密集型程序。")]),a._v(" "),v("p",[a._v("此类程序运行的过程中，CPU占用率一般都很高。")]),a._v(" "),v("p",[a._v("假如在单核CPU情况下，线程池有6个线程，但是由于是单核CPU，所以同一时间只能运行一个线程，考虑到线程之间还有上下文切换的时间消耗，还不如单个线程执行高效。")]),a._v(" "),v("p",[a._v("所以！！！单核CPU处理CPU密集型程序，就不要使用多线程了。")]),a._v(" "),v("p",[a._v("假如是6个核心的CPU，理论上运行速度可以提升6倍。每个线程都有 CPU 来运行，并不会发生等待 CPU 时间片的情况，也没有线程切换的开销。")]),a._v(" "),v("p",[a._v("所以！！！多核CPU处理CPU密集型程序才合适，而且中间可能没有线程的上下文切换（一个核心处理一个线程）。")]),a._v(" "),v("p",[a._v("简单的说，就是需要CPU疯狂的计算。")]),a._v(" "),v("h2",{attrs:{id:"io密集型"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#io密集型"}},[a._v("#")]),a._v(" IO密集型")]),a._v(" "),v("p",[a._v("IO密集型指的是系统的CPU性能相对硬盘、内存要好很多，此时，系统运作，大部分的状况是CPU在等I/O (硬盘/内存) 的读/写操作，但CPU的使用率不高。")]),a._v(" "),v("p",[a._v("所以用脚本语言像python去做I/O密集型操作，效率就很快。")]),a._v(" "),v("p",[a._v("简单的说，就是需要大量的输入输出，不如读文件、写文件、传输文件、网络请求。")]),a._v(" "),v("h2",{attrs:{id:"区别和使用"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#区别和使用"}},[a._v("#")]),a._v(" 区别和使用：")]),a._v(" "),v("p",[a._v("IO密集型：大量网络，文件操作\nCPU 密集型：大量计算，cpu 占用越接近 100%, 耗费多个核或多台机器")]),a._v(" "),v("p",[a._v("业务要具体分析，假如CPU现在是10%，数据量增大一点点，CPU狂飙，那也可能CPU密集型。")]),a._v(" "),v("h2",{attrs:{id:"如何确定线程池大小"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#如何确定线程池大小"}},[a._v("#")]),a._v(" 如何确定线程池大小？")]),a._v(" "),v("p",[a._v("目前确定线程池大小一共有两派，对应着两个不同的公式，但是对错都没有人证明，比较不可控的因素多，具体还是要看自己的业务。")]),a._v(" "),v("h3",{attrs:{id:"第一派-《java并发编程实践》"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#第一派-《java并发编程实践》"}},[a._v("#")]),a._v(" 第一派：《java并发编程实践》")]),a._v(" "),v("p",[a._v("线程数不是越多越好。")]),a._v(" "),v("p",[a._v("由于CPU的核心数有限，线程之间切换也需要开销，频繁的切换上下文会使性能降低，适得其反。")]),a._v(" "),v("p",[a._v("简单的总结就是：")]),a._v(" "),v("p",[v("strong",[v("em",[a._v("N")]),a._v("cpu")]),a._v(" 表示 核心数。")]),a._v(" "),v("p",[v("strong",[a._v("如果是CPU密集型任务，就需要尽量压榨CPU，参考值可以设为 "),v("em",[a._v("N")]),a._v("cpu+1")])]),a._v(" "),v("p",[v("strong",[a._v("如果是IO密集型任务，参考值可以设置为 2 * "),v("em",[a._v("N")]),a._v("cpu")])]),a._v(" "),v("p",[a._v("上面两个公式为什么是Ncpu+1 呢，而不是Ncpu+2 呢，为什么不是3 * "),v("strong",[v("em",[a._v("N")]),a._v("cpu")]),a._v("  呢？")]),a._v(" "),v("h4",{attrs:{id:"解释"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#解释"}},[a._v("#")]),a._v(" 解释：")]),a._v(" "),v("p",[a._v("在《Java并发编程实践》中，是这样来计算线程池的线程数目的：")]),a._v(" "),v("p",[v("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/584866-20170526162253247-2075463115.png",alt:""}})]),a._v(" "),v("p",[v("strong",[a._v("简单解释：")])]),a._v(" "),v("p",[a._v("一个基准负载下，使用 几种不同大小的线程池运行你的应用程序，并观察CPU利用率的水平。\n给定下列定义：")]),a._v(" "),v("blockquote",[v("p",[a._v("Ncpu = CPU的数量\nUcpu = 目标CPU的使用率， 0 <= Ucpu <= 1\nW/C  = 等待时间与计算时间的比率")])]),a._v(" "),v("p",[a._v("为保持处理器达到期望的使用率，最优的池的大小等于：")]),a._v(" "),v("div",{staticClass:"language- extra-class"},[v("pre",{pre:!0,attrs:{class:"language-text"}},[v("code",[a._v(" Nthreads = Ncpu x Ucpu x (1 + W/C)\n")])])]),v("p",[a._v("CPU数量是确定的，CPU使用率是目标值也是确定的，W/C也是可以通过基准程序测试得出的。")]),a._v(" "),v("h4",{attrs:{id:"疑问一-对于计算密集型应用-假定等待时间趋近于0-cpu利用率达到100-那么线程数就是cpu核心数-那这个-1意义何在呢"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#疑问一-对于计算密集型应用-假定等待时间趋近于0-cpu利用率达到100-那么线程数就是cpu核心数-那这个-1意义何在呢"}},[a._v("#")]),a._v(" 疑问一：对于计算密集型应用，假定等待时间趋近于0，CPU利用率达到100%，那么线程数就是CPU核心数，那这个+1意义何在呢？")]),a._v(" "),v("p",[a._v("根据  Nthreads = Ncpu x Ucpu x (1 + W/C)，等待时间趋近于0 ，即 W/C  = 0，结果就是 Ucpu ，那为什么要+1 呢？")]),a._v(" "),v("p",[a._v("《Java并发编程实践》这么说：")]),a._v(" "),v("blockquote",[v("p",[a._v("计算密集型的线程恰好在某时因为发生一个页错误或者因其他原因而暂停，刚好有一个“额外”的线程，可以确保在这种情况下CPU周期不会中断工作。")])]),a._v(" "),v("p",[a._v("所以 "),v("strong",[v("em",[a._v("N")]),a._v("cpu+1")]),a._v(" 是一个经验值。")]),a._v(" "),v("p",[a._v("对于IO密集型应用，假定所有的操作时间几乎都是IO操作耗时，那么 W/C的值就为1，Ucpu 要达到100%利用率。")]),a._v(" "),v("p",[a._v("根据  "),v("code",[a._v("Nthreads = Ncpu x Ucpu x (1 + W/C)")]),a._v("，那么对应的线程数确实为 "),v("strong",[v("em",[a._v("2N")]),a._v("cpu")]),a._v(" 。")]),a._v(" "),v("p",[a._v("对于包含I/O操作或者其他阻塞的任务，由于线程不会一直执行，因此线程池的数量应该更多。")]),a._v(" "),v("p",[a._v("在《linux多线程服务器端编程》中有一个思路，CPU计算和IO的"),v("strong",[a._v("阻抗匹配原则")]),a._v("。")]),a._v(" "),v("p",[a._v("如果线程池中的线程在执行任务时，密集计算所占的时间比重为P(0<P<=1)，而系统一共有C个CPU，为了让CPU跑满而又不过载，线程池的大小经验公式 T = C / P。在此，T只是一个参考，考虑到P的估计并不是很准确，T的最佳估值可以上下浮动50%。")]),a._v(" "),v("p",[a._v("这个经验公式的原理很简单，T个线程，每个线程占用P的CPU时间，如果刚好占满C个CPU,那么必有 T * P = C。")]),a._v(" "),v("h4",{attrs:{id:"疑问二-如何在代码中确定cpu数量"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#疑问二-如何在代码中确定cpu数量"}},[a._v("#")]),a._v(" 疑问二：如何在代码中确定CPU数量？")]),a._v(" "),v("p",[a._v("Java代码中可以通过Rumtime来获得CUP的数目：")]),a._v(" "),v("div",{staticClass:"language-java extra-class"},[v("pre",{pre:!0,attrs:{class:"language-java"}},[v("code",[v("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("int")]),a._v(" N_CPUS "),v("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" "),v("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("Runtime")]),v("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),v("span",{pre:!0,attrs:{class:"token function"}},[a._v("getRuntime")]),v("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),v("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),v("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),v("span",{pre:!0,attrs:{class:"token function"}},[a._v("availableProcessor")]),v("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),v("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),v("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n")])])]),v("h3",{attrs:{id:"第二派-《java-虚拟机并发编程》"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#第二派-《java-虚拟机并发编程》"}},[a._v("#")]),a._v(" 第二派:《Java 虚拟机并发编程》")]),a._v(" "),v("p",[v("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/584866-20170526162253247-2075463115.png",alt:""}})]),a._v(" "),v("p",[a._v("重点概括就是：")]),a._v(" "),v("blockquote",[v("p",[a._v("线程数 = CPU可用核心数/(1 - 阻塞系数），其中阻塞系数的取值在0和1之间。\n计算密集型任务的阻塞系数为0，而IO密集型任务的阻塞系数则接近1。一个完全阻塞的任务是注定要挂掉的，所以我们无须担心阻塞系数会达到1。")])]),a._v(" "),v("p",[a._v("这里说到的 "),v("code",[a._v("IO密集型任务的阻塞系数则接近1")]),a._v("， 也验证了上面第一派中 "),v("code",[a._v("Nthreads = Ncpu x Ucpu x (1 + W/C)")]),a._v("，那么对应的线程数确实为 "),v("strong",[v("em",[a._v("2N")]),a._v("cpu")]),a._v(" 。")]),a._v(" "),v("p",[a._v("对于派系一，假设cpu100%运转，即撇开CPU使用率这个因素，线程数=Ncpu*(1+w/c)。")]),a._v(" "),v("p",[a._v("现在假设将派系二的公式等于派系一公式，即令")]),a._v(" "),v("div",{staticClass:"language- extra-class"},[v("pre",{pre:!0,attrs:{class:"language-text"}},[v("code",[a._v("Ncpu /（1-阻塞系数）= Ncpu*(1+w/c)\n")])])]),v("p",[a._v("化简得出： "),v("strong",[a._v("阻塞系数=w/(w+c)")])]),a._v(" "),v("p",[a._v("即 阻塞系数=阻塞时间/（阻塞时间+计算时间），这个结论在派系二后续中得到应征，如下图：")]),a._v(" "),v("p",[v("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/584866-20170526171225919-888895376.png",alt:""}})]),a._v(" "),v("p",[v("strong",[a._v("由此可见，派系一和派系二其实是一个公式。")])]),a._v(" "),v("h4",{attrs:{id:"解释-2"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#解释-2"}},[a._v("#")]),a._v(" 解释：")]),a._v(" "),v("p",[a._v("这一派的公式就为：")]),a._v(" "),v("div",{staticClass:"language- extra-class"},[v("pre",{pre:!0,attrs:{class:"language-text"}},[v("code",[a._v("最佳线程数目 = CPU数目/(1-阻塞系数)\n")])])]),v("p",[a._v("其中 ，")]),a._v(" "),v("div",{staticClass:"language- extra-class"},[v("pre",{pre:!0,attrs:{class:"language-text"}},[v("code",[a._v("阻塞系数 = w/(w+c)\n即：\n阻塞系数 = 阻塞时间/（阻塞时间+计算时间）\n")])])]),v("blockquote",[v("p",[a._v("其中 w/(w+c) 可以根据算出来的，w是线程等待时间，即IO时间，c 是线程CPU时间。")])]),a._v(" "),v("p",[a._v("这样就可以计算CPU和IO混合操作的任务线程数量了，见下面这个疑问。")]),a._v(" "),v("h4",{attrs:{id:"疑问三-如果一个web程序有cpu操作-也有io操作-那该如何设置呢"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#疑问三-如果一个web程序有cpu操作-也有io操作-那该如何设置呢"}},[a._v("#")]),a._v(" 疑问三：如果一个web程序有CPU操作，也有IO操作，那该如何设置呢？")]),a._v(" "),v("p",[a._v("如果可以拆分任务，那么就是给CPU的计算型任务分配 N+1 个线程，给IO密集型的任务分配 2N 个线程。")]),a._v(" "),v("p",[a._v("如果不能拆分，就需要估算了：")]),a._v(" "),v("p",[a._v("根据上面的公式：")]),a._v(" "),v("div",{staticClass:"language- extra-class"},[v("pre",{pre:!0,attrs:{class:"language-text"}},[v("code",[a._v("最佳线程数目 = CPU数目/(1-阻塞系数) = CPU数目/(1- w/(w+c))\n")])])]),v("blockquote",[v("p",[a._v("把w、c 换成 线程等待时间、线程CPU时间")])]),a._v(" "),v("p",[a._v("化简后为：")]),a._v(" "),v("div",{staticClass:"language- extra-class"},[v("pre",{pre:!0,attrs:{class:"language-text"}},[v("code",[a._v("最佳线程数目 = （（线程等待时间 + 线程CPU时间）/线程CPU时间 ）* CPU数目\n")])])]),v("p",[a._v("这个公式进一步转化为：")]),a._v(" "),v("div",{staticClass:"language- extra-class"},[v("pre",{pre:!0,attrs:{class:"language-text"}},[v("code",[a._v("最佳线程数目 = （线程等待时间与线程CPU时间之比 + 1）* CPU数目\n")])])]),v("p",[a._v("以上可以得出一个结论：")]),a._v(" "),v("p",[v("strong",[a._v("线程等待时间所占比例越高，需要越多线程。线程CPU时间所占比例越高，需要越少线程。")])]),a._v(" "),v("h4",{attrs:{id:"疑问四-是否使用线程池就一定比使用单线程高效呢"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#疑问四-是否使用线程池就一定比使用单线程高效呢"}},[a._v("#")]),a._v(" 疑问四：是否使用线程池就一定比使用单线程高效呢？")]),a._v(" "),v("p",[a._v("答案是否定的，比如Redis就是单线程的，但它却非常高效，基本操作都能达到十万量级/s。从线程这个角度来看，部分原因在于：")]),a._v(" "),v("ul",[v("li",[v("p",[a._v("多线程带来线程上下文切换开销，单线程就没有这种开销")])]),a._v(" "),v("li",[v("p",[a._v("锁")])])]),a._v(" "),v("hr"),a._v(" "),v("h2",{attrs:{id:"下面据说是个腾讯的面试题"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#下面据说是个腾讯的面试题"}},[a._v("#")]),a._v(" 下面据说是个腾讯的面试题：")]),a._v(" "),v("h3",{attrs:{id:"问题一"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#问题一"}},[a._v("#")]),a._v(" 问题一：")]),a._v(" "),v("p",[a._v("假如一个程序平均每个线程CPU运行时间为0.5s，而线程等待时间（非CPU运行时间，比如IO）为1.5s，CPU核心数为8，那么最佳的线程数应该是？")]),a._v(" "),v("blockquote",[v("p",[a._v("根据上面这个公式估算得到最佳的线程数：((0.5+1.5)/0.5)*8=32。")])]),a._v(" "),v("h3",{attrs:{id:"问题二"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#问题二"}},[a._v("#")]),a._v(" 问题二：")]),a._v(" "),v("p",[a._v("假如在一个请求中，计算操作需要5ms，DB操作需要100ms，对于一台8个CPU的服务器，总共耗时100+5=105ms，而其中只有5ms是用于计算操作的，CPU利用率为5/(100+5)。使用线程池是为了尽量提高CPU的利用率，减少对CPU资源的浪费，假设以100%的CPU利用率来说，要达到100%的CPU利用率，又应该设置多少个线程呢？")]),a._v(" "),v("blockquote",[v("p",[a._v("((5+100)/5)*8=168  个线程。")])]),a._v(" "),v("h3",{attrs:{id:"问题三"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#问题三"}},[a._v("#")]),a._v(" 问题三：")]),a._v(" "),v("p",[a._v("那如果现在这个IO操作是DB操作，而DB的QPS上限是1000，这个线程池又该设置为多大呢？")]),a._v(" "),v("blockquote",[v("p",[a._v("这个可以安装比例进行，根据上面算出168最大的线程数，可以反推出DB的最大QPS：")]),a._v(" "),v("p",[a._v("168*(1000/(100+5))=1600")]),a._v(" "),v("p",[a._v("如果现在DB的QPS最大为1000，那么对应的，最大只能设置168*(1000/1600)=105个线程")])]),a._v(" "),v("hr"),a._v(" "),v("h2",{attrs:{id:"总结"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#总结"}},[a._v("#")]),a._v(" 总结")]),a._v(" "),v("p",[a._v("即使有上面的简单估算方法，也许看似合理，但实际上也未必合理，都需要结合系统真实情况（比如是IO密集型或者是CPU密集型或者是纯内存操作）和硬件环境（CPU、内存、硬盘读写速度、网络状况等）来不断尝试达到一个符合实际的合理估算值。")]),a._v(" "),v("p",[a._v("如果任务可以分离：")]),a._v(" "),v("p",[v("strong",[a._v("如果是CPU密集型任务，参考值可以设为 "),v("em",[a._v("N")]),a._v("cpu+1")])]),a._v(" "),v("p",[v("strong",[a._v("如果是IO密集型任务，参考值可以设置为 2 * "),v("em",[a._v("N")]),a._v("cpu")])]),a._v(" "),v("p",[a._v("如果任务不可以分离：")]),a._v(" "),v("p",[a._v("​\t"),v("em",[v("em",[a._v("参考线程数目 = （（线程等待时间+线程CPU时间）/线程CPU时间 ）")]),a._v(" CPU数目")]),a._v("*")]),a._v(" "),v("p",[a._v("另外：")]),a._v(" "),v("p",[a._v("在调试线程数数量的时候，可以使用"),v("code",[a._v("jstack")]),a._v(" 进行测试，如果发现线程都处于waiting（等待状态获取任务），那么说明线程数是够用的；如果都是running，则可以继续调高线程数量。")]),a._v(" "),v("hr"),a._v(" "),v("p",[a._v("参考：")]),a._v(" "),v("ol",[v("li",[a._v("什么是CPU密集型、IO密集型？：https://blog.csdn.net/youanyyou/article/details/78990156")]),a._v(" "),v("li",[a._v("《java虚拟机并发编程》")]),a._v(" "),v("li",[a._v("腾讯面试官：线程池要设置多大：http://www.zyiz.net/tech/detail-121726.html")]),a._v(" "),v("li",[a._v("如何合理地估算线程池大小？：http://ifeve.com/how-to-calculate-threadpool-size/")])])])}),[],!1,null,null,null);v.default=s.exports}}]);