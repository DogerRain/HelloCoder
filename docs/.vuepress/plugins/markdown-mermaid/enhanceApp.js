import Vue from 'vue'

const MERMAID_SCRIPT = '/js/mermaid.min.js'

let mermaidPromise = null
let initialized = false

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
      const { svg } = await mermaid.render(`mermaid-diagram-${Date.now()}-${index++}`, source)
      chart.innerHTML = svg
      chart.setAttribute('data-rendered', 'true')
      chart.classList.add('is-rendered')

      const svgEl = chart.querySelector('svg')
      if (svgEl) {
        svgEl.style.maxWidth = '100%'
        svgEl.style.height = 'auto'
        svgEl.style.display = 'block'
      }
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
