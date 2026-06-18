'use client'

import { useState } from 'react'
import Icon from '@/components/public/Icon'

/**
 * Share controls (PLAN §14.4): native Web Share API when available, plus
 * explicit WhatsApp deep link (wa.me), Twitter/X intent and copy-link fallback.
 * The page URL is resolved on the client at click time so it is always correct.
 *
 * @param {{ title?: string }} props
 */
export default function ShareButtons({ title = '' }) {
  const [copied, setCopied] = useState(false)

  const currentUrl = () => (typeof window !== 'undefined' ? window.location.href : '')

  const nativeShare = async () => {
    const url = currentUrl()
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        /* user cancelled */
      }
    } else {
      copyLink()
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  const whatsappHref = () => `https://wa.me/?text=${encodeURIComponent(`${title} ${currentUrl()}`.trim())}`
  const twitterHref = () =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl())}`

  const btn = 'text-white text-[11px] font-bold px-2.5 py-1.5 rounded flex items-center gap-1.5 shadow-sm transition-opacity hover:opacity-90'

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button onClick={nativeShare} className={`${btn} bg-primary`} aria-label="Share">
        <Icon name="share" className="w-3.5 h-3.5" /> Share
      </button>
      <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className={`${btn} bg-[#25D366]`}>
        <Icon name="whatsapp" className="w-3.5 h-3.5" /> WhatsApp
      </a>
      <a href={twitterHref()} target="_blank" rel="noopener noreferrer" className={`${btn} bg-black`}>
        <Icon name="twitter" className="w-3.5 h-3.5" /> Tweet
      </a>
      <button onClick={copyLink} className={`${btn} bg-slate-700`}>
        <Icon name={copied ? 'link' : 'link'} className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  )
}
