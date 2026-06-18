'use client'

import { useState } from 'react'
import Link from 'next/link'
import CardImage from './CardImage'
import VideoModal from '@/components/public/VideoModal'
import Icon from '@/components/public/Icon'
import { youTubeThumb } from '@/lib/format'

/**
 * Video card (mockup: thumbnail with centred play button + duration badge).
 * Clicking the thumbnail opens the YouTube modal in place (PLAN §15.4); a small
 * "Details" link still routes to the full detail page for description/speakers.
 *
 * @param {{ item: object, config?: object }} props
 */
export default function VideoCard({ item }) {
  const [open, setOpen] = useState(false)
  const thumb = item.thumbnail || youTubeThumb(item.youTubeLink)

  return (
    <div className="bg-white rounded-soft border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Play ${item.title}`}
        className="relative h-40 block w-full text-left"
      >
        <CardImage src={thumb} alt={item.title} />
        <span className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="bg-primary text-white p-2.5 rounded-full shadow-lg transition-transform group-hover:scale-110">
            <Icon name="play" className="w-5 h-5" />
          </span>
        </span>
        {item.duration ? (
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
            {item.duration}
          </span>
        ) : null}
      </button>
      <div className="p-3 flex items-center justify-between gap-2">
        <h3 className="text-xs font-bold font-serif text-ink leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        <Link href={`/video/${item.slug}`} className="text-[10px] text-primary font-bold shrink-0 hover:underline">
          Details
        </Link>
      </div>

      <VideoModal open={open} url={item.youTubeLink} title={item.title} onClose={() => setOpen(false)} />
    </div>
  )
}
