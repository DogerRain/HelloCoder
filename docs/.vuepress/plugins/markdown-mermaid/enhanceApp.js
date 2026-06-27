import '../../styles/mermaid.styl'

import Vue from 'vue'

const MERMAID_SCRIPT = '/js/mermaid.min.js'

const EXPAND_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>'

const CLOSE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'

const INLINE_MAX_HEIGHT_RATIO = 0.5

let mermaidPromise = null
let initialized = false
let lightbox = null
let lightboxResizeHandler = null

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

function getSvgDimensions (svgEl) {
  const viewBox = svgEl.viewBox?.baseVal
  if (viewBox && viewBox.width > 0 && viewBox.height > 0) {
    return { width: viewBox.width, height: viewBox.height }
  }

  const widthAttr = Number.parseFloat(svgEl.getAttribute('width') || '')
  const heightAttr = Number.parseFloat(svgEl.getAttribute('height') || '')
  if (Number.isFinite(widthAttr) && Number.isFinite(heightAttr) && widthAttr > 0 && heightAttr > 0) {
    return { width: widthAttr, height: heightAttr }
  }

  const box = svgEl.getBoundingClientRect()
  return { width: Math.max(box.width, 1), height: Math.max(box.height, 1) }
}

function fitSvgToViewport (viewport, svgEl, { maxScale = Infinity, padding = 48 } = {}) {
  svgEl.style.display = 'block'
  svgEl.style.maxWidth = 'none'
  svgEl.style.maxHeight = 'none'
  svgEl.style.margin = '0 auto'
  svgEl.removeAttribute('width')
  svgEl.removeAttribute('height')
  svgEl.style.removeProperty('transform')
  svgEl.style.removeProperty('transform-origin')
  svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet')

  const fitToView = () => {
    const { width, height } = getSvgDimensions(svgEl)
    const vp = viewport.getBoundingClientRect()
    if (vp.width <= 0 || vp.height <= 0 || width <= 0 || height <= 0) return

    const scaleX = (vp.width - padding) / width
    const scaleY = (vp.height - padding) / height
    const scale = Math.min(scaleX, scaleY, maxScale)

    svgEl.style.width = `${Math.round(width * scale)}px`
    svgEl.style.height = `${Math.round(height * scale)}px`
  }

  requestAnimationFrame(fitToView)
  return fitToView
}

function parseViewBox (svgEl) {
  const viewBox = svgEl.getAttribute('viewBox')
  if (!viewBox) return null

  const parts = viewBox.trim().split(/[\s,]+/).map(Number)
  if (parts.length < 4 || !parts[2] || !parts[3]) return null

  return { width: parts[2], height: parts[3] }
}

function fitSvgToBounds (svgEl, maxWidth, maxHeight, allowUpscale = false) {
  if (!svgEl || maxWidth <= 0 || maxHeight <= 0) return

  svgEl.removeAttribute('width')
  svgEl.removeAttribute('height')
  svgEl.style.removeProperty('transform')
  svgEl.style.removeProperty('transform-origin')
  svgEl.style.display = 'block'
  svgEl.style.margin = '0 auto'
  svgEl.style.maxWidth = '100%'
  svgEl.style.maxHeight = `${maxHeight}px`
  svgEl.style.width = 'auto'
  svgEl.style.height = 'auto'
  svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet')

  const viewBox = parseViewBox(svgEl)
  if (!viewBox) return

  let scale = Math.min(maxWidth / viewBox.width, maxHeight / viewBox.height)
  if (!allowUpscale) scale = Math.min(scale, 1)

  svgEl.style.width = `${Math.round(viewBox.width * scale)}px`
  svgEl.style.height = `${Math.round(viewBox.height * scale)}px`
}

function getInlineBounds (chart) {
  const width = Math.min(window.innerWidth * 0.9, 720)
  const height = window.innerHeight * INLINE_MAX_HEIGHT_RATIO

  return { width, height }
}

function fitInlineSvg (svgEl, chart) {
  const bounds = getInlineBounds(chart)
  fitSvgToBounds(svgEl, bounds.width, bounds.height)
}

function ensureLightbox () {
  if (lightbox) return lightbox

  lightbox = document.createElement('div')
  lightbox.className = 'mermaid-lightbox'
  lightbox.hidden = true
  lightbox.innerHTML = `
    <div class="mermaid-lightbox-backdrop" data-close></div>
    <div class="mermaid-lightbox-panel" role="dialog" aria-modal="true" aria-label="Mermaid diagram preview">
      <button type="button" class="mermaid-lightbox-close" data-close aria-label="Close">${CLOSE_ICON}</button>
      <div class="mermaid-lightbox-viewport">
        <div class="mermaid-lightbox-body"></div>
      </div>
    </div>
  `

  const close = () => closeLightbox()

  lightbox.querySelectorAll('[data-close]').forEach((el) => {
    el.addEventListener('click', close)
  })

  document.addEventListener('keydown', onLightboxKeydown)
  document.body.appendChild(lightbox)

  return lightbox
}

function onLightboxKeydown (event) {
  if (event.key === 'Escape' && lightbox && !lightbox.hidden) {
    closeLightbox()
  }
}

function openLightbox (svgEl) {
  if (!svgEl) return

  const modal = ensureLightbox()
  const viewport = modal.querySelector('.mermaid-lightbox-viewport')
  const body = modal.querySelector('.mermaid-lightbox-body')

  body.innerHTML = ''

  const clone = svgEl.cloneNode(true)
  clone.removeAttribute('style')
  body.appendChild(clone)

  if (lightboxResizeHandler) {
    window.removeEventListener('resize', lightboxResizeHandler)
  }

  lightboxResizeHandler = fitSvgToViewport(viewport, clone, { padding: 48 })
  window.addEventListener('resize', lightboxResizeHandler)

  modal.hidden = false
  document.body.classList.add('mermaid-lightbox-open')
  requestAnimationFrame(lightboxResizeHandler)
}

function closeLightbox () {
  if (!lightbox || lightbox.hidden) return

  if (lightboxResizeHandler) {
    window.removeEventListener('resize', lightboxResizeHandler)
    lightboxResizeHandler = null
  }

  lightbox.hidden = true
  lightbox.querySelector('.mermaid-lightbox-body').innerHTML = ''
  document.body.classList.remove('mermaid-lightbox-open')
}

function addZoomButton (viewport, svgEl) {
  if (!viewport || viewport.querySelector('.mermaid-zoom-btn')) return

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'mermaid-zoom-btn'
  button.setAttribute('aria-label', 'Enlarge diagram')
  button.innerHTML = EXPAND_ICON
  viewport.appendChild(button)

  button.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()
    openLightbox(svgEl)
  })
}

function refitRenderedCharts () {
  document.querySelectorAll('.mermaid-chart.is-rendered').forEach((chart) => {
    const svgEl = chart.querySelector('.mermaid-chart-viewport svg')
    if (svgEl) fitInlineSvg(svgEl, chart)
  })

  if (lightbox && !lightbox.hidden) {
    const svgEl = lightbox.querySelector('.mermaid-lightbox-body svg')
    const viewport = lightbox.querySelector('.mermaid-lightbox-viewport')
    if (svgEl && viewport && lightboxResizeHandler) {
      lightboxResizeHandler()
    }
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
      chart.innerHTML = `<div class="mermaid-chart-viewport">${svg}</div>`
      const viewport = chart.querySelector('.mermaid-chart-viewport')
      const svgEl = viewport?.querySelector('svg')
      if (svgEl) {
        fitInlineSvg(svgEl, chart)
        addZoomButton(viewport, svgEl)
      }
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

let resizeTimer = null
function onWindowResize () {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(refitRenderedCharts, 150)
}

export default ({ router, isServer }) => {
  if (isServer) return

  window.addEventListener('resize', onWindowResize)
  router.onReady(scheduleMermaidRender)
  router.afterEach(() => {
    closeLightbox()
    scheduleMermaidRender()
  })
}
