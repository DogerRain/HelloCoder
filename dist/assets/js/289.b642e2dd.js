(window.webpackJsonp=window.webpackJsonp||[]).push([[289],{687:function(t,s,a){"use strict";a.r(s);var n=a(7),r=Object(n.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("p",[t._v("此前一篇文章介绍过Nginx的详细使用： "),s("a",{attrs:{href:"http://mp.weixin.qq.com/s?__biz=MzAxNTc4ODYzOQ==&mid=2247485827&idx=1&sn=b8df5093d42c053a028584b7c01e786c&chksm=9bfff6b3ac887fa5783ecd8acadad5d09066b0b5fc7bf68801c33d3d37c13d220a5247b581a5#rd",target:"_blank",rel:"noopener noreferrer"}},[t._v("Nginx入门与实践"),s("OutboundLink")],1)]),t._v(" "),s("p",[t._v("顺便再来列举一些常用的配置清单👇")]),t._v(" "),s("h2",{attrs:{id:"侦听端口"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#侦听端口"}},[t._v("#")]),t._v(" 侦听端口")]),t._v(" "),s("div",{staticClass:"language-lua extra-class"},[s("pre",{pre:!0,attrs:{class:"language-lua"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("server")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("#")]),t._v(" Standard HTTP Protocol\n    listen "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("80")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("#")]),t._v(" Standard HTTPS Protocol\n    listen "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("443")]),t._v(" ssl"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("#")]),t._v(" For http2\n    listen "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("443")]),t._v(" ssl http2"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("#")]),t._v(" Listen on "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("80")]),t._v(" using IPv6\n    listen "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("::")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("80")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("#")]),t._v(" Listen only on using IPv6\n    listen "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("::")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("80")]),t._v(" ipv6only"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("on"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h2",{attrs:{id:"访问日志"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#访问日志"}},[t._v("#")]),t._v(" 访问日志")]),t._v(" "),s("div",{staticClass:"language-lua extra-class"},[s("pre",{pre:!0,attrs:{class:"language-lua"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("server")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("#")]),t._v(" Relative "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("or")]),t._v(" full path to log file\n    access_log "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("path"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("to"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("file"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("log"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("#")]),t._v(" Turn "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'on'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("or")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'off'")]),t._v("\n    access_log on"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h2",{attrs:{id:"域名"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#域名"}},[t._v("#")]),t._v(" 域名")]),t._v(" "),s("div",{staticClass:"language-lua extra-class"},[s("pre",{pre:!0,attrs:{class:"language-lua"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("server")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("#")]),t._v(" Listen to yourdomain"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("com\n    server_name yourdomain"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("com"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("#")]),t._v(" Listen to multiple domains  server_name yourdomain"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("com www"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("yourdomain"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("com"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("#")]),t._v(" Listen to all domains\n    server_name "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("*")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("yourdomain"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("com"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("#")]),t._v(" Listen to all top"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("level domains\n    server_name yourdomain"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("*")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("#")]),t._v(" Listen to unspecified "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("Hostnames")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("Listens to IP address itself"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    server_name "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('""')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h2",{attrs:{id:"静态资源"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#静态资源"}},[t._v("#")]),t._v(" 静态资源")]),t._v(" "),s("div",{staticClass:"language-lua extra-class"},[s("pre",{pre:!0,attrs:{class:"language-lua"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("server")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    listen "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("80")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    server_name yourdomain"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("com"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    location "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        root "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("path"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("to"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("website"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h2",{attrs:{id:"重定向"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#重定向"}},[t._v("#")]),t._v(" 重定向")]),t._v(" "),s("div",{staticClass:"language-lua extra-class"},[s("pre",{pre:!0,attrs:{class:"language-lua"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("server")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    listen "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("80")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    server_name www"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("yourdomain"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("com"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("301")]),t._v(" http"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("//")]),t._v("yourdomain"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("com$request_uri"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("server")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    listen "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("80")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    server_name www"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("yourdomain"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("com"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    location "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("redirect"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("url")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("301")]),t._v(" http"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("//")]),t._v("otherdomain"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("com"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h2",{attrs:{id:"反向代理"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#反向代理"}},[t._v("#")]),t._v(" 反向代理")]),t._v(" "),s("div",{staticClass:"language-lua extra-class"},[s("pre",{pre:!0,attrs:{class:"language-lua"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("server")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    listen "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("80")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    server_name yourdomain"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("com"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    location "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        proxy_pass http"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("//")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0.0")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v(".0")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v(".0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("3000")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("#")]),t._v(" where "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0.0")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v(".0")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v(".0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("3000")]),t._v(" is your application "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("server")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("Ex"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" node"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("js"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" bound on "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0.0")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v(".0")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v(".0")]),t._v(" listening on port "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("3000")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h2",{attrs:{id:"负载均衡"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#负载均衡"}},[t._v("#")]),t._v(" 负载均衡")]),t._v(" "),s("div",{staticClass:"language-lua extra-class"},[s("pre",{pre:!0,attrs:{class:"language-lua"}},[s("code",[t._v("upstream "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("node_js")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    server "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0.0")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v(".0")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v(".0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("3000")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    server "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0.0")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v(".0")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v(".0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("4000")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    server "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("123.131")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v(".121")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v(".122")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("server")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    listen "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("80")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    server_name yourdomain"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("com"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    location "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        proxy_pass http"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("//")]),t._v("node_js"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h2",{attrs:{id:"ssl-协议"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ssl-协议"}},[t._v("#")]),t._v(" SSL 协议")]),t._v(" "),s("div",{staticClass:"language-lua extra-class"},[s("pre",{pre:!0,attrs:{class:"language-lua"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("server")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        listen "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("443")]),t._v(" ssl"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        server_name yourdomain"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("com"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        ssl on"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        ssl_certificate "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("path"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("to"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("cert"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("pem"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        ssl_certificate_key "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("path"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("to"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("privatekey"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("pem"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        ssl_stapling on"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        ssl_stapling_verify on"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        ssl_trusted_certificate "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("path"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("to"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("fullchain"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("pem"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        ssl_protocols TLSv1 TLSv1"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),t._v(" TLSv1"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        ssl_session_timeout 1h"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        ssl_session_cache shared"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("SSL"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("50m"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        add_header Strict"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("Transport"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("Security max"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("age"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("15768000")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n        "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("#")]),t._v(" Permanent Redirect "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("for")]),t._v(" HTTP to HTTPS\n        "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("server")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        listen "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("80")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        server_name yourdomain"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("com"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("301")]),t._v(" https"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("//")]),t._v("$host$request_uri"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("以上就是用到的一些日常配置，很多时候我们需要打开"),s("code",[t._v("nginx.conf")]),t._v("手动修改。")]),t._v(" "),s("p",[t._v("新手在玩Nginx的时候，可能和我一样存在一些顾虑：")]),t._v(" "),s("ul",[s("li",[t._v("配置十分多，而且又没有详细的参考文档")]),t._v(" "),s("li",[t._v("如果配置错误，那么Nginx就无法启动")]),t._v(" "),s("li",[t._v("Nginx隐藏的功能该怎么正确使用？")])]),t._v(" "),s("p",[t._v("后来在 GitHub 上发现了这款，可以一键生成 Nginx 配置的开源免费神器，目前github已经有 "),s("code",[t._v("14.7k star")]),t._v(" 了")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/Home/image-20211118224921241.png",alt:""}})]),t._v(" "),s("p",[t._v("这个项目是 "),s("code",[t._v("JavaScript+Vue")]),t._v(" 开发的，对前端感兴趣的筒子们可以试着研究一下。")]),t._v(" "),s("p",[t._v("先来说一下它的功能：")]),t._v(" "),s("p",[t._v("反向代理、HTTPS、HTTP/2、IPv6， 缓存、WordPress、CDN、Node.js 支持、 Python (Django) 服务器、日志、限制等等。")]),t._v(" "),s("p",[t._v("只需要在它的网站手动点击你需要的功能：")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/Home/image-20211118225406771.png",alt:""}})]),t._v(" "),s("p",[t._v("跟着网站提示一步一步操作：")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/Home/image-20211118225741373.png",alt:""}})]),t._v(" "),s("p",[t._v("选择你的场景，填写好参数，系统就会自动生成配置文件。")]),t._v(" "),s("p",[t._v("在最后你就可以下载或者复制最终的Nginx配置清单了：")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/DogerRain/image@main/Home/image-20211118225642177.png",alt:""}})]),t._v(" "),s("p",[t._v("对于新手来说，就是配置高性能、安全、稳定的NGINX服务器的最简单方法。")]),t._v(" "),s("p",[t._v("github地址："),s("a",{attrs:{href:"https://github.com/digitalocean/nginxconfig.io",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://github.com/digitalocean/nginxconfig.io"),s("OutboundLink")],1)]),t._v(" "),s("p",[t._v("在线配置地址："),s("a",{attrs:{href:"https://www.digitalocean.com/community/tools/nginx",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://www.digitalocean.com/community/tools/nginx"),s("OutboundLink")],1)])])}),[],!1,null,null,null);s.default=r.exports}}]);