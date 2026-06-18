import Link from 'next/link'
import CardImage from './CardImage'
import Icon from '@/components/public/Icon'

/**
 * Gallery album card (mockup: cover image + photo-count badge). Links to the
 * album detail page where the swipeable lightbox lives.
 *
 * @param {{ item: object }} props
 */
export default function GalleryCard({ item }) {
  const count = item.images?.length || 0
  const cover = item.coverImage || item.images?.[0]?.url
  return (
    <Link
      href={`/gallery/${item.slug}`}
      className="bg-white rounded-soft border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group"
    >
      <div className="relative h-44 shrink-0">
        <CardImage src={cover} alt={item.title} />
        <span className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        {count > 0 ? (
          <span className="absolute top-2.5 right-2.5 bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Icon name="image" className="w-3 h-3" strokeWidth={2.4} />
            {count}
          </span>
        ) : null}
        <h3 className="absolute bottom-2.5 left-3 right-3 text-white font-bold text-sm font-serif leading-snug line-clamp-2">
          {item.title}
        </h3>
      </div>
    </Link>
  )
}
