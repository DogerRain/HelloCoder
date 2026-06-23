import Vue from 'vue'

const MERMAID_SCRIPT = '/js/mermaid.min.js'

const ICON_ZOOM = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>'
const ICON_DOWNLOAD = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>'

let mermaidPromise = null
let initialized = false
let modalKeydownBound = false

function loadMermaid () {
  if (typeof window === 'undefined') return Promise.resolve(null)
  if (window.mermaid) return Promise.resolve(window.mermaid)
  if (mermaidPromise) return mermaidPromise

  mermaidPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${MERMAID_SCRIPT}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(window.mermaid))
      existing.addEventListener('error', () => reject(new Error('Failed to load mermaid script')))
      return
    }

    const script = document.createElement('script')
    script.src = MERMAID_SCRIPT
    script.async = true
    script.onload = () => {
      if (window.mermaid) resolve(window.mermaid)
      else reject(new Error('mermaid script loaded but window.mermaid is missing'))
    }
    script.onerror = () => reject(new Error('Failed to load mermaid script'))
    document.head.appendChild(script)
  })

  return mermaidPromise
}

function initMermaid (mermaid) {
  if (initialized) return

  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
    fontFamily: '"Microsoft YaHei", system-ui, -apple-system, "Segoe UI", sans-serif'
  })

  initialized = true
}

function styleSvg (svgEl) {
  if (!svgEl) return
  svgEl.style.maxWidth = '100%'
  svgEl.style.height = 'auto'
  svgEl.style.display = 'block'
}

function createToolbarButton (className, title, iconHtml, onClick) {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = `mermaid-toolbar-btn ${className}`
  button.title = title
  button.setAttribute('aria-label', title)
  button.innerHTML = iconHtml
  button.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()
    onClick()
  })
  return button
}

function ensureMermaidModal () {
  let modal = document.getElementById('mermaid-lightbox')
  if (modal) return modal

  modal = document.createElement('div')
  modal.id = 'mermaid-lightbox'
  modal.className = 'mermaid-lightbox'
  modal.innerHTML = `
    <div class="mermaid-lightbox-backdrop" data-mermaid-close></div>
    <div class="mermaid-lightbox-panel" role="dialog" aria-modal="true" aria-label="Mermaid diagram preview">
      <button type="button" class="mermaid-lightbox-close" data-mermaid-close aria-label="Close preview">&times;</button>
      <div class="mermaid-lightbox-diagram"></div>
    </div>
  `
  document.body.appendChild(modal)

  modal.querySelectorAll('[data-mermaid-close]').forEach((el) => {
    el.addEventListener('click', closeMermaidModal)
  })

  if (!modalKeydownBound) {
    document.addEventListener('keydown', onMermaidModalKeydown)
    modalKeydownBound = true
  }

  return modal
}

function openMermaidModal (svgString) {
  const modal = ensureMermaidModal()
  const diagram = modal.querySelector('.mermaid-lightbox-diagram')
  diagram.innerHTML = svgString
  styleSvg(diagram.querySelector('svg'))
  modal.classList.add('is-open')
  document.body.classList.add('mermaid-lightbox-open')
}

function closeMermaidModal () {
  const modal = document.getElementById('mermaid-lightbox')
  if (!modal) return
  modal.classList.remove('is-open')
  document.body.classList.remove('mermaid-lightbox-open')
}

function onMermaidModalKeydown (event) {
  if (event.key === 'Escape') closeMermaidModal()
}

function downloadMermaidSvg (svgString, chartId) {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${chartId || 'mermaid-diagram'}.svg`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function wrapRenderedSvg (svgString, chartId) {
  const inner = document.createElement('div')
  inner.className = 'mermaid-chart-inner'

  const toolbar = document.createElement('div')
  toolbar.className = 'mermaid-toolbar'
  toolbar.appendChild(createToolbarButton('mermaid-zoom-btn', 'Zoom diagram', ICON_ZOOM, () => {
    openMermaidModal(svgString)
  }))
  toolbar.appendChild(createToolbarButton('mermaid-download-btn', 'Download SVG', ICON_DOWNLOAD, () => {
    downloadMermaidSvg(svgString, chartId)
  }))

  const diagram = document.createElement('div')
  diagram.className = 'mermaid-diagram'
  diagram.innerHTML = svgString
  styleSvg(diagram.querySelector('svg'))

  inner.appendChild(toolbar)
  inner.appendChild(diagram)
  return inner
}

async function renderMermaidCharts (container) {
  const root = container || document
  const charts = root.querySelectorAll('.mermaid-chart:not([data-rendered])')
  if (!charts.length) return false

  let mermaid
  try {
    mermaid = await loadMermaid()
  } catch (err) {
    charts.forEach((chart) => {
      chart.setAttribute('data-rendered', 'error')
      chart.classList.add('is-error')
      chart.innerHTML = `<pre class="mermaid-error">${err.message || String(err)}</pre>`
    })
    return true
  }

  initMermaid(mermaid)

  let index = 0
  for (const chart of charts) {
    const sourceEl = chart.querySelector('.mermaid-source')
    if (!sourceEl) continue

    const source = sourceEl.textContent.trim().replace(/\r\n?/g, '\n')
    if (!source) continue

    try {
      const chartId = `mermaid-diagram-${Date.now()}-${index++}`
      const { svg } = await mermaid.render(chartId, source)
      chart.innerHTML = ''
      chart.appendChild(wrapRenderedSvg(svg, chartId))
      chart.setAttribute('data-rendered', 'true')
      chart.classList.add('is-rendered')
    } catch (err) {
      chart.setAttribute('data-rendered', 'error')
      chart.classList.add('is-error')
      const message = err?.message || String(err)
      chart.innerHTML = `<pre class="mermaid-error">${message}</pre>`
    }
  }

  return true
}

function scheduleMermaidRender () {
  let attempts = 0
  const maxAttempts = 30

  const tryRender = async () => {
    attempts += 1
    const rendered = await renderMermaidCharts()
    if (!rendered && attempts < maxAttempts) {
      setTimeout(tryRender, 100)
    }
  }

  Vue.nextTick(() => {
    tryRender()
  })
}

export default ({ router, isServer }) => {
  if (isServer) return

  router.onReady(scheduleMermaidRender)
  router.afterEach(scheduleMermaidRender)
}
