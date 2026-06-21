'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Desktop nav link with active underline based on the current path. Colors come
 * from SiteConfig.header (Website Builder → Header): `textColor` for the resting
 * state, `activeColor` for the active underline, and `activeTextColor` for the
 * active label. Falls back to the Tailwind defaults when colors aren't set.
 * Tiny client island so the Navbar itself remains a server component.
 *
 * @param {{ href: string, external?: boolean, children: React.ReactNode,
 *   textColor?: string, activeColor?: string, activeTextColor?: string }} props
 */
export default function NavLink({ href, external, children, textColor, activeColor, activeTextColor }) {
  const pathname = usePathname()
  const active = pathname === href || (href !== '/' && pathname.startsWith(href))

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={textColor ? { color: textColor } : undefined}
        className="hover:text-white transition-colors"
      >
        {children}
      </a>
    )
  }

  // Inline style only overrides what's configured; class fallbacks cover the rest.
  const style = active
    ? { color: activeTextColor || activeColor || undefined, borderBottomColor: activeColor || undefined }
    : { color: textColor || undefined }

  return (
    <Link
      href={href}
      style={style}
      className={
        active
          ? 'text-white border-b-2 border-accent pb-0.5'
          : 'hover:text-white transition-colors border-b-2 border-transparent pb-0.5'
      }
    >
      {children}
    </Link>
  )
}
