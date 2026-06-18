'use client'

import { useEffect } from 'react'

/**
 * Registers the PWA service worker (PLAN §14.4). Client-only; renders nothing.
 * Registration is deferred to the load event so it never competes with initial
 * page rendering. Only runs in production builds — an active SW in dev interferes
 * with HMR.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator)) return
    const onLoad = () => navigator.serviceWorker.register('/sw.js').catch(() => {})
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  return null
}
