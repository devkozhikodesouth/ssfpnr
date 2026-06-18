import Link from 'next/link'
import CardImage from './CardImage'
import CategoryBadge from './CategoryBadge'
import { formatDate } from '@/lib/format'

/**
 * News list/grid card (mockup: image-on-top, category badge overlay, title,
 * date + read time). `config` is the module config — toggles category/read-time
 * display (PLAN §9.2 modules.news.*).
 *
 * @param {{ item: object, config?: object }} props
 */
export default function NewsCard({ item, config = {} }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className="bg-white rounded-soft border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group"
    >
      <div className="relative h-40 shrink-0">
        <CardImage src={item.image} alt={item.title} />
        {config.showCategory !== false && (
          <span className="absolute top-2.5 left-2.5">
            <CategoryBadge category={item.categoryId} />
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-sm font-serif text-ink leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        {item.excerpt ? (
          <p className="text-[11px] text-muted line-clamp-2 mt-1.5">{item.excerpt}</p>
        ) : null}
        <div className="flex justify-between items-center text-[10px] text-gray-400 pt-3 mt-auto border-t border-gray-50">
          <span>{formatDate(item.publishedAt || item.createdAt)}</span>
          {config.showReadTime !== false && item.readTime ? <span>{item.readTime} min read</span> : null}
        </div>
      </div>
    </Link>
  )
}
