/**
 * Sanitize per-item custom CSS before it is stored / rendered.
 *
 * Strips / rejects the dangerous patterns described in PLAN §11.3:
 *   - @import            (no external CSS loads)
 *   - expression()       (legacy IE script execution)
 *   - behavior:          (IE behavior attachments)
 *   - javascript: URLs   inside url(...)
 *   - <style>/<script>   stray HTML tags (CSS is not HTML)
 *   - position: fixed    on body-level selectors (body, html, :root, *)
 *
 * CSS is auto-scoped to the article at render time, so positional hijacking on
 * top-level selectors is the only positional risk worth blocking here.
 *
 * @param {string} css
 * @returns {{ sanitized: string, errors: string[] }}
 */
function sanitizeCss(css) {
  const errors = []

  if (typeof css !== 'string' || css.trim() === '') {
    return { sanitized: '', errors }
  }

  let out = css

  // Stray HTML tags — custom CSS must be raw CSS, never markup.
  if (/<\s*\/?\s*(style|script)\b[^>]*>/i.test(out)) {
    errors.push('HTML <style>/<script> tags are not allowed')
    out = out.replace(/<\s*\/?\s*(style|script)\b[^>]*>/gi, '')
  }

  // @import
  if (/@import/i.test(out)) {
    errors.push('@import is not allowed')
    out = out.replace(/@import[^;]*;?/gi, '')
  }

  // expression(...)
  if (/expression\s*\(/i.test(out)) {
    errors.push('expression() is not allowed')
    out = out.replace(/expression\s*\([^)]*\)/gi, '')
  }

  // behavior: ...
  if (/behavior\s*:/i.test(out)) {
    errors.push('behavior property is not allowed')
    out = out.replace(/behavior\s*:[^;}]*;?/gi, '')
  }

  // javascript: URLs inside url(...)
  if (/url\(\s*['"]?\s*javascript:/i.test(out)) {
    errors.push('javascript: URLs are not allowed')
    out = out.replace(/url\(\s*['"]?\s*javascript:[^)]*\)/gi, 'url()')
  }

  // position: fixed on body-level selectors
  out = out.replace(/([^{}]+)\{([^}]*)\}/g, (block, selector, body) => {
    const topLevel = selector
      .split(',')
      .some((s) => /^\s*(body|html|:root|\*)\s*$/i.test(s))
    if (topLevel && /position\s*:\s*fixed/i.test(body)) {
      errors.push('position: fixed is not allowed on body-level selectors')
      const cleaned = body.replace(/position\s*:\s*fixed\s*;?/gi, '')
      return `${selector}{${cleaned}}`
    }
    return block
  })

  return { sanitized: out.trim(), errors }
}

module.exports = sanitizeCss
