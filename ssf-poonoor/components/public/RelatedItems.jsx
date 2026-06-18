import Link from 'next/link'
import CardImage from '@/components/public/cards/CardImage'
import SectionHeader from '@/components/public/SectionHeader'
import { formatDate } from '@/lib/format'

/**
 * Compact "Related" list for detail pages (PLAN §13.2 — related by category).
 * Generic across modules: resolves whichever cover field a module uses and links
 * to `${basePath}/${slug}`. Server component.
 *
 * @param {{ items: object[], basePath: string, title?: string }} props
 */
export default function RelatedItems({ items = [], basePath, title = 'Related Articles' }) {
  if (!items.length) return null

  const cover = (it) => it.image || it.coverImage || it.bannerImage || it.thumbnail

  return (
    <section className="space-y-4">
      <div className="border-b border-gray-100 pb-2">
        <SectionHeader eyebrow="Read More" title={title} />
      </div>
      <div className="space-y-3.5">
        {items.map((it) => (
          <Link key={it._id} href={`${basePath}/${it.slug}`} className="flex gap-3 items-start group">
            <div className="relative w-16 h-16 rounded-soft overflow-hidden shrink-0">
              <CardImage src={cover(it)} alt={it.title || it.name} sizes="64px" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <h4 className="font-bold text-[12px] font-serif text-ink leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {it.title || it.name}
              </h4>
              <span className="block text-[10px] text-gray-400">{formatDate(it.publishedAt || it.createdAt)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
