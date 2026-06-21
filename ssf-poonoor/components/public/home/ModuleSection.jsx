import SectionHeader from '@/components/public/SectionHeader'
import NewsCard from '@/components/public/cards/NewsCard'
import BlogCard from '@/components/public/cards/BlogCard'
import VideoCard from '@/components/public/cards/VideoCard'
import GalleryCard from '@/components/public/cards/GalleryCard'
import EventCard from '@/components/public/cards/EventCard'
import CampaignCard from '@/components/public/cards/CampaignCard'
import { fetchPublicList, getModuleConfig, MODULE_PATH } from '@/lib/public-content'

/**
 * GENERIC homepage content section (PLAN anti-duplication rule). One component
 * renders the home strip for News, Blogs, Videos, Gallery, Events or Campaigns —
 * the homepage maps each `section.type` to this with a limit. There is NO
 * per-module home section component.
 *
 * Respects the module toggle + showOnHome flag (PLAN §9.6) and renders nothing
 * when disabled or empty.
 *
 * @param {{ type: string, config?: object, alt?: boolean }} props
 */

// section.type → { module key, card, default copy, layout }
const TYPE_MAP = {
  news: { module: 'news', Card: NewsCard, eyebrow: "What's Happening", title: 'Latest News', layout: 'grid' },
  blogs: { module: 'blogs', Card: BlogCard, eyebrow: 'Ideas & Writing', title: 'Recent Blogs', layout: 'grid' },
  videos: { module: 'video', Card: VideoCard, eyebrow: 'Video Stories', title: 'Latest Videos', layout: 'grid' },
  gallery: { module: 'gallery', Card: GalleryCard, eyebrow: 'Memories', title: 'Gallery Moments', layout: 'gallery' },
  events: { module: 'events', Card: EventCard, eyebrow: 'Calendar', title: 'Upcoming Events', layout: 'list', params: { status: 'upcoming' } },
  campaigns: { module: 'campaigns', Card: CampaignCard, eyebrow: 'Ongoing', title: 'Active Campaigns', layout: 'grid', params: { active: 'true' } },
}

const LAYOUT_CLASS = {
  grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5',
  gallery: 'grid grid-cols-2 lg:grid-cols-4 gap-3',
  list: 'space-y-3 max-w-3xl',
}

export default async function ModuleSection({ type, config = {}, alt = false }) {
  const map = TYPE_MAP[type]
  if (!map) return null

  const modConfig = await getModuleConfig(map.module)
  if (modConfig.enabled === false || modConfig.showOnHome === false) return null

  const limit = config.limit || modConfig.homeLimit || 3
  let { items } = await fetchPublicList(map.module, { ...(map.params || {}), sort: 'newest' }, { perPage: limit })

  // Events: if nothing upcoming, fall back to latest so the strip isn't empty.
  if (!items.length && map.params?.status === 'upcoming') {
    ;({ items } = await fetchPublicList(map.module, { sort: 'newest' }, { perPage: limit }))
  }
  if (!items.length) return null

  const { Card } = map
  const sectionStyle = config.bgColor ? { backgroundColor: config.bgColor } : undefined
  const cta = config.cta || {}
  const ctaStyle = { backgroundColor: cta.bgColor || undefined, color: cta.textColor || undefined }
  const ctaHref = cta.url || MODULE_PATH[map.module]

  return (
    <section className={alt ? 'bg-lightbg' : 'bg-white'} style={sectionStyle}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-5">
        <SectionHeader
          eyebrow={config.eyebrow || map.eyebrow}
          title={config.title || modConfig.label || map.title}
          subtitle={config.subtitle}
          viewAllHref={cta.enabled ? undefined : MODULE_PATH[map.module]}
        />
        {config.description ? (
          <p className="text-sm text-muted leading-relaxed max-w-3xl">{config.description}</p>
        ) : null}
        <div className={LAYOUT_CLASS[map.layout]}>
          {items.map((item) => (
            <Card key={item._id} item={item} config={modConfig} />
          ))}
        </div>
        {cta.enabled && cta.text ? (
          <div>
            <a
              href={ctaHref}
              style={ctaStyle}
              className="inline-block bg-primary hover:bg-secondary text-white font-bold px-7 py-2.5 rounded-full text-xs tracking-wider uppercase shadow-md transition-colors"
            >
              {cta.text}
            </a>
          </div>
        ) : null}
      </div>
    </section>
  )
}
