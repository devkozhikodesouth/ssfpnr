// One generic skeleton loader for every public list/detail page (PLAN Phase 9a).
// Parameterized by `variant` (card shape) so there are NO per-page skeleton
// files — each route's loading.jsx just renders <Loading variant="…" />.

const GRID = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'

function Pulse({ className = '' }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
}

/** A single card skeleton whose shape matches the given card variant. */
function CardSkeleton({ variant }) {
  if (variant === 'list') {
    return (
      <div className="flex gap-3 p-3 bg-white rounded-soft border border-gray-100">
        <Pulse className="h-14 w-14 shrink-0 rounded-lg" />
        <div className="flex-grow space-y-2 py-1">
          <Pulse className="h-3.5 w-3/4" />
          <Pulse className="h-3 w-1/2" />
        </div>
      </div>
    )
  }

  // Default: image-on-top content card (news/blog/video/gallery/etc.).
  return (
    <div className="bg-white rounded-soft border border-gray-100 overflow-hidden">
      <Pulse className="h-40 w-full rounded-none" />
      <div className="p-4 space-y-2.5">
        <Pulse className="h-4 w-5/6" />
        <Pulse className="h-3 w-full" />
        <Pulse className="h-3 w-2/3" />
        <div className="flex justify-between pt-3">
          <Pulse className="h-2.5 w-16" />
          <Pulse className="h-2.5 w-12" />
        </div>
      </div>
    </div>
  )
}

/**
 * @param {{ variant?: 'card'|'list', count?: number }} props
 *   variant — card shape; `card` (grid) is the default, `list` for stacked rows.
 *   count   — number of placeholder cards to render.
 */
export default function Loading({ variant = 'card', count = 6 }) {
  const items = Array.from({ length: count })
  const wrapper = variant === 'list' ? 'space-y-3' : GRID

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6" aria-busy="true" aria-label="Loading content">
      <div className="border-b border-gray-200 pb-4 mb-5">
        <Pulse className="h-7 w-48" />
      </div>
      <div className={wrapper}>
        {items.map((_, i) => (
          <CardSkeleton key={i} variant={variant} />
        ))}
      </div>
    </div>
  )
}
