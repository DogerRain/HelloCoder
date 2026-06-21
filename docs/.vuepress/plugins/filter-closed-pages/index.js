const { isPageOpen } = require('../../theme/node_utils/modules/isPageOpen')

function collectClosedPageKeys (pages) {
  const closedPermalinks = new Set()
  const closedPaths = new Set()

  pages.forEach(page => {
    if (isPageOpen(page.frontmatter)) {
      return
    }
    closedPaths.add(page.path)
    closedPaths.add(page.regularPath)
    if (page.frontmatter && page.frontmatter.permalink) {
      closedPermalinks.add(page.frontmatter.permalink)
    }
  })

  return { closedPermalinks, closedPaths }
}

function filterSidebarItems (items, closedPermalinks) {
  if (!Array.isArray(items)) {
    return items
  }

  return items.reduce((result, item) => {
    if (Array.isArray(item)) {
      const permalink = item[2]
      if (permalink && closedPermalinks.has(permalink)) {
        return result
      }
      result.push(item)
      return result
    }

    if (item && Array.isArray(item.children)) {
      const children = filterSidebarItems(item.children, closedPermalinks)
      if (!children.length) {
        return result
      }
      result.push(Object.assign({}, item, { children }))
    }

    return result
  }, [])
}

function filterCatalogue (catalogue, closedPermalinks) {
  if (!catalogue || typeof catalogue !== 'object') {
    return catalogue
  }

  const nextCatalogue = {}
  Object.keys(catalogue).forEach(key => {
    const permalink = catalogue[key]
    if (!closedPermalinks.has(permalink)) {
      nextCatalogue[key] = permalink
    }
  })
  return nextCatalogue
}

function filterSidebar (sidebar, closedPermalinks) {
  if (!sidebar) {
    return sidebar
  }

  if (Array.isArray(sidebar)) {
    return filterSidebarItems(sidebar, closedPermalinks)
  }

  if (typeof sidebar !== 'object') {
    return sidebar
  }

  const nextSidebar = {}
  Object.keys(sidebar).forEach(key => {
    if (key === 'catalogue') {
      nextSidebar.catalogue = filterCatalogue(sidebar.catalogue, closedPermalinks)
      return
    }
    nextSidebar[key] = filterSidebarItems(sidebar[key], closedPermalinks)
  })
  return nextSidebar
}

module.exports = (options, ctx) => ({
  name: 'filter-closed-pages',

  ready () {
    const { pages, themeConfig } = ctx
    const { closedPermalinks } = collectClosedPageKeys(pages)

    for (let i = pages.length - 1; i >= 0; i--) {
      if (!isPageOpen(pages[i].frontmatter)) {
        pages.splice(i, 1)
      }
    }

    if (themeConfig && themeConfig.sidebar && closedPermalinks.size) {
      themeConfig.sidebar = filterSidebar(themeConfig.sidebar, closedPermalinks)
    }
  }
})
