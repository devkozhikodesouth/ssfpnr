/**
 * STUB — returns input unchanged.
 * Full sanitization (strips @import, expression(), behavior:, javascript: urls,
 * position:fixed on body selectors) is implemented in Phase 3.
 * Max CSS size enforced at API layer: 50 KB per item.
 * @param {string} css
 * @returns {string}
 */
function sanitizeCss(css) {
  return css
}

module.exports = sanitizeCss
