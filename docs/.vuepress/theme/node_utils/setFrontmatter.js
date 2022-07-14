const fs = require('fs'); // 文件模块
const matter = require('gray-matter'); // FrontMatter解析器 https://github.com/jonschlinkert/gray-matter
const jsonToYaml = require('json2yaml')
const chalk = require('chalk') // 命令行打印美化
// const arg = process.argv.splice(2)[0]; // 获取命令行传入的参数
const readFileList = require('./modules/readFileList');
const { type, repairDate, dateFormat } = require('./modules/fn');
const log = console.log
const path = require('path');
const os = require('os');

const {getTags,getPropertyCount}  = require('./modules/cutTags');

const PREFIX = '/pages/'

/**
 * 给.md文件设置frontmatter(标题、日期、永久链接等数据)
 */
function setFrontmatter(sourceDir, themeConfig) {
  log("检查Frontmatter开始....")
  const { category: isCategory, tag: isTag, categoryText = '随笔', extendFrontmatter } = themeConfig
  const files = readFileList(sourceDir) // 读取所有md文件数据

  let hascategory =[];

  // 扩展自定义生成frontmatter
  const extendFrontmatterStr = extendFrontmatter ?
    jsonToYaml.stringify(extendFrontmatter)
      .replace(/\n\s{2}/g, "\n")
      .replace(/"|---\n/g, "")
    : '';



  files.forEach(file => {
    let dataStr = fs.readFileSync(file.filePath, 'utf8');// 读取每个md文件内容

    // fileMatterObj => {content:'剔除frontmatter后的文件内容字符串', data:{<frontmatter对象>}, ...}
    const fileMatterObj = matter(dataStr, {});

    let lock = "false";
    if (Object.keys(fileMatterObj.data).length === 0) { // 未定义FrontMatter数据
      const stat = fs.statSync(file.filePath);
      const dateStr = dateFormat(
        getBirthtime(stat)
      ); // 文件的创建时间
      const categories = getCategories(
        file,
        categoryText
      );


      let cateLabelStr = '';

      categories.forEach(item => {
        cateLabelStr += os.EOL + '  - ' + item;



      });


      lock = isLock(categories)


      let cateStr = '';
      if (!(isCategory === false)) {
        cateStr = os.EOL + 'categories:' + cateLabelStr
      }


      //permalink
      let link = PREFIX +file.name;

      link = encodeURI(link);


      log("file.name:",file.name)
      //tags
      let tagLabelStr = '';
      let tags = getTags(file.name);
      if (getPropertyCount(tags)===0){
        tagLabelStr += os.EOL + '  - ' + categories[categories.length-1];
      }else {
        tags.forEach(item => {
          tagLabelStr += os.EOL + '  - ' + item;
        });
      }

      let tagStr = '';
      if (!(isTag===false)){
        tagStr = os.EOL + 'tags:' + tagLabelStr
      }



      // 注意下面这些反引号字符串的格式会映射到文件
//       const tagsStr = isTag === false ? '' : `
//
//
// tags:
//   - `;

      const fmData = `---
title: ${file.name}
date: ${dateStr}
lock: ${lock}
permalink: ${link}${file.filePath.indexOf('_posts') > -1 ? os.EOL + 'sidebar: auto' : ''}${cateStr}${tagStr}
${extendFrontmatterStr}---`;


      fs.writeFileSync(file.filePath, `${fmData}${os.EOL}${fileMatterObj.content}`); // 写入
      log(chalk.blue('tip ') + chalk.green(`write frontmatter(写入frontmatter)：${file.filePath} `))

    }

    // 已有FrontMatter
    else {


      let matterData = fileMatterObj.data;
      let hasChange = false;

      // 已有FrontMatter，但是没有title、date、permalink、categories、tags数据的
      if (!matterData.hasOwnProperty('title')) { // 标题
        matterData.title = file.name;
        hasChange = true;
      }

      if (!matterData.hasOwnProperty('date')) { // 日期
        const stat = fs.statSync(file.filePath);
        matterData.date = dateFormat(getBirthtime(stat));
        hasChange = true;
      }

      if (!matterData.hasOwnProperty('permalink')) { // 永久链接
        matterData.permalink = getPermalink();
        hasChange = true;
      }



      if (file.filePath.indexOf('_posts') > -1 && !matterData.hasOwnProperty('sidebar')) { // auto侧边栏，_posts文件夹特有
        matterData.sidebar = "auto";
        hasChange = true;
      }

      if (!matterData.hasOwnProperty('pageComponent') && matterData.article !== false) { // 是文章页才添加分类和标签
        if (isCategory !== false && !matterData.hasOwnProperty('categories')) { // 分类
           hascategory = getCategories(file, categoryText);
            matterData.categories= hascategory;
          hasChange = true;
        }
        if (isTag !== false && !matterData.hasOwnProperty('tags')) { // 标签

            let tags = getTags(file.name);
            if (getPropertyCount(tags)===0){
                tags.push(hascategory[getPropertyCount(hascategory)-1]);
            }

          matterData.tags = tags;
          hasChange = true;
        }
      }
      //沒有lock
      if (!matterData.hasOwnProperty('lock')) { // lock
        if(hascategory.length===0){
          hascategory = getCategories(file, categoryText);
        }
        matterData.lock = isLock(hascategory);
        hasChange = true;
      }

      // 扩展自动生成frontmatter的字段
      if (type(extendFrontmatter) === 'object') {
        Object.keys(extendFrontmatter).forEach(keyName => {
          if (!matterData.hasOwnProperty(keyName)) {
            matterData[keyName] = extendFrontmatter[keyName]
            hasChange = true;
          }
        })
      }

      if (hasChange) {
        if (matterData.date && type(matterData.date) === 'date') {
          matterData.date = repairDate(matterData.date) // 修复时间格式
        }
        const newData = jsonToYaml.stringify(matterData).replace(/\n\s{2}/g, "\n").replace(/"/g, "") + '---' + os.EOL + fileMatterObj.content;
        fs.writeFileSync(file.filePath, newData); // 写入
        log(chalk.blue('tip hasChange') + chalk.green(`write frontmatter(写入frontmatter)：${file.filePath} `))
      }

    }
  })
}

// 获取分类数据
function getCategories(file, categoryText) {
  let categories = []

  if (file.filePath.indexOf('_posts') === -1) {
    // 不在_posts文件夹
    let filePathArr = file.filePath.split(path.sep) // path.sep用于兼容不同系统下的路径斜杠
    filePathArr.pop()

    let ind = filePathArr.indexOf('docs')
    if (ind !== -1) {
      while (filePathArr[++ind] !== undefined) {
        const item = filePathArr[ind]
        const firstDotIndex = item.indexOf('.');
        categories.push(item.substring(firstDotIndex + 1) || '') // 获取分类
        // categories.push(filePathArr[ind].split('.').pop()) // 获取分类
      }
    }
  } else {
    categories.push(categoryText)
  }
  return categories
}

// 获取文件创建时间
function getBirthtime(stat) {
  // 在一些系统下无法获取birthtime属性的正确时间，使用atime代替
  return stat.birthtime.getFullYear() != 1970 ? stat.birthtime : stat.atime
}

// 定义永久链接数据
function getPermalink() {
  // return `${PREFIX + (Math.random() + Math.random()).toString(16).slice(2, 8)}/`
  return `${file.name}`

}

// 是否锁住
function isLock(categories) {



  let lockDir = ['牛客网题库','求职建议','专栏','《从0到1学习Java多线程》','《从0到1搭建服务器》'];
  let lock = "false";

  if(categories===null || categories === undefined){
    return lock;
  }

  for(let cat in categories){
    for(let ld in lockDir){
      if(lockDir[ld] ===categories[cat]){
        log("命中加锁规则："+lockDir[ld])
        lock="need"
        return lock;
      }
    }
  }

  return lock;

}

module.exports = setFrontmatter;

