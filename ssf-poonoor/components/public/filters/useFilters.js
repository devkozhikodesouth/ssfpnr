'use client'

import { useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

/**
 * URL-as-state helper shared by every filter control (PLAN §12.3 — shareable
 * links). Reading is via useSearchParams; writing always resets ?page back to 1
 * so a filter change never lands on an out-of-range page.
 *
 * Returns helpers that all mutate the query string of the current pathname.
 */
export function useFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const get = useCallback((key) => searchParams.get(key) || '', [searchParams])

  const buildHref = useCallback(
    (changes) => {
      const next = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(changes)) {
        if (value === null || value === undefined || value === '') next.delete(key)
        else next.set(key, value)
      }
      next.delete('page')
      const qs = next.toString()
      return qs ? `${pathname}?${qs}` : pathname
    },
    [pathname, searchParams]
  )

  const setParam = useCallback((key, value) => router.push(buildHref({ [key]: value }), { scroll: false }), [router, buildHref])
  const setMany = useCallback((changes) => router.push(buildHref(changes), { scroll: false }), [router, buildHref])

  return { get, searchParams, buildHref, setParam, setMany, pathname }
}
