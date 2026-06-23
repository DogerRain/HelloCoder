import Vue from 'vue'

const MERMAID_SCRIPT = '/js/mermaid.min.js'

const EXPAND_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>'

const CLOSE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'

let mermaidPromise = null
let initialized = false
let lightbox = null
let bodyScrollLocked = false

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

function ensureLightbox () {
  if (lightbox) return lightbox

  lightbox = document.createElement('div')
  lightbox.className = 'mermaid-lightbox'
  lightbox.innerHTML = `
    <div class="mermaid-lightbox-backdrop"></div>
    <div class="mermaid-lightbox-panel" role="dialog" aria-modal="true" aria-label="Mermaid diagram preview">
      <button type="button" class="mermaid-lightbox-close" aria-label="Close">${CLOSE_ICON}</button>
      <div class="mermaid-lightbox-body"></div>
    </div>
  `

  lightbox.querySelector('.mermaid-lightbox-backdrop').addEventListener('click', closeLightbox)
  lightbox.querySelector('.mermaid-lightbox-close').addEventListener('click', closeLightbox)
  document.addEventListener('keydown', onLightboxKeydown)
  document.body.appendChild(lightbox)

  return lightbox
}

function onLightboxKeydown (event) {
  if (event.key === 'Escape' && lightbox?.classList.contains('is-open')) {
    closeLightbox()
  }
}

function openLightbox (svgEl) {
  const modal = ensureLightbox()
  const body = modal.querySelector('.mermaid-lightbox-body')
  body.innerHTML = ''

  const clone = svgEl.cloneNode(true)
  clone.removeAttribute('style')
  clone.style.maxWidth = '100%'
  clone.style.height = 'auto'
  clone.style.display = 'block'
  body.appendChild(clone)

  modal.classList.add('is-open')
  document.body.style.overflow = 'hidden'
  bodyScrollLocked = true
}

function closeLightbox () {
  if (!lightbox?.classList.contains('is-open')) return

  lightbox.classList.remove('is-open')
  lightbox.querySelector('.mermaid-lightbox-body').innerHTML = ''

  if (bodyScrollLocked) {
    document.body.style.overflow = ''
    bodyScrollLocked = false
  }
}

function addZoomButton (chart, svgEl) {
  let button = chart.querySelector('.mermaid-zoom-btn')
  if (!button) {
    button = document.createElement('button')
    button.type = 'button'
    button.className = 'mermaid-zoom-btn'
    button.setAttribute('aria-label', 'Enlarge diagram')
    button.innerHTML = EXPAND_ICON
    chart.appendChild(button)
    button.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      openLightbox(svgEl)
    })
  }
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
      chart.innerHTML = svg
      const svgEl = chart.querySelector('svg')
      styleSvg(svgEl)
      addZoomButton(chart, svgEl)
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
  router.afterEach(() => {
    closeLightbox()
    scheduleMermaidRender()
  })
}
