'use client'

import Link from 'next/link'
import { useFilters } from './useFilters'

/**
 * URL-based pagination (PLAN §12.3) preserving all active filter/sort params.
 * Renders a compact window of page numbers with prev/next.
 *
 * @param {{ page: number, totalPages: number }} props
 */
export default function Pagination({ page = 1, totalPages = 1 }) {
  const { searchParams, pathname } = useFilters()
  if (totalPages <= 1) return null

  const href = (p) => {
    const next = new URLSearchParams(searchParams.toString())
    if (p <= 1) next.delete('page')
    else next.set('page', String(p))
    const qs = next.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }

  // Page window: current ±2, clamped.
  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, start + 4)
  const pages = []
  for (let p = start; p <= end; p += 1) pages.push(p)

  const cell = 'w-9 h-9 rounded-soft flex items-center justify-center text-xs font-bold border transition-colors'

  return (
    <nav className="flex justify-center items-center gap-2 py-6" aria-label="Pagination">
      {page > 1 ? (
        <Link href={href(page - 1)} className={`${cell} border-gray-200 text-slate-700 hover:border-primary hover:text-primary`} aria-label="Previous page">
          ‹
        </Link>
      ) : (
        <span className={`${cell} border-gray-100 text-gray-300`}>‹</span>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={href(p)}
          aria-current={p === page ? 'page' : undefined}
          className={
            p === page
              ? `${cell} bg-primary text-white border-primary`
              : `${cell} border-gray-200 text-slate-700 hover:border-primary hover:text-primary`
          }
        >
          {p}
        </Link>
      ))}

      {page < totalPages ? (
        <Link href={href(page + 1)} className={`${cell} border-gray-200 text-slate-700 hover:border-primary hover:text-primary`} aria-label="Next page">
          ›
        </Link>
      ) : (
        <span className={`${cell} border-gray-100 text-gray-300`}>›</span>
      )}
    </nav>
  )
}
