(window.webpackJsonp=window.webpackJsonp||[]).push([[309],{707:function(s,a,t){"use strict";t.r(a);var e=t(7),r=Object(e.a)({},(function(){var s=this,a=s._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("p",[s._v("上一篇文章介绍了使用秘钥对登录服务器的好处。")]),s._v(" "),a("blockquote",[a("p",[s._v("本文使用服务器为Centos 7.6")])]),s._v(" "),a("p",[s._v("除了使用密钥对之外，只能确保我们的服务器是安全的，但是并不能确保我们的应用是安全的。")]),s._v(" "),a("p",[s._v("为什么这么说？")]),s._v(" "),a("p",[s._v("以MySQL来说，我们希望在我的电脑可以连接我服务器的MySQL服务，那必然需要我的服务器开放3306端口，那么这个端口是暴露在公网的，如果你的密码简单，很容易就会被攻击。")]),s._v(" "),a("p",[a("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20201230163645601.png",alt:""}})]),s._v(" "),a("p",[s._v("类似的还有Redis 6389这些端口。")]),s._v(" "),a("p",[a("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20201230163743564.png",alt:""}})]),s._v(" "),a("p",[s._v("如果要使服务安全，最好的方法就是不暴露公网的端口，只允许本地的服务访问。那这样也不现实，业务上还需要连接数据库查询。")]),s._v(" "),a("p",[s._v("还有就是服务器的权限问题，root用户权限过大，密码过于简单。")]),s._v(" "),a("p",[s._v("可以查看一下本地的"),a("code",[s._v("/var/log/secure")]),s._v(" 文件，记录了外界尝试登录你服务器的IP、用户名、端口：")]),s._v(" "),a("p",[a("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20201230175732994.png",alt:"暴力破解"}})]),s._v(" "),a("p",[s._v("如果你的密码过于简单，服务器就很容易被黑了。")]),s._v(" "),a("p",[s._v("以下介绍几种方法让你的服务更安全。")]),s._v(" "),a("h2",{attrs:{id:"一、后台配置安全组规则"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#一、后台配置安全组规则"}},[s._v("#")]),s._v(" 一、后台配置安全组规则")]),s._v(" "),a("p",[s._v("安全组规则是云厂商提供的访问规则。")]),s._v(" "),a("p",[a("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20201229093901377.png",alt:""}})]),s._v(" "),a("p",[s._v("安全组可以设置允许登录服务器的IP和端口，还有暴露到公网的允许端口。")]),s._v(" "),a("p",[s._v("安全组一共有两个：")]),s._v(" "),a("ul",[a("li",[s._v("入站规则")])]),s._v(" "),a("p",[s._v("表示登入服务器的允许，如果我常用的IP是 "),a("code",[s._v("192.168.0.12")]),s._v("，协议端口为 "),a("code",[s._v("22")]),s._v("，那么我设置了这个入站规则，就只能允许这个IP和端口登录服务器。")]),s._v(" "),a("p",[s._v("如果你要搭建了一个网站，就需要放通 Web 服务 HTTP 或 HTTPS 访问，即 80 和 443 端口，否则外部就不能访问。")]),s._v(" "),a("p",[s._v("可以设置多个允许登录的IP，支持IP段：")]),s._v(" "),a("p",[a("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20201229094410276.png",alt:""}})]),s._v(" "),a("ul",[a("li",[s._v("出站规则")])]),s._v(" "),a("p",[s._v("表示服务器不可以访问外部特定的 IP 地址。")]),s._v(" "),a("p",[s._v("这种场景一般比较少。")]),s._v(" "),a("p",[a("strong",[s._v("安全组是一种虚拟防火墙。")])]),s._v(" "),a("p",[a("strong",[s._v("如果打开了防火墙，又打开了安全组，如果防火墙未放开端口，安全组放开了，这种情况下端口也是无法访问的。")])]),s._v(" "),a("h2",{attrs:{id:"二、防火墙"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#二、防火墙"}},[s._v("#")]),s._v(" 二、防火墙")]),s._v(" "),a("h3",{attrs:{id:"_1、firewall"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1、firewall"}},[s._v("#")]),s._v(" 1、firewall")]),s._v(" "),a("p",[s._v("你在服务商后台配置了安全组，其最终也是修改了防火墙。")]),s._v(" "),a("p",[s._v("但并不是所有的云厂商提供的服务器都有安全组的概念，如果没有，就需要我们自行配置服务器的防火墙了。")]),s._v(" "),a("h4",{attrs:{id:"_1、防火墙状态"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1、防火墙状态"}},[s._v("#")]),s._v(" 1、防火墙状态")]),s._v(" "),a("p",[s._v("两种方法查看防火墙状态：（显示 running 表示已开启）")]),s._v(" "),a("div",{staticClass:"language-java extra-class"},[a("pre",{pre:!0,attrs:{class:"language-java"}},[a("code",[s._v("systemctl status firewalld\nfirewall"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("cmd "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("--")]),s._v("state\n")])])]),a("p",[s._v("以下表示防火墙开启：")]),s._v(" "),a("p",[a("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20201229110105944.png",alt:""}})]),s._v(" "),a("p",[s._v("如果显示 "),a("code",[s._v("-bash: firewall: command not found")]),s._v(" 表示防火墙没有安装。")]),s._v(" "),a("p",[s._v("需要手动安装：")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("yum "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" firewalld systemd -y\n")])])]),a("p",[s._v("启动：")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("systemctl start firewalld.service\n")])])]),a("p",[s._v("关闭：")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("systemctl stop firewalld.service \n")])])]),a("p",[s._v("重启：")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("systemctl reload firewalld.service\n")])])]),a("p",[s._v("查看指定防火墙端口是否开放：")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("firewall-cmd --query-port"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("8080")]),s._v("/tcp\n")])])]),a("p",[s._v("提示 yes 或者 no")]),s._v(" "),a("p",[s._v("查询所有打开的端口：")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("firewall-cmd --zone"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("dmz --list-ports\n")])])]),a("p",[s._v("开放防火墙端口：")]),s._v(" "),a("p",[s._v('firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="192.168.1.0/24" port protocol="tcp" port="6666" accept"')]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("firewall-cmd --zone"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("public --add-port"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("8080")]),s._v("/tcp --permanent \n")])])]),a("p",[a("code",[s._v("--permanent")]),s._v("  表示永久生效，如果没有加表示防火墙重启失效。")]),s._v(" "),a("p",[s._v("关闭/移除服务器端口：")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("firewall-cmd --remove-port"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("8080")]),s._v("/tcp --permanent\n")])])]),a("blockquote",[a("p",[s._v("在RHEL7里有几种防火墙共存：firewalld、iptables、ebtables，默认是使用firewalld来管理netfilter子系统，不过底层调用的命令仍然是iptables等。")])]),s._v(" "),a("h3",{attrs:{id:"_2、iptables"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2、iptables"}},[s._v("#")]),s._v(" 2、iptables")]),s._v(" "),a("p",[s._v("firewalld跟iptables比起来至少有两大好处：")]),s._v(" "),a("p",[s._v("1、firewalld可以动态修改单条规则，而不需要像iptables那样，在修改了规则后必须得全部刷新才可以生效；")]),s._v(" "),a("p",[s._v("2、firewalld在使用上要比iptables人性化很多，即使不明白“五张表五条链”而且对TCP/IP协议也不理解也可以实现大部分功能。")]),s._v(" "),a("p",[s._v("firewalld跟iptables比起来，不好的地方是每个服务都需要去设置才能放行，因为默认是拒绝。而iptables里默认是每个服务是允许，需要拒绝的才去限制。")]),s._v(" "),a("p",[s._v("firewalld自身并不具备防火墙的功能，而是和iptables一样需要通过内核的netfilter来实现，也就是说firewalld和 iptables一样，他们的作用都是用于维护规则，而真正使用规则干活的是内核的netfilter，只不过firewalld和iptables的结构以及使用方法不一样罢了。")]),s._v(" "),a("blockquote",[a("p",[s._v("转自  —— https://www.cnblogs.com/grimm/p/10345693.html")])]),s._v(" "),a("p",[a("strong",[s._v("如果你本地开启了防火墙，未开放80端口，而在云厂商后台开放了该端口，这种情况也是不能访问80端口的。")])]),s._v(" "),a("p",[s._v("现在Centos7默认使用的是"),a("code",[s._v("firewall")]),s._v("作为防火墙，而不是"),a("code",[s._v("iptables")]),s._v("，如果要使用"),a("code",[s._v("iptables")]),s._v("，先把"),a("code",[s._v("firewall")]),s._v("停用，再安装"),a("code",[s._v("iptables")]),s._v("即可。")]),s._v(" "),a("p",[s._v("查看本地是否存在"),a("code",[s._v("iptables")]),s._v("：")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("vi")]),s._v(" /etc/sysconfig/iptables\n")])])]),a("p",[s._v("查看发现是个空文件，表示还没有安装。")]),s._v(" "),a("p",[a("code",[s._v("iptables")]),s._v(" 安装：")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("yum "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" iptables-services\n")])])]),a("p",[s._v("执行：")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("service")]),s._v(" iptables save\n")])])]),a("p",[a("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20201230181439848.png",alt:""}})]),s._v(" "),a("p",[s._v("再查看一下"),a("code",[s._v("/etc/sysconfig/iptables")]),s._v(" 文件")]),s._v(" "),a("p",[a("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20201230181138394.png",alt:""}})]),s._v(" "),a("p",[s._v("可以看到文件存在了，而且默认只开放了22端口。")]),s._v(" "),a("p",[s._v("查看"),a("code",[s._v("iptables")]),s._v("状态：")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("service")]),s._v(" iptables status\n")])])]),a("p",[s._v("绿色的"),a("strong",[s._v("active")]),s._v("表示 "),a("strong",[s._v("iptables")]),s._v(" 是已经运行：")]),s._v(" "),a("p",[a("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20201231093755145.png",alt:""}})]),s._v(" "),a("p",[s._v("启动/停止/重启 "),a("code",[s._v("iptables")]),s._v("：")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("service")]),s._v(" iptables start/stop/restart\n")])])]),a("blockquote",[a("p",[s._v("如果执行命令的时候提示：")]),s._v(" "),a("p",[s._v("Redirecting to /bin/systemctl status firewalld.service")]),s._v(" "),a("p",[s._v("The service command supports only basic LSB actions (start, stop, restart, try-restart, reload, force-reload, status). For other actions, please try to use systemctl.")]),s._v(" "),a("p",[s._v("因为centos7 大部分命令都需要 systemctl ，而不是 service，例如 "),a("code",[s._v("service firewalld status")]),s._v(" 改成 "),a("code",[s._v("systemctl status firewalld")]),s._v(" 即可")])]),s._v(" "),a("h2",{attrs:{id:"三、修改sshd-config"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#三、修改sshd-config"}},[s._v("#")]),s._v(" 三、修改sshd_config")]),s._v(" "),a("p",[s._v("ssh是linux远程登录的安全协议，是 C/S 模式的架构，配置文件分为服务器端配置文件 "),a("code",[s._v("[/etc/ssh/sshd_config]")]),s._v(" 与 用户配置文件"),a("code",[s._v("[~/.ssh/config]")])]),s._v(" "),a("blockquote",[a("p",[s._v("上一章节使用SSH密钥对就是通过修改"),a("code",[s._v("~/.ssh/config")])])]),s._v(" "),a("p",[a("code",[s._v("sshd_config")]),s._v(" 是服务端主配置文件，定义了一系列的安全访问规则。")]),s._v(" "),a("p",[s._v("打开 "),a("code",[s._v("/etc/ssh/sshd_config")])]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("vi")]),s._v(" /etc/ssh/sshd_config\n")])])]),a("h3",{attrs:{id:"_1、修改端口、协议"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1、修改端口、协议"}},[s._v("#")]),s._v(" 1、修改端口、协议")]),s._v(" "),a("p",[s._v("默认的SSH端口是22，入侵者常用22端口暴力撞库。")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#更改SSH端口，最好改为五位数以上，攻击者扫描到端口的机率也会下降。 ")]),s._v("\nPort "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("10000")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#禁用版本1协议, 因为其设计缺陷, 很容易使密码被黑掉。")]),s._v("\nProtocol "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("2")]),s._v("\n")])])]),a("h3",{attrs:{id:"_2、设置特定-用户、ip-登录"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2、设置特定-用户、ip-登录"}},[s._v("#")]),s._v(" 2、设置特定 用户、IP 登录")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("允许特定ip、用户登录\nAllowUsers    aliyun test@192.168.1.1,root@192.168.*\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 拒绝 zhangsan、aliyun 帐户通过 SSH 登录系统")]),s._v("\nDenyUsers    zhangsan aliyun    "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#Linux系统账户        ")]),s._v("\n")])])]),a("blockquote",[a("p",[s._v("如果没有开启防火墙，强烈推荐这种方法，以免被第三方暴力破解")])]),s._v(" "),a("h3",{attrs:{id:"_3、禁止root用户登录"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3、禁止root用户登录"}},[s._v("#")]),s._v(" 3、禁止root用户登录")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#尝试任何情况先都不允许 Root 登录. 生效后我们就不能直接以root的方式登录了，我们需要用一个普通的帐号来登录，然后用su来切换到root帐号")]),s._v("\nPermitRootLogin no\n")])])]),a("h3",{attrs:{id:"_4、禁用空密码登录"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_4、禁用空密码登录"}},[s._v("#")]),s._v(" 4、禁用空密码登录")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#禁止空密码登陆")]),s._v("\nPermitEmptyPasswords no\n")])])]),a("p",[s._v("修改完sshd文件，最后记得重启sshd服务")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("service")]),s._v(" sshd restart\n")])])]),a("hr"),s._v(" "),a("p",[s._v("以上就是一些简单的安全设置方法。")]),s._v(" "),a("p",[s._v("最后的效果就是自从我设置后，服务器超过1年也没被侵入过。")])])}),[],!1,null,null,null);a.default=r.exports}}]);