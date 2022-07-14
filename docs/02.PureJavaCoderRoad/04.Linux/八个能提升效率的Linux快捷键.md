---
title: 八个能提升效率的Linux快捷键
date: 2022-05-26 17:04:01
permalink: /pages/%E5%85%AB%E4%B8%AA%E8%83%BD%E6%8F%90%E5%8D%87%E6%95%88%E7%8E%87%E7%9A%84Linux%E5%BF%AB%E6%8D%B7%E9%94%AE
lock: false
categories: 
  - PureJavaCoderRoad
  - Linux
tags: 
  - Linux
  - 快捷键
---
 Linux命令相信大家都会，特别是一些基础的命令，比如ls、cd、cat、vi 等等。

在和Linux打交道久了之后，你会发现来来去去都是那几个常用的命令。

 命令虽然用的熟练，但是还不够，Linux还提供了一些快捷键，可以快速提升操作Linux的效率。



## 1、tap

文件、路径 补全。

tab键是比较常用的一个快捷键，它的作用是**补全文件名或者路径**。

只需要输入一个命令，文件名，目录名甚至是命令选项的开头，并敲击 `tab` 键。 它将自动完成你输入的内容，或为你显示全部可能的结果。

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210315111106323.png)

## 2、Ctrl+l 

清屏。

在不知道这个快捷键的时候之前，我猜大家都是使用`clear` 命令清屏的。

现在你可以使用 `Ctrl+L` 清空终端，代替输入 `clear`

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210315111019370.png)

## 3、Ctrl + C 

终止进程。

为了在终端上中断命令或进程该按的键。它将立刻终止运行的程序。

比如说你在安装、编译 、运行 某个程序，只要你使用`Ctrl + C`，都会立即结束你的程序。

## 4、Ctrl+Z

 将正在运行的程序放到后台执行。

 `Ctrl + C`  会结束进程，如果你不想一直等待进程执行完毕，可以使用`Ctrl+Z`，它会把进程送到后台执行。



## 5、Ctrl+A / Ctrl+E

移动光标到所在行首/尾。

假设你在终端输入了一个很长的命令或路径，如：
```bash
[root@VM-8-8-centos ~]#  netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}'
```

但你想要回到它的 **开头或者结尾**， 使用方向键移动光标将花费大量时间，此时 `Ctrl+A`、 `Ctrl+E` 将很方便。 
> 注意：Linux终端不支持使用鼠标移动光标到行首。



## 6、擦除

有时候在终端输入了错误的命令，又不想整条命令删除，或者只想删除一部分命令的时候，擦除就很方便了。

### Ctrl + U

擦除从当前光标位置到**行首**的全部内容。

### Ctrl + K

擦除从当前光标位置到**行尾**的全部内容。

### Ctrl + W

擦除从光标位置到**词首**的全部字母。

> 简单的说就是擦除一个单词。Linux以空格判断一个单词。

### Ctrl + Y

粘贴 使用 `Ctrl+W`、`Ctrl+U` 和 `Ctrl+K` 快捷键擦除的文本。

 ![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/Home/Linux20210323.gif)

## 7、历史命令

###  Ctrl + P、方向键上

历史命令上翻。

### Ctrl + N、方向键下

历史命令下翻。

### Ctrl + R

查找历史命令。

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/Home/Linux20210323-1.gif)

## 8、复制、粘贴

Linux不使`用Ctrl+c`、`Ctrl+v` 复制、粘贴，Linux使用的是：

复制：`ctrl+insert`

粘贴：`shift+insert`

目前大部分终端工具都是选中就自动复制，鼠标右击就自动粘贴，像MobaXterm、SecurityCRT 是支持的。

---

![](https://cdn.jsdelivr.net/gh/DogerRain/image@main/img/image-20210323172610829.png)

目前我用的是MobaXterm，MobaXterm是支持选中自动复制，右键自动粘贴。

安利一波：[一款好用的终端工具—MobaXterm](https://mp.weixin.qq.com/s/Z3cYlTLLN4cO-FzoTL0pSw)

