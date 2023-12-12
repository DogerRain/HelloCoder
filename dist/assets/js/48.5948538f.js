(window.webpackJsonp=window.webpackJsonp||[]).push([[48],{452:function(t,e,a){"use strict";a.r(e);var s=a(7),n=Object(s.a)({},(function(){var t=this,e=t._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h2",{attrs:{id:"_1、ribbon的负载均衡策略有哪些"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1、ribbon的负载均衡策略有哪些"}},[t._v("#")]),t._v(" 1、Ribbon的负载均衡策略有哪些？")]),t._v(" "),e("p",[t._v("com.netflix.loadbalancer.RandomRule #配置规则 随机\ncom.netflix.loadbalancer.RoundRobinRule #配置规则 轮询\ncom.netflix.loadbalancer.RetryRule #配置规则 重试\ncom.netflix.loadbalancer.WeightedResponseTimeRule #配置规则 响应时间权重\ncom.netflix.loadbalancer.BestAvailableRule #配置规则 最空闲连接策略")]),t._v(" "),e("p",[t._v("Ribbon默认是 "),e("strong",[t._v("RandomRule 随机 轮询策略")]),t._v("。")]),t._v(" "),e("p",[t._v("而Feign @FeignClient注解的时候 是默认使用了Ribbon进行客户端的负载均衡的，默认的是"),e("strong",[t._v("RoundRobinRule 轮询的策略")])]),t._v(" "),e("div",{staticClass:"language-java extra-class"},[e("pre",{pre:!0,attrs:{class:"language-java"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//使用FeignClient 告知发布方的应用名称 默认使用ribbon进行负载均衡")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@FeignClient")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("name"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),e("span",{pre:!0,attrs:{class:"token string"}},[t._v('"stu-provide"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("interface")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("TestFeign")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@RequestMapping")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("value "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/getAll/{id}"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("method "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("RequestMethod")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("GET"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Student")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("getAll")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@PathVariable")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token string"}},[t._v('"id"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Integer")]),t._v(" id"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),e("h2",{attrs:{id:"_2、ribbon的实现原理是什么"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2、ribbon的实现原理是什么"}},[t._v("#")]),t._v(" 2、Ribbon的实现原理是什么？")]),t._v(" "),e("p",[t._v("ribbon实现的关键点是为ribbon定制的RestTemplate，ribbon利用了RestTemplate的拦截器机制，在拦截器中实现ribbon的负载均衡。负载均衡的基本实现就是利用applicationName从服务注册中心获取可用的服务地址列表，然后通过一定算法负载，决定使用哪一个服务地址来进行http调用。")]),t._v(" "),e("p",[t._v("Ribbon的RestTemplate")]),t._v(" "),e("p",[t._v("RestTemplate中有一个属性是"),e("code",[t._v("List<ClientHttpRequestInterceptor> interceptors")]),t._v("，如果interceptors里面的拦截器数据不为空，在RestTemplate进行http请求时，这个请求就会被拦截器拦截进行，拦截器实现接口ClientHttpRequestInterceptor，需要实现方法是")]),t._v(" "),e("div",{staticClass:"language-text extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution)\n      throws IOException;\n")])])]),e("p",[t._v("也就是说拦截器需要完成http请求，并封装一个标准的response返回。")]),t._v(" "),e("h2",{attrs:{id:"_3、ribbon几种负载均衡策略的原理是什么"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3、ribbon几种负载均衡策略的原理是什么"}},[t._v("#")]),t._v(" 3、Ribbon几种负载均衡策略的原理是什么？")]),t._v(" "),e("h3",{attrs:{id:"_3-1、randomrule"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-1、randomrule"}},[t._v("#")]),t._v(" 3.1、RandomRule")]),t._v(" "),e("p",[t._v("随机负载规则很简单，随机整数选择服务，最终达到随机负载均衡。")]),t._v(" "),e("h3",{attrs:{id:"_3-2、roundrobinrule"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-2、roundrobinrule"}},[t._v("#")]),t._v(" 3.2、RoundRobinRule")]),t._v(" "),e("p",[t._v("线性轮询负载均衡策略。在类中维护了一个原子性的nextServerCyclicCounter成员变量作为当前服务的索引号，每次在所有服务数量的限制下，就是将服务的索引号加1，到达服务数量限制时再从头开始。")]),t._v(" "),e("p",[t._v("其实就是一个求余的过程。")]),t._v(" "),e("h3",{attrs:{id:"_3-3、weightedresponsetimerule"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-3、weightedresponsetimerule"}},[t._v("#")]),t._v(" 3.3、WeightedResponseTimeRule")]),t._v(" "),e("p",[t._v("响应时间作为选取权重的负载均衡策略。")]),t._v(" "),e("p",[t._v("其含义就是，响应时间越短的服务被选中的可能性大。")]),t._v(" "),e("p",[e("strong",[t._v("假设有4个服务，每个服务的响应时间（ms）：")])]),t._v(" "),e("p",[t._v("A: 200")]),t._v(" "),e("p",[t._v("B: 500")]),t._v(" "),e("p",[t._v("C: 30")]),t._v(" "),e("p",[t._v("D: 1200")]),t._v(" "),e("p",[e("strong",[t._v("总响应时间：")])]),t._v(" "),e("p",[t._v("200+500+30+1200=1930ms")]),t._v(" "),e("p",[e("strong",[t._v("接下来第二个for循环，计算每个服务的权重。")])]),t._v(" "),e("p",[t._v("服务的权重=总响应时间-服务自身的响应时间：")]),t._v(" "),e("p",[t._v("A: 1930-200=1730")]),t._v(" "),e("p",[t._v("B: 1930-500=1430")]),t._v(" "),e("p",[t._v("C: 1930-30=1900")]),t._v(" "),e("p",[t._v("D: 1930-1200=730")]),t._v(" "),e("p",[e("strong",[t._v("总权重：")])]),t._v(" "),e("p",[t._v("1730+1430+1900+730=5790")]),t._v(" "),e("p",[e("strong",[t._v("响应时间及权重计算结果示意图：")])]),t._v(" "),e("p",[e("img",{attrs:{src:"https://images2018.cnblogs.com/blog/166781/201803/166781-20180309161056472-1998885095.png",alt:""}})]),t._v(" "),e("p",[t._v("结果就是响应时间越短的服务，它的权重就越大。")]),t._v(" "),e("p",[t._v("再看一下choose方法。")]),t._v(" "),e("p",[t._v("重点在while循环的第3个if这里。")]),t._v(" "),e("p",[t._v("首先如果判定没有服务或者权重还没计算出来时，会采用父类RoundRobinRule以线性轮询的方式选择服务器。")]),t._v(" "),e("p",[t._v("有服务，有权重计算结果后，就是以总权重值为限制，拿到一个随机数，然后看随机数落到哪个区间，就选择对应的服务。")]),t._v(" "),e("p",[t._v("所以选取服务的结论就是：")]),t._v(" "),e("p",[t._v("响应时间越短的服务，它的权重就越大，被选中的可能性就越大。")]),t._v(" "),e("p",[t._v("参考：https://www.cnblogs.com/kongxianghai/p/8477781.html")])])}),[],!1,null,null,null);e.default=n.exports}}]);