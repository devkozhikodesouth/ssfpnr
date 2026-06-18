import Link from 'next/link'
import CardImage from './CardImage'
import CategoryBadge from './CategoryBadge'
import { formatDate } from '@/lib/format'

/**
 * Campaign card (mockup: banner image with Active tag, eyebrow category, title,
 * description, date range). Active campaigns get a green "Active" pill.
 *
 * @param {{ item: object }} props
 */
export default function CampaignCard({ item }) {
  const range = [item.fromDate, item.toDate].filter(Boolean).map(formatDate).join(' – ')
  return (
    <Link
      href={`/campaigns/${item.slug}`}
      className="bg-white rounded-soft border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group"
    >
      <div className="relative h-44 shrink-0">
        <CardImage src={item.bannerImage} alt={item.title} sizes="(max-width: 768px) 100vw, 50vw" />
        {item.isActive ? (
          <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Active
          </span>
        ) : null}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <CategoryBadge category={item.categoryId} variant="inline" />
        <h3 className="font-bold text-sm font-serif text-ink leading-snug mt-1 line-clamp-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        {item.content ? (
          <p className="text-[11px] text-muted mt-1.5 line-clamp-2 leading-relaxed">
            {item.content.replace(/<[^>]+>/g, '').slice(0, 160)}
          </p>
        ) : null}
        {range ? (
          <div className="pt-3 mt-auto flex justify-between items-center border-t border-gray-50 text-[10px] font-medium text-gray-400">
            <span>{range}</span>
            <span className="text-primary font-bold">View →</span>
          </div>
        ) : null}
      </div>
    </Link>
  )
}
