import SectionHeader from '@/components/public/SectionHeader'
import NewsCard from '@/components/public/cards/NewsCard'
import VideoCard from '@/components/public/cards/VideoCard'
import GalleryCard from '@/components/public/cards/GalleryCard'
import BlogCard from '@/components/public/cards/BlogCard'

// Linked content groups for campaign/event detail pages (PLAN §15.7/§15.8).
// Reuses the real card components so there is no bespoke linked-item markup.
const GROUPS = [
  { key: 'news', label: 'News', Card: NewsCard },
  { key: 'videos', label: 'Videos', Card: VideoCard },
  { key: 'gallery', label: 'Gallery', Card: GalleryCard },
  { key: 'blogs', label: 'Blogs', Card: BlogCard },
]

/**
 * @param {{ linked: { news:[], videos:[], gallery:[], blogs:[] } }} props
 */
export default function LinkedItemsPanel({ linked = {} }) {
  const groups = GROUPS.filter((g) => linked[g.key]?.length)
  if (!groups.length) return null

  return (
    <section className="space-y-8">
      <SectionHeader eyebrow="Linked Content" title="Related Coverage" />
      {groups.map(({ key, label, Card }) => (
        <div key={key} className="space-y-3">
          <h3 className="text-sm font-bold font-serif text-ink">{label}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {linked[key].map((item) => (
              <Card key={item._id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
