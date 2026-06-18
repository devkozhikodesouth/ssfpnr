import Link from 'next/link'
import CardImage from '@/components/public/cards/CardImage'
import SectionHeader from '@/components/public/SectionHeader'
import { getFeaturedCategories } from '@/lib/public-content'

/**
 * Featured standalone categories (PLAN §15.1 #3) — horizontal "peek" scroller on
 * mobile, grid on desktop. Each card links to the standalone category page
 * /c/[slug]. Renders nothing when no categories are flagged featured.
 *
 * @param {{ config?: object, alt?: boolean }} props
 */
export default async function FeaturedCategories({ config = {}, alt = false }) {
  const categories = await getFeaturedCategories()
  if (!categories.length) return null

  return (
    <section className={alt ? 'bg-lightbg' : 'bg-white'}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-5">
        <div className="px-1">
          <SectionHeader eyebrow={config.eyebrow || 'Portals & Initiatives'} title={config.title || 'Featured Categories'} />
        </div>
        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory hide-scrollbar pb-2">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/c/${cat.slug}`}
              className="w-[280px] md:w-auto shrink-0 snap-center bg-white rounded-soft shadow-sm border border-gray-200 overflow-hidden flex flex-col group"
            >
              <div className="relative h-28">
                <CardImage src={cat.coverImage} alt={cat.name} sizes="280px" />
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <h3 className="font-bold text-sm text-ink font-serif line-clamp-1">{cat.name}</h3>
                <span className="text-[11px] text-primary font-bold group-hover:underline shrink-0">View →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
