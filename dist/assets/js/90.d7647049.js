(window.webpackJsonp=window.webpackJsonp||[]).push([[90],{501:function(t,s,a){"use strict";a.r(s);var e=a(7),r=Object(e.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("p",[t._v("有一次线上要做数据的预热，是一个暂时性的高并发活动，启动的时候把MySQL的部分数据加载到缓存，免得因为请求量过大而击穿数据库造成服务器压力。")]),t._v(" "),s("p",[t._v("期间Redis的大部分key都是不断地被修改。")]),t._v(" "),s("p",[t._v("活动结束后，发现Redis的内存占用挺大的，打算把Redis的key清除，确认数据无误后使用了flushdb命令，但"),s("strong",[t._v("Redis在删除数据后，占用的内存依然降不下来")]),t._v("。")]),t._v(" "),s("p",[t._v("这让我很疑惑。")]),t._v(" "),s("p",[t._v("后来发现是Redis的内存碎片和内存分配策略问题。")]),t._v(" "),s("h2",{attrs:{id:"_1、内存碎片"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_1、内存碎片"}},[t._v("#")]),t._v(" 1、内存碎片")]),t._v(" "),s("p",[t._v("这个问题类似于MySQL，如果你了解MySQL的话，MySQL在使用delete语句删除表数据的时候，表的大小是不会有很明显的变化，反而还可能会增大空间。")]),t._v(" "),s("p",[t._v("如果MySQL的引擎是 MyISAM ，会立刻释放磁盘空间 ，而InnoDB 不会释放磁盘空间，数据只是对你不可见。会产生空洞，标记为可复用，下次你执行insert，会覆盖这部分空间。")]),t._v(" "),s("p",[t._v("这也有点类似于GC 标记清除法回收对象的样子。")]),t._v(" "),s("p",[t._v("就连操作系统中对于内存分配也是一样的，比如应用需要申请一块连续"),s("code",[t._v("K")]),t._v("个字节的空间，虽然剩余总的内存总量大于"),s("code",[t._v("k")]),t._v("个字节，但是没有一块"),s("strong",[t._v("连续的内存空间")]),t._v("是"),s("code",[t._v("k")]),t._v("个字节，这就会产生"),s("strong",[t._v("内存碎片")]),t._v("，Redis也是如此：")]),t._v(" "),s("p",[t._v("比如刚好三个键值"),s("code",[t._v("k1")]),t._v("、"),s("code",[t._v("k2")]),t._v("、"),s("code",[t._v("k3")]),t._v("、占用"),s("code",[t._v("3")]),t._v("、"),s("code",[t._v("3")]),t._v("、"),s("code",[t._v("2")]),t._v(" 共"),s("code",[t._v("8")]),t._v("个字节：")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210325163603017.png",alt:""}})]),t._v(" "),s("p",[t._v("此时"),s("code",[t._v("k1")]),t._v("键值修改后变成占用 "),s("code",[t._v("2 个字节")]),t._v("，就会产生碎片：")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210325163616172.png",alt:""}})]),t._v(" "),s("blockquote",[s("p",[t._v("如果是键值删除，情况也是如此")])]),t._v(" "),s("p",[t._v("但如果是修改键值，"),s("code",[t._v("k1")]),t._v("键值特别大，如果大于目前预分配的空间 "),s("code",[t._v("8 字节")]),t._v("，就会进行扩容；如果在预分配空间内但需要相邻的"),s("code",[t._v("k2")]),t._v("空间，比如说"),s("code",[t._v("4字节")]),t._v("，操作系统会把 "),s("code",[t._v("k2")]),t._v(" 拷贝到别的空间，此时又会出现一个内存碎片：")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210325164423133.png",alt:""}})]),t._v(" "),s("p",[t._v("所以Redis造成内存碎片的主要原因是自己的内存分配策略和键值的删除、修改造成的。")]),t._v(" "),s("h2",{attrs:{id:"_2、内存分配策略"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2、内存分配策略"}},[t._v("#")]),t._v(" 2、内存分配策略")]),t._v(" "),s("p",[t._v("在编译时指定的Redis使用的内存分配器，可以是libc、jemalloc、tcmalloc，默认是jemalloc。jemalloc在64位系统中，将内存空间划分为小、大、巨大三个范围；")]),t._v(" "),s("p",[t._v("每个范围内又划分了许多小的内存块单位；存储数据的时候，会选择大小最合适的内存块进行存储。")]),t._v(" "),s("p",[t._v("jemalloc划分的内存单元如图所示：")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/Home/9972795-3ac5b08c5ee00c46.png",alt:""}})]),t._v(" "),s("p",[t._v("假如你要分配一个3字节的数据，Redis就会分配一个8字节的的空间（预分配）。如果下次这个数据增大了，在5字节以内，Redis就不会再申请额外的空间。但如果此时需要继续写入6 字节，则已分配空间不够用了，需要再次向系统申请分配内存空间。")]),t._v(" "),s("p",[t._v("但是如果没有写入，这5字节也将会是内存碎片。")]),t._v(" "),s("p",[t._v("还有就是，键、值都会随时修改或者删除（一般修改后的value与原来value的大小差异较大才会产生），这就导致Redis进行空间的扩容和释放，这样一来也会产生内存碎片。")]),t._v(" "),s("p",[t._v("Redis的String数据类型，（底层是SDS实现），它就是会预分配空间，当缩短SDS长度时，Redis不进行内存释放，而是记录到"),s("code",[t._v("free")]),t._v("字段中， 等待下次使用。 与此同时，也提供相应的API，可以手动释放内存。")]),t._v(" "),s("p",[t._v("“存在即合理”，预分配内存的好处就是避免了内存分配和释放耗时可能对性能造成影响。")]),t._v(" "),s("blockquote",[s("p",[t._v("这也是典型的空间换时间")])]),t._v(" "),s("h2",{attrs:{id:"_3、key过期和内存淘汰机制"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3、key过期和内存淘汰机制"}},[t._v("#")]),t._v(" 3、key过期和内存淘汰机制")]),t._v(" "),s("p",[t._v("Redis的key是可以设置过期时间的。")]),t._v(" "),s("p",[t._v("当key过期，Redis也算会回收的，但并不是时间一到，就会被回收，所以内存不一定会立马减少。")]),t._v(" "),s("blockquote",[s("p",[t._v("本篇文章主要说的是人为主动删除为什么Redis内存不下降，但这里是Redis"),s("strong",[t._v("自动释放内存")]),t._v("的被动过程~就不展开说了")])]),t._v(" "),s("p",[t._v("想要了解key过期的删除策略和内存不足Redis的应对方法，可以参考：https://mp.weixin.qq.com/s/rYD7-Xfs7InLCjd-O-iQxA")]),t._v(" "),s("h2",{attrs:{id:"_4、内存碎片查看"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_4、内存碎片查看"}},[t._v("#")]),t._v(" 4、内存碎片查看")]),t._v(" "),s("h3",{attrs:{id:"_4-1、内存碎片查看"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_4-1、内存碎片查看"}},[t._v("#")]),t._v(" 4.1、内存碎片查看")]),t._v(" "),s("p",[t._v("我这里本地演示一下，这是使用flushdb几次后（flushdb也会产生很多内存碎片）：")]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[t._v("localhost"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v('INFO memory\n"# '),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Memory")]),t._v("\nused_memory"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("3986048")]),t._v("\nused_memory_human"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("3.80")]),t._v("M\nused_memory_rss"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("14991360")]),t._v("\nused_memory_rss_human"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("14.30")]),t._v("M\nused_memory_peak"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("4330880")]),t._v("\nused_memory_lua"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("36864")]),t._v("\nmem_fragmentation_ratio"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("3.80")]),t._v("\nmem_allocator"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("jemalloc"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("3.6")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v(".0")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v('\n"\n')])])]),s("p",[t._v("参数解释：")]),t._v(" "),s("h5",{attrs:{id:"_1、used-memory"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_1、used-memory"}},[t._v("#")]),t._v(" 1、used_memory：")]),t._v(" "),s("p",[s("strong",[t._v("Redis实际已经使用了的内存大小")]),t._v("，包括redis进程内部开销和你的cache的数据所占用的内存，单位byte。")]),t._v(" "),s("h5",{attrs:{id:"_2、used-memory-human"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2、used-memory-human"}},[t._v("#")]),t._v(" 2、used_memory_human：")]),t._v(" "),s("p",[t._v("加了单位的"),s("code",[t._v("used_memory")])]),t._v(" "),s("h5",{attrs:{id:"_3、used-memory-rss"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3、used-memory-rss"}},[t._v("#")]),t._v(" 3、used_memory_rss：")]),t._v(" "),s("p",[s("strong",[t._v("操作系统实际分配的内存")])]),t._v(" "),s("h5",{attrs:{id:"_4、used-memory-peak"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_4、used-memory-peak"}},[t._v("#")]),t._v(" 4、used_memory_peak：")]),t._v(" "),s("p",[t._v("redis内存使用的峰值。")]),t._v(" "),s("h5",{attrs:{id:"_5、used-memory-peak"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_5、used-memory-peak"}},[t._v("#")]),t._v(" 5、used_memory_peak：")]),t._v(" "),s("p",[t._v("用户cache数据的峰值大小。")]),t._v(" "),s("h5",{attrs:{id:"_6、used-memory-lua"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_6、used-memory-lua"}},[t._v("#")]),t._v(" 6、used_memory_lua：")]),t._v(" "),s("p",[t._v("执行lua脚本所占用的内存。")]),t._v(" "),s("h5",{attrs:{id:"_7、mem-fragmentation-ratio"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_7、mem-fragmentation-ratio"}},[t._v("#")]),t._v(" 7、mem_fragmentation_ratio：")]),t._v(" "),s("p",[t._v("内存碎片率，计算公式："),s("code",[t._v("used_memory_rss / used_memory")])]),t._v(" "),s("h5",{attrs:{id:"_8、mem-allocator"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_8、mem-allocator"}},[t._v("#")]),t._v(" 8、mem_allocator")]),t._v(" "),s("p",[t._v("内存分配器")]),t._v(" "),s("p",[t._v("这里主要看一下这个"),s("code",[t._v("mem_fragmentation_ratio")]),t._v("，一般来说：")]),t._v(" "),s("p",[t._v("​\t（1）"),s("code",[t._v(">1&&<1.5")]),t._v("：合理的范围，说明操作系统分配的内存总是总是大于实际申请的空间，碎片不多")]),t._v(" "),s("p",[t._v("​    （2）"),s("code",[t._v(">1.5")]),t._v("：内存碎片率已经超过"),s("code",[t._v("50%")]),t._v("，需要采取一些措施来降低碎片率。")]),t._v(" "),s("p",[t._v("​\t（3）"),s("code",[t._v("<1")]),t._v("：实际分配的内存小于申请的内存了，很显然内存不足了，这样会导致部分数据写入到"),s("code",[t._v("Swap")]),t._v("中")]),t._v(" "),s("blockquote",[s("p",[t._v("swap对于操作系统来比较重要， 当物理内存不足时， 可以将一部分内存页进行swap操作， 以解燃眉之急。")]),t._v(" "),s("p",[t._v("swap空间由硬盘提供， 对于需要高并发、 高吞吐的应用来说， 磁盘IO通常会成为系统瓶颈。当然内存达到了Redis的规则，会触发内存淘汰机制。")]),t._v(" "),s("p",[t._v("之后Redis访问Swap中的数据时，延迟会变大，性能会降低。")])]),t._v(" "),s("p",[t._v("可以看到我这里演示的 Redis实际使用的空间是 "),s("code",[t._v("used_memory_human:3.80M")]),t._v("，操作系统实际分配的空间是"),s("code",[t._v("used_memory_rss_human:14.30M")]),t._v(" ，内存碎片率达到了"),s("code",[t._v("mem_fragmentation_ratio:3.80")]),t._v("，内存碎片率十分高！")]),t._v(" "),s("p",[t._v("这也要提醒一下大家，Redis使用flushdb命令只能清掉数据但是清不掉内存~")]),t._v(" "),s("h2",{attrs:{id:"_5、内存碎片清理"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_5、内存碎片清理"}},[t._v("#")]),t._v(" 5、内存碎片清理")]),t._v(" "),s("p",[s("strong",[t._v("那要如何清除内存碎片呢？")])]),t._v(" "),s("p",[t._v("处理内存碎片是Redis调优的一种方法之一。")]),t._v(" "),s("h4",{attrs:{id:"解决方法一"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#解决方法一"}},[t._v("#")]),t._v(" 解决方法一：")]),t._v(" "),s("ul",[s("li",[t._v("重启Redis")])]),t._v(" "),s("p",[t._v("没有什么问题是重启无法解决的，yyds！")]),t._v(" "),s("p",[t._v("但，在生产环境不能这么玩啊，如果Redis恰好没有持久化，这会导致数据丢失的，即使持久化了，万一数据量大，重启恢复时间长，期间不可用对业务影响也大。")]),t._v(" "),s("ul",[s("li",[t._v("执行 memory purge 命令")])]),t._v(" "),s("p",[t._v("手动暴力整理内存碎片，会阻塞主进程，生产环境慎用。")]),t._v(" "),s("h4",{attrs:{id:"解决方法二"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#解决方法二"}},[t._v("#")]),t._v(" 解决方法二：")]),t._v(" "),s("p",[t._v("Redis 4.0-RC3版本之后，Redis提供了一种自动清理内存碎片的参数"),s("code",[t._v("activedefrag")])]),t._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 开启自动内存碎片整理(总开关)")]),t._v("\nactivedefrag "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("yes")]),t._v("\n")])])]),s("p",[t._v("只需要设置开启即可：")]),t._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token number"}},[t._v("127.0")]),t._v(".0.1:637"),s("span",{pre:!0,attrs:{class:"token operator"}},[s("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[t._v("9")]),t._v(">")]),t._v(" config get activedefrag\n"),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"activedefrag"')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"no"')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("127.0")]),t._v(".0.1:637"),s("span",{pre:!0,attrs:{class:"token operator"}},[s("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[t._v("9")]),t._v(">")]),t._v(" config "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("set")]),t._v(" activedefrag "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("yes")]),t._v("\nOK\n")])])]),s("p",[t._v("Redis开启了自动清理内存碎片参数，那要达到什么条件才会清理呢？")]),t._v(" "),s("p",[t._v("Redis提供了一下触发机制，下面4个参数都是"),s("strong",[t._v("满足任意一条件")]),t._v("后就可以进行清理：")]),t._v(" "),s("ul",[s("li",[s("p",[s("strong",[t._v("active-defrag-ignore-bytes 100mb")])]),t._v(" "),s("p",[t._v("默认值，碎片达到100MB时，开启清理。")])]),t._v(" "),s("li",[s("p",[s("strong",[t._v("active-defrag-threshold-lower 10")])]),t._v(" "),s("p",[t._v("默认值，当碎片超过 10% 时，开启清理。")])]),t._v(" "),s("li",[s("p",[s("strong",[t._v("active-defrag-threshold-upper 100")])]),t._v(" "),s("p",[t._v("默认值，内存碎片超过 100%，则尽最大努力整理。")])])]),t._v(" "),s("p",[t._v("只需要进入redis客户端或者在conf配置文件设置即可：")]),t._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token number"}},[t._v("127.0")]),t._v(".0.1:637"),s("span",{pre:!0,attrs:{class:"token operator"}},[s("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[t._v("9")]),t._v(">")]),t._v(" config get active-defrag-ignore-bytes\n"),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"active-defrag-ignore-bytes"')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"104857600"')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("127.0")]),t._v(".0.1:637"),s("span",{pre:!0,attrs:{class:"token operator"}},[s("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[t._v("9")]),t._v(">")]),t._v(" config get active-defrag-threshold-lower\n"),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"active-defrag-threshold-lower"')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"10"')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("127.0")]),t._v(".0.1:637"),s("span",{pre:!0,attrs:{class:"token operator"}},[s("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[t._v("9")]),t._v(">")]),t._v(" config get active-defrag-threshold-upper\n"),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"active-defrag-threshold-upper"')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"100"')]),t._v("\n")])])]),s("p",[t._v("Redis在清理内存，是会消耗CPU资源的，而且IO也会是一个瓶颈。")]),t._v(" "),s("p",[t._v("为了避免对正常请求的影响，同时又能保证性能。Redis 提供了监控 CPU 占用比例的参数，在满足以下条件时才会保证清理正常开展：")]),t._v(" "),s("ul",[s("li",[s("p",[s("strong",[t._v("active-defrag-cycle-min 5")]),t._v("：")]),t._v(" "),s("p",[t._v("默认值，占用资源最小百分比")])]),t._v(" "),s("li",[s("p",[s("strong",[t._v("active-defrag-cycle-max 75")]),t._v("：")]),t._v(" "),s("p",[t._v("默认值，占用资源最大百分比，一旦超过则停止清理，从而避免在清理时，大量的内存拷贝阻塞 Redis，导致其它请求延迟。")])])]),t._v(" "),s("p",[t._v("还有一些其他参数：")]),t._v(" "),s("ul",[s("li",[s("p",[s("strong",[t._v("active-defrag-max-scan-fields")]),t._v("：")]),t._v(" "),s("p",[t._v("碎片整理 扫描set/hash/zset/list时，仅当 set/hash/zset/list 的长度小于此阀值时，才会将此key加入碎片整理；")])])]),t._v(" "),s("p",[t._v("稍微引申一下，可以看看4.0版本下Redis的"),s("code",[t._v("activeDefragCycle")]),t._v(" 函数实现：")]),t._v(" "),s("div",{staticClass:"language-c extra-class"},[s("pre",{pre:!0,attrs:{class:"language-c"}},[s("code",[t._v("     "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*每秒进行一次判断*/")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("run_with_period")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1000")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* 碎片大小 */")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("size_t")]),t._v(" frag_bytes"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* 碎片率*/")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("float")]),t._v(" frag_pct "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("getAllocatorFragmentation")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("&")]),t._v("frag_bytes"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n       "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* 如果没有运行或碎片低于碎片大小或者低于碎片率，则不执行 */")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("!")]),t._v("server"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("active_defrag_running"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("frag_pct "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v(" server"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("active_defrag_threshold_lower "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("||")]),t._v(" frag_bytes "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v(" server"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("active_defrag_ignore_bytes"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n                "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* 计算CPU的阀值 */")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("int")]),t._v(" cpu_pct "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("INTERPOLATE")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("frag_pct"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                server"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("active_defrag_threshold_lower"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                server"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("active_defrag_threshold_upper"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                server"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("active_defrag_cycle_min"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                server"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("active_defrag_cycle_max"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        cpu_pct "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("LIMIT")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("cpu_pct"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                server"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("active_defrag_cycle_min"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                server"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("active_defrag_cycle_max"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n         "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* 如果没有运行，则不执行 */")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("!")]),t._v("server"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("active_defrag_running "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("||")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* 根据上面计算的cpu_pct和大小与我们设置的参数进行比较判断，决定是否执行 */")]),t._v("\n            cpu_pct "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" server"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("active_defrag_running"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            server"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("active_defrag_running "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" cpu_pct"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("serverLog")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("LL_VERBOSE"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Starting active defrag, frag=%.0f%%, frag_bytes=%zu, cpu=%d%%"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                frag_pct"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" frag_bytes"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" cpu_pct"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h2",{attrs:{id:"总结"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#总结"}},[t._v("#")]),t._v(" 总结")]),t._v(" "),s("p",[t._v("1、Redis删除数据内存仍然占用高是因为存在"),s("strong",[t._v("内存碎片")]),t._v("。")]),t._v(" "),s("p",[t._v("2、Redis内存碎片的由自身的 "),s("strong",[t._v("内存分配策略")]),t._v(" 和 "),s("strong",[t._v("键值对的大幅度修改、删除")]),t._v(" 造成的。")]),t._v(" "),s("p",[t._v("3、可以使用"),s("code",[t._v("INFO memory")]),t._v("命令查看内存的碎片率。")]),t._v(" "),s("p",[t._v("4、可以通过"),s("code",[t._v("memory purge")]),t._v(" 主动的方式 或者开启"),s("code",[t._v("activedefrag")]),t._v(" 被动的方式清理内存碎片。")]),t._v(" "),s("p",[t._v("参考：")]),t._v(" "),s("ul",[s("li",[t._v("Redis官方文档：https://redis.io/topics/memory-optimization")]),t._v(" "),s("li",[t._v("Redis的key过期删除策略内存淘汰机制：https://mp.weixin.qq.com/s/rYD7-Xfs7InLCjd-O-iQxA")])])])}),[],!1,null,null,null);s.default=r.exports}}]);