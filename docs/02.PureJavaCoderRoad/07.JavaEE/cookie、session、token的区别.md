---
title: cookie、session、token的区别
date: 2022-05-26 17:04:06
permalink: /pages/cookie%E3%80%81session%E3%80%81token%E7%9A%84%E5%8C%BA%E5%88%AB
lock: false
categories: 
  - PureJavaCoderRoad
  - JavaEE
tags: 
  - cookiesessiontoken
  - 区别
---
> 转自：https://www.cnblogs.com/moyand/p/9047978.html

# **发展史**

1、很久很久以前，Web 基本上就是文档的浏览而已， 既然是浏览，作为服务器， 不需要记录谁在某一段时间里都浏览了什么文档。



每次请求都是一个新的 HTTP 协议， 就是请求加响应，尤其是我不用记住是谁刚刚发了 HTTP 请求，每个请求对我来说都是全新的。这段时间很嗨皮。



2、但是随着交互式 Web 应用的兴起，像在线购物网站，需要登录的网站等等，马上就面临一个问题，那就是要管理会话，必须记住哪些人登录系统，哪些人往自己的购物车中放商品。



也就是说我必须把每个人区分开，这就是一个不小的挑战，因为HTTP请求是无状态的，所以想出的办法就是给大家发一个会话标识（session id）。



说白了就是一个随机的字串，每个人收到的都不一样，每次大家向我发起HTTP请求的时候，把这个字符串给一并捎过来，这样我就能区分开谁是谁了。



3、这样大家很嗨皮了，可是服务器就不嗨皮了，每个人只需要保存自己的 session id，而服务器要保存所有人的 session id 。如果访问服务器多了，就得由成千上万，甚至几十万个。



这对服务器来说是一个巨大的开销 ， 严重的限制了服务器扩展能力。



比如说我用两个机器组成了一个集群，小F 通过机器 A 登录了系统，那 session id 会保存在机器 A 上，假设小F的下一次请求被转发到机器 B 怎么办？机器 B 可没有 小F 的 session id 啊。



有时候会采用一点小伎俩：session sticky ，就是让 小F 的请求一直粘连在机器 A 上，但是这也不管用， 要是机器 A 挂掉了， 还得转到机器 B 去。



那只好做 session 的复制了， 把 session id  在两个机器之间搬来搬去， 快累死了。

　　　　　　![图片](https://mmbiz.qpic.cn/mmbiz_png/WlIksv5EUJmwFEnicJIOq1HDlibQC072AibI0TgPZIdaWdPE8kgqHYPiahR1waSZAJq7iadU4fibvpgyQvG8QP3vdtVw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

后来有个叫 Memcached 的支了招：把 session id 集中存储到一个地方，所有的机器都来访问这个地方的数据。



这样一来，就不用复制了，但是增加了单点失败的可能性，要是那个负责 session 的机器挂了，所有人都得重新登录一遍，估计得被人骂死。



　　　　　　 ![图片](https://mmbiz.qpic.cn/mmbiz_png/WlIksv5EUJmwFEnicJIOq1HDlibQC072AibHBsvGVIyTBUkQQDUhzHicEesCfsYhmdN8LKYKuibbG3BXBYSfuqRCibLA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)



也尝试把这个单点的机器也搞出集群，增加可靠性，但不管如何，这小小的 session  对我来说是一个沉重的负担。

 

4、于是有人就一直在思考，我为什么要保存这可恶的 session 呢，只让每个客户端去保存该多好？

 

可是如果不保存这些 session id ，怎么验证客户端发给我的 session id 的确是我生成的呢？



如果不去验证，我们都不知道他们是不是合法登录的用户，那些不怀好意的家伙们就可以伪造 session id，为所欲为了。

 

嗯，对了，**关键点就是验证** ！

 

比如说，小F 已经登录了系统，我给他发一个令牌（token），里边包含了 小F 的 user id，下一次 小F 再次通过 HTTP 请求访问我的时候，把这个 token 通过 HTTP header 带过来不就可以了。

 

不过这和 session id 没有本质区别啊，任何人都可以可以伪造，所以我得想点儿办法，让别人伪造不了。

 

那就对数据做一个签名吧，比如说我用 HMAC-SHA256 算法，加上一个只有我才知道的密钥，对数据做一个签名，把这个签名和数据一起作为 token，由于密钥别人不知道，就无法伪造 token 了。

![图片](https://mmbiz.qpic.cn/mmbiz_png/WlIksv5EUJmwFEnicJIOq1HDlibQC072AibeWM3JB50yXSe6UnkTslB6SkHh6pye3qzo9I5NaNIRS6cozBuf7gApw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)



这个 token 我不保存，当 小F 把这个 token 给我发过来的时候，我再用同样的HMAC-SHA256 算法和同样的密钥，对数据再计算一次签名，和 token 中的签名做个比较，如果相同，我就知道小F已经登录过了，并且可以直接取到 小F 的 user id，如果不相同，数据部分肯定被人篡改过，我就告诉发送者：对不起，没有认证。



![图片](https://mmbiz.qpic.cn/mmbiz_png/WlIksv5EUJmwFEnicJIOq1HDlibQC072AibpD6xHylFxiciaap2j7MHRj6HpPxxSkrzuMfy5PsCHjlKt9bzSHhjOBMA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)



Token 中的数据是明文保存的（虽然我会用 Base64 做下编码， 但那不是加密），还是可以被别人看到的，所以我不能在其中保存像密码这样的敏感信息。



当然，如果一个人的 token 被别人偷走了，那我也没办法，我也会认为小偷就是合法用户，这其实和一个人的 session id 被别人偷走是一样的。

 

这样一来，我就不保存 session id 了，我只是生成 token ，然后验证 token ，我用我的 CPU 计算时间获取了我的 session 存储空间 ！

 

解除了 session id 这个负担，可以说是无事一身轻，我的机器集群现在可以轻松地做水平扩展，用户访问量增大，直接加机器就行。这种无状态的感觉实在是太好了！



# **Cookie**

Cookie 是一个非常具体的东西，指的就是浏览器里面能永久存储的一种数据，仅仅是浏览器实现的一种数据存储功能。



Cookie 由服务器生成，发送给浏览器，浏览器把 cookie 以 kv 形式保存到某个目录下的文本文件内，下一次请求同一网站时会把该 cookie 发送给服务器。



由于 cookie是存在客户端上的，所以浏览器加入了一些限制确保 cookie 不会被恶意使用，同时不会占据太多磁盘空间，所以每个域的 cookie 数量是有限的。



# **Session**

Session 从字面上讲，就是会话。这个就类似于你和一个人交谈，你怎么知道当前和你交谈的是张三而不是李四呢？对方肯定有某种特征（长相等）表明他就是张三。



Session 也是类似的道理，服务器要知道当前发请求给自己的是谁。



为了做这种区分，服务器就要给每个客户端分配不同的“身份标识”，然后客户端每次向服务器发请求的时候，都带上这个“身份标识”，服务器就知道这个请求来自于谁了。



至于客户端怎么保存这个“身份标识”，可以有很多种方式，对于浏览器客户端，大家都默认采用 cookie 的方式。



服务器使用 session 把用户的信息临时保存在了服务器上，用户离开网站后 session 会被销毁。



这种用户信息存储方式相对 cookie 来说更安全，可是 session 有一个**缺陷**：如果 Web 服务器做了负载均衡，那么下一个操作请求到了另一台服务器的时候 session 会丢失。



# **Token**

在 Web 领域基于 token 的身份验证随处可见。在大多数使用 Web API 的互联网公司中，token 是多用户下处理认证的最佳方式。以下几点特性会让你在程序中使用基于 token 的身份验证：

- 无状态、可扩展
- 支持移动设备
- 跨程序调用
- 安全

那些使用基于 token 的身份验证的大佬们

大部分你见到过的 API 和 Web 应用都使用 token，例如 Facebook、Twitter、Google+、GitHub 等。



**Token 的起源**

在介绍基于 token 的身份验证的原理与优势之前，不妨先看看之前的认证都是怎么做的。



**基于服务器的验证**

我们都是知道 HTTP 协议是无状态的，这种无状态意味着程序需要验证每一次请求，从而辨别客户端的身份。



在这之前，程序都是通过在服务端存储的登录信息来辨别请求的。这种方式一般都是通过存储 session来完成。



 

随着 Web，应用程序，已经移动端的兴起，这种验证的方式逐渐暴露出了问题。尤其是在可扩展性方面。

 

**基于服务器验证方式暴露的一些问题**

\1. **Seesion：**每次认证用户发起请求时，服务器需要去创建一个记录来存储信息。当越来越多的用户发请求时，内存的开销也会不断增加。

\2. **可扩展性：**在服务端的内存中使用Seesion存储登录信息，伴随而来的是可扩展性问题。

\3. **CORS(跨域资源共享)：**当我们需要让数据跨多台移动设备上使用时，跨域资源的共享会是一个让人头疼的问题。在使用 Ajax 抓取另一个域的资源，就可以会出现禁止请求的情况。

\4. **CSRF(跨站请求伪造)：**用户在访问银行网站时，他们很容易受到跨站请求伪造的攻击，并且能够被利用其访问其他的网站。



在这些问题中，可扩展行是最突出的。因此我们有必要去寻求一种更有行之有效的方法。

 

**基于 token 的验证原理**

基于 token 的身份验证是无状态的，我们不将用户信息存在服务器或 Session 中。



这种概念解决了在服务端存储信息时的许多问题。

> NoSession 意味着你的程序可以根据需要去增减机器，而不用去担心用户是否登录。



基于 token 的身份验证的过程如下:

1. 用户通过用户名和密码发送请求。
2. 程序验证。
3. 程序返回一个签名的 token 给客户端。
4. 客户端储存 token 并且每次用于每次发送请求。
5. 服务端验证 token 并返回数据。



每一次请求都需要 token。它应该在 HTTP 的头部发送从而保证了 HTTP 请求无状态。



我们同样通过设置服务器属性 Access-Control-Allow-Origin:* ，让服务器能接受到来自所有域的请求。



需要注意的是，在 ACAO 头部标明（designating）时，不得带有像 HTTP 认证，客户端 SSL 证书和 cookies 的证书。





**实现思路：**

![图片](https://mmbiz.qpic.cn/mmbiz_png/WlIksv5EUJmwFEnicJIOq1HDlibQC072AibYDQicwHn3pfdg8gY1McQKXnVIzlDaaQZwGeYKeXX59xsGvzpTW4SdPA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

\1. 用户登录校验，校验成功后就返回 token 给客户端。

\2. 客户端收到数据后保存在客户端

\3. 客户端每次访问 API 是携带 token 到服务器端。

\4. 服务器端采用filter过滤器校验。校验成功则返回请求数据，校验失败则返回错误码。

 

当我们在程序中认证了信息并取得 token 之后，我们便能通过这个 token 做许多的事情。



我们甚至能基于创建一个基于权限的 token 传给第三方应用程序，这些第三方程序能够获取到我们的数据（当然只有在我们允许的特定的 token）。



**Token 的优势**

**无状态、可扩展**

在客户端存储的 Token 是无状态的，并且能够被扩展。基于这种无状态和不存储 session 信息，负载负载均衡器能够将用户信息从一个服务传到其他服务器上。



如果我们将已验证的用户的信息保存在 Session 中，则每次请求都需要用户向已验证的服务器发送验证信息（称为 session 亲和性）。用户量大时，可能会造成一些拥堵。



但是不要着急。使用 token 之后这些问题都迎刃而解，因为 token 自己 hold 住了用户的验证信息。



**安全性**

请求中发送 token 而不再是发送 cookie 能够防止 CSRF（跨站请求伪造）。



即使在客户端使用 cookie 存储 token，cookie 也仅仅是一个存储机制而不是用于认证。不将信息存储在 session 中，让我们少了对 session 操作。 



Token 是有时效的，一段时间之后用户需要重新验证。我们也不一定需要等到 token 自动失效，token 有撤回的操作，通过 token revocataion 可以使一个特定的 token 或是一组有相同认证的 token 无效。



**可扩展性**

Token 能够创建与其它程序共享权限的程序。



例如，能将一个随便的社交帐号和自己的大号（Fackbook 或是 Twitter）联系起来。



当通过服务登录 Twitter（我们将这个过程 Buffer）时，我们可以将这些 Buffer 附到 Twitter 的数据流上。



使用 token 时，可以提供可选的权限给第三方应用程序。当用户想让另一个应用程序访问它们的数据，我们可以通过建立自己的 API，得出特殊权限的 token。



**多平台跨域**

我们提前先来谈论一下CORS（跨域资源共享），对应用程序和服务进行扩展的时候，需要介入各种各种的设备和应用程序。

> Having our API just serve data, we can also make the design choice to serve assets from a CDN. This eliminates the issues that CORS brings up after we set a quick header configuration for our application.

只要用户有一个通过了验证的 token，数据和资源就能够在任何域上被请求到。