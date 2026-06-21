// 解决代码选项卡无法加载的问题
import Vue from 'vue'
import CodeBlock from "@theme/global-components/CodeBlock.vue"
import CodeGroup from "@theme/global-components/CodeGroup.vue"
// Register the Vue global component
Vue.component(CodeBlock)
Vue.component(CodeGroup)

//  注：此文件在浏览器端运行
import postsMixin from '@theme/mixins/posts'

// 新增代码，中文路由
import Router from 'vue-router'
function decode (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, ("Error decoding \"" + str + "\". Leaving it intact."));
    }
  }
  return str
}

const VueRouterMatch = Router.prototype.match
Router.prototype.match = function match (raw, currentRoute, redirectedFrom) {
  if (typeof raw === 'string') {
    raw = decode(raw)
  }
  return VueRouterMatch.call(this, raw, currentRoute, redirectedFrom)
}
// end

function decodeQueryParam (value) {
  if (value == null || value === '') return ''
  try {
    return decodeURIComponent(String(value))
  } catch (err) {
    return String(value)
  }
}

function normalizePath (path) {
  if (!path) return '/'
  let normalized = path.split(/[?#]/)[0]
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1)
  }
  return normalized
}

function stripBase (path, base) {
  if (!base || base === '/') return path
  const basePath = base.endsWith('/') ? base.slice(0, -1) : base
  if (path.startsWith(basePath)) {
    const rest = path.slice(basePath.length)
    return rest || '/'
  }
  return path
}

function getTagCategoryPageTitle (route, siteTitle, base) {
  const path = normalizePath(stripBase(route.path, base))
  const siteName = siteTitle || 'HelloCoder'

  if (path === '/tags') {
    const tag = decodeQueryParam(route.query.tag)
    return tag ? `${siteName} - ${tag}` : `${siteName} - 标签`
  }

  if (path === '/categories') {
    const category = decodeQueryParam(route.query.category)
    return category ? `${siteName} - ${category}` : `${siteName} - 分类`
  }

  return null
}

function updateTagCategoryDocumentTitle (route, siteData) {
  const title = getTagCategoryPageTitle(route, siteData.title, siteData.base)
  if (!title) return

  document.title = title

  const description = siteData.description
  if (description) {
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', description)
  }
}

function setupTagCategoryTitle (router, siteData) {
  const update = (route) => updateTagCategoryDocumentTitle(route, siteData)

  router.onReady(() => {
    update(router.currentRoute)
  })

  router.afterEach((to) => {
    update(to)
  })
}

export default ({
  Vue, // VuePress 正在使用的 Vue 构造函数
  options, // 附加到根实例的一些选项
  router, // 当前应用的路由实例
  siteData, // 站点元数据
  isServer // 当前应用配置是处于服务端渲染还是客户端
}) => {
  // 修复ISO8601时间格式为普通时间格式，以及添加作者信息
  siteData.pages.map(item => {
    const { frontmatter: { date, author } } = item
    if (typeof date === 'string' && date.charAt(date.length - 1) === 'Z') {
      item.frontmatter.date = repairUTCDate(date)
    }
    if (author) {
      item.author = author
    } else {
      if (siteData.themeConfig.author) {
        item.author = siteData.themeConfig.author
      }
    }
  })

  // 将对文章数据的处理结果混入Vue实例
  Vue.mixin(postsMixin)

  // 标签/分类页动态标题（仅客户端，避免 SSR 额外开销）
  if (!isServer && router) {
    setupTagCategoryTitle(router, siteData)
  }
}


// 修复ISO8601时间格式为普通时间格式
function repairUTCDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  return `${date.getUTCFullYear()}-${zero(date.getUTCMonth() + 1)}-${zero(date.getUTCDate())} ${zero(date.getUTCHours())}:${zero(date.getUTCMinutes())}:${zero(date.getUTCSeconds())}`;
}
// 小于10补0
function zero(d) {
  return d.toString().padStart(2, '0')
}
