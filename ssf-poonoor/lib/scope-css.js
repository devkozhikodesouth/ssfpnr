/**
 * Scope already-sanitized per-item CSS to a single article (PLAN §11.2). Every
 * top-level selector is prefixed with the article's `[data-article="ID"]` scope
 * so the styles cannot leak outside the article wrapper. @media / @supports
 * blocks are recursed into; @keyframes / @font-face bodies are left intact
 * (their inner "selectors" are frame stops / descriptors, not real selectors).
 *
 * @param {string} css   sanitized CSS (see lib/css-sanitizer)
 * @param {string} scope e.g. `[data-article="abc123"]`
 * @returns {string}
 */
function scopeCss(css, scope) {
  if (!css || typeof css !== 'string') return ''
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '') // drop comments
  return scopeRules(stripped, scope).trim()
}

function readBlock(css, openIndex) {
  // openIndex points at '{'. Return inner content + index just past matching '}'.
  let depth = 0
  for (let i = openIndex; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1
    else if (css[i] === '}') {
      depth -= 1
      if (depth === 0) return { inner: css.slice(openIndex + 1, i), end: i + 1 }
    }
  }
  // Unbalanced — treat the rest as the block body.
  return { inner: css.slice(openIndex + 1), end: css.length }
}

function scopeRules(css, scope) {
  let out = ''
  let i = 0
  while (i < css.length) {
    const brace = css.indexOf('{', i)
    if (brace === -1) {
      out += css.slice(i)
      break
    }
    const prelude = css.slice(i, brace).trim()
    const { inner, end } = readBlock(css, brace)

    if (prelude.startsWith('@')) {
      const lower = prelude.toLowerCase()
      if (lower.startsWith('@media') || lower.startsWith('@supports')) {
        out += `${prelude}{${scopeRules(inner, scope)}}`
      } else {
        out += `${prelude}{${inner}}`
      }
    } else if (prelude) {
      const scoped = prelude
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => `${scope} ${s}`)
        .join(', ')
      out += `${scoped}{${inner}}`
    }
    i = end
  }
  return out
}

module.exports = { scopeCss }
