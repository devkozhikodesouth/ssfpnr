/**
 * Recursively merge `source` into `target`, returning a new object. Plain
 * objects are merged key-by-key; arrays and primitives REPLACE the target value
 * (so e.g. homepage.sections or bottomNavItems are swapped wholesale, never
 * element-merged). Used by PUT /api/site-config to apply partial config updates
 * to the singleton without clobbering untouched branches.
 *
 * @param {object} target
 * @param {object} source
 * @returns {object}
 */
function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  )
}

function deepMerge(target, source) {
  if (!isPlainObject(source)) return source
  const out = isPlainObject(target) ? { ...target } : {}
  for (const key of Object.keys(source)) {
    const sourceVal = source[key]
    if (isPlainObject(sourceVal)) {
      out[key] = deepMerge(out[key], sourceVal)
    } else {
      out[key] = sourceVal
    }
  }
  return out
}

module.exports = { deepMerge, isPlainObject }
