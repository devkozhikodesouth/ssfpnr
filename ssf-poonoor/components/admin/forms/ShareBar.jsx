'use client'

import { useState } from 'react'
import Icon from '@/components/public/Icon'

/**
 * Admin share helper shown for a published content item. Builds the public URL
 * from the module's `publicBase` + slug and offers copy-link plus one-tap share
 * to WhatsApp / Facebook / X / Telegram. Uses the Web Share API when available
 * (mobile), falling back to the per-network share links. Renders nothing for a
 * draft (nothing to share yet).
 *
 * @param {{ publicBase: string, slug: string, title?: string,
 *   published?: boolean, compact?: boolean }} props
 */
export default function ShareBar({ publicBase, slug, title = '', published = true, compact = false }) {
  const [copied, setCopied] = useState(false)
  if (!published || !publicBase || !slug) return null

  // Resolve the absolute URL on the client so it matches the deployed origin.
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = `${origin}${publicBase}/${slug}`
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const networks = [
    { name: 'WhatsApp', icon: 'whatsapp', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { name: 'Facebook', icon: 'facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { name: 'X', icon: 'twitter', href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { name: 'Telegram', icon: 'telegram', href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}` },
  ]

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard may be blocked (insecure context); ignore silently.
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // user cancelled
      }
    } else {
      copyLink()
    }
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={nativeShare}
        title={`Share ${title}`}
        className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors inline-flex items-center gap-1"
      >
        <Icon name="share" className="w-3.5 h-3.5" /> Share
      </button>
    )
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-gray-200 flex items-center gap-2">
          <Icon name="share" className="w-4 h-4 text-emerald-400" /> Share this {title ? 'item' : 'page'}
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1"
        >
          <Icon name="globe" className="w-3.5 h-3.5" /> View live
        </a>
      </div>

      <div className="flex items-center gap-2">
        <input
          readOnly
          value={url}
          onFocus={(e) => e.target.select()}
          className="flex-1 min-w-0 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 text-xs focus:outline-none"
        />
        <button
          type="button"
          onClick={copyLink}
          className="shrink-0 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors"
        >
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {networks.map((n) => (
          <a
            key={n.name}
            href={n.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors"
          >
            <Icon name={n.icon} className="w-3.5 h-3.5" /> {n.name}
          </a>
        ))}
      </div>
    </div>
  )
}
