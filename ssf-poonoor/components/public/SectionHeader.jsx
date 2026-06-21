import Link from 'next/link'

/**
 * Section eyebrow + heading combo from the design system (small uppercase
 * accent eyebrow above a serif H2/H3). Optional "view all" link on the right.
 * Pure — used across home sections and list page headers.
 *
 * @param {{ eyebrow?: string, title: string, subtitle?: string, viewAllHref?: string,
 *   viewAllLabel?: string, size?: 'sm'|'lg' }} props
 */
export default function SectionHeader({ eyebrow, title, subtitle, viewAllHref, viewAllLabel = 'View all', size = 'sm', titleStyle, eyebrowStyle }) {
  return (
    <div className="flex justify-between items-end gap-4">
      <div>
        {eyebrow ? (
          <span className="block text-[10px] font-bold text-accent uppercase tracking-widest" style={eyebrowStyle}>{eyebrow}</span>
        ) : null}
        <h2
          style={titleStyle}
          className={`font-bold font-serif text-ink mt-0.5 leading-tight ${
            size === 'lg' ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'
          }`}
        >
          {title}
        </h2>
        {subtitle ? <p className="text-xs text-gray-400 mt-1">{subtitle}</p> : null}
      </div>
      {viewAllHref ? (
        <Link href={viewAllHref} className="text-[11px] text-primary font-bold hover:underline shrink-0 whitespace-nowrap">
          {viewAllLabel} →
        </Link>
      ) : null}
    </div>
  )
}
