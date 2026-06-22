const path = require('path')

module.exports = (options, ctx) => ({
  name: 'markdown-mermaid',

  enhanceAppFiles: [
    path.resolve(__dirname, 'enhanceApp.js')
  ],

  extendMarkdown (md) {
    const defaultFence = md.renderer.rules.fence

    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
      const token = tokens[idx]
      const lang = token.info ? token.info.trim().split(/\s+/)[0] : ''

      if (lang === 'mermaid') {
        const source = md.utils.escapeHtml(token.content)
        return `<div class="mermaid-chart" v-pre><pre class="mermaid-source">${source}</pre></div>\n`
      }

      return defaultFence(tokens, idx, options, env, self)
    }
  }
})
