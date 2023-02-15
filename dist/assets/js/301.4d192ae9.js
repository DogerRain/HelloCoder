(window.webpackJsonp=window.webpackJsonp||[]).push([[301],{699:function(t,e,r){"use strict";r.r(e);var _=r(7),n=Object(_.a)({},(function(){var t=this,e=t._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("p",[t._v("我们每天都在访问不同的网站，比如百度，那我们在浏览器输入 "),e("code",[t._v("www.baidu.com")]),t._v(" 背后发生了什么，百度又是如何提供服务的呢。")]),t._v(" "),e("p",[t._v("首先我们要明白内网IP和公网IP的区别。")]),t._v(" "),e("h3",{attrs:{id:"_1、公网ip和内网ip"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1、公网ip和内网ip"}},[t._v("#")]),t._v(" 1、公网IP和内网IP")]),t._v(" "),e("p",[e("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20201007133451598.png",alt:""}})]),t._v(" "),e("p",[t._v("如图，假如我在某学校访问百度，正在使用着校园网，首先校园网的路由器会把我们的内网IP转换成外网的IP，如何进行寻址、网关转发，最后找到百度的服务器公网IP，然后我的个人PC就和百度的服务器建立了链接，这样就可以互相通信了。")]),t._v(" "),e("p",[t._v("整个网络的服务建立是很复杂的，涉及譬如IP封装、ARP寻址、三次握手、防火墙等等。这些就留给你们慢慢研究了。")]),t._v(" "),e("p",[t._v("我们只需要明白，"),e("strong",[t._v("公网IP具有世界范围的唯一性")]),t._v("，而域名 baidu.com 的 公网IP 解析 为 "),e("code",[t._v("39.156.69.79")]),t._v(" ，所以 我们访问百度的时候，就是向IP为 "),e("code",[t._v("39.156.69.79")]),t._v("的服务器建立连接。")]),t._v(" "),e("p",[t._v("所以，只需要拥有一个公网IP，你就可以建立自己的服务器；虽然个人也可以申请公网IP，但是这个比较复杂而且没有商用服务器方便，一般我们都是选择商用的服务器。比如腾讯云、百度云、阿里云、华为云等等。")]),t._v(" "),e("h3",{attrs:{id:"_2、选择云服务商"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2、选择云服务商"}},[t._v("#")]),t._v(" 2、选择云服务商")]),t._v(" "),e("p",[t._v("以"),e("strong",[t._v("腾讯云")]),t._v("为例，登录 腾讯云 ，"),e("code",[t._v("https://cloud.tencent.com")]),t._v("，如果你是学生的话，可以使用学生身份购买 学生云主机。")]),t._v(" "),e("p",[t._v("学生云主机优惠的链接是这个："),e("a",{attrs:{href:"https://cloud.tencent.com/act/campus?from=12631",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://cloud.tencent.com/act/campus"),e("OutboundLink")],1)]),t._v(" "),e("p",[t._v("这里我选择购买 "),e("strong",[t._v("轻量应用服务器 Lighthouse")]),t._v("，地址这个："),e("a",{attrs:{href:"https://curl.qcloud.com/Jot5xuYU",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://curl.qcloud.com"),e("OutboundLink")],1)]),t._v(" "),e("blockquote",[e("p",[t._v("不同的云厂商都有不同类型的服务器，如果你是学生，建议你买最便宜的1核1G就够了。")])]),t._v(" "),e("p",[t._v("我选择的是 1核 2G 5M ，系统镜像选择 Centos7.6 ，购买完毕，然后进入控制台。")]),t._v(" "),e("p",[e("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20201007142842358.png",alt:""}})]),t._v(" "),e("p",[t._v("付款就可以了，新用户一般第一个月是10块钱，有一些还有1块钱的，可以白嫖不同云厂商：")]),t._v(" "),e("p",[e("strong",[t._v("以下是答主我从学生时代薅过最便宜的云服务器，建议大家有学生身份或者新用户身份的都去试试。")])]),t._v(" "),e("table",[e("thead",[e("tr",[e("th",[t._v("云厂商")]),t._v(" "),e("th",[t._v("学生优惠")]),t._v(" "),e("th",[t._v("新人优惠")])])]),t._v(" "),e("tbody",[e("tr",[e("td",[t._v("腾讯云")]),t._v(" "),e("td",[e("a",{attrs:{href:"https://cloud.tencent.com/act/cps/redirect?redirect=10004&cps_key=664b44b4e8e43b579d07036bf1c71060",target:"_blank",rel:"noopener noreferrer"}},[t._v("学生特惠，1核2G5M宽带，仅需9元/1个月"),e("OutboundLink")],1)]),t._v(" "),e("td",[e("a",{attrs:{href:"https://cloud.tencent.com/act/cps/redirect?redirect=1063&cps_key=664b44b4e8e43b579d07036bf1c71060&from=console",target:"_blank",rel:"noopener noreferrer"}},[t._v("星星海SA2云服务器，1核2G首年99元"),e("OutboundLink")],1),t._v("（我目前用的，已失效2022年3月29日 11:46:33）")])]),t._v(" "),e("tr",[e("td"),t._v(" "),e("td"),t._v(" "),e("td",[e("a",{attrs:{href:"https://cloud.tencent.com/act/cps/redirect?redirect=1040&cps_key=664b44b4e8e43b579d07036bf1c71060&from=console",target:"_blank",rel:"noopener noreferrer"}},[t._v("新客户无门槛代金券，价值高达2860元代金券"),e("OutboundLink")],1)])]),t._v(" "),e("tr",[e("td"),t._v(" "),e("td"),t._v(" "),e("td",[e("a",{attrs:{href:"https://cloud.tencent.com/act/cps/redirect?redirect=1062&cps_key=664b44b4e8e43b579d07036bf1c71060&from=console",target:"_blank",rel:"noopener noreferrer"}},[t._v("云产品限时秒杀，爆款1核2G云服务器，首年99元"),e("OutboundLink")],1)])]),t._v(" "),e("tr",[e("td",[t._v("阿里云")]),t._v(" "),e("td"),t._v(" "),e("td",[e("a",{attrs:{href:"https://www.aliyun.com/minisite/goods?userCode=4lol8et7",target:"_blank",rel:"noopener noreferrer"}},[t._v("精选云服务器1核2G 新人仅需87元/年"),e("OutboundLink")],1)])]),t._v(" "),e("tr",[e("td",[t._v("百度云")]),t._v(" "),e("td",[e("a",{attrs:{href:"https://cloud.baidu.com/campaign/campus-2018/index.html?unifrom=eventpage",target:"_blank",rel:"noopener noreferrer"}},[t._v("1核2G 学生身份 9 元/1个月"),e("OutboundLink")],1)]),t._v(" "),e("td")]),t._v(" "),e("tr",[e("td",[t._v("华为云")]),t._v(" "),e("td"),t._v(" "),e("td",[e("a",{attrs:{href:"https://activity.huaweicloud.com/cps/recommendstore.html?fromacct=0740541e-dec2-47db-99e9-b5bb524ccbf7&utm_source=aGlkX2txbGYyNDR0ZXlxc2ZwZg===&utm_medium=cps&utm_campaign=201905",target:"_blank",rel:"noopener noreferrer"}},[t._v("精选云服务器2折起"),e("OutboundLink")],1)])]),t._v(" "),e("tr",[e("td",[t._v("七牛云")]),t._v(" "),e("td"),t._v(" "),e("td",[e("a",{attrs:{href:"https://activity.huaweicloud.com/cps/recommendstore.html?fromacct=0740541e-dec2-47db-99e9-b5bb524ccbf7&utm_source=aGlkX2txbGYyNDR0ZXlxc2ZwZg===&utm_medium=cps&utm_campaign=201905",target:"_blank",rel:"noopener noreferrer"}},[t._v("对象存储服务每月10GB免费空间"),e("OutboundLink")],1),t._v(" (用做云存储)")])]),t._v(" "),e("tr",[e("td",[t._v("青云")]),t._v(" "),e("td"),t._v(" "),e("td",[e("a",{attrs:{href:"https://www.qingcloud.com",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://www.qingcloud.com"),e("OutboundLink")],1)])])])]),t._v(" "),e("h3",{attrs:{id:"_3、熟悉控制台"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3、熟悉控制台"}},[t._v("#")]),t._v(" 3、熟悉控制台")]),t._v(" "),e("p",[t._v("付款后，进入到腾讯云的后台，找到我的服务器（Lighthouse和正常的云服务器不一样，界面要自己在控制台找一下）")]),t._v(" "),e("p",[e("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210511113938382.png",alt:""}})]),t._v(" "),e("ul",[e("li",[t._v("首先我们需要重置一下密码，然后重启。")])]),t._v(" "),e("p",[e("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20201007140414442.png",alt:""}})]),t._v(" "),e("ul",[e("li",[t._v("然后下面可以看到腾讯云给你分配的IP了。")])]),t._v(" "),e("p",[t._v("比如我的公网IP是"),e("code",[t._v("119.29.62.179")])]),t._v(" "),e("ul",[e("li",[t._v("防火墙")])]),t._v(" "),e("p",[t._v("这里默认设置了端口开放的规则，"),e("strong",[t._v("如果你的服务器需要使用其他端口，比如说后续我们需要开放MySQL的3306端口，也需要到这里设置，否则远程是无法访问你的数据库的。")])]),t._v(" "),e("p",[e("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20201007143051867.png",alt:"防火墙"}})]),t._v(" "),e("ul",[e("li",[t._v("安全组")])]),t._v(" "),e("p",[t._v("我这里的Lighthouse没有显示安全组（腾讯云不提供可视化操作，需要自己登录服务器设置），但其他正常的服务器是有的，"),e("strong",[t._v("安全组定义了哪些IP可以访问服务器，服务器可以访问哪些IP")]),t._v("。")]),t._v(" "),e("ul",[e("li",[t._v("快照")])]),t._v(" "),e("p",[t._v("快照就是一个备份，你可以不定时备份，假如你的服务器被黑了，你需要回滚，就可以很快捷。")]),t._v(" "),e("p",[e("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20210511114331680.png",alt:""}})]),t._v(" "),e("p",[t._v("控制台的界面，其实就是密码、防火墙、安全组 需要了解一下。")]),t._v(" "),e("p",[t._v("自此，你就可以和这台服务器玩耍了。")]),t._v(" "),e("h3",{attrs:{id:"_4、登录服务器"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_4、登录服务器"}},[t._v("#")]),t._v(" 4、登录服务器")]),t._v(" "),e("p",[t._v("登录服务器需要使用终端工具，这里我使用 "),e("strong",[t._v("MobaXterm")]),t._v(" 。")]),t._v(" "),e("p",[t._v("如果你不熟悉"),e("strong",[t._v("MobaXterm")]),t._v("，可以参考我这个："),e("a",{attrs:{href:"https://mp.weixin.qq.com/s/Z3cYlTLLN4cO-FzoTL0pSw",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://mp.weixin.qq.com/s/Z3cYlTLLN4cO-FzoTL0pSw"),e("OutboundLink")],1)]),t._v(" "),e("p",[t._v("输入你的ip和账户名、端口（默认是22），再输入密码，就可以了。")]),t._v(" "),e("p",[e("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20201009153418835.png",alt:"使用终端工具连接服务器"}})]),t._v(" "),e("p",[e("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/img-20210401/image-20201009153752001.png",alt:"查看服务器信息"}})]),t._v(" "),e("p",[t._v("自此你的服务器就可以操作了，你还需要一些Linux知识，如果你学过操作系统，那么你将会更游刃有余。")]),t._v(" "),e("p",[t._v("不过，这个专栏都是写的很简单的，我会把每一步的操作就详细写下来，也会介绍这些命令的含义。")]),t._v(" "),e("p",[t._v("下面跟着这个专栏来开始吧。")])])}),[],!1,null,null,null);e.default=n.exports}}]);