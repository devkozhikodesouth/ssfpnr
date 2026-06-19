'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const form = new FormData(e.currentTarget)
    const password = form.get('password')
    const confirm = form.get('confirm')
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.get('username'),
          password,
          resetKey: form.get('resetKey'),
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.error || 'Reset failed')
      } else {
        setSuccess(data.message || 'Password updated. Redirecting to sign in…')
        setTimeout(() => router.push('/app/login'), 1500)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-sm bg-gray-900 rounded-xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-1">Reset Password</h1>
        <p className="text-gray-400 text-sm mb-6">
          Emergency reset for any admin account. Requires the server reset key.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1" htmlFor="username">
              Username
            </label>
            <input id="username" name="username" type="text" required className={inputClass} />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1" htmlFor="password">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={10}
              autoComplete="new-password"
              className={inputClass}
            />
            <p className="text-gray-500 text-xs mt-1">At least 10 characters.</p>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1" htmlFor="confirm">
              Confirm Password
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              required
              autoComplete="new-password"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1" htmlFor="resetKey">
              Reset Key
            </label>
            <input
              id="resetKey"
              name="resetKey"
              type="password"
              required
              autoComplete="off"
              className={inputClass}
            />
          </div>

          {error && (
            <p role="alert" className="text-red-400 text-sm">
              {error}
            </p>
          )}
          {success && <p className="text-emerald-400 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </form>

        <Link
          href="/app/login"
          className="block text-center text-sm text-gray-400 hover:text-emerald-400 mt-6 transition-colors"
        >
          ← Back to sign in
        </Link>
      </div>
    </div>
  )
}
