// 页面是否对外可见；缺少 open 字段时默认可见
exports.isPageOpen = function (frontmatter = {}) {
  return frontmatter.open !== false
}
