import Link from 'next/link'
import Icon from '@/components/public/Icon'
import { dateParts, formatDate, eventStatus } from '@/lib/format'

const STATUS_STYLES = {
  upcoming: 'bg-emerald-100 text-emerald-800',
  ongoing: 'bg-accent/20 text-amber-800',
  past: 'bg-gray-100 text-gray-500',
}

/**
 * Event card (mockup: prominent date block on the left, title + venue). Status
 * (upcoming/ongoing/past) is computed from the date range (PLAN §7.8).
 *
 * @param {{ item: object }} props
 */
export default function EventCard({ item }) {
  const { day, month } = dateParts(item.fromDate)
  const status = item.status || eventStatus(item.fromDate, item.toDate)

  return (
    <Link
      href={`/events/${item.slug}`}
      className="bg-white rounded-soft border border-gray-200 p-3 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow group"
    >
      <div className="bg-primary text-white w-14 h-14 rounded-soft flex flex-col items-center justify-center shrink-0 shadow-sm">
        <span className="text-xl font-bold leading-none">{day || '—'}</span>
        <span className="text-[8px] font-bold uppercase tracking-widest mt-0.5 opacity-90">{month}</span>
      </div>
      <div className="min-w-0 flex-grow">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm text-ink font-serif leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full shrink-0 ${STATUS_STYLES[status]}`}>
            {status}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1.5 line-clamp-1">
          {item.venue || item.location ? (
            <>
              <Icon name="map-pin" className="w-3 h-3 shrink-0" />
              {item.venue || item.location}
            </>
          ) : (
            formatDate(item.fromDate)
          )}
        </p>
      </div>
    </Link>
  )
}
