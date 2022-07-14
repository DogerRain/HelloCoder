(window.webpackJsonp=window.webpackJsonp||[]).push([[290],{688:function(a,v,t){"use strict";t.r(v);var _=t(7),s=Object(_.a)({},(function(){var a=this,v=a._self._c;return v("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[v("blockquote",[v("p",[a._v("多线程可以实现并行处理，避免了某项任务长时间占用CPU时间。\n在单CPU计算机中，为了运行所有这些线程，操作系统需要为每个独立线程安排一些CPU时间，操作系统以轮换方式向线程提供时间片，在宏观上似乎这些线程都在同时运行。\n简单的说，就是更好的利用CPU的资源。")])]),a._v(" "),v("h2",{attrs:{id:"_1-程序"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_1-程序"}},[a._v("#")]),a._v(" 1. 程序")]),a._v(" "),v("p",[a._v("计算机程序，是指为了得到某种结果而可以由计算机等具有信息处理能力的装置执行的代码化指令序列，或者可以被自动转换成代码化指令序列的符号化指令序列或者符号化语句序列。")]),a._v(" "),v("h2",{attrs:{id:"_2-进程"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_2-进程"}},[a._v("#")]),a._v(" 2. 进程")]),a._v(" "),v("p",[a._v("为了使程序并发执行，并且可以对并发执行的程序加以描述和控制，人们引入了进程，使参与并发执行的每个程序都能独立地运行，在操作系统中必须为之配置一个专门的数据结构，称作进程控制块（PCB）。")]),a._v(" "),v("p",[a._v("系统利用PCB来描述进程的基本情况和活动过程，进而控制和管理进程。这样，有程序段、相关数据段和PCB三部分就构成了进程实体（又叫进程映像）。我们一般情况下把进程实体就简称为进程。可以定义为：进程是进程实体的运行过程，是系统进行资源分配和调度的一个独立单位。")]),a._v(" "),v("h2",{attrs:{id:"_3-线程"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_3-线程"}},[a._v("#")]),a._v(" 3. 线程")]),a._v(" "),v("p",[a._v("线程是进程的基础，线程的引入是为了减少程序在并发执行时所付出的时空开销，使OS具有更好的并发性。进一步改善系统的服务质量。线程是比进程的更小基本单位。")]),a._v(" "),v("p",[a._v("简单地说，把正在计算机中执行的程序叫做“进程（Process）”。而“线程（Thread）”是进程中某个单一顺序的控制流，它记录了程序指令的踪迹。线程是进程内部的一个执行单元。")]),a._v(" "),v("p",[a._v("例如QQ是一个程序，更新是一个进程，下载包数据 是其中一个线程，清理旧版本数据也是其中一个线程。")]),a._v(" "),v("h2",{attrs:{id:"java线程的好处"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#java线程的好处"}},[a._v("#")]),a._v(" Java线程的好处")]),a._v(" "),v("p",[a._v("（1）进程间不能共享内存，但线程之间可以共享内存非常容易。")]),a._v(" "),v("p",[a._v("（2）系统创建进程需要为该进程重新分配系统资源，但创建线程则代价小的多，因此使用多线程来实现多任务并发比多进程的效率高。")]),a._v(" "),v("p",[a._v("（3）Java语言内置多线程功能支持，而不是单纯地作为底层操作系统的调度方式，从而简化了Java的多线程编程。")]),a._v(" "),v("p",[a._v("Java中，线程是一个轻量级的子进程，是最小的处理单元，一个系统下可以有多个进程，一个进程中又有多个线程：")]),a._v(" "),v("p",[v("img",{attrs:{src:"https://images-1253198264.cos.ap-guangzhou.myqcloud.com/image-20200624002751824.png",alt:"OS、进程、线程"}})]),a._v(" "),v("hr"),a._v(" "),v("p",[v("strong",[a._v("JUC")]),a._v(" ，即 java.util.concurrent包名的简写，Java 5.0 引入的，是关于并发编程的API。")]),a._v(" "),v("p",[a._v("这里面包含了Java线程的关键知识点。")]),a._v(" "),v("p",[a._v("本教程也是围绕以下进行讲述。")]),a._v(" "),v("p",[v("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210226140911934.png",alt:""}})]),a._v(" "),v("p",[a._v("在锁的章节（volatile、synchronized、ReentrantLock），你需要了解底层的原理，为什么会出现锁？这和Java内存模型有不可或缺的联系。")]),a._v(" "),v("p",[a._v("在线程的普通常见模式中，假如线程过多，如何进行管理，Java线程池如何选择大小。")]),a._v(" "),v("p",[a._v("还有很多因为线程引出的通信方式，比如说线程的休眠、阻塞、唤醒、同步。")]),a._v(" "),v("p",[a._v("....等等。")]),a._v(" "),v("p",[a._v("在这里，期待和各位进步。")])])}),[],!1,null,null,null);v.default=s.exports}}]);