---
title: Linux之用户管理
date: 2022-07-14 16:09:55
lock: false
permalink: /pages/Linux%E4%B9%8B%E7%94%A8%E6%88%B7%E7%AE%A1%E7%90%86
categories:
  - PureJavaCoderRoad
  - Linux
tags:
  - Linux
  - 之用户管理
---
上一章提到不允许使用root直接登录服务器，因为这样的权限太大了。

当然如果只有你一个人使用服务器这是无所谓的，但是在团队中是禁止的。

使用服务器的人多了，就需要使用用户管理。

## 1、用户管理

下面是基本的用户管理命令：

1. 查看用户列表：`cat /etc/passwd`
2. 查看组列表：`cat /etc/group`
3. 查看当前登陆用户：`who`
4. 查看用户登陆历史记录：`last`
5. 新增用户：`useradd`



### 新增用户

> linux系统的用户分为两种类型：root和普通用户
>
> root用户可以对系统做任意操作，普通用户只有部分权限，既是使用sudo的话，也只能扩大一部分权限。

新增一个 HaC 的用户。

```
useradd HaC
```

默认是没有密码的，需要设置密码可以这样做：

```
passwd  HaC
```

然后输入密码即可：

```
[root@VM-8-8-centos ~]# passwd HaC
Changing password for user HaC.
New password:
```



### 查询用户：

查看用户列表：

```bash
[root@VM-8-8-centos ~]# cat /etc/passwd
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
operator:x:11:0:operator:/root:/sbin/nologin
games:x:12:100:games:/usr/games:/sbin/nologin
ftp:x:14:50:FTP User:/var/ftp:/sbin/nologin
nobody:x:99:99:Nobody:/:/sbin/nologin
systemd-network:x:192:192:systemd Network Management:/:/sbin/nologin
dbus:x:81:81:System message bus:/:/sbin/nologin
polkitd:x:999:998:User for polkitd:/:/sbin/nologin
libstoragemgmt:x:998:997:daemon account for libstoragemgmt:/var/run/lsm:/sbin/nologin
rpc:x:32:32:Rpcbind Daemon:/var/lib/rpcbind:/sbin/nologin
ntp:x:38:38::/etc/ntp:/sbin/nologin
abrt:x:173:173::/etc/abrt:/sbin/nologin
sshd:x:74:74:Privilege-separated SSH:/var/empty/sshd:/sbin/nologin
postfix:x:89:89::/var/spool/postfix:/sbin/nologin
chrony:x:997:995::/var/lib/chrony:/sbin/nologin
tcpdump:x:72:72::/:/sbin/nologin
syslog:x:996:994::/home/syslog:/bin/false
lighthouse:x:1000:1000::/home/lighthouse:/bin/bash
dockerroot:x:995:992:Docker User:/var/lib/docker:/sbin/nologin
mysql:x:1002:1002::/home/mysql:/bin/bash
HaC:x:1003:1003::/home/HaC:/bin/bash
```

7 个字段的详细信息如下。

- **用户名** （magesh）： 已创建用户的用户名，字符长度 1 个到 12 个字符。
- **密码**（x）：代表加密密码保存在 `/etc/shadow 文件中。
- **用户 ID（506）**：代表用户的 ID 号，每个用户都要有一个唯一的 ID 。UID 号为 0 的是为 root 用户保留的，UID 号 1 到 99 是为系统用户保留的，UID 号 100-999 是为系统账户和群组保留的。
- **群组 ID （507）**：代表群组的 ID 号，每个群组都要有一个唯一的 GID ，保存在 /etc/group文件中。
- **用户信息（2g Admin - Magesh M）**：代表描述字段，可以用来描述用户的信息（LCTT 译注：此处原文疑有误）。
- **家目录（/home/mageshm）**：代表用户的家目录。
- **Shell（/bin/bash）**：代表用户使用的 shell 类型。

仅仅显示用户名可以使用 `compgen -u`



用户切换：

`su - HaC`  或者 `su HaC`

> 在 su - 指令中，“-”表示在切换用户时，同时切换掉当前用户的环境
>
> 高级用户向低级用户切换不需要密码，反之需要



### 查询当前登陆用户

多个命令窗口登录则显示多个：

```bash
[root@VM-8-8-centos ~]# who
root     tty1         2020-02-25 10:08
root     pts/1        2020-02-25 10:13 (112.34.45.12)
root     pts/3        2020-02-25 11:40 (112.34.45.12)
```



### 删除用户

一般需要删除系统默认的不必要的用户和组，避免被别人用来暴力登录：

```bash
# 删除的多余用户
userdel xiaoming
userdel HaC

# 需要删除的多余用户组
groupdel admin
groupdel dev
```



### 赋予权限

在Linux 操作系统的 `/etc` 目录有一个 `sudoers` 文件，在这个文件中我们可以配置让某些用户可以拥有 `sudo` 权限，也可以配置该用户可以 以哪个用户、用户组的身份来执行命令

> sudo权限是受/etc/sudoers文件控制的

（1）首先我们要给 `/etc/sudoers` 文件加写权限，默认是400权限。

```bash
chmod u+w /etc/sudoers
```

（2）配置 `sudo` 权限

在 `sudoers` 文件中你可以这样配置（youuser表示你要配置的用户名）：

```bash
 vi /etc/sudoers
```

**vi模式**下输入`:set nu` 可以显示行号，跳到 100 行这里，可以看到这有几个参数：

```bash
root    ALL=(ALL)       ALL
%dev    ALL=(ALL)       NOPASSWD: ALL
```



- 字段 1 

```bash
不以%号开头的表示"将要授权的用户" 如：root

以%号开头的表示"将要授权的组" 如：%dev
```

- 字段 2 ，第一个ALL

多个系统之间部署 sudo 环境时，该ALL代表所有主机。也可以换成相应的主机名，表示改规则只适用主机名对应的系统。

```bash
如:
HaC mycomputer=/usr/sbin/reboot,/usr/sbin/shutdown
表示: 普通用户HaC在主机mycomputer上, 只可以通过sudo执行reboot和shutdown两个命令
```

- 字段 3  ，第二个ALL

```bash
如果省略, 相当于(root:root)，表示可以通过sudo提权到root; 如果为(ALL)或者(ALL:ALL), 表示能够提权到(任意用户:任意用户组)。
注意：如果没省略,必须使用( )双括号包含起来
```

- 字段 4

```bash
可能取值是NOPASSWD:。请注意NOPASSWD后面带有冒号: 。表示执行sudo时可以不需要输入密码
eg:HaC ALL=(ALL) NOPASSWD: /bin/useradd
表示: 普通用户HaC可以在任何主机上, 通过sudo执行/bin/useradd命令, 并且不需要输入密码
```

- 字段 5，第三个ALL

```bash
逗号分开一系列命令或者ALL表示允许所有操作
注意：命令必须使用绝对路径
命令的绝对路径可通过which指令查看到
我们也可以通过在命令前面加 "!" 的方式"拒绝"用户执行该命令。
```

举个例子：

#### 禁止用户HaC使用 rm 命令权限

```shell
HaC  ALL=(ALL)       ALL,!/usr/bin/rm
```



切换用户：

```shell
[root@VM-8-8-centos ~]# su - HaC
Last login: Thu Feb 25 15:40:29 CST 2021 on pts/3
su: warning: cannot change directory to /home/HaC: Permission denied
-bash: /home/HaC/.bash_profile: Permission denied
```

这里显示用户HaC没有权限，切换root用户赋予权限：

```bash
chown -R HaC /home/HaC/
```

将 rm 命令的权限改为 700

> -rwx------ (700) 只有所有者才有读，写，执行的权限

再切换到 HaC 用户，新建一个文件，删除是没有权限的：

```shell
[HaC@VM-8-8-centos ~]$ touch 1
[HaC@VM-8-8-centos ~]$ rm 1
-bash: /bin/rm: Permission denied
[HaC@VM-8-8-centos ~]$ sudo rm 1
[sudo] password for HaC:
Sorry, user HaC is not allowed to execute '/bin/rm 1' as root on VM-8-8-centos.
[HaC@VM-8-8-centos ~]$
```

