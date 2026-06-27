import Vue from 'vue'

const MERMAID_SCRIPT = '/js/mermaid.min.js'

const EXPAND_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>'

const CLOSE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'

const INLINE_MAX_HEIGHT_RATIO = 0.5
const LIGHTBOX_WIDTH_RATIO = 0.8
const LIGHTBOX_HEIGHT_RATIO = 0.8

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
  const viewport = chart.querySelector('.mermaid-chart-viewport') || chart
  const width = viewport.clientWidth || Math.min(window.innerWidth * 0.9, 720)
  const height = window.innerHeight * INLINE_MAX_HEIGHT_RATIO

  return { width, height }
}

function getLightboxBounds () {
  const horizontalPadding = 64
  const verticalPadding = 96

  return {
    width: Math.max(window.innerWidth * LIGHTBOX_WIDTH_RATIO - horizontalPadding, 240),
    height: Math.max(window.innerHeight * LIGHTBOX_HEIGHT_RATIO - verticalPadding, 240)
  }
}

function fitInlineSvg (svgEl, chart) {
  const bounds = getInlineBounds(chart)
  fitSvgToBounds(svgEl, bounds.width, bounds.height)
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
  if (!svgEl) return

  const modal = ensureLightbox()
  const body = modal.querySelector('.mermaid-lightbox-body')
  body.innerHTML = ''

  const clone = svgEl.cloneNode(true)
  clone.removeAttribute('style')
  body.appendChild(clone)

  const bounds = getLightboxBounds()
  fitSvgToBounds(clone, bounds.width, bounds.height, true)

  modal.classList.add('is-open')
  modal.setAttribute('aria-hidden', 'false')
  document.body.style.overflow = 'hidden'
  bodyScrollLocked = true
}

function closeLightbox () {
  if (!lightbox?.classList.contains('is-open')) return

  lightbox.classList.remove('is-open')
  lightbox.setAttribute('aria-hidden', 'true')
  lightbox.querySelector('.mermaid-lightbox-body').innerHTML = ''

  if (bodyScrollLocked) {
    document.body.style.overflow = ''
    bodyScrollLocked = false
  }
}

function addZoomButton (chart) {
  let button = chart.querySelector('.mermaid-zoom-btn')
  if (button) return

  button = document.createElement('button')
  button.type = 'button'
  button.className = 'mermaid-zoom-btn'
  button.setAttribute('aria-label', 'Enlarge diagram')
  button.innerHTML = EXPAND_ICON
  chart.appendChild(button)

  button.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()
    const currentSvg = chart.querySelector('.mermaid-chart-viewport svg, svg')
    openLightbox(currentSvg)
  })
}

function refitRenderedCharts () {
  document.querySelectorAll('.mermaid-chart.is-rendered').forEach((chart) => {
    const svgEl = chart.querySelector('.mermaid-chart-viewport svg, svg')
    if (svgEl) fitInlineSvg(svgEl, chart)
  })

  if (lightbox?.classList.contains('is-open')) {
    const svgEl = lightbox.querySelector('.mermaid-lightbox-body svg')
    if (svgEl) {
      const bounds = getLightboxBounds()
      fitSvgToBounds(svgEl, bounds.width, bounds.height, true)
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
      const svgEl = chart.querySelector('svg')
      fitInlineSvg(svgEl, chart)
      addZoomButton(chart)
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
