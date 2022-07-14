const log = console.log;
// let str = "GitHub超详细的编程学习路线";
// let str = "Java的就业和发展";
// let str = "8.Callable和Runnable的区别";
// let str = "toString()、String.valueOf、(String)强转有什么区别？";
let str = "SpringMVC中Controller是线程安全的吗？";
//
let tags = getTags(str);

// if (getPropertyCount(tags) === 0) {
//     log("tags为空")
// }
// for (let t in  tags) {
//     log(tags[t])
// }

/**
 * 主体函数
 */
function getTags(fileName) {

    log("开始分词:", fileName)

    // let strs = fileName.split(".");
    //
    // if (strs[strs.length-1]!=='md'){
    //     return
    // }

    let str = fileName;

    let tags = [];
    // log("tags[]:",getPropertyCount(tags));


    let filter = ["吗", "啊", "呢", "什么"]

    let concatKeys = ["和", "的", "是"];


    let chineseEnglish = str.match(/[a-zA-Z\u4e00-\u9fa5\-\_\、]+/g);


    chineseEnglish = chineseEnglish.join("");

    log("只保留英文、中文：", chineseEnglish)

    //去除过滤字
    for (let f in  filter) {
        chineseEnglish = chineseEnglish.replace(filter[f], "");
    }

    log("过滤语气词：", chineseEnglish)


    // var tagKeys = chineseEnglish.split("Java").join("").split("java");


    //截取英文
    const reEnglishs = /[a-zA-Z]+[\-\_]*[a-zA-Z]*/g;

    //把英文丢进去
    var regExpMatchArray = chineseEnglish.match(reEnglishs);



    log("截取英文：", regExpMatchArray)

    if (regExpMatchArray!=null){
        regExpMatchArray.forEach(item => {
            tags.push(item);
        })
    }

    //截取中文
    const reChineses = /[\u4e00-\u9fa5]+/g;

    let chineseTags = chineseEnglish.match(reChineses);
    log("截取中文：", chineseTags)

    for (let i in chineseTags) {
        let length = chineseTags[i].length;
        let tag = chineseTags[i];
        if (length <= 1) {
            continue
        }
        if (length <= 5) {
            tags.push(tag);
        } else {
            //    连接词
            for (let c in  concatKeys) {
                let concatTags = tag.split(concatKeys[c]);

                for (let cc in concatTags) {
                    let cclength = concatTags[cc].length;
                    let ccTag =concatTags[cc];

                    if (cclength > 1 && cclength <= 5){

                        tags.push(ccTag)
                    }
                }

            }
        }

    }

    let from = Array.from(new Set(tags));

    for (let c in concatKeys){
        for (let f in from){
             if (from[f].startsWith(concatKeys[c])){
                 from[f] = from[f].replace(concatKeys[c],"");
             }
        }
    }

    log("最终分词:",from)

    return from;


}

function getPropertyCount(o) {
    var n, count = 0;
    for (n in o) {
        if (o.hasOwnProperty(n)) {
            count++;
        }
    }
    return count;
}


module.exports = {
    getTags,
    getPropertyCount,
};

