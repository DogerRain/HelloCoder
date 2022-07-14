(window.webpackJsonp=window.webpackJsonp||[]).push([[95],{494:function(s,e,a){"use strict";a.r(e);var t=a(7),r=Object(t.a)({},(function(){var s=this,e=s._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[e("p",[s._v("Redis是基于内存操作，很快，既然Redis在内存工作，但是数据如何保存呢？")]),s._v(" "),e("p",[s._v("在Redis重启的时候，如何把数据恢复，保持一致性？这就涉及Redis的持久化机制了。")]),s._v(" "),e("h2",{attrs:{id:"_1、redis的持久化机制"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1、redis的持久化机制"}},[s._v("#")]),s._v(" 1、Redis的持久化机制")]),s._v(" "),e("p",[s._v("Redis的持久化机制有两种：")]),s._v(" "),e("ul",[e("li",[s._v("RDB")]),s._v(" "),e("li",[s._v("AOF")])]),s._v(" "),e("p",[s._v("可以单独使用其中一种或将二者结合使用。")]),s._v(" "),e("h2",{attrs:{id:"_2、rdb"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2、rdb"}},[s._v("#")]),s._v(" 2、RDB")]),s._v(" "),e("p",[s._v("RDB持久化是将当前进程中的数据生成"),e("strong",[s._v("快照")]),s._v("保存到硬盘(因此也称作快照持久化)，保存的文件后缀是"),e("code",[s._v(".rdb")])]),s._v(" "),e("p",[e("strong",[s._v("它是redis默认采用支持持久化的方式。")])]),s._v(" "),e("h4",{attrs:{id:"_2-1-自动触发"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2-1-自动触发"}},[s._v("#")]),s._v(" 2.1 自动触发")]),s._v(" "),e("p",[s._v("常见配置：")]),s._v(" "),e("div",{staticClass:"language-shell extra-class"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Redis默认设置， 表示  900秒内产生1条写入命令就触发一次快照，自动触发 bgsave")]),s._v("\nsave "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("900")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("\nsave "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("300")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("10")]),s._v("\nsave "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("60")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("10000")]),s._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 如果持久化出错，主进程是否停止写入")]),s._v("\nstop-writes-on-bgsave-error "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("yes")]),s._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 是否压缩，如果开启，则消耗更多的CPU，否则消耗更多硬盘")]),s._v("\nrdbcompression "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("yes")]),s._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 使用CRC64算法来进行数据校验，但是这样做会增加大约10%的性能消耗")]),s._v("\nrdbchecksum "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("yes")]),s._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 快照文件名称")]),s._v("\ndbfilename dump.rdb\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 快照文件保存路径")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("dir")]),s._v(" ./\n")])])]),e("p",[e("strong",[s._v("①、save m n："),e("strong",[s._v("表示m秒内数据集存在n次修改时，自动触发")]),s._v("bgsave")]),s._v("。")]),s._v(" "),e("p",[s._v("其他参数解释见上。")]),s._v(" "),e("h4",{attrs:{id:"_2-2-手动触发"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2-2-手动触发"}},[s._v("#")]),s._v(" 2.2 手动触发")]),s._v(" "),e("p",[s._v("手动触发有两种方法：")]),s._v(" "),e("ul",[e("li",[e("p",[e("strong",[s._v("1）save")])]),s._v(" "),e("p",[s._v("同步操作，会阻塞当前Redis服务器，执行save命令期间，Redis不能处理其他命令，直到RDB过程完成为止。")])]),s._v(" "),e("li",[e("p",[e("strong",[s._v("2）bgsave")]),s._v("\n异步操作，Redis fork 出一个新子进程，原来的 Redis 进程（父进程）继续处理客户端请求，而子进程则负责将数据保存到磁盘，然后退出。")])])]),s._v(" "),e("div",{staticClass:"language-shell extra-class"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[s._v("localhost:"),e("span",{pre:!0,attrs:{class:"token operator"}},[e("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("0")]),s._v(">")]),s._v("save\n"),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"OK"')]),s._v("\n\nlocalhost:"),e("span",{pre:!0,attrs:{class:"token operator"}},[e("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("0")]),s._v(">")]),s._v("bgsave\n"),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"Background saving started"')]),s._v("\n\nlocalhost:"),e("span",{pre:!0,attrs:{class:"token operator"}},[e("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("0")]),s._v(">")]),s._v("lastsave\n"),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"1603777804"')]),s._v("\n")])])]),e("p",[s._v("很明显"),e("code",[s._v("bgsave")]),s._v(" 更适合执行RDB 操作，所以Redis的内部操作，包括自动触发，也是 "),e("code",[s._v("bgsave")]),s._v("。")]),s._v(" "),e("p",[s._v("RDB bgsave 具体过程如下：")]),s._v(" "),e("p",[s._v("​\t1、Redis服务器接收"),e("code",[s._v("bgsave")]),s._v("，主线程需要调用系统的 "),e("code",[s._v("fork()")]),s._v(" 函数，构建出一个子进程去操作；\n​\t2、子线程创建好RDB文件并退出时，向父进程发送一个通知，告知RDB文件创建完毕；\n​\t3、父进程接收子进程创建好的RDB文件，"),e("code",[s._v("bgsave")]),s._v("命令执行结束。")]),s._v(" "),e("h3",{attrs:{id:"rdb优缺点"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#rdb优缺点"}},[s._v("#")]),s._v(" RDB优缺点：")]),s._v(" "),e("p",[s._v("优点：")]),s._v(" "),e("ol",[e("li",[s._v("采用子线程创建RDB文件，不会对redis服务器性能造成大的影响；")]),s._v(" "),e("li",[s._v("快照生成的RDB文件是一种压缩的二进制文件，可以方便的在网络中传输和保存。通过RDB文件，可以方便的将redis数据恢复到某一历史时刻，可以提高数据安全性，避免宕机等意外对数据的影响。")])]),s._v(" "),e("p",[s._v("缺点：")]),s._v(" "),e("ol",[e("li",[s._v("在redis文件在时间点A生成，之后产生了新数据，还未到达另一次生成RDB文件的条件，redis服务器崩溃了，那么在时间点A之后的数据会丢失掉，数据一致性不是完美的好，如果可以接受这部分丢失的数据，可以用生成RDB的方式；")]),s._v(" "),e("li",[s._v("快照持久化方法通过调用"),e("code",[s._v("fork()")]),s._v("方法创建子线程。当redis内存的数据量比较大时，创建子线程和生成RDB文件会占用大量的系统资源和处理时间，对 redis处理正常的客户端请求造成较大影响。")])]),s._v(" "),e("h2",{attrs:{id:"_3、aof"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3、aof"}},[s._v("#")]),s._v(" 3、AOF")]),s._v(" "),e("p",[s._v("AOF是"),e("strong",[s._v("记录Redis的命令")]),s._v("，redis对将所有的"),e("strong",[s._v("写命令")]),s._v("保存到一个aof文件中，根据这些写命令，实现数据的持久化和数据恢复，它增量备份。")]),s._v(" "),e("p",[s._v("常见配置：")]),s._v(" "),e("div",{staticClass:"language-shell extra-class"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 是否开启aof，默认是不开启")]),s._v("\nappendonly no\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 文件名称")]),s._v("\nappendfilename "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"appendonly.aof"')]),s._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 同步方式，有三种，默认是 everysec")]),s._v("\nappendfsync everysec\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# aof重写期间是否同步")]),s._v("\nno-appendfsync-on-rewrite no\n\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 重写触发配置")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# (当前AOF文件大小超过上一次重写的AOF文件大小的百分之多少才会重写)")]),s._v("\nauto-aof-rewrite-percentage "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("100")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# AOF文件重写需要的尺寸，AOF多大时开启重写")]),s._v("\nauto-aof-rewrite-min-size 64mb\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 文件重写策略")]),s._v("\naof-rewrite-incremental-fsync "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("yes")]),s._v("\n")])])]),e("p",[s._v("①"),e("code",[s._v("appendfsync everysec")]),s._v("的三种模式：")]),s._v(" "),e("ul",[e("li",[s._v("always：把"),e("strong",[s._v("每个写命令")]),s._v("都立即同步到aof文件，很慢，但是很安全")]),s._v(" "),e("li",[s._v("everysec：每 1 秒同步一次，Redis官方推荐。")]),s._v(" "),e("li",[s._v("no：redis不刷盘交给OS来处理，非常快，但是也最不安全")])]),s._v(" "),e("p",[s._v("②"),e("code",[s._v("aof-rewrite-incremental-fsync")]),s._v("：")]),s._v(" "),e("p",[s._v("每次批量写入磁盘的数据量由"),e("code",[s._v("aof-rewrite-incremental-fsync")]),s._v("参数控制，默认为32M，避免单次刷盘数据过多造成硬盘阻塞")]),s._v(" "),e("h4",{attrs:{id:"_3-1-aof的工作流程"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-aof的工作流程"}},[s._v("#")]),s._v(" 3.1 AOF的工作流程：")]),s._v(" "),e("p",[s._v("三个步骤：命令追加、文件写入、文件同步。")]),s._v(" "),e("ol",[e("li",[e("p",[s._v("所有的写入命令追加到"),e("code",[s._v("aof_buf")]),s._v("缓冲区中。")])]),s._v(" "),e("li",[e("p",[s._v("AOF会根据对应的策略向磁盘做同步操作。刷盘策略由"),e("code",[s._v("appendfsync")]),s._v("参数决定。")])]),s._v(" "),e("li",[e("p",[s._v("定期对AOF文件进行重写。重写策略由"),e("code",[s._v("auto-aof-rewrite-percentage")]),s._v("、"),e("code",[s._v("auto-aof-rewrite-min-size")]),s._v("两个参数决定。")])])]),s._v(" "),e("h4",{attrs:{id:"_3-2-为什么需要重写"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-为什么需要重写"}},[s._v("#")]),s._v(" 3.2 为什么需要重写？")]),s._v(" "),e("blockquote",[e("p",[s._v("redis不断的将写命令保存到AOF文件中，导致AOF文件越来越大，当AOF文件体积过大时，数据恢复的时间也是非常长的，所以就需要重写了。")])]),s._v(" "),e("p",[s._v("可以重写的情况：")]),s._v(" "),e("ol",[e("li",[s._v("进程内超时的数据不用再写入到AOF文件中。")]),s._v(" "),e("li",[s._v("存在删除命令。")]),s._v(" "),e("li",[s._v("多条写命令可以合并为一个。")])]),s._v(" "),e("p",[s._v("比如一个value 自增1w次，那AOF就需要记录1w次的操作，如果重写后，就可以直接记录该key的最终set值了。")]),s._v(" "),e("h4",{attrs:{id:"_3-3-aof重写过程"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-3-aof重写过程"}},[s._v("#")]),s._v(" 3.3 AOF重写过程")]),s._v(" "),e("p",[s._v("​\t重写分为：")]),s._v(" "),e("ul",[e("li",[e("p",[s._v("自动触发")]),s._v(" "),e("p",[s._v("由"),e("code",[s._v("auto-aof-rewrite-percentage")]),s._v("、"),e("code",[s._v("auto-aof-rewrite-min-size")]),s._v("两个参数决定 且没有进行BGSAVE、BGREWRITEAOF操作 。")]),s._v(" "),e("p",[s._v("贴一下Redis的原话：")])])]),s._v(" "),e("div",{staticClass:"language-java extra-class"},[e("pre",{pre:!0,attrs:{class:"language-java"}},[e("code",[s._v("# "),e("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Automatic")]),s._v(" rewrite of the append only file"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("\n# "),e("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Redis")]),s._v(" is able "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("to")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token namespace"}},[s._v("automatically")]),s._v(" rewrite the log file implicitly calling\n# BGREWRITEAOF when the AOF log size grows by the specified percentage"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("\n# \n# "),e("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("This")]),s._v(" is how it works"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Redis")]),s._v(" remembers the size of the AOF file after the\n# latest rewrite "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" no rewrite has happened since the restart"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" the size of\n# the AOF at startup is used"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("\n#\n# "),e("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("This")]),s._v(" base size is compared "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("to")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token namespace"}},[s._v("the")]),s._v(" current "),e("span",{pre:!0,attrs:{class:"token class-name"}},[e("span",{pre:!0,attrs:{class:"token namespace"}},[s._v("size"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")])]),s._v(" If")]),s._v(" the current size is\n# bigger than the specified percentage"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" the rewrite is "),e("span",{pre:!0,attrs:{class:"token class-name"}},[e("span",{pre:!0,attrs:{class:"token namespace"}},[s._v("triggered"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")])]),s._v(" Also")]),s._v("\n# you need "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("to")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token namespace"}},[s._v("specify")]),s._v(" a minimal size "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("for")]),s._v(" the AOF file "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("to")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token namespace"}},[s._v("be")]),s._v(" rewritten"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("this")]),s._v("\n# is useful "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("to")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token namespace"}},[s._v("avoid")]),s._v(" rewriting the AOF file even "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" the percentage increase\n# is reached but it is still pretty small"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("\n#\n# "),e("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Specify")]),s._v(" a percentage of zero in order "),e("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("to")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token namespace"}},[s._v("disable")]),s._v(" the automatic AOF\n# rewrite feature"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("\n\nauto"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("aof"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("rewrite"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("percentage "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("100")]),s._v("\nauto"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("aof"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("rewrite"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("min"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("size "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("64")]),s._v("mb\n")])])]),e("p",[s._v("简单解释一下，首先当你AOF文件超过了 "),e("code",[s._v("auto-aof-rewrite-min-size")]),s._v("才会重写。")]),s._v(" "),e("p",[s._v("Redis会记录上一次重写的大小，和当前AOF的大小，当 "),e("code",[s._v("（当前AOF大小/上次重写AOF大小）> auto-aof-rewrite-percentage")]),s._v("  则自动重写。")]),s._v(" "),e("p",[s._v("例如当前文件大小129mb，上一次AOF重写原文件大小是64mb，超过100%，就重写。")]),s._v(" "),e("p",[s._v("自动重写也是调用 "),e("code",[s._v("bgrewriteaof")]),s._v(" 命令。")]),s._v(" "),e("ul",[e("li",[e("p",[s._v("手动触发")]),s._v(" "),e("p",[s._v("调用"),e("code",[s._v("bgrewriteaof")]),s._v("命令。")]),s._v(" "),e("p",[s._v("短短一句命令其实背后做了很多操作。")])])]),s._v(" "),e("div",{staticClass:"language-java extra-class"},[e("pre",{pre:!0,attrs:{class:"language-java"}},[e("code",[s._v("localhost"),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),e("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("bgrewriteaof\n"),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"Background append only file rewriting started"')]),s._v("\n")])])]),e("p",[e("strong",[s._v("AOF重写大致过程：")])]),s._v(" "),e("ol",[e("li",[e("p",[s._v("父进程执行"),e("code",[s._v("fork()")]),s._v("，创建一个子进程。")])]),s._v(" "),e("li",[e("p",[s._v("父进程处理客户端请求，父进程把所有修改命令会写入到"),e("code",[s._v("aof_rewrite_buf")]),s._v("中，并根据"),e("code",[s._v("appendfsync")]),s._v("策略持久化到AOF文件中。")])]),s._v(" "),e("li",[e("p",[s._v("子进程把新AOF文件写入完成后，子进程发送信号给父进程，父进程更新统计信息。")])]),s._v(" "),e("li",[e("p",[s._v("父进程将"),e("code",[s._v("aof_rewrite_buf")]),s._v("（AOF重写缓冲区）的数据写入到新的AOF文件中。")])])]),s._v(" "),e("blockquote",[e("p",[s._v("过期的键不会被记录到 "),e("code",[s._v("AOF")]),s._v(" 文件中")])]),s._v(" "),e("p",[e("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-202204/image-20201027155614967.png",alt:" AOF重写流程 "}})]),s._v(" "),e("blockquote",[e("p",[s._v("AOF的持久化也可能会造成阻塞。")])]),s._v(" "),e("p",[s._v("fsync 每秒同步一次，假如系统磁盘比较忙，可能就会造成Redis主线程阻塞。")]),s._v(" "),e("h3",{attrs:{id:"aof优缺点"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#aof优缺点"}},[s._v("#")]),s._v(" AOF优缺点：")]),s._v(" "),e("p",[s._v("优点：")]),s._v(" "),e("ol",[e("li",[e("p",[s._v("提供了多种同步命令的方式，默认1秒同步一次写命令，最多丢失1秒内的数据；、")])]),s._v(" "),e("li",[e("p",[s._v("如果AOF文件有错误，比如在写AOF文件时redis崩溃了，redis提供了多种恢复AOF文件的方式，例如使用redis-check-aof工具修正AOF文件（一般都是最后一条写命令有问题，可以手动取出最后一条写命令）；")])]),s._v(" "),e("li",[e("p",[s._v("AOF文件可读性较强，也可手动操作写命令。")])])]),s._v(" "),e("p",[s._v("缺点：")]),s._v(" "),e("ol",[e("li",[s._v("AOF文件比RDB文件较大；")]),s._v(" "),e("li",[s._v("redis负载较高时，RDB文件比AOF文件具有更好的性能；")]),s._v(" "),e("li",[s._v("RDB使用快照的方式持久化整个redis数据，而aof只是追加写命令，因此从理论上来说，RDB比AOF方式更加健壮，另外，官方文档也指出，在某些情况下，AOF的确也存在一些bug，（举个例子，阻塞命令 BRPOPLPUSH 就曾经引起过这样的 bug 。）这些bug的场景RDB是不存在的。")])]),s._v(" "),e("h2",{attrs:{id:"_4、数据恢复"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_4、数据恢复"}},[s._v("#")]),s._v(" 4、数据恢复")]),s._v(" "),e("p",[s._v("当Redis重新启动时，可以读取快照文件恢复数据。")]),s._v(" "),e("p",[s._v("将备份文件 ("),e("code",[s._v("dump.rdb")]),s._v(") 或者 （"),e("code",[s._v(".aof文件")]),s._v("）移动到 redis 安装目录并启动服务即可，redis就会自动加载文件数据至内存了。")]),s._v(" "),e("p",[s._v("RDB恢复又分两种情况：")]),s._v(" "),e("p",[s._v("1）"),e("strong",[s._v("主库master")]),s._v("：")]),s._v(" "),e("ul",[e("li",[s._v("载入RDB时，过期键会被忽略。")])]),s._v(" "),e("p",[s._v("2）"),e("strong",[s._v("从库salve")]),s._v("：")]),s._v(" "),e("p",[s._v("载入 RDB 时，文件中的所有键都会被载入，当同步进行时，会和Master 保持一致。不过，因为主从服务器在进行数据同步的时候，从服务器的数据库就会被清空，所以一般来说，过期键在载入RDB文件的从服务器也不会造成影响")]),s._v(" "),e("p",[s._v("AOF则不会，过期但并未被删除释放的状态会被正常记录到 "),e("code",[s._v("AOF")]),s._v(" 文件中，当过期键发生释放删除时，"),e("code",[s._v("DEL")]),s._v(" 也会被同步到 "),e("code",[s._v("AOF")]),s._v(" 文件中去。")]),s._v(" "),e("p",[s._v("如果同时开启了RDB和AOF，Redis会优先加载AOF文件，找不到AOF文件才会加载RDB文件。")]),s._v(" "),e("p",[s._v("redis4.0开始 添加了RDB-AOF混合方式，可以通过设置"),e("code",[s._v("aof-use-rdb-preamble yes")]),s._v("开启。"),e("code",[s._v(".aof")]),s._v("文件就由"),e("code",[s._v(".rdb")]),s._v("和"),e("code",[s._v(".aof")]),s._v("文件组成了。这样加载速度快，同时结合AOF，增量的数据以AOF方式保存了，数据更少的丢失。")]),s._v(" "),e("p",[e("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-202204/image-20201027170452172.png",alt:" "}})]),s._v(" "),e("h2",{attrs:{id:"_5、如何选用"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_5、如何选用"}},[s._v("#")]),s._v(" 5、如何选用？")]),s._v(" "),e("p",[s._v("如果你非常关心你的数据，但仍然可以承受数分钟以内的数据丢失， 那么你可以只使用 RDB 持久化。")]),s._v(" "),e("p",[s._v("因为定时生成 RDB 快照（snapshot）非常便于进行数据库备份， 并且 RDB 恢复数据集的速度也要比 AOF 恢复的速度要快， 除此之外， 使用 RDB 还可以避免之前提到的 AOF 程序的 bug 。")]),s._v(" "),e("p",[s._v("如果要担心数据安全和一致性，应该同时使用两种持久化功能。")]),s._v(" "),e("hr"),s._v(" "),e("p",[s._v("参考：")]),s._v(" "),e("ul",[e("li",[s._v("https://www.cnblogs.com/ivictor/p/9749465.html")]),s._v(" "),e("li",[s._v("https://blog.csdn.net/qq_28018283/article/details/80764518")]),s._v(" "),e("li",[s._v("https://redis.io/topics/persistenc")]),s._v(" "),e("li",[e("a",{attrs:{href:"https://www.jianshu.com/p/cbe1238f592a",target:"_blank",rel:"noopener noreferrer"}},[s._v("https://www.jianshu.com/p/cbe1238f592a"),e("OutboundLink")],1)])])])}),[],!1,null,null,null);e.default=r.exports}}]);