function decodeQueryValue (raw) {
  if (!raw) return ''
  try {
    return decodeURIComponent(String(raw))
  } catch (err) {
    return String(raw)
  }
}

/**
 * 标签页 / 分类页：标题与 SEO，格式 HelloCoder | ${name}
 */
export function buildQueryPageMetaInfo (vm, { queryKey, defaultLabel }) {
  const siteTitle = vm.$site.title || 'HelloCoder'
  const siteDescription = vm.$site.description || ''
  const raw = vm.$route.query[queryKey]
  const name = raw ? decodeQueryValue(raw) : defaultLabel
  const title = `${siteTitle} | ${name}`
  const description = raw
    ? `${siteTitle} 站点下与「${name}」相关的技术文章`
    : (siteDescription || `${siteTitle} - ${defaultLabel}页`)

  return {
    title,
    titleTemplate: null,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { name: 'keywords', content: `${name},${siteTitle},Java` }
    ]
  }
}
