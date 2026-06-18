'use client'

import { useEffect } from 'react'

/**
 * Fires a one-shot POST to the module's view endpoint on mount to increment the
 * self-hosted view counter (PLAN §13.4). The endpoint rate-limits per IP+item,
 * so React Strict Mode's double-invoke in dev counts at most once. Renders
 * nothing.
 *
 * @param {{ module: string, id: string }} props
 */
export default function ViewTracker({ module, id }) {
  useEffect(() => {
    if (!module || !id) return
    // keepalive so the request survives a fast navigation away.
    fetch(`/api/${module}/${id}/view`, { method: 'POST', keepalive: true }).catch(() => {})
  }, [module, id])

  return null
}
