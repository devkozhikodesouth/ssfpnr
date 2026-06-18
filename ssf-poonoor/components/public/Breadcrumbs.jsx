import Link from 'next/link'

/**
 * Visible breadcrumb trail (PLAN §13.2). Server component. Structured-data
 * (BreadcrumbList JSON-LD) is Phase 8's responsibility, so this renders the
 * visible trail only. The last item is rendered as the current page.
 *
 * @param {{ items: {label:string, href?:string}[] }} props
 */
export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null
  return (
    <nav aria-label="Breadcrumb" className="text-[11px] text-gray-400 font-medium">
      <ol className="flex items-center flex-wrap gap-1">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              {item.href && !last ? (
                <Link href={item.href} className="hover:text-primary transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={last ? 'text-slate-600 font-semibold line-clamp-1' : ''}>{item.label}</span>
              )}
              {!last ? <span className="text-gray-300">›</span> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
