(window.webpackJsonp=window.webpackJsonp||[]).push([[301],{699:function(t,s,e){"use strict";e.r(s);var a=e(7),v=Object(a.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("p",[t._v("VuePress 由两部分组成：第一部分是一个极简静态网站生成器 (opens new window)，它包含由 Vue 驱动的主题系统和插件 API，另一个部分是为书写技术文档而优化的默认主题，它的诞生初衷是为了支持 Vue 及其子项目的文档需求。")]),t._v(" "),s("p",[t._v("简单来说，VuePress 可以渲染你的 Markdown 文件，按照约定俗成的配置，生成一个 html 网站，从而更加方便的生成技术文档。")]),t._v(" "),s("p",[t._v("此前我的文档网站是通过 docsify 生成的，非常简单，但是用户每次访问网站，都需要把 "),s("code",[t._v(".md")]),t._v("渲染一遍，性能较差，而且还不能定制化开发。")]),t._v(" "),s("p",[t._v("所以我打算把它换成 vuepress。")]),t._v(" "),s("h2",{attrs:{id:"_1、选型"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_1、选型"}},[t._v("#")]),t._v(" 1、选型")]),t._v(" "),s("p",[t._v("官方的 VuePress 主题风格并不是每个人都喜欢的。")]),t._v(" "),s("p",[t._v("基于 VuePress 主题，国内开发者开发出了很多好看的主题，加入了许多功能，例如：")]),t._v(" "),s("table",[s("thead",[s("tr",[s("th"),t._v(" "),s("th",[t._v("vuepress-theme-vdoing")]),t._v(" "),s("th",[t._v("vuepress-theme-hope")]),t._v(" "),s("th",[t._v("vuepress-theme-reco")])])]),t._v(" "),s("tbody",[s("tr",[s("td",[t._v("网站")]),t._v(" "),s("td",[t._v("https://doc.xugaoyi.com")]),t._v(" "),s("td",[t._v("https://vuepress-theme-hope.github.io/v1/zh")]),t._v(" "),s("td",[t._v("https://vuepress-theme-reco.recoluan.com")])]),t._v(" "),s("tr",[s("td",[t._v("技术")]),t._v(" "),s("td",[t._v("基于 Vue")]),t._v(" "),s("td",[t._v("基于typescript")]),t._v(" "),s("td",[t._v("基于typescript")])]),t._v(" "),s("tr",[s("td",[t._v("优点")]),t._v(" "),s("td",[t._v("自动生成 frontmatter，支持文档、博客风格，安装方便")]),t._v(" "),s("td",[t._v("插件多，支持seo")]),t._v(" "),s("td",[t._v("插件多，支持seo，支持RSS")])]),t._v(" "),s("tr",[s("td",[t._v("缺点")]),t._v(" "),s("td",[t._v("不支持多语言，不支持seo，")]),t._v(" "),s("td",[t._v("需要自定义侧边栏")]),t._v(" "),s("td",[t._v("需要自定义侧边栏")])])])]),t._v(" "),s("p",[t._v("因为我只对 Vue 熟悉，所以我的网站是基于 "),s("strong",[t._v("vuepress-theme-vdoing")]),t._v(" 搭建的，其中做了一些二次开发，体验地址：")]),t._v(" "),s("p",[t._v("https://learnjava.baimuxym.cn")]),t._v(" "),s("p",[t._v("所以我这里只对 "),s("strong",[t._v("vuepress-theme-vdoing")]),t._v(" 主题的搭建进行演示。")]),t._v(" "),s("h2",{attrs:{id:"_2、安装和启动"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2、安装和启动"}},[t._v("#")]),t._v(" 2、安装和启动")]),t._v(" "),s("p",[s("strong",[t._v("vuepress-theme-vdoing")]),t._v("  的作者已经做了一个demo，我们只需要把仓库拉取下来即可：")]),t._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 拉取 文档风格主题 的代码仓库，作者提供了3种风格的文档类型，可以参考官网或者本地自行修改配置")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" clone https://github.com/xugaoyi/vuepress-theme-vdoing-doc.git\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 进入安装目录")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("cd")]),t._v(" vuepress-theme-vdoing-doc\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# install dependency 注意：需要安装node环境，如安装不成功请关闭淘宝源。也可以使用 yarn 进行安装")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("npm")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# yarn install")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# develop")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("npm")]),t._v(" run dev "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("#  yarn dev")]),t._v("\n")])])]),s("p",[t._v("npm install 的过程比较久，占用内存较大，失败了可以尝试 淘宝源。")]),t._v(" "),s("blockquote",[s("p",[t._v("注意，node、npm的版本不能太低，我这里的 node版本为 16 ，npm 版本为 8.5")])]),t._v(" "),s("p",[t._v("执行完毕，出现以下提示表示成功，打开链接，即可浏览生成的文档网站：")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("success "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("10")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("48")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("43")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" Build 3b8cfd finished "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("in")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("20236")]),t._v(" ms"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("!")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" VuePress dev server listening at http"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),s("span",{pre:!0,attrs:{class:"token regex"}},[s("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[t._v("/")]),s("span",{pre:!0,attrs:{class:"token regex-source language-regex"}},[t._v("localhost:8080")]),s("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[t._v("/")])]),t._v("\n")])])]),s("p",[s("img",{attrs:{src:"https://fastly.jsdelivr.net/gh/DogerRain/image@main/img-202207/image-20220711134815091.png",alt:""}})]),t._v(" "),s("h2",{attrs:{id:"_3、采坑点"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3、采坑点"}},[t._v("#")]),t._v(" 3、采坑点")]),t._v(" "),s("p",[t._v("作者已经在官方文档写明了约定俗成的配置，以及 frontmatter，但新手在使用的时候可能会遇到一些坑。")]),t._v(" "),s("h3",{attrs:{id:"_3-1、侧边栏"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-1、侧边栏"}},[t._v("#")]),t._v(" 3.1、侧边栏")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://fastly.jsdelivr.net/gh/DogerRain/image@main/img-202207/image-20220711105549597.png",alt:""}})]),t._v(" "),s("p",[t._v("侧边栏是需要按照序号的排列生成。")]),t._v(" "),s("p",[t._v("否则不会出现在侧边栏和目录栏。"),s("code",[t._v("getSidebarData.js")]),t._v(" 这个js工具会遍历这些目录生成侧边栏。")]),t._v(" "),s("blockquote",[s("p",[t._v("需要注意的是， .md 文件不要超过两个二级目录，否则目录栏无法正确跳转。")])]),t._v(" "),s("h3",{attrs:{id:"_3-2、-标签"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-2、-标签"}},[t._v("#")]),t._v(" 3.2、<>标签")]),t._v(" "),s("p",[t._v("对于一些自定义的非 vue、html 标签，如 "),s("code",[t._v("<dependeny>")]),t._v("、"),s("code",[t._v("<properties>")]),t._v("，需要使用 "),s("strong",[t._v("``")]),t._v(" 行内语法块，否则会导致内容渲染失败。")]),t._v(" "),s("h3",{attrs:{id:"_3-3、图片"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-3、图片"}},[t._v("#")]),t._v(" 3.3、图片")]),t._v(" "),s("p",[t._v("支持图片的相对路径。markdown中若使用了图片的相对路径，需要将 "),s("code",[t._v("/")]),t._v(" 改为 "),s("code",[t._v("./")])]),t._v(" "),s("h3",{attrs:{id:"_3-4、打包"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-4、打包"}},[t._v("#")]),t._v(" 3.4、打包")]),t._v(" "),s("p",[t._v("打包部署到NGINX，可能会引起样式错乱，需要将 "),s("code",[t._v("config.js")]),t._v(" ：")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("base")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n")])])]),s("p",[t._v("如果路径没有错误，可能是 Nginx 的问题，我遇到过在windows部署错乱，在Linux部署就正常了。")]),t._v(" "),s("h2",{attrs:{id:"_4、基于vuepress-theme-vdoing的修改"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_4、基于vuepress-theme-vdoing的修改"}},[t._v("#")]),t._v(" 4、基于vuepress-theme-vdoing的修改")]),t._v(" "),s("p",[t._v("Vuepress基于Vue，所以如果有一些不满意的地方，都可以DIY修改。")]),t._v(" "),s("h3",{attrs:{id:"_4-1、加入-阅读全文模块"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_4-1、加入-阅读全文模块"}},[t._v("#")]),t._v(" 4.1、加入 阅读全文模块")]),t._v(" "),s("p",[t._v("为了对特别的用户开放，我做了个文章加锁的功能，通过 frontmatter 设定值，来判断文章是否需要加锁。")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://fastly.jsdelivr.net/gh/DogerRain/image@main/img-202207/image-20220714144128606.png",alt:""}})]),t._v(" "),s("p",[t._v("点击弹出 窗口需要输入密码验证：")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://fastly.jsdelivr.net/gh/DogerRain/image@main/img-202207/image-20220714144208230.png",alt:""}})]),t._v(" "),s("p",[t._v("主要还是防止被人盗文章。")]),t._v(" "),s("h3",{attrs:{id:"_4-2、基于分词器做标签分类"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_4-2、基于分词器做标签分类"}},[t._v("#")]),t._v(" 4.2、基于分词器做标签分类")]),t._v(" "),s("p",[t._v("首页生成的分类需要 frontmatter 定义的tags才能显示出来。")]),t._v(" "),s("p",[t._v("但是自定义的tag比较麻烦，所以我写了个方法，自动根据标题截取分词，这样首页就有了智能生成的标签：")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://fastly.jsdelivr.net/gh/DogerRain/image@main/img-202207/image-20220714144927804.png",alt:""}})]),t._v(" "),s("h3",{attrs:{id:"_4-3、侧栏自定义"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_4-3、侧栏自定义"}},[t._v("#")]),t._v(" 4.3、侧栏自定义")]),t._v(" "),s("p",[t._v("文章左边可以生成侧栏，右侧可以生成目录。")]),t._v(" "),s("p",[t._v("原作者是通过一个js脚本遍历 "),s("code",[t._v("01.")]),t._v("、"),s("code",[t._v("02.")]),t._v(" 这种带序号的目录和文件生成的，以替代原来Vuepress手动自定义json的形式。")]),t._v(" "),s("p",[t._v("我觉得每次都要这样命名太麻烦了，而且如果要插入到中间的序号之间......")]),t._v(" "),s("p",[t._v("所以我把原来作者自动生成侧栏的逻辑改了，按照系统自动排序的规则，读取所有文件夹和文件，然后生成侧边栏。")]),t._v(" "),s("h2",{attrs:{id:"_5、总结"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_5、总结"}},[t._v("#")]),t._v(" 5、总结")]),t._v(" "),s("p",[t._v("Vuepress相对 hexo、hugo、gitbook ，更方便，插件也多，主题也多。")]),t._v(" "),s("p",[t._v("相对 docsify，功能更强大，docsify则很简单但是性能差加载慢。")]),t._v(" "),s("p",[t._v("Vuepress的主题，也丰富多彩，每个主题都要自己的特色，而 vuepress-theme-vdoing 又非常符合程序员搭建技术文档，非常感谢 vuepress-theme-vdoing 的作者。")]),t._v(" "),s("p",[t._v("最后附上我的个人网站：https://learnjava.baimuxym.cn")]),t._v(" "),s("hr"),t._v(" "),s("p",[t._v("参考：")]),t._v(" "),s("ul",[s("li",[t._v("vuepress-theme-vdoing主题：https://doc.xugaoyi.com/")])])])}),[],!1,null,null,null);s.default=v.exports}}]);