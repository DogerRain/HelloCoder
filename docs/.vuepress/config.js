const baiduCode = require('./config/baiduCode.js'); // 百度统计hm码
const htmlModules = require('./config/htmlModules.js');
const sidebar = require('./sidebar.js');


module.exports = {


    port: '1299',

    theme: 'vdoing', // 使用依赖包主题
    // theme: require.resolve('vdoing'), // 使用本地主题
    title: "HelloCoder",
    description: 'java面试,java学习,面试指南,Java小白求职之路',

    //项目路径配置
    base: '/', // 默认'/'。如果你想将你的网站部署到如 https://foo.github.io/bar/，那么 base 应该被设置成 "/bar/",（否则页面将失去样式等文件）
    destination: './dist',
    dest: './dist',
    publicPath:'../../',



    head: [ // 注入到页面<head> 中的标签，格式[tagName, { attrName: attrValue }, innerHTML?]
        ['link', {rel: 'icon', href: '/img/favicon.ico'}], //favicons，资源放在public文件夹
        ['meta', {name: 'keywords', content: 'java面试,java面试题目,java核心知识,面试指南,Java小白求职之路'}],
        ['meta', {name: 'theme-color', content: '#11a8cd'}], // 移动浏览器主题颜色

        // ['meta', {name: 'wwads-cn-verify', content: '6c4b761a28b734fe93831e3fb400ce87'}], // 广告相关，你可以去掉
        // ['script', {src: 'https://cdn.wwads.cn/js/makemoney.js', type: 'text/javascript'}], // 广告相关，你可以去掉
        ['script',
            {
                charset: 'utf-8',
                async: 'async',
                // src: 'https://code.jquery.com/jquery-3.5.1.min.js',
                src: '/js/jquery.min.js',
            }],
        ['script',
            {
                charset: 'utf-8',
                async: 'async',
                // src: 'https://code.jquery.com/jquery-3.5.1.min.js',
                src: '/js/global.js',
            }],
        ['script',
            {
                charset: 'utf-8',
                async: 'async',
                src: '/js/fingerprint2.min.js',
            }],
        ['script',
            {
                charset: 'utf-8',
                async: 'async',
                src: 'https://readmore.openwrite.cn/js/readmore.js',
            }],
        ['script',
            {
                charset: 'utf-8',
                async: 'async',
                src: '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js',
            }],
        // 添加百度统计
        //已换成 learnjava 的 hmcode
        ["script", {},
            `
              var _hmt = _hmt || [];
              (function() {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?b673363a2df767abd890cd6918642392";
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
              })();
            `
        ]

    ],

    // 主题配置
    themeConfig: {
        keyPage: {
            keys: ['e10adc3949ba59abbe56e057f20f883e'], // 1.3.0 版本后需要设置为密文
            color: '#42b983', // 登录页动画球的颜色
            lineColor: '#42b983' // 登录页动画线的颜色
        },

        // sidebar,
        nav: sidebar.nav,
        sidebarDepth: 0, // 侧边栏显示深度，默认1，最大2（显示到h3标题）
        logo: '/img/site/logo.png', // 导航栏logo
        // repo: 'xugaoyi/vuepress-theme-vdoing', // 导航栏右侧生成Github链接
        searchMaxSuggestions: 8, // 搜索结果显示最大数
        lastUpdated: '上次更新', // 更新的时间，及前缀文字   string | boolean (取值为git提交时间)

        selfPassword: 'Coder',

        docsDir: 'docs', // 编辑的文件夹
        // editLinks: true, // 编辑链接
        // editLinkText: '编辑',

        // 以下配置是Vdoing主题改动的和新增的配置
        sidebar: {mode: 'structuring', collapsable: true}, // 侧边栏  'structuring' | { mode: 'structuring', collapsable: Boolean} | 'auto' | 自定义    温馨提示：目录页数据依赖于结构化的侧边栏数据，如果你不设置为'structuring',将无法使用目录页

        sidebarOpen: true, // 初始状态是否打开侧边栏，默认true
        updateBar: { // 最近更新栏
            showToArticle: true, // 显示到文章页底部，默认true
            moreArticle: '/archives' // “更多文章”跳转的页面，默认'/archives'
        },
        // titleBadge: false, // 文章标题前的图标是否显示，默认true
        // titleBadgeIcons: [ // 文章标题前图标的地址，默认主题内置图标
        //   '图标地址1',
        //   '图标地址2'
        // ],
        // bodyBgImg: [
        //   'https://cdn.jsdelivr.net/gh/xugaoyi/image_store/blog/20200507175828.jpeg',
        //   'https://cdn.jsdelivr.net/gh/xugaoyi/image_store/blog/20200507175845.jpeg',
        //   'https://cdn.jsdelivr.net/gh/xugaoyi/image_store/blog/20200507175846.jpeg'
        // ], // body背景大图，默认无。 单张图片 String || 多张图片 Array, 多张图片时每隔15秒换一张。


        // categoryText: '随笔', // 碎片化文章（_posts文件夹的文章）预设生成的分类值，默认'随笔'

         //1是网格
         // contentBgStyle: 1,

        // 博主信息 (显示在首页侧边栏),不支持html代码
        // blogger: {
        //     avatar: 'https://cdn.jsdelivr.net/gh/xugaoyi/image_store/blog/20200103123203.jpg',
        //     name: "<a href='http://beian.miit.gov.cn/' target='_blank'>京ICP备2020044519号-4</a>",
        //     slogan: "<a href='http://beian.miit.gov.cn/' target='_blank'>京ICP备2020044519号-4</a>",
        // },

        category: true, // 是否打开分类功能，默认true。 如打开，会做的事情有：1. 自动生成的frontmatter包含分类字段 2.页面中显示与分类相关的信息和模块 3.自动生成分类页面（在@pages文件夹）。如关闭，则反之。
        tag: true, // 是否打开标签功能，默认true。 如打开，会做的事情有：1. 自动生成的frontmatter包含标签字段 2.页面中显示与标签相关的信息和模块 3.自动生成标签页面（在@pages文件夹）。如关闭，则反之。
        archive: true, // 是否打开归档功能，默认true。 如打开，会做的事情有：1.自动生成归档页面（在@pages文件夹）。如关闭，则反之。

        author: { // 文章默认的作者信息，可在md文件中单独配置此信息 String | {name: String, href: String}
            name: '程序员阿雨', // 必需
            href: '' // 可选的
        },
        social: { // 社交图标，显示于博主信息栏和页脚栏
            // iconfontCssFile: '//at.alicdn.com/t/font_1678482_u4nrnp8xp6g.css', // 可选，阿里图标库在线css文件地址，对于主题没有的图标可自由添加
            icons: [
                {
                    iconClass: 'icon-youjian',
                    title: '发邮件',
                    link: 'mailto:huangyongwen0306@163.com'
                },
                {
                    iconClass: 'icon-zhihu',
                    title: '知乎',
                    link: 'https://www.zhihu.com/people/dai-ma-coder'
                },
                {
                    iconClass: 'icon-weixin',
                    title: '微信公众号',
                    // kejiayu.png
                    link: '/img/site/HelloCoder.png'
                }
            ]
        },
        footer: { // 页脚信息
            createYear: 2020, // 博客创建年份
            copyrightInfo: '程序员阿雨', // 博客版权信息，支持a标签
            // copyrightInfo:
            //     '<p>友情链接：<a href="https://uniadmin.jiangruyi.com" target="_blank">UniAdmin</a> | <a href="https://jiangruyi.com" target="_blank">江如意的博客</a></p>' +
            //     'Copyright © 2021-2040 FUJIE. All rights reserved. 北京符节科技有限公司版权所有 | ' +
            //     '<a href="http://beian.miit.gov.cn/" target="_blank">京ICP备2020044519号-4</a>', // 博客版权信息，支持a标签
        },

        htmlModules,
    },

    // 插件
    plugins: [
        // [require('./plugins/love-me'), { // 鼠标点击爱心特效
        //   color: '#11a8cd', // 爱心颜色，默认随机色
        //   excludeClassName: 'theme-vdoing-content' // 要排除元素的class, 默认空''
        // }],

        ['fulltext-search'], // 全文搜索

        // ['thirdparty-search', { // 可以添加第三方搜索链接的搜索框（原官方搜索框的参数仍可用）
        //   thirdparty: [ // 可选，默认 []
        //     {
        //       title: '在GitHub中搜索',
        //       frontUrl: 'https://github.com/search?q=', // 搜索链接的前面部分
        //       behindUrl: '' // 搜索链接的后面部分，可选，默认 ''
        //     },
        //     {
        //       title: '在npm中搜索',
        //       frontUrl: 'https://www.npmjs.com/search?q=',
        //     },
        //     {
        //       title: '在Bing中搜索',
        //       frontUrl: 'https://cn.bing.com/search?q='
        //     }
        //   ]
        // }],

        [
            'vuepress-plugin-baidu-tongji', // 百度统计
            {
                hm: baiduCode || 'b673363a2df767abd890cd6918642392'
            }
        ],

        ['one-click-copy', { // 代码块复制按钮
            copySelector: ['div[class*="language-"] pre', 'div[class*="aside-code"] aside'], // String or Array
            copyMessage: '复制成功', // default is 'Copy successfully and then paste it for use.'
            duration: 1000, // prompt message display time.
            showInMobile: false // whether to display on the mobile side, default: false.
        }],

        ['demo-block', { // demo演示模块 https://github.com/xiguaxigua/vuepress-plugin-demo-block
            settings: {
                // jsLib: ['http://xxx'], // 在线示例(jsfiddle, codepen)中的js依赖
                // cssLib: ['http://xxx'], // 在线示例中的css依赖
                // vue: 'https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js', // 在线示例中的vue依赖
                jsfiddle: false, // 是否显示 jsfiddle 链接
                codepen: true, // 是否显示 codepen 链接
                horizontal: false // 是否展示为横向样式
            }
        }],
        [
            'vuepress-plugin-zooming', // 放大图片
            {
                selector: '.theme-vdoing-content img:not(.no-zoom)',
                options: {
                    bgColor: 'rgba(0,0,0,0.6)'
                },
            },
        ],
        [
            '@vuepress/last-updated', // "上次更新"时间格式
            {
                transformer: (timestamp, lang) => {
                    const dayjs = require('dayjs') // https://day.js.org/
                    return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
                },
            }
        ],



        [
            '@vssue/vuepress-plugin-vssue', {

            comment:false,
            issueId:false,
            autoCreateIssue:false,
            // 设置 `platform` 而不是 `api`
            platform: 'github',
            // 其他的 Vssue 配置
            owner: 'DogerRain',
            repo: 'HelloCoder',
            // https://github.com/settings/applications/1942555
            clientId: '43a73d473914ee5ce72c',
            clientSecret: 'a50dceb37b9f2d636cd446b7674261e9da3141a3',

            locale: 'zh'
        },

        ]

    ],

    markdown: {
        // lineNumbers: true,
        extractHeaders: ['h2', 'h3', 'h4', 'h5', 'h6'], // 提取标题到侧边栏的级别，默认['h2', 'h3']
    },


    // 监听文件变化并重新构建
    extraWatchFiles: [
        '.vuepress/config.js',
        '.vuepress/config/htmlModules.js',
    ]
}
