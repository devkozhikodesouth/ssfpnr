'use client'

import { useState } from 'react'
import Icon from '@/components/public/Icon'

/**
 * Newsletter subscribe strip (PLAN §15.1 #10) — toggleable homepage section.
 * No mailing backend is in scope for Phase 7, so submit simply acknowledges
 * locally; wiring a provider is a later concern.
 *
 * @param {{ config?: object }} props
 */
export default function Newsletter({ config = {} }) {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setDone(true)
  }

  return (
    <section className="bg-darkbg text-white">
      <div className="max-w-3xl mx-auto px-6 py-12 text-center space-y-4">
        <span className="block text-[10px] font-bold text-accent uppercase tracking-widest">Stay Updated</span>
        <h2 className="text-2xl font-bold font-serif">{config.title || 'Subscribe to our Newsletter'}</h2>
        <p className="text-sm text-gray-400">
          {config.subtitle || 'Get the latest news, events and campaigns from SSF Poonoor in your inbox.'}
        </p>
        {done ? (
          <p className="text-sm font-semibold text-accent flex items-center justify-center gap-2">
            <Icon name="mail" className="w-4 h-4" /> Thanks for subscribing!
          </p>
        ) : (
          <form onSubmit={submit} className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 rounded-soft px-4 py-2.5 text-sm text-ink focus:outline-none"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-secondary text-white text-sm font-bold px-5 py-2.5 rounded-soft transition-colors"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
