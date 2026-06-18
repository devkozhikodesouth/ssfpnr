import Link from 'next/link'
import CardImage from './CardImage'
import { formatDate } from '@/lib/format'

/**
 * Blog card (mockup: author block on top, title, excerpt). Shows the author
 * avatar/name + date and an optional cover image. `config.showAuthor` toggles
 * the author block.
 *
 * @param {{ item: object, config?: object }} props
 */
export default function BlogCard({ item, config = {} }) {
  const author = item.author || {}
  return (
    <Link
      href={`/blogs/${item.slug}`}
      className="bg-white rounded-soft border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group"
    >
      {item.image ? (
        <div className="relative h-40 shrink-0">
          <CardImage src={item.image} alt={item.title} />
        </div>
      ) : null}
      <div className="p-4 flex flex-col flex-grow">
        {config.showAuthor !== false && author.name ? (
          <div className="flex items-center gap-2.5 mb-2">
            {author.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={author.image}
                alt={author.name}
                className="w-7 h-7 rounded-full border border-gray-200 object-cover shrink-0"
              />
            ) : (
              <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                {author.name.charAt(0)}
              </span>
            )}
            <div className="leading-tight">
              <span className="block text-[10px] font-bold text-ink">{author.name}</span>
              <span className="block text-[8px] text-gray-400 mt-0.5">
                {author.role ? `${author.role} • ` : ''}
                {formatDate(item.publishedAt || item.createdAt)}
              </span>
            </div>
          </div>
        ) : null}
        <h3 className="font-bold text-sm font-serif text-ink leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        {item.excerpt ? (
          <p className="text-[11px] text-muted line-clamp-2 mt-1 leading-relaxed">{item.excerpt}</p>
        ) : null}
        {config.showReadTime && item.readTime ? (
          <span className="text-[10px] text-gray-400 mt-2">{item.readTime} min read</span>
        ) : null}
      </div>
    </Link>
  )
}
