const log = console.log;

// let resArr =["（10）利用Docsify搭建个人笔记网站.md", "（11）GitHub+Hexo搭建自己的网站、博客.md", "（12）利用WordPress搭建个人网站.md", "（13）利用vuepress搭建博客.md", "（1）选择云服务器.md", "（2）搭建服务器环境.md", "（3）部署静态网站到Tomcat服务器.md", "（4）部署静态网站到Nginx服务器.md", "（5）部署JavaWeb项目到服务器.md", "（6）如何判断服务器被入侵.md", "（7）一次服务器被黑的排查全过程.md", "（8）使用密钥对登录服务器.md", "（9）让你的服务器更安全.md"];
let resArr =["IBM面试题-不借助变量交换两个数.md", "奇怪的面试题.md", "快手", "美团", "腾讯", "阿里"]


//

// resArr.sort(SortLikeWin);

// sort2(resArr)
//
// log(resArr)

function sortLikeWindows(arr, comparator) {
    const newArr = arr.map((item) => splitStr(item));
    let temp;
    let len = newArr.length - 1;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i; j++) {
            const result = compare(newArr[j], newArr[j + 1], comparator);
            if (result > 0) {
                temp = newArr[j];
                newArr[j] = newArr[j + 1];
                newArr[j + 1] = temp;
                temp = arr[j]
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

function splitStr(str) {
    const arr = [];
    str.replace(/\D|\d+/g, function (match) {
        const val = +match;
        arr.push(isNaN(val) ? match : val);
    });
    return arr;
}

function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
function descending(a, b) {
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}
function compare(a, b, comparator = ascending) {
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
        const result = comparator(a[i], b[i]);
        if (result !== 0) {
            return result;
        }
    }
    return comparator(a.length, b.length);
}

module.exports = {
    sortLikeWindows
};