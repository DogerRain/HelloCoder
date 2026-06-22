import mermaid from 'mermaid'
import Vue from 'vue'

let initialized = false

function initMermaid () {
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
  if (!charts.length) return

  initMermaid()

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
}

export default ({ router, isServer }) => {
  if (isServer) return

  const scheduleRender = () => {
    Vue.nextTick(() => {
      renderMermaidCharts()
    })
  }

  router.onReady(scheduleRender)
  router.afterEach(scheduleRender)
}
