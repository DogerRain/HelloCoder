---
title: Linux三剑客之awk命令
date: 2022-05-26 17:04:01
permalink: /pages/Linux%E4%B8%89%E5%89%91%E5%AE%A2%E4%B9%8Bawk%E5%91%BD%E4%BB%A4
lock: false
categories: 
  - PureJavaCoderRoad
  - Linux
tags: 
  - Linux
  - awk
  - 三剑客之
  - 命令
---
awk 是一种处理文本文件的语言，是一个强大的文本分析工具。它可以根据分隔符将每行内容进行切片，切开的部分再进行分析处理。

> 之所以叫 awk 是因为其取了三位创始人 Alfred Aho，Peter Weinberger, 和 Brian Kernighan 的 Family Name 的首字符。

awk 的功能十分强大，本文只会介绍awk日常大多数的常见的应用场景，不求面面俱到，但求实用。



## 1、awk语法

语法：

```bash
awk [-F 分隔符] 'commands' input-file(s)
```

参数：

```
-F	指定输入时用到的字段分隔符
-v	自定义变量
-f	从脚本中读取awk命令
-m	对val值设置内在限制
```

`[-F 分隔符]`是可选的，因为awk默认使用**空格 制表符**作为缺省的字段分隔符。

最简单的用法：（默认使用空格分隔）

```bash
echo "I am HelloCoder's HaC" | awk '{ print $1 }'
# 输出：
I

echo "I am HelloCoder's HaC" | awk '{ print $3,$4 }'
# 输出：
HelloCoder's HaC

# 打印整行 和 print $0 效果一样 print 
echo "I am HelloCoder's HaC" | awk '{ print $0 }'
I am HelloCoder's HaC
```

> 竖线`|` 左右被理解为简单命令，即前一个（左边）简单命令的标准输出指向后一个（右边）标准命令的标准输入

`print $1` 表示打印第1列

`print $3,$4` 表示打印第3列，第4列，用`,`隔开，默认是空格隔开。

 `print $0` 其中 `$0` 表示输出整条语句

## 2、使用场景

### 1、只显示/etc/passwd的账户

先来看看`/etc/passwd` 内容有什么：

```bash
[root@VM-8-8-centos ~]# cat /etc/passwd
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
```

第一列表示账户名，我们可以利用`awk -F` 指定分隔符打印出来：

```bash
[root@VM-8-8-centos ~]# awk -F : '{ print $1 }' /etc/passwd
root
bin
daemon
adm
```

### 2、正则，过滤账户名称

简单的运算符：

| 运算符                  | 描述                             |
| :---------------------- | :------------------------------- |
| = += -= *= /= %= ^= **= | 赋值                             |
| ?:                      | C条件表达式                      |
| \|\|                    | 逻辑或                           |
| &&                      | 逻辑与                           |
| ~ 和 !~                 | 匹配正则表达式和不匹配正则表达式 |
| < <= > >= != ==         | 关系运算符                       |
| 空格                    | 连接                             |
| + -                     | 加，减                           |
| * / %                   | 乘，除与求余                     |
| + - !                   | 一元加，减和逻辑非               |
| ^ ***                   | 求幂                             |
| ++ --                   | 增加或减少，作为前缀或后缀       |
| $                       | 字段引用                         |
| in                      | 数组成员                         |

#### 1、~ 包含

`'$1~"r"` 即第一列含有`r`的就打印整行：

```bash
# 第一列包含 r 的
[root@localhost nginx]#  awk -F : '$1~"r" {print $1}' /etc/passwd
root
operator
systemd-bus-proxy
systemd-network
chrony
```

也支持结尾、开头、中间任意字符的正则表达：

**开头：**

```bash
# r 开头的
[root@VM-8-8-centos ~]# awk -F : '$1~"^r"{print $1}' /etc/passwd
root
rpc
```

**结尾：**

```bash
# r 结尾的
[root@VM-8-8-centos ~]# awk -F : '$1~"r$"{print $1}' /etc/passwd
operator
```

**包含：**

含有字母 r 或者 t 的  ，

```bash
[root@localhost nginx]# awk -F : '$1~"r|t"{print $1}' /etc/passwd
root
shutdown
halt
operator
ftp
systemd-bus-proxy
systemd-network
polkitd
tss
postfix
chrony
ntp
tcpdump
```

还可以写成：`awk -F : '$1~"r*t"{print $1}' /etc/passwd` 

#### 2、== 等于

```bash
[root@VM-8-8-centos ~]# awk -F : '$1=="root"{print $1}' /etc/passwd
root
```

`>=`、`<=` 可用于比较数字，同理。

### 3、拼接

#### 1、自定义列名

 `BEGIN` 表示开头要显示的内容， `END` 命令表示在结束需要显示的内容

 `{print $1}` 你可以理解为body ，意思为中间部分，每读取一行，执行一次 `body`。

```bash
[root@VM-8-8-centos ~]# awk -F ':' 'BEGIN {print "开始"} $1~"root|mysql"{print $1} END {print "结束"}' /etc/passwd
开始
root
结束
```

#### 2、行号和列还有格式

还可以使用 `NR`、`NF` 显示`行号`、`列号`：

> `NR` 表示当前第几行，`NF`表示当前行有几列。

```bash
[root@VM-8-8-centos ~]#   awk -F ':' 'BEGIN {printf "%-10s  %-10s  %-10s\n", "行","列","第一列"} {printf "%-10s %-10s  %-10s\n", NR, NF,$1} END {print "结束"}' /etc/passwd
行         列         第一列
1         7         root
2         7         bin
3         7         daemon
4         7         adm
结束
```

`printf "%-10s  %-10s  %-10s\n"`  类似于c语言的格式化输出，这里表示左对齐占位10个字符的字符串。

#### 3、指定输出分隔符

可以使用`OFS`参数指定输出分隔符

```bash
[root@VM-8-8-centos ~]# awk -F ':' '{print $1,$1 }' OFS="--" /etc/passwd
root--root
bin--bin
daemon--daemon
adm--adm
```

### 4、匹配某一行

awk 可以像 grep 一样匹配某一行，以下三种做法都可以：

```bash
[root@VM-8-8-centos ~]# awk -F ':'  '$0~"root"{print $0}' /etc/passwd
root:x:0:0:root:/root:/bin/bash
operator:x:11:0:operator:/root:/sbin/nologin
dockerroot:x:995:992:Docker User:/var/lib/docker:/sbin/nologin

[root@VM-8-8-centos ~]# awk '$0~"root"' /etc/passwd
root:x:0:0:root:/root:/bin/bash
operator:x:11:0:operator:/root:/sbin/nologin
dockerroot:x:995:992:Docker User:/var/lib/docker:/sbin/nologin

[root@VM-8-8-centos ~]# awk '/root/' /etc/passwd
root:x:0:0:root:/root:/bin/bash
operator:x:11:0:operator:/root:/sbin/nologin
dockerroot:x:995:992:Docker User:/var/lib/docker:/sbin/nologin
```

`/root|HaC/`  表示或，可以匹配多个字符串

grep做法：

```bash
[root@VM-8-8-centos ~]# grep 'root' /etc/passwd
root:x:0:0:root:/root:/bin/bash
operator:x:11:0:operator:/root:/sbin/nologin
dockerroot:x:995:992:Docker User:/var/lib/docker:/sbin/nologin
```

当然，匹配行还是使用grep方便，输出会显示颜色：

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img2/image-20210331172314910.png)

### 5、支持控制流程语句

因为akw是一门语言，所以**if while do/while for break continue** 都支持：

输出第一个字段的第一个字符大于r的行：

```bash
[root@VM-8-8-centos ~]# awk -F ':' '{ if ($1 > "r") { print $1 } else { print "--" } }' /etc/passwd
root
--
--
--
--
sync
```

可以把流程控制语句放到一个`.awk`脚本文件中，然后调用执行，如`test.sh`的内容如下

```bash
{   
    if ($1 > "r") {  
        print $1   
    } else {  
        print "--"   
    }   
}
```

用如下方式执行，效果一样，注意要使用`-f` ，表示调用脚本文件

```bash
awk -F ':' -f test.sh /etc/passwd
```



## 3、实战

### 1、统计每一个Linux用户的进程占用内存的大小

先用`ps aux` 命令看一下输出的格式：

```bash
[root@VM-8-8-centos logs]# ps -aux
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.0  51620  3860 ?        Ss   Mar24   0:30 /usr
root         2  0.0  0.2      0     0 ?        S    Mar24   0:00 [kthreadd]
root         4  0.0  0.1      0     0 ?        S<   Mar24   0:00 [kworker/0:0H]
mysql     1787  0.0 12.5 1772728 486156 ?      Sl   Mar24   3:53 mysqld
```

可以看到第1列表示用户名称，第4列 `%MEM` 表示内存占用情况比例。

我们可以这样写：

```bash
ps aux | awk 'BEGIN {printf "%-5s %-5s\n","用户名","内存占用比例"} NR!=1 {men[$1]+=$4} END {for(i in men) printf"%-10s %-0.2f\n",i , men[i]}'
```

`NR!=1` 表示去除第一行

`men[$1]+=$4` 表示使用第4列进行累加，akw的数组不需要声明，索引可以是字符串或者数字。

awk数组语法：

```bash
array_name[index]=value
```

- array_name：数组的名称
- index：数组索引
- value：数组中元素所赋予的值

有点像Java的HashMap。

结果：

```bash
[root@VM-8-8-centos logs]#  ps aux | awk 'BEGIN {printf "%-5s %-5s\n","用户名","内存占用比例"} NR!=1 {men[$1]+=$4} END {for(i in men) printf"%-10s %-0.2f\n",i , men[i]}'
用户名   内存占用比例
polkitd    0.30
dbus       0.00
nobody     0.10
libstor+   0.00
mysql      12.50
postfix    0.20
ntp        0.00
root       37.40
```

### 2、统计Nginx的独立IP访问次数

先找到Nginx的访问日志路径：

```bash
[root@VM-8-8-centos ~]# find / -name 'access.log'
/usr/local/nginx/logs/access.log
[root@VM-8-8-centos ~]# cd /usr/local/nginx/logs/
[root@VM-8-8-centos logs]#
```

查看格式，日志较大，可以只看第一行：

```bash
[root@VM-8-8-centos logs]# cat access.log | head -1
120.239.196.104 - - [16/Jan/2021:12:50:25 +0800] "GET / HTTP/1.1" 200 612 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36"
```

可以看到，第一列就是访问的IP。

我们可以这样写：

```bash
cat access.log | awk '{ip[$1]++} END {for(i in ip) printf"%-10s %-10d\n",i , ip[i]} '  |sort -k2nr | head -5 
```

`sort -k2nr`  ： k2 表示第二列，n 表示数字，r 表示降序

`head -5`  ： 只打印前5行

```bash
[root@VM-8-8-centos logs]# cat access.log | awk '{ip[$1]++} END {for(i in ip) printf"%-10s %-10d\n",i , ip[i]} '  |sort -k2nr | head -5
112.91.84.72 44097
183.27.153.54 32215
120.239.196.5 28490
183.27.154.185 25162
183.27.152.2 24786
```

还可以使用uniq命令进行统计：

```bash
cat access.log |awk '{print $1}'|sort|uniq -c |sort -nr |head -5
```

`uniq -c` ：每列旁边显示该行重复出现的次数。

```bash
[root@VM-8-8-centos logs]# cat access.log |awk '{print $1}'|sort|uniq -c |sort -nr |head -5
  44097 12.91.84.72
  32215 2.27.153.54
  28490 3.239.196.5
  25162 4.27.154.185
  24786 183.27.152.2
```



## 总结

akw 适合对列进行操作，而且配合其他的命令一起操作会更高效。

可以看到以上的文本中，akw对文本的格式有要求，以特定的分隔符隔开的文本，akw处理起来会很方便，选用grep、akw、sed 可以根据以下进行区分：

-  grep 更适合单纯的查找或匹配文本
-  sed 更适合编辑匹配到的文本
-  awk 更适合格式化文本，对文本进行较复杂格式处理

