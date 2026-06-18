'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Icon from '@/components/public/Icon'

/**
 * Sticky mobile bottom navigation (PLAN §14.1). Hidden at >= md. Items come from
 * SiteConfig.mobile.bottomNavItems (passed from the layout). The active item
 * gets the gold top-border + primary colour from the mockup. A `#menu`-style
 * path is treated as a passive "More" entry (the hamburger drawer is the real
 * menu), so it never reports active.
 *
 * @param {{ items: {label,icon,path}[] }} props
 */
export default function BottomNav({ items = [] }) {
  const pathname = usePathname()
  if (!items.length) return null

  const isActive = (path) => {
    if (!path || path.startsWith('#')) return false
    return pathname === path || (path !== '/' && pathname.startsWith(path))
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-lightbg border-t border-gray-200 px-2 flex justify-around items-stretch z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]"
      aria-label="Primary"
    >
      {items.map((item) => {
        const active = isActive(item.path)
        return (
          <Link
            key={item.path + item.label}
            href={item.path}
            className={`flex flex-col items-center justify-center flex-1 pt-0.5 border-t-2 ${
              active ? 'text-primary border-accent' : 'text-gray-400 hover:text-primary border-transparent'
            }`}
          >
            <Icon name={item.icon || 'menu'} className="w-5 h-5" strokeWidth={2.2} />
            <span className={`text-[9px] mt-0.5 tracking-wider ${active ? 'font-bold' : 'font-semibold'}`}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
