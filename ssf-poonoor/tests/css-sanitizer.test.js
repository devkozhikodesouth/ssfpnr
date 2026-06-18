const test = require('node:test')
const assert = require('node:assert/strict')
const sanitizeCss = require('../lib/css-sanitizer')

// PLAN Phase 9a — the per-item custom CSS sanitizer must reject the dangerous
// patterns from PLAN §11.3 while leaving legitimate CSS untouched.

test('@import is rejected and stripped', () => {
  const { sanitized, errors } = sanitizeCss('@import url("https://evil.test/x.css"); .a { color: red }')
  assert.ok(errors.some((e) => /@import/i.test(e)), 'should report an @import error')
  assert.ok(!/@import/i.test(sanitized), 'should strip the @import')
})

test('expression() is rejected and stripped', () => {
  const { sanitized, errors } = sanitizeCss('.a { width: expression(alert(1)) }')
  assert.ok(errors.some((e) => /expression/i.test(e)), 'should report an expression() error')
  assert.ok(!/expression\s*\(/i.test(sanitized), 'should strip expression()')
})

test('position:fixed on body is rejected and stripped', () => {
  const { sanitized, errors } = sanitizeCss('body { position: fixed; top: 0 }')
  assert.ok(
    errors.some((e) => /position: fixed/i.test(e)),
    'should report a position:fixed error'
  )
  assert.ok(!/position\s*:\s*fixed/i.test(sanitized), 'should strip position:fixed from body')
})

test('javascript: URL is rejected and stripped', () => {
  const { sanitized, errors } = sanitizeCss('.a { background: url(javascript:alert(1)) }')
  assert.ok(errors.some((e) => /javascript:/i.test(e)), 'should report a javascript: URL error')
  assert.ok(!/javascript:/i.test(sanitized), 'should strip the javascript: URL')
})

test('normal CSS passes unchanged', () => {
  const css = '.headline { color: #1a6b47; font-size: 1.25rem }\n.box { padding: 8px; position: absolute }'
  const { sanitized, errors } = sanitizeCss(css)
  assert.equal(errors.length, 0, 'should report no errors')
  assert.equal(sanitized, css.trim(), 'should leave clean CSS intact')
})

test('position:fixed on a scoped (non-body) selector is allowed', () => {
  const css = '.sticky-note { position: fixed; bottom: 1rem }'
  const { errors } = sanitizeCss(css)
  assert.equal(errors.length, 0, 'scoped position:fixed should not be rejected')
})

test('empty / non-string input is handled gracefully', () => {
  assert.deepEqual(sanitizeCss(''), { sanitized: '', errors: [] })
  assert.deepEqual(sanitizeCss(undefined), { sanitized: '', errors: [] })
})
