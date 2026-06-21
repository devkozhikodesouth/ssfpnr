// Convert a Website Builder typography override object into an inline style.
// All fields are optional; returns undefined when nothing is set so callers can
// spread it without forcing an empty style object. Shared by public components
// (Hero, Live, section headers, About) so the per-field font/size/weight/align
// controls behave identically everywhere.
//
// @param {{ fontFamily?, fontSize?, fontWeight?, align?, color? }} t
function typeStyle(t) {
  if (!t || typeof t !== 'object') return undefined
  const s = {}
  if (t.fontFamily) s.fontFamily = t.fontFamily
  if (t.fontSize) s.fontSize = t.fontSize
  if (t.fontWeight) s.fontWeight = String(t.fontWeight)
  if (t.align) s.textAlign = t.align
  if (t.color) s.color = t.color
  return Object.keys(s).length ? s : undefined
}

// Merge a base style with a typography override (override wins).
function withType(base, t) {
  const ts = typeStyle(t)
  if (!base && !ts) return undefined
  return { ...(base || {}), ...(ts || {}) }
}

module.exports = { typeStyle, withType }
