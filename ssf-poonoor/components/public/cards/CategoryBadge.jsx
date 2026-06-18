/**
 * Category pill, shared by all cards + detail pages so the badge is defined
 * once. Accepts a populated category object ({ name, color }). When the category
 * defines a custom hex colour it is used as the background; otherwise it falls
 * back to the primary brand colour.
 *
 * @param {{ category?: {name?:string,color?:string}|null, variant?: 'overlay'|'inline' }} props
 */
export default function CategoryBadge({ category, variant = 'overlay' }) {
  const name = category?.name
  if (!name) return null

  if (variant === 'inline') {
    return (
      <span
        className="text-[8px] font-bold uppercase tracking-widest text-accent"
        style={category?.color ? { color: category.color } : undefined}
      >
        {name}
      </span>
    )
  }

  return (
    <span
      className="bg-primary text-white text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
      style={category?.color ? { backgroundColor: category.color } : undefined}
    >
      {name}
    </span>
  )
}
