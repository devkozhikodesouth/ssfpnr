// Builds a CSS @font-face declaration from a Font document. Shared by the upload
// route (which stores the generated string) and FontInjector (which renders it).

/**
 * @param {{ name: string, files?: { woff2?: string, woff?: string, ttf?: string },
 *           weights?: number[], styles?: string[] }} font
 * @returns {string} a single @font-face rule, or '' if no files are present
 */
function buildFontFace(font) {
  if (!font?.name || !font.files) return ''

  const srcs = []
  if (font.files.woff2) srcs.push(`url('${font.files.woff2}') format('woff2')`)
  if (font.files.woff) srcs.push(`url('${font.files.woff}') format('woff')`)
  if (font.files.ttf) srcs.push(`url('${font.files.ttf}') format('truetype')`)
  if (!srcs.length) return ''

  const weights = Array.isArray(font.weights) && font.weights.length ? font.weights : [400]
  const min = Math.min(...weights)
  const max = Math.max(...weights)
  const fontWeight = min === max ? String(min) : `${min} ${max}`

  const styles = Array.isArray(font.styles) && font.styles.length ? font.styles : ['normal']
  const fontStyle = styles.includes('normal') ? 'normal' : styles[0]

  return [
    '@font-face {',
    `  font-family: '${font.name}';`,
    `  src: ${srcs.join(',\n       ')};`,
    `  font-weight: ${fontWeight};`,
    `  font-style: ${fontStyle};`,
    '  font-display: swap;',
    '}',
  ].join('\n')
}

module.exports = { buildFontFace }
