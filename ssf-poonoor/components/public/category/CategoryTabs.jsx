'use client'

import { useState } from 'react'
import NewsCard from '@/components/public/cards/NewsCard'
import VideoCard from '@/components/public/cards/VideoCard'
import GalleryCard from '@/components/public/cards/GalleryCard'
import BlogCard from '@/components/public/cards/BlogCard'
import EventCard from '@/components/public/cards/EventCard'
import CampaignCard from '@/components/public/cards/CampaignCard'

// type → card + grid for the aggregated standalone category page (PLAN §15.10).
const RENDER = {
  news: { Card: NewsCard, grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' },
  videos: { Card: VideoCard, grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' },
  gallery: { Card: GalleryCard, grid: 'grid grid-cols-2 lg:grid-cols-4 gap-3' },
  blogs: { Card: BlogCard, grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' },
  events: { Card: EventCard, grid: 'space-y-3 max-w-3xl' },
  campaigns: { Card: CampaignCard, grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' },
}

/**
 * Swipeable/tabbed view of all content aggregated under a standalone category.
 * Only tabs with content are passed in. The tab bar scrolls horizontally on
 * mobile; selecting a tab swaps the rendered grid (no navigation).
 *
 * @param {{ groups: {key,label,type,items}[] }} props
 */
export default function CategoryTabs({ groups = [] }) {
  const [active, setActive] = useState(groups[0]?.key)
  if (!groups.length) return null

  const current = groups.find((g) => g.key === active) || groups[0]
  const { Card, grid } = RENDER[current.type] || RENDER.news

  return (
    <div>
      <nav className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar" role="tablist">
        {groups.map((g) => {
          const isActive = g.key === current.key
          return (
            <button
              key={g.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(g.key)}
              className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${
                isActive ? 'border-accent text-primary' : 'border-transparent text-gray-500 hover:text-ink'
              }`}
            >
              {g.label}
              <span className="ml-1.5 text-xs text-gray-400">({g.items.length})</span>
            </button>
          )
        })}
      </nav>

      <div className={grid}>
        {current.items.map((item) => (
          <Card key={item._id} item={item} />
        ))}
      </div>
    </div>
  )
}
