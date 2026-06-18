/**
 * Small presentational formatters shared across public components, so date /
 * file-size / YouTube parsing lives in one place (CONVENTIONS: no duplicate
 * utilities).
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "Jun 12, 2026" — safe on null/invalid input (returns ''). */
export function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return `${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`
}

/** Split a date into { day: "28", month: "JUN" } for date-block badges. */
export function dateParts(value) {
  if (!value) return { day: '', month: '' }
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return { day: '', month: '' }
  return { day: String(d.getDate()).padStart(2, '0'), month: MONTHS[d.getMonth()].toUpperCase() }
}

/** Extract the 11-char YouTube video id from any common URL shape. */
export function youTubeId(url) {
  if (!url) return null
  const m = String(url).match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  )
  if (m) return m[1]
  // Bare id fallback.
  if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url
  return null
}

/** YouTube thumbnail URL from a video link (falls back when no id). */
export function youTubeThumb(url) {
  const id = youTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}

/** Human-readable file size from a byte count. */
export function formatFileSize(bytes) {
  if (!bytes || bytes <= 0) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  let n = bytes
  let i = 0
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i += 1
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`
}

/** Compute the upcoming/ongoing/past status of an event from its dates. */
export function eventStatus(fromDate, toDate) {
  const now = Date.now()
  const from = fromDate ? new Date(fromDate).getTime() : null
  const to = toDate ? new Date(toDate).getTime() : from
  if (from && now < from) return 'upcoming'
  if (to && now > to) return 'past'
  if (from) return 'ongoing'
  return 'upcoming'
}
