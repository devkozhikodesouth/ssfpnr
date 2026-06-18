'use client'

import { useEffect } from 'react'
import Icon from '@/components/public/Icon'
import { youTubeId } from '@/lib/format'

/**
 * In-page YouTube player modal (PLAN §15.4 — play without redirect). Controlled:
 * render when `open` is true. Closes on ESC, backdrop click, or the X button.
 *
 * @param {{ open: boolean, url?: string, title?: string, onClose: ()=>void }} props
 */
export default function VideoModal({ open, url, title, onClose }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  const id = youTubeId(url)

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/85 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Video player'}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close video"
        className="absolute top-4 right-4 text-white hover:text-accent p-2"
      >
        <Icon name="close" className="w-7 h-7" />
      </button>
      <div className="w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
        {id ? (
          <iframe
            className="w-full h-full rounded-soft"
            src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
            title={title || 'YouTube video player'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-sm">
            Video unavailable
          </div>
        )}
      </div>
    </div>
  )
}
