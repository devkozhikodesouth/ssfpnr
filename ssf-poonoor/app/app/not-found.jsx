import Link from 'next/link'

/**
 * 404 for the admin panel (/app/*). Inherits the AdminShell chrome from the
 * /app layout, so the sidebar/top-bar stay in place around it.
 */
export default function AdminNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center">
        <p className="text-6xl font-black text-emerald-600/30">404</p>
        <h1 className="mt-2 text-xl font-bold text-white">Page not found</h1>
        <p className="mt-1 text-sm text-gray-400">
          The admin page you’re looking for doesn’t exist or has moved.
        </p>
        <Link
          href="/app/dashboard"
          className="inline-block mt-5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
