(window.webpackJsonp=window.webpackJsonp||[]).push([[251],{664:function(_,v,t){"use strict";t.r(v);var s=t(7),a=Object(s.a)({},(function(){var _=this,v=_._self._c;return v("ContentSlotsDistributor",{attrs:{"slot-key":_.$parent.slotKey}},[v("h2",{attrs:{id:"絮"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#絮"}},[_._v("#")]),_._v(" 絮")]),_._v(" "),v("p",[_._v("大家好我是HaC，这篇文章来给大家分享一下我自学MySQL的历程。")]),_._v(" "),v("p",[_._v("记得我当初入门SQL，用的是SQLServer，老实说，真的不好用，光是安装这个软件都花了几天的时间，因为期间崩溃了几次还无法连接。")]),_._v(" "),v("p",[_._v("后来接触了MySQL，因为看到网上说，大部分的业务都是用的MySQL，于是我就踏上了MySQL的道路。")]),_._v(" "),v("p",[v("strong",[_._v("以下是我的一些学习MySQL的时间线：")])]),_._v(" "),v("p",[_._v("入门看的是菜鸟的SQL教程（下面讲到），实习期间看的是《MySQL是怎么样运行的》，一本简单介绍SQL原理稍微深入的书籍。")]),_._v(" "),v("p",[_._v("正式工作后接触了大量的金融业务，需要大量的报表和SQL调优，于是又看了《MySQL实战45讲-丁奇》，这是丁奇老师在极客时间的一门课程，讲的非常好，还有就是《MySQL排错指南》。看完这俩，对我的MySQL能力有了质的飞跃（其实也就是豁然开朗的感觉）。因为历史遗留的SQL随着数据量激增运行太耗时了，后来开始结合慢日志进行排查和优化，对锁、binlog、redolog、索引等有了深刻印象。也相辅相成吧，结果就是让我的SQL能力也更强了。")]),_._v(" "),v("p",[_._v("目前停留在以下说到的第四部分——"),v("strong",[_._v("进阶")]),_._v("阶段。这部分学习起来十分吃力，主要还是用不上，你说我想搭个高可用的分库分表数据库，老大也不放心让我搞啊，也只能是偶尔翻翻书，有个大概的印象，万一以后再用到了，我再系统的翻翻书，看看网上的案例就行了。")]),_._v(" "),v("p",[_._v("嗯~这大概就是我的学习过程了。")]),_._v(" "),v("p",[_._v("具体见下：")]),_._v(" "),v("h2",{attrs:{id:"sql开篇"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#sql开篇"}},[_._v("#")]),_._v(" SQL开篇")]),_._v(" "),v("p",[_._v("数据是存储在数据库的，开发人员要操作数据库进行数据的增删改查就需要"),v("strong",[_._v("SQL语言")]),_._v("。")]),_._v(" "),v("p",[v("strong",[_._v("SQL")]),_._v(" (Structured Query Language:结构化查询语言) 是用于管理关系数据库管理系统（RDBMS）。 SQL 的范围包括数据插入、查询、更新和删除，数据库模式创建和修改，以及数据访问控制。")]),_._v(" "),v("p",[_._v("虽然 SQL 是一门 ANSI（American National Standards Institute 美国国家标准化组织）标准的计算机语言，但是仍然存在着多种不同版本的 SQL 语言。")]),_._v(" "),v("p",[_._v("因为目前的主流数据库有：")]),_._v(" "),v("ul",[v("li",[_._v("MySQL")]),_._v(" "),v("li",[_._v("Qracle")]),_._v(" "),v("li",[_._v("SQLServer")]),_._v(" "),v("li",[_._v("MongoDB")]),_._v(" "),v("li",[_._v("PostgreSQL")]),_._v(" "),v("li",[_._v("......")])]),_._v(" "),v("p",[_._v("因为有不同的数据库，所以会有不同版本的SQL，但是区别并不是很大。")]),_._v(" "),v("p",[_._v("这里建议学习 "),v("strong",[_._v("MySQL")]),_._v(" ，因为上手简单，而且MySQL是一个轻量级的数据库。")]),_._v(" "),v("h2",{attrs:{id:"_1、入门"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_1、入门"}},[_._v("#")]),_._v(" 1、入门")]),_._v(" "),v("h3",{attrs:{id:"_1-1、安装数据库"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_1-1、安装数据库"}},[_._v("#")]),_._v(" 1.1、安装数据库")]),_._v(" "),v("p",[_._v("上面说到建议学习MySQL作为数据库语言，安装数据库可以参考：")]),_._v(" "),v("p",[_._v("https://www.runoob.com/mysql/mysql-install.html")]),_._v(" "),v("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/Home/image-20210328115317680.png"}}),_._v(" "),v("p",[_._v("安装完成了，可以使用一个可视化的工具："),v("strong",[_._v("Navicat")])]),_._v(" "),v("p",[_._v("这样就可以简单操作数据库了：")]),_._v(" "),v("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/Home/image-20210328115438740.png"}}),_._v(" "),v("h3",{attrs:{id:"_1-2、上手sql语句"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_1-2、上手sql语句"}},[_._v("#")]),_._v(" 1.2、上手SQL语句")]),_._v(" "),v("p",[_._v("菜鸟教程SQL快速上手：")]),_._v(" "),v("p",[_._v("https://www.runoob.com/sql/sql-tutorial.html")]),_._v(" "),v("p",[_._v("我当初就是从这里入门的，这个教程包含了最基础的增删改查语句。")]),_._v(" "),v("h4",{attrs:{id:"一些最重要的-sql-命令"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#一些最重要的-sql-命令"}},[_._v("#")]),_._v(" 一些最重要的 SQL 命令：")]),_._v(" "),v("ul",[v("li",[v("strong",[_._v("SELECT")]),_._v(" - 从数据库中提取数据")]),_._v(" "),v("li",[v("strong",[_._v("UPDATE")]),_._v(" - 更新数据库中的数据")]),_._v(" "),v("li",[v("strong",[_._v("DELETE")]),_._v(" - 从数据库中删除数据")]),_._v(" "),v("li",[v("strong",[_._v("INSERT INTO")]),_._v(" - 向数据库中插入新数据")]),_._v(" "),v("li",[v("strong",[_._v("CREATE DATABASE")]),_._v(" - 创建新数据库")]),_._v(" "),v("li",[v("strong",[_._v("ALTER DATABASE")]),_._v(" - 修改数据库")]),_._v(" "),v("li",[v("strong",[_._v("CREATE TABLE")]),_._v(" - 创建新表")]),_._v(" "),v("li",[v("strong",[_._v("ALTER TABLE")]),_._v(" - 变更（改变）数据库表")]),_._v(" "),v("li",[v("strong",[_._v("DROP TABLE")]),_._v(" - 删除表")]),_._v(" "),v("li",[v("strong",[_._v("CREATE INDEX")]),_._v(" - 创建索引（搜索键）")]),_._v(" "),v("li",[v("strong",[_._v("DROP INDEX")]),_._v(" - 删除索引")])]),_._v(" "),v("p",[_._v("可以按照分类进行记住它们，SQL语言包括数据定义(DDL)、数据操纵(DML)，数据控制(DCL)和数据查询（DQL）四个部分：")]),_._v(" "),v("ul",[v("li",[v("strong",[_._v("数据定义(DDL)")])])]),_._v(" "),v("p",[_._v("Create Table，Alter Table,Drop Table, Craete/Drop Index等")]),_._v(" "),v("ul",[v("li",[v("strong",[_._v("数据操纵(DML)")])])]),_._v(" "),v("p",[_._v("select ,insert,update,delete,")]),_._v(" "),v("ul",[v("li",[v("strong",[_._v("数据控制(DCL)")])])]),_._v(" "),v("p",[_._v("grant,revoke")]),_._v(" "),v("ul",[v("li",[v("strong",[_._v("数据查询（DQL）")])])]),_._v(" "),v("p",[_._v("select")]),_._v(" "),v("h2",{attrs:{id:"_2、夯实-看书"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_2、夯实-看书"}},[_._v("#")]),_._v(" 2、夯实—看书")]),_._v(" "),v("p",[_._v("菜鸟教程的教程没有讲得很细，很适合快速上手的小伙伴v，如果你是时间充足，建议再看几本书：")]),_._v(" "),v("h3",{attrs:{id:"《sql基础教程第2版-日-mick-著-》"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#《sql基础教程第2版-日-mick-著-》"}},[_._v("#")]),_._v(" 《SQL基础教程第2版 ([日]MICK 著)》")]),_._v(" "),v("img",{staticStyle:{zoom:"33%"},attrs:{src:"https://img3.doubanio.com/view/subject/l/public/s29461770.jpg"}}),_._v(" "),v("blockquote",[v("p",[_._v("介绍了关系数据库以及用来操作关系数据库的SQL语言的使用方法。书中通过丰富的图示、大量示例程序和详实的操作步骤说明，让读者循序渐进地掌握SQL的基础知识和使用技巧，切实提高编程能力。每章结尾设置有练习题，帮助读者检验对各章内容的理解程度。")])]),_._v(" "),v("p",[_._v("这本书也是基础入门的数据，讲述了很多SQL的知识点，它是以"),v("strong",[_._v("PostgreSQL")]),_._v("  作为教程的，这本书的好处就是有大量的图片。")]),_._v(" "),v("p",[_._v("⭐️"),v("strong",[_._v("适合人群：初入门SQL的小伙伴")])]),_._v(" "),v("p",[_._v("学完基础的MySQL语法，接下来就可以进行练习了，一个在线练习SQL的网站：")]),_._v(" "),v("p",[_._v("https://www.nowcoder.com/ta/sql")]),_._v(" "),v("p",[_._v("⬆️⬆️")]),_._v(" "),v("p",[v("strong",[_._v("以上这里的SQL基本语法是必须掌握的，如果你是测试人员、业务人员，数据分析岗，或者实习，一般掌握到这里就可以了。")])]),_._v(" "),v("p",[_._v("我实习也就是掌握到了这部分。")]),_._v(" "),v("hr"),_._v(" "),v("p",[_._v("下面这部分是针对后端开发人员的提升⬇️⬇️")]),_._v(" "),v("h3",{attrs:{id:"《mysql是怎样运行的-从根儿上理解mysql》"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#《mysql是怎样运行的-从根儿上理解mysql》"}},[_._v("#")]),_._v(" 《MySQL是怎样运行的：从根儿上理解MySQL》")]),_._v(" "),v("p",[_._v("这本书稍微深入讲述了MySQL是怎么样运行的，不再单独介绍简单增删改查语句，")]),_._v(" "),v("p",[_._v("各部分简介如下：")]),_._v(" "),v("ul",[v("li",[_._v("第1部分（第1章～第3章）：以只会写增删改查语句的小白身份重新审视MySQL到底是个什么东西，介绍MySQL的服务器程序和客户端程序有哪些、启动选项和系统变量以及字符集的一些事情。")]),_._v(" "),v("li",[_._v("第2部分（第4章～第9章）：唠叨记录、页面、索引、表空间的结构和用法。第2部分是全篇的基础，后边的章节都依赖于这些结构。")]),_._v(" "),v("li",[_._v("第3部分（第10章～第17章）：介绍同学们工作中经常遇到的查询优化问题，比如单表查询是如何执行的，连接查询是怎么执行的，MySQL基于成本和规则的优化是个什么东西。本部分还十分详细的介绍如何查看Explain语句的执行结果。")]),_._v(" "),v("li",[_._v("第4部分（第18章～第22章）：介绍为什么会有事务的概念，以及MySQL是如何实现事务的，其中包括redo日志、undo日志、MVCC、各种锁的细节等。")])]),_._v(" "),v("p",[_._v("目录大致如下：")]),_._v(" "),v("p",[v("img",{attrs:{src:"https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b55a37cdc62f4f38b2c7715d72b38b0a~tplv-k3u1fbpfcp-watermark.image?imageslim",alt:""}})]),_._v(" "),v("p",[v("img",{attrs:{src:"https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0a71f0572e643cdb357a725a9abf26f~tplv-k3u1fbpfcp-watermark.image?imageslim",alt:""}})]),_._v(" "),v("p",[v("strong",[_._v("⭐️适合人群：")])]),_._v(" "),v("ul",[v("li",[_._v("刚刚学完SQL基础的同学；")]),_._v(" "),v("li",[_._v("被数据库问题折磨的求职者；")]),_._v(" "),v("li",[_._v("天天被DBA逼着优化SQL的业务开发小伙伴；")]),_._v(" "),v("li",[_._v("菜鸟DBA和不是非常菜的DBA小伙伴；")]),_._v(" "),v("li",[_._v("对MySQL内核有强烈兴趣但一看源码就发懵的小伙伴。")])]),_._v(" "),v("hr"),_._v(" "),v("p",[_._v("实战部分是针对日常业务工作多，不知道如何定位MySQL错误问题的学习，这部分可以快速让你学习到日常错误的例子，可以快速让你上手MySQL中有哪些谨记的法则：⬇️⬇️")]),_._v(" "),v("h2",{attrs:{id:"_3、实战"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_3、实战"}},[_._v("#")]),_._v(" 3、实战")]),_._v(" "),v("h3",{attrs:{id:"《mysql排错指南》"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#《mysql排错指南》"}},[_._v("#")]),_._v(" 《MySQL排错指南》")]),_._v(" "),v("blockquote",[v("p",[v("strong",[_._v("MySQL排错指南")]),_._v("由Oracle公司的技术支持工程师编写，详细阐述了MySQL故障诊断及处理中的知识，教会读者如何深入浅出地定位、分析并解决各种MySQL数据库的故障。")])]),_._v(" "),v("p",[_._v("涵盖了解决MySQL问题的基本技巧、MySQL中的并发问题、服务配置的影响、MySQL硬件和运行环境相关的问题、复制备份中的故障排除、故障排除使用的技术和工具，以及一些MySQL故障排除的最佳实践。此外，本书的附录中还包含了可以帮助读者解决MySQL疑难问题的一些有用资源。")]),_._v(" "),v("h3",{attrs:{id:"《mysql实战45讲-丁奇》"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#《mysql实战45讲-丁奇》"}},[_._v("#")]),_._v(" 《MySQL实战45讲-丁奇》")]),_._v(" "),v("p",[_._v("极客时间丁奇老师的一门课程，共分为两部分内容：")]),_._v(" "),v("ul",[v("li",[v("strong",[_._v("基础篇")]),_._v("，深入浅出地讲述MySQL核心知识，涵盖MySQL基础架构、日志系统、事务隔离、锁等内容。")]),_._v(" "),v("li",[v("strong",[_._v("实践篇")]),_._v("。将从一个个关键的数据库问题出发，分析数据库原理，并给出实践指导。")])]),_._v(" "),v("p",[_._v("以实战中的常见问题为切入点，带你剖析现象背后的本质原因，作者列巨额了36个MySQL常见痛点问题解析，分享一条高效的学习路径，旨在给你一个从理论到实战的系统性指导。")]),_._v(" "),v("p",[_._v("⭐️"),v("strong",[_._v("以上适合人群：")])]),_._v(" "),v("ul",[v("li",[_._v("1~3年工作经验的开发人员")]),_._v(" "),v("li",[_._v("运维人员")])]),_._v(" "),v("hr"),_._v(" "),v("p",[_._v("⬇️⬇️"),v("strong",[_._v("​进阶这部分是针对DBA和高级开发人员的，这部分内容更为深入，但是这也仅仅停留在理论，像阿里这种大公司，看重的更多是解决方案，比如说分库分表、binlog日志保存、主从同步、容灾等等。")])]),_._v(" "),v("p",[v("strong",[_._v("先理论再实战。")])]),_._v(" "),v("p",[_._v("不建议死磕这部分内容，可以有个大概印象就行了。")]),_._v(" "),v("h2",{attrs:{id:"_4、进阶"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_4、进阶"}},[_._v("#")]),_._v(" 4、进阶")]),_._v(" "),v("p",[_._v("MySQL较为深入的原理网上基本都很难找得到答案，要想深入理解一下MySQL，个人觉得必须是要看书的，像MySQL的运行原理、索引、存储引擎、并发、性能、锁、事务管理、备份与恢复等等。")]),_._v(" "),v("p",[_._v("推荐书籍：")]),_._v(" "),v("h3",{attrs:{id:"《mysql技术内幕-innodb存储引擎》"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#《mysql技术内幕-innodb存储引擎》"}},[_._v("#")]),_._v(" 《MySQL技术内幕:InnoDB存储引擎》")]),_._v(" "),v("p",[_._v("国内唯一二本有关InnoDB的著作，详细介绍了MySQL的系统架构和各种各样普遍的存储引擎及其他们中间的较为：")]),_._v(" "),v("ul",[v("li",[v("p",[_._v("包含InnoDB存储引擎的系统架构、运行内存中的数据结构")])]),_._v(" "),v("li",[v("p",[_._v("应用场景InnoDB存储引擎的表和页的物理学存储、数据库索引与优化算法、文档、锁、事务管理、备份与恢复")])]),_._v(" "),v("li",[v("p",[_._v("InnoDB的特性调优等关键的专业知、InnoDB存储引擎源码的编译和调节。")])])]),_._v(" "),v("h3",{attrs:{id:"《高性能mysql》"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#《高性能mysql》"}},[_._v("#")]),_._v(" 《高性能MySQL》")]),_._v(" "),v("p",[_._v("内容涵盖MySQL架构和历史，基准测试和性能剖析，数据库软硬件性能优化，复制、备份和恢复，高可用与高可扩展性，以及云端的MySQL和MySQL相关工具等方面的内容。每一章都是相对独立的主题，读者可以有选择性地单独阅读。")]),_._v(" "),v("p",[v("strong",[_._v("⭐️这两本书适合人群：")])]),_._v(" "),v("ul",[v("li",[_._v("期待搭建和管理方法性能、高可用性的MySQL数据库的开发人员和DBA")])]),_._v(" "),v("h3",{attrs:{id:"mysql官方文档"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#mysql官方文档"}},[_._v("#")]),_._v(" MySQL官方文档")]),_._v(" "),v("p",[_._v("另外，可以试读一下MySQL的官方文档：https://dev.mysql.com/doc/")]),_._v(" "),v("p",[_._v("有一些MySQL的新特性，MySQL的官方文档都有了最新的介绍，看书是无法第一时间知道最新的特性，所以看官方文档是个不错的选择。")]),_._v(" "),v("hr"),_._v(" "),v("p",[_._v("上面提到的电子书，如果要下载，可以在这里找到：")]),_._v(" "),v("p",[_._v("https://rain.baimuxym.cn/article/34#menu_15")])])}),[],!1,null,null,null);v.default=a.exports}}]);