'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Popular destinations surfaced on the 404 so a lost visitor has a way forward.
const POPULAR = [
  { href: '/news', label: 'News' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/video', label: 'Videos' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/events', label: 'Events' },
  { href: '/campaigns', label: 'Campaigns' },
]

export default function NotFound() {
  const router = useRouter()
  const [q, setQ] = useState('')

  function handleSearch(e) {
    e.preventDefault()
    const term = q.trim()
    // Send the query to the News archive, which supports `?q=` search.
    router.push(term ? `/news?q=${encodeURIComponent(term)}` : '/news')
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-lightbg">
      <div className="w-full max-w-lg text-center">
        <p className="text-6xl font-bold font-serif text-primary">404</p>
        <h1 className="mt-3 text-2xl font-semibold text-ink">Page not found</h1>
        <p className="mt-2 text-sm text-muted">
          The page you’re looking for doesn’t exist or may have moved.
        </p>

        <form onSubmit={handleSearch} className="mt-8 flex gap-2">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the site…"
            aria-label="Search the site"
            className="flex-grow px-4 py-2.5 rounded-soft border border-gray-300 bg-white text-ink placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-soft bg-primary text-white font-medium hover:opacity-90 transition-opacity"
          >
            Search
          </button>
        </form>

        <div className="mt-10">
          <p className="text-xs uppercase tracking-wide text-muted mb-3">Popular content</p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="px-4 py-1.5 rounded-full text-sm font-medium bg-white border border-gray-200 text-ink hover:border-primary hover:text-primary transition-colors"
              >
                {p.label}
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/"
          className="inline-block mt-10 text-sm font-medium text-primary hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  )
}
