(window.webpackJsonp=window.webpackJsonp||[]).push([[37],{436:function(e,t,s){"use strict";s.r(t);var v=s(7),r=Object(v.a)({},(function(){var e=this,t=e._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("blockquote",[t("p",[e._v("原文：https://www.runoob.com/servlet/servlet-life-cycle.html")])]),e._v(" "),t("h1",{attrs:{id:"servlet-生命周期"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#servlet-生命周期"}},[e._v("#")]),e._v(" Servlet 生命周期")]),e._v(" "),t("p",[e._v("Servlet 生命周期可被定义为从创建直到毁灭的整个过程。以下是 Servlet 遵循的过程：")]),e._v(" "),t("ul",[t("li",[e._v("Servlet 初始化后调用 "),t("strong",[e._v("init ()")]),e._v(" 方法。")]),e._v(" "),t("li",[e._v("Servlet 调用 "),t("strong",[e._v("service()")]),e._v(" 方法来处理客户端的请求。")]),e._v(" "),t("li",[e._v("Servlet 销毁前调用 "),t("strong",[e._v("destroy()")]),e._v(" 方法。")]),e._v(" "),t("li",[e._v("最后，Servlet 是由 JVM 的垃圾回收器进行垃圾回收的。")])]),e._v(" "),t("p",[e._v("现在让我们详细讨论生命周期的方法。")]),e._v(" "),t("h2",{attrs:{id:"init-方法"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#init-方法"}},[e._v("#")]),e._v(" init() 方法")]),e._v(" "),t("p",[e._v("init 方法被设计成只调用一次。它在第一次创建 Servlet 时被调用，在后续每次用户请求时不再调用。因此，它是用于一次性初始化，就像 Applet 的 init 方法一样。")]),e._v(" "),t("p",[e._v("Servlet 创建于用户第一次调用对应于该 Servlet 的 URL 时，但是您也可以指定 Servlet 在服务器第一次启动时被加载。")]),e._v(" "),t("p",[e._v("当用户调用一个 Servlet 时，就会创建一个 Servlet 实例，每一个用户请求都会产生一个新的线程，适当的时候移交给 doGet 或 doPost 方法。init() 方法简单地创建或加载一些数据，这些数据将被用于 Servlet 的整个生命周期。")]),e._v(" "),t("p",[e._v("init 方法的定义如下：")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("public void init() throws ServletException {\n  // 初始化代码...\n}\n")])])]),t("h2",{attrs:{id:"service-方法"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#service-方法"}},[e._v("#")]),e._v(" service() 方法")]),e._v(" "),t("p",[e._v("service() 方法是执行实际任务的主要方法。Servlet 容器（即 Web 服务器）调用 service() 方法来处理来自客户端（浏览器）的请求，并把格式化的响应写回给客户端。")]),e._v(" "),t("p",[e._v("每次服务器接收到一个 Servlet 请求时，服务器会产生一个新的线程并调用服务。service() 方法检查 HTTP 请求类型（GET、POST、PUT、DELETE 等），"),t("strong",[e._v("并在适当的时候调用 doGet、doPost、doPut，doDelete 等方法")]),e._v("。")]),e._v(" "),t("p",[e._v("下面是该方法的特征：")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("public void service(ServletRequest request, \n                    ServletResponse response) \n      throws ServletException, IOException{\n}\n")])])]),t("p",[e._v("service() 方法由容器调用，service 方法在适当的时候调用 doGet、doPost、doPut、doDelete 等方法。所以，您不用对 service() 方法做任何动作，您只需要根据来自客户端的请求类型来重写 doGet() 或 doPost() 即可。")]),e._v(" "),t("p",[e._v("doGet() 和 doPost() 方法是每次服务请求中最常用的方法。下面是这两种方法的特征。")]),e._v(" "),t("h2",{attrs:{id:"doget-方法"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#doget-方法"}},[e._v("#")]),e._v(" doGet() 方法")]),e._v(" "),t("p",[e._v("GET 请求来自于一个 URL 的正常请求，或者来自于一个未指定 METHOD 的 HTML 表单，它由 doGet() 方法处理。")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("public void doGet(HttpServletRequest request,\n                  HttpServletResponse response)\n    throws ServletException, IOException {\n    // Servlet 代码\n}\n")])])]),t("h2",{attrs:{id:"dopost-方法"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#dopost-方法"}},[e._v("#")]),e._v(" doPost() 方法")]),e._v(" "),t("p",[e._v("POST 请求来自于一个特别指定了 METHOD 为 POST 的 HTML 表单，它由 doPost() 方法处理。")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("public void doPost(HttpServletRequest request,\n                   HttpServletResponse response)\n    throws ServletException, IOException {\n    // Servlet 代码\n}\n")])])]),t("h2",{attrs:{id:"destroy-方法"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#destroy-方法"}},[e._v("#")]),e._v(" destroy() 方法")]),e._v(" "),t("p",[e._v("destroy() 方法只会被调用一次，在 Servlet 生命周期结束时被调用。destroy() 方法可以让您的 Servlet 关闭数据库连接、停止后台线程、把 Cookie 列表或点击计数器写入到磁盘，并执行其他类似的清理活动。")]),e._v(" "),t("p",[e._v("在调用 destroy() 方法之后，servlet 对象被标记为垃圾回收。destroy 方法定义如下所示：")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("  public void destroy() {\n    // 终止化代码...\n  }\n")])])]),t("h2",{attrs:{id:"架构图"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#架构图"}},[e._v("#")]),e._v(" 架构图")]),e._v(" "),t("p",[e._v("下图显示了一个典型的 Servlet 生命周期方案。")]),e._v(" "),t("ul",[t("li",[e._v("第一个到达服务器的 HTTP 请求被委派到 Servlet 容器。")]),e._v(" "),t("li",[e._v("Servlet 容器在调用 service() 方法之前加载 Servlet。")]),e._v(" "),t("li",[e._v("然后 Servlet 容器处理由多个线程产生的多个请求，每个线程执行一个单一的 Servlet 实例的 service() 方法。")])]),e._v(" "),t("p",[t("img",{attrs:{src:"https://www.runoob.com/wp-content/uploads/2014/07/Servlet-LifeCycle.jpg",alt:""}})])])}),[],!1,null,null,null);t.default=r.exports}}]);