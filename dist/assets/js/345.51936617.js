(window.webpackJsonp=window.webpackJsonp||[]).push([[345],{759:function(s,a,t){"use strict";t.r(a);var n=t(7),e=Object(n.a)({},(function(){var s=this,a=s._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("p",[s._v("上一章提到不允许使用root直接登录服务器，因为这样的权限太大了。")]),s._v(" "),a("p",[s._v("当然如果只有你一个人使用服务器这是无所谓的，但是在团队中是禁止的。")]),s._v(" "),a("p",[s._v("使用服务器的人多了，就需要使用用户管理。")]),s._v(" "),a("h2",{attrs:{id:"_1、用户管理"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1、用户管理"}},[s._v("#")]),s._v(" 1、用户管理")]),s._v(" "),a("p",[s._v("下面是基本的用户管理命令：")]),s._v(" "),a("ol",[a("li",[s._v("查看用户列表："),a("code",[s._v("cat /etc/passwd")])]),s._v(" "),a("li",[s._v("查看组列表："),a("code",[s._v("cat /etc/group")])]),s._v(" "),a("li",[s._v("查看当前登陆用户："),a("code",[s._v("who")])]),s._v(" "),a("li",[s._v("查看用户登陆历史记录："),a("code",[s._v("last")])]),s._v(" "),a("li",[s._v("新增用户："),a("code",[s._v("useradd")])])]),s._v(" "),a("h3",{attrs:{id:"新增用户"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#新增用户"}},[s._v("#")]),s._v(" 新增用户")]),s._v(" "),a("blockquote",[a("p",[s._v("linux系统的用户分为两种类型：root和普通用户")]),s._v(" "),a("p",[s._v("root用户可以对系统做任意操作，普通用户只有部分权限，既是使用sudo的话，也只能扩大一部分权限。")])]),s._v(" "),a("p",[s._v("新增一个 HaC 的用户。")]),s._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("useradd HaC\n")])])]),a("p",[s._v("默认是没有密码的，需要设置密码可以这样做：")]),s._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("passwd  HaC\n")])])]),a("p",[s._v("然后输入密码即可：")]),s._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("[root@VM-8-8-centos ~]# passwd HaC\nChanging password for user HaC.\nNew password:\n")])])]),a("h3",{attrs:{id:"查询用户"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#查询用户"}},[s._v("#")]),s._v(" 查询用户：")]),s._v(" "),a("p",[s._v("查看用户列表：")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("root@VM-8-8-centos ~"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# cat /etc/passwd")]),s._v("\nroot:x:0:0:root:/root:/bin/bash\nbin:x:1:1:bin:/bin:/sbin/nologin\ndaemon:x:2:2:daemon:/sbin:/sbin/nologin\nadm:x:3:4:adm:/var/adm:/sbin/nologin\nlp:x:4:7:lp:/var/spool/lpd:/sbin/nologin\nsync:x:5:0:sync:/sbin:/bin/sync\nshutdown:x:6:0:shutdown:/sbin:/sbin/shutdown\nhalt:x:7:0:halt:/sbin:/sbin/halt\nmail:x:8:12:mail:/var/spool/mail:/sbin/nologin\noperator:x:11:0:operator:/root:/sbin/nologin\ngames:x:12:100:games:/usr/games:/sbin/nologin\nftp:x:14:50:FTP User:/var/ftp:/sbin/nologin\nnobody:x:99:99:Nobody:/:/sbin/nologin\nsystemd-network:x:192:192:systemd Network Management:/:/sbin/nologin\ndbus:x:81:81:System message bus:/:/sbin/nologin\npolkitd:x:999:998:User "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("for")]),s._v(" polkitd:/:/sbin/nologin\nlibstoragemgmt:x:998:997:daemon account "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("for")]),s._v(" libstoragemgmt:/var/run/lsm:/sbin/nologin\nrpc:x:32:32:Rpcbind Daemon:/var/lib/rpcbind:/sbin/nologin\nntp:x:38:38::/etc/ntp:/sbin/nologin\nabrt:x:173:173::/etc/abrt:/sbin/nologin\nsshd:x:74:74:Privilege-separated SSH:/var/empty/sshd:/sbin/nologin\npostfix:x:89:89::/var/spool/postfix:/sbin/nologin\nchrony:x:997:995::/var/lib/chrony:/sbin/nologin\ntcpdump:x:72:72::/:/sbin/nologin\nsyslog:x:996:994::/home/syslog:/bin/false\nlighthouse:x:1000:1000::/home/lighthouse:/bin/bash\ndockerroot:x:995:992:Docker User:/var/lib/docker:/sbin/nologin\nmysql:x:1002:1002::/home/mysql:/bin/bash\nHaC:x:1003:1003::/home/HaC:/bin/bash\n")])])]),a("p",[s._v("7 个字段的详细信息如下。")]),s._v(" "),a("ul",[a("li",[a("strong",[s._v("用户名")]),s._v(" （magesh）： 已创建用户的用户名，字符长度 1 个到 12 个字符。")]),s._v(" "),a("li",[a("strong",[s._v("密码")]),s._v("（x）：代表加密密码保存在 `/etc/shadow 文件中。")]),s._v(" "),a("li",[a("strong",[s._v("用户 ID（506）")]),s._v("：代表用户的 ID 号，每个用户都要有一个唯一的 ID 。UID 号为 0 的是为 root 用户保留的，UID 号 1 到 99 是为系统用户保留的，UID 号 100-999 是为系统账户和群组保留的。")]),s._v(" "),a("li",[a("strong",[s._v("群组 ID （507）")]),s._v("：代表群组的 ID 号，每个群组都要有一个唯一的 GID ，保存在 /etc/group文件中。")]),s._v(" "),a("li",[a("strong",[s._v("用户信息（2g Admin - Magesh M）")]),s._v("：代表描述字段，可以用来描述用户的信息（LCTT 译注：此处原文疑有误）。")]),s._v(" "),a("li",[a("strong",[s._v("家目录（/home/mageshm）")]),s._v("：代表用户的家目录。")]),s._v(" "),a("li",[a("strong",[s._v("Shell（/bin/bash）")]),s._v("：代表用户使用的 shell 类型。")])]),s._v(" "),a("p",[s._v("仅仅显示用户名可以使用 "),a("code",[s._v("compgen -u")])]),s._v(" "),a("p",[s._v("用户切换：")]),s._v(" "),a("p",[a("code",[s._v("su - HaC")]),s._v("  或者 "),a("code",[s._v("su HaC")])]),s._v(" "),a("blockquote",[a("p",[s._v("在 su - 指令中，“-”表示在切换用户时，同时切换掉当前用户的环境")]),s._v(" "),a("p",[s._v("高级用户向低级用户切换不需要密码，反之需要")])]),s._v(" "),a("h3",{attrs:{id:"查询当前登陆用户"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#查询当前登陆用户"}},[s._v("#")]),s._v(" 查询当前登陆用户")]),s._v(" "),a("p",[s._v("多个命令窗口登录则显示多个：")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("root@VM-8-8-centos ~"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# who")]),s._v("\nroot     tty1         "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("2020")]),s._v("-02-25 "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("10")]),s._v(":08\nroot     pts/1        "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("2020")]),s._v("-02-25 "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("10")]),s._v(":13 "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("112.34")]),s._v(".45.12"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\nroot     pts/3        "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("2020")]),s._v("-02-25 "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("11")]),s._v(":40 "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("112.34")]),s._v(".45.12"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])])]),a("h3",{attrs:{id:"删除用户"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#删除用户"}},[s._v("#")]),s._v(" 删除用户")]),s._v(" "),a("p",[s._v("一般需要删除系统默认的不必要的用户和组，避免被别人用来暴力登录：")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 删除的多余用户")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("userdel")]),s._v(" xiaoming\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("userdel")]),s._v(" HaC\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 需要删除的多余用户组")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("groupdel")]),s._v(" admin\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("groupdel")]),s._v(" dev\n")])])]),a("h3",{attrs:{id:"赋予权限"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#赋予权限"}},[s._v("#")]),s._v(" 赋予权限")]),s._v(" "),a("p",[s._v("在Linux 操作系统的 "),a("code",[s._v("/etc")]),s._v(" 目录有一个 "),a("code",[s._v("sudoers")]),s._v(" 文件，在这个文件中我们可以配置让某些用户可以拥有 "),a("code",[s._v("sudo")]),s._v(" 权限，也可以配置该用户可以 以哪个用户、用户组的身份来执行命令")]),s._v(" "),a("blockquote",[a("p",[s._v("sudo权限是受/etc/sudoers文件控制的")])]),s._v(" "),a("p",[s._v("（1）首先我们要给 "),a("code",[s._v("/etc/sudoers")]),s._v(" 文件加写权限，默认是400权限。")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("chmod")]),s._v(" u+w /etc/sudoers\n")])])]),a("p",[s._v("（2）配置 "),a("code",[s._v("sudo")]),s._v(" 权限")]),s._v(" "),a("p",[s._v("在 "),a("code",[s._v("sudoers")]),s._v(" 文件中你可以这样配置（youuser表示你要配置的用户名）：")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("vi")]),s._v(" /etc/sudoers\n")])])]),a("p",[a("strong",[s._v("vi模式")]),s._v("下输入"),a("code",[s._v(":set nu")]),s._v(" 可以显示行号，跳到 100 行这里，可以看到这有几个参数：")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("root    "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("ALL")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("ALL"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("       ALL\n%dev    "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("ALL")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("ALL"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("       NOPASSWD: ALL\n")])])]),a("ul",[a("li",[s._v("字段 1")])]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("不以%号开头的表示"),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"将要授权的用户"')]),s._v(" 如：root\n\n以%号开头的表示"),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"将要授权的组"')]),s._v(" 如：%dev\n")])])]),a("ul",[a("li",[s._v("字段 2 ，第一个ALL")])]),s._v(" "),a("p",[s._v("多个系统之间部署 sudo 环境时，该ALL代表所有主机。也可以换成相应的主机名，表示改规则只适用主机名对应的系统。")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("如:\nHaC "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("mycomputer")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("/usr/sbin/reboot,/usr/sbin/shutdown\n表示: 普通用户HaC在主机mycomputer上, 只可以通过sudo执行reboot和shutdown两个命令\n")])])]),a("ul",[a("li",[s._v("字段 3  ，第二个ALL")])]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("如果省略, 相当于"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("root:root"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("，表示可以通过sudo提权到root"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v(" 如果为"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("ALL"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("或者"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("ALL:ALL"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(", 表示能够提权到"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("任意用户:任意用户组"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("。\n注意：如果没省略,必须使用"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("双括号包含起来\n")])])]),a("ul",[a("li",[s._v("字段 4")])]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("可能取值是NOPASSWD:。请注意NOPASSWD后面带有冒号: 。表示执行sudo时可以不需要输入密码\neg:HaC "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("ALL")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("ALL"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" NOPASSWD: /bin/useradd\n表示: 普通用户HaC可以在任何主机上, 通过sudo执行/bin/useradd命令, 并且不需要输入密码\n")])])]),a("ul",[a("li",[s._v("字段 5，第三个ALL")])]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("逗号分开一系列命令或者ALL表示允许所有操作\n注意：命令必须使用绝对路径\n命令的绝对路径可通过which指令查看到\n我们也可以通过在命令前面加 "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"!"')]),s._v(" 的方式"),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"拒绝"')]),s._v("用户执行该命令。\n")])])]),a("p",[s._v("举个例子：")]),s._v(" "),a("h4",{attrs:{id:"禁止用户hac使用-rm-命令权限"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#禁止用户hac使用-rm-命令权限"}},[s._v("#")]),s._v(" 禁止用户HaC使用 rm 命令权限")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("HaC  "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("ALL")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("ALL"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("       ALL,"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!")]),s._v("/usr/bin/rm\n")])])]),a("p",[s._v("切换用户：")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("root@VM-8-8-centos ~"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# su - HaC")]),s._v("\nLast login: Thu Feb "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("25")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("15")]),s._v(":40:29 CST "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("2021")]),s._v(" on pts/3\nsu: warning: cannot change directory to /home/HaC: Permission denied\n-bash: /home/HaC/.bash_profile: Permission denied\n")])])]),a("p",[s._v("这里显示用户HaC没有权限，切换root用户赋予权限：")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("chown")]),s._v(" -R HaC /home/HaC/\n")])])]),a("p",[s._v("将 rm 命令的权限改为 700")]),s._v(" "),a("blockquote",[a("p",[s._v("-rwx------ (700) 只有所有者才有读，写，执行的权限")])]),s._v(" "),a("p",[s._v("再切换到 HaC 用户，新建一个文件，删除是没有权限的：")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("HaC@VM-8-8-centos ~"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("touch")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("HaC@VM-8-8-centos ~"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("rm")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("\n-bash: /bin/rm: Permission denied\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("HaC@VM-8-8-centos ~"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("rm")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("sudo"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" password "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("for")]),s._v(" HaC:\nSorry, user HaC is not allowed to execute "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'/bin/rm 1'")]),s._v(" as root on VM-8-8-centos.\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("HaC@VM-8-8-centos ~"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("$\n")])])])])}),[],!1,null,null,null);a.default=e.exports}}]);