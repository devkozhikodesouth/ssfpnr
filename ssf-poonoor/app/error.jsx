'use client'

import { useEffect } from 'react'
import Link from 'next/link'

/**
 * Global error boundary for the App Router (PLAN Phase 9a). Catches render /
 * data errors in any route segment below the root layout and offers a retry.
 */
export default function Error({ error, reset }) {
  useEffect(() => {
    // Surface the error for observability; details are never shown to the user.
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-lightbg">
      <div className="w-full max-w-lg text-center">
        <p className="text-6xl font-bold font-serif text-primary">Oops</p>
        <h1 className="mt-3 text-2xl font-semibold text-ink">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted">
          An unexpected error occurred while loading this page. Please try again.
        </p>
        {error?.digest ? (
          <p className="mt-2 text-xs text-gray-400">Reference: {error.digest}</p>
        ) : null}

        <div className="mt-8 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-soft bg-primary text-white font-medium hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-soft bg-white border border-gray-200 text-ink font-medium hover:border-primary hover:text-primary transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  )
}
