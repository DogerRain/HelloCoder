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

function decodeQuery (str) {
  try {
    return decodeURIComponent(String(str).replace(/\+/g, ' '))
  } catch (err) {
    return String(str)
  }
}

function normalizePath (path) {
  if (!path) return ''
  return path.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/'
}

function getQueryParam (route, key) {
  if (!route) return ''

  let val = route.query && route.query[key]
  if (Array.isArray(val)) val = val[0]
  if (val) return decodeQuery(val)

  if (route.fullPath && route.fullPath.includes('?')) {
    const qs = route.fullPath.split('?')[1].split('#')[0]
    const params = new URLSearchParams(qs)
    val = params.get(key)
    if (val) return decodeQuery(val)
  }

  if (typeof window !== 'undefined' && window.location.search) {
    val = new URLSearchParams(window.location.search).get(key)
    if (val) return decodeQuery(val)
  }

  return ''
}

function getTagsPageTitle (route, siteTitle) {
  if (!route || normalizePath(route.path) !== '/tags') {
    return null
  }
  const tag = getQueryParam(route, 'tag')
  if (tag) {
    return `${siteTitle} - ${tag}`
  }
  return `${siteTitle} - 标签`
}

function getCategoriesPageTitle (route, siteTitle) {
  if (!route || normalizePath(route.path) !== '/categories') {
    return null
  }
  const category = getQueryParam(route, 'category')
  if (category) {
    return `${siteTitle} - ${category}`
  }
  return `${siteTitle} - 分类`
}

function getDynamicListPageTitle (route, siteTitle) {
  return getTagsPageTitle(route, siteTitle) || getCategoriesPageTitle(route, siteTitle)
}

function getDynamicListPageDescription (route, siteDescription) {
  if (!route) return null

  if (normalizePath(route.path) === '/tags') {
    const tag = getQueryParam(route, 'tag')
    return tag
      ? `HelloCoder 标签「${tag}」下的文章列表`
      : 'HelloCoder 全部标签与文章列表'
  }

  if (normalizePath(route.path) === '/categories') {
    const category = getQueryParam(route, 'category')
    return category
      ? `HelloCoder 分类「${category}」下的文章列表`
      : 'HelloCoder 全部分类与文章列表'
  }

  return null
}

function getDefaultTitle (vm) {
  const page = vm.$page
  const { metaTitle } = page.frontmatter
  if (typeof metaTitle === 'string') {
    return metaTitle
  }

  const siteTitle = vm.$siteTitle || vm.$site.title
  const selfTitle = page.frontmatter.home ? null : (
    page.frontmatter.title || page.title
  )

  return siteTitle
    ? (selfTitle ? (selfTitle + ' | ' + siteTitle) : siteTitle)
    : (selfTitle || 'VuePress')
}

function applyDynamicPageMeta (route, siteData) {
  const title = getDynamicListPageTitle(route, siteData.title)
  if (title) {
    document.title = title
  }

  const description = getDynamicListPageDescription(route, siteData.description)
  if (description) {
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', description)
  }
}

export default ({
  Vue, // VuePress 正在使用的 Vue 构造函数
  options, // 附加到根实例的一些选项
  router, // 当前应用的路由实例
  siteData, // 站点元数据
  isServer // 当前应用配置是处于 服务端渲染 还是 客户端
}) => {
  Vue.mixin({
    computed: {
      $title () {
        const dynamicTitle = getDynamicListPageTitle(this.$route, this.$siteTitle || this.$site.title)
        if (dynamicTitle) {
          return dynamicTitle
        }
        return getDefaultTitle(this)
      },
      $description () {
        const dynamicDescription = getDynamicListPageDescription(this.$route, this.$site.description)
        if (dynamicDescription) {
          return dynamicDescription
        }

        const description = (this.$page.frontmatter.meta || [])
          .filter(item => item.name === 'description')[0]
        if (description) {
          return description.content
        }

        return this.$page.frontmatter.description
          || (this.$themeLocaleConfig && this.$themeLocaleConfig.description)
          || this.$site.description
          || ''
      }
    },
    watch: {
      '$route' (to) {
        if (typeof document !== 'undefined') {
          applyDynamicPageMeta(to, this.$site)
        }
      }
    }
  })

  if (!isServer && router) {
    const syncMeta = () => applyDynamicPageMeta(router.currentRoute, siteData)

    router.onReady(syncMeta)
    router.afterEach((to) => {
      applyDynamicPageMeta(to, siteData)
    })
  }

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
