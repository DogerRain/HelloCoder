const fs = require('fs'); // 文件模块
const path = require('path'); // 路径模块
const chalk = require('chalk') // 命令行打印美化
const matter = require('gray-matter'); // front matter解析器
const log = console.log

let catalogueData = {}; // 目录页数据

/**
 * 生成侧边栏数据
 * @param {String} sourceDir .md文件所在源目录(一般是docs目录)
 * @param {Boolean} collapsable  是否可折叠
 */
function createSidebarData(sourceDir, collapsable) {
    const sidebarData = {};

    const selfSidebarData = {title: "", collapsable: false, children: []}

    const tocs = readTocs(sourceDir);
    tocs.forEach(toc => { // toc是每个目录的绝对路径

        log("当前toc：" + toc)

        if (toc.substr(-6) === '_posts') { // 碎片化文章

            // 注释说明：碎片化文章不需要生成结构化侧边栏 2020.05.01
            // const sidebarArr = mapTocToPostSidebar(toc);
            // sidebarData[`/${path.basename(toc)}/`] = sidebarArr

        } else {
            const sidebarObj = mapTocToSidebar(toc, collapsable);

            // log("当前sidebarObj：", sidebarObj)

            if (!sidebarObj.sidebar.length) {
                log(chalk.yellow(`warning: 该目录 "${toc}" 内部没有任何文件或文件序号出错，将忽略生成对应侧边栏`))
                return;
            }
            // F:\笔记\HelloCoderBlog\docs\articles\02.PureJavaCoderRoad
            var basename = path.basename(toc);//02.PureJavaCoderRoad

            const fileNameArr = basename.split('.')

            var title = fileNameArr[fileNameArr.length - 1]

            log("title:", title)

            // 重新构造一层
            if (title === "PureJavaCoderRoad" || title === "LearnJavaToFindAJob") {
                sidebarData[`/${path.basename(toc)}/`] =
                    [

                        {
                            title: "《" + title + "》",
                            children: sidebarObj.sidebar,
                            catalogue : sidebarObj.catalogueData
                        },

                    ]
                sidebarData.catalogue = sidebarObj.catalogueData;
                return sidebarData;


            }

            sidebarData[`/${path.basename(toc)}/`] = sidebarObj.sidebar
            sidebarData.catalogue = sidebarObj.catalogueData

        }
    })

    selfSibar = {

        "/02.PureJavaCoderRoad/": [

            {
                title: '《PureJavaCoderRoad》',
                collapsable: false,
                children: [
                    {
                        title: 'Java基础',
                        collapsable: false,
                        children: [
                            {
                                title: 'Java入门',
                                collapsable: false,
                                children: [
                                    [
                                        '01.Java基础/01.Java入门/06.IDEA快捷键.md',
                                        'IDEA快捷键',
                                        '/pages/IDEA%E5%BF%AB%E6%8D%B7%E9%94%AE'
                                    ],
                                    [
                                        '01.Java基础/01.Java入门/04.JavaIDE介绍.md',
                                        'JavaIDE介绍',
                                        '/pages/JavaIDE%E4%BB%8B%E7%BB%8D'
                                    ],
                                    [
                                        '01.Java基础/01.Java入门/Java的就业和发展.md',
                                        'Java的就业和发展',
                                        '/pages/Java%E7%9A%84%E5%B0%B1%E4%B8%9A%E5%92%8C%E5%8F%91%E5%B1%95'
                                    ],
                                    [
                                        '01.Java基础/01.Java入门/01.Java介绍.md',
                                        'Java介绍',
                                        '/pages/Java%E4%BB%8B%E7%BB%8D'
                                    ],
                                    [
                                        '01.Java基础/01.Java入门/02.安装Java运行环境.md',
                                        '安装Java运行环境',
                                        '/pages/%E5%AE%89%E8%A3%85Java%E8%BF%90%E8%A1%8C%E7%8E%AF%E5%A2%83'
                                    ],
                                    [
                                        '01.Java基础/01.Java入门/05.使用IDEA编写第一个Java程序.md',
                                        '使用IDEA编写第一个Java程序',
                                        '/pages/%E4%BD%BF%E7%94%A8IDEA%E7%BC%96%E5%86%99%E7%AC%AC%E4%B8%80%E4%B8%AAJava%E7%A8%8B%E5%BA%8F'
                                    ],
                                    [
                                        '01.Java基础/01.Java入门/03.运行第一个Java程序.md',
                                        '运行第一个Java程序',
                                        '/pages/%E8%BF%90%E8%A1%8C%E7%AC%AC%E4%B8%80%E4%B8%AAJava%E7%A8%8B%E5%BA%8F'
                                    ]
                                ]
                            },
                            {
                                title: 'Java基础',
                                collapsable: false,
                                children: []
                            }
                            , {
                                title: 'Java流程控制',
                                collapsable: false,
                                children: []
                            }


                        ]
                    }
                ]

            },

            {}

            // { title: 'Java新特性', collapsable: false, children: [ [Object] ] }
        ]


    }
    // return selfSibar
    return sidebarData

}

module.exports = createSidebarData;


/**
 * 读取指定目录下的文件绝对路径
 * @param {String} root 指定的目录
 */
function readTocs(root) {
    const result = [];
    const files = fs.readdirSync(root); // 读取目录,返回数组，成员是root底下所有的目录名 (包含文件夹和文件)
    files.forEach(name => {
        const file = path.resolve(root, name); // 将路径或路径片段的序列解析为绝对路径
        if (fs.statSync(file).isDirectory() && name !== '.vuepress' && name !== '@pages') { // 是否为文件夹目录，并排除.vuepress文件夹
            result.push(file);
        }
    })
    return result;
}


/**
 * 将碎片化文章目录(_posts)映射为对应的侧边栏配置数据
 * @param {String} root
 */
function mapTocToPostSidebar(root) {
    let postSidebar = [] // 碎片化文章数据
    const files = fs.readdirSync(root); // 读取目录（文件和文件夹）,返回数组

    files.forEach(filename => {
        const file = path.resolve(root, filename); // 方法：将路径或路径片段的序列解析为绝对路径
        const stat = fs.statSync(file); // 文件信息

        const fileNameArr = filename.split('.');
        if (fileNameArr.length > 2) {
            log(chalk.yellow(`warning: 该文件 "${file}" 在_posts文件夹中，不应有序号，且文件名中间不应有'.'`))
            return
        }
        if (stat.isDirectory()) { // 是文件夹目录
            // log(chalk.yellow(`warning: 该目录 "${file}" 内文件无法生成侧边栏，_posts文件夹里面不能有二级目录。`))
            return
        }

        let [title, type] = filename.split('.');
        if (type !== 'md') {
            log(chalk.yellow(`warning: 该文件 "${file}" 非.md格式文件，不支持该文件类型`))
            return;
        }

        const contentStr = fs.readFileSync(file, 'utf8') // 读取md文件内容，返回字符串
        const {data} = matter(contentStr, {}) // 解析出front matter数据
        const {permalink = '', titleTag = ''} = data || {}
        if (data.title) {
            title = data.title
        }
        const item = [filename, title, permalink]
        if (titleTag) {
            item.push(titleTag)
        }
        postSidebar.push(item);  // [<路径>, <标题>, <永久链接>, <?标题标签>]
    })

    return postSidebar
}


/**
 * 将目录映射为对应的侧边栏配置数据
 * @param {String} root
 * @param {Boolean} collapsable
 * @param {String} prefix
 */

// 核心方法。， by HaC
function mapTocToSidebar(root, collapsable, prefix = '') {
    let sidebar = []; // 结构化文章侧边栏数据
    const files = fs.readdirSync(root); // 读取目录（文件和文件夹）,返回数组

    files.forEach(filename => {
        const file = path.resolve(root, filename); // 方法：将路径或路径片段的序列解析为绝对路径
        const stat = fs.statSync(file); // 文件信息
        if (filename === '.DS_Store') { // 过滤.DS_Store文件
            return
        }
        // let [order, title, type] = filename.split('.');

        const fileNameArr = filename.split('.')

        // log("fileNameArr:"+fileNameArr)
        const isDir = stat.isDirectory()
        let order = 0, title = '', type = '';

        if (fileNameArr.length >= 2) {
            title = fileNameArr[fileNameArr.length - 1]
            order = fileNameArr[0]
        } else {
            title = fileNameArr[0];
            order = 999;
        }
        order = parseInt(order, 10);
        if (isNaN(order) || order < 0) {
            // log(chalk.yellow(`warning: 该文件 "${file}" 序号出错，请填写正确的序号`))
            // return;
            order = 999;
        }
        while (true) {
            if (sidebar[order]) {
                order += 1
            } else {
                break;
            }
        }

        //如果是目录
        if (isDir) {

            // log("当前目录：", filename)


            if (filename === 'picture' || filename==='.git' || filename==='git') {
                return;
            }

            //定义是否可以折叠的目录

            if(filename==='计算机资源'){
                collapsable = false;
            }

            sidebar[order] = {
                title,
                collapsable, // 是否可折叠，默认true
                children: mapTocToSidebar(file, collapsable, prefix + filename + '/').sidebar // 子栏路径添加前缀
            }

        } else {

            type = fileNameArr[fileNameArr.length - 1];


            // 是文件
            if (type !== 'md') {
                log(chalk.yellow(`warning: 该文件 "${file}" ，格式："${type}",非.md格式文件，不支持该文件类型`))
                return;
            }
            const contentStr = fs.readFileSync(file, 'utf8') // 读取md文件内容，返回字符串
            const {data} = matter(contentStr, {}) // 解析出front matter数据
            const {permalink = '', titleTag = ''} = data || {}

            // 目录页对应的永久链接，用于给面包屑提供链接
            const {pageComponent} = data
            if (pageComponent && pageComponent.name === "Catalogue") {
                catalogueData[title] = permalink
            }

            if (data.title) {
                title = data.title
            }
            const item = [prefix + filename, title, permalink]
            if (titleTag) item.push(titleTag)

            sidebar[order] = item;  // [<路径>, <标题>, <永久链接>, <?标题标签>]
        }

    })


    sidebar = sidebar.filter(item => item !== null && item !== undefined);


    // log("sidebar:"+sidebar);

    return {
        sidebar,
        catalogueData
    };

}
