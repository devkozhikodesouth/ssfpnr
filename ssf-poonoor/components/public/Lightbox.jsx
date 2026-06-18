'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from '@/components/public/Icon'

/**
 * Gallery grid + swipeable lightbox (PLAN §14.1, §15.3). Renders a responsive
 * masonry-ish grid of thumbnails; tapping one opens a full-screen viewer with:
 *  - swipe left/right (touch) to move between images
 *  - arrow keys + on-screen prev/next
 *  - ESC / backdrop / X to close
 *  - per-image caption
 *
 * Self-contained so a gallery detail page just renders <Lightbox images=… />.
 *
 * @param {{ images: {url:string, caption?:string, alt?:string}[] }} props
 */
export default function Lightbox({ images = [] }) {
  const [index, setIndex] = useState(null)
  const touchStartX = useRef(null)
  const open = index !== null

  const close = useCallback(() => setIndex(null), [])
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  )
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  )

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close, prev, next])

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (dx > 50) prev()
    else if (dx < -50) next()
    touchStartX.current = null
  }

  if (!images.length) return null
  const current = open ? images[index] : null

  return (
    <>
      {/* Thumbnail grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {images.map((img, i) => (
          <button
            key={img.url + i}
            type="button"
            onClick={() => setIndex(i)}
            className="relative block aspect-square rounded-soft overflow-hidden bg-gray-100 group border border-transparent hover:border-accent transition-colors"
            aria-label={`Open image ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.alt || img.caption || ''}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </button>
        ))}
      </div>

      {/* Lightbox overlay */}
      {open && current ? (
        <div
          className="fixed inset-0 z-[70] bg-black/90 flex flex-col"
          role="dialog"
          aria-modal="true"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex items-center justify-between p-4 text-white">
            <span className="text-xs font-semibold">
              {index + 1} / {images.length}
            </span>
            <button onClick={close} aria-label="Close" className="p-1 hover:text-accent">
              <Icon name="close" className="w-7 h-7" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative px-2" onClick={close}>
            {images.length > 1 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prev()
                }}
                aria-label="Previous"
                className="absolute left-2 text-white/80 hover:text-white p-2 bg-black/30 rounded-full"
              >
                <Icon name="chevron-left" className="w-6 h-6" />
              </button>
            ) : null}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.url}
              alt={current.alt || current.caption || ''}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[80vh] max-w-full object-contain rounded-soft"
            />

            {images.length > 1 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  next()
                }}
                aria-label="Next"
                className="absolute right-2 text-white/80 hover:text-white p-2 bg-black/30 rounded-full"
              >
                <Icon name="chevron-right" className="w-6 h-6" />
              </button>
            ) : null}
          </div>

          {current.caption ? (
            <p className="text-center text-white/80 text-xs p-4">{current.caption}</p>
          ) : null}
        </div>
      ) : null}
    </>
  )
}
