/**
 * Estimate reading time in minutes from HTML/plain content.
 * Strips tags, counts words, assumes 200 words per minute (min 1).
 * @param {string} content
 * @returns {number}
 */
function calcReadTime(content) {
  if (!content || typeof content !== 'string') return 1
  const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (!text) return 1
  const words = text.split(' ').length
  return Math.max(1, Math.round(words / 200))
}

module.exports = { calcReadTime }
