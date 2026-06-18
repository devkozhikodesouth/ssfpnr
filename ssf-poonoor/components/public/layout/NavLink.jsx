'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Desktop nav link with active underline (gold) based on the current path.
 * Tiny client island so the Navbar itself remains a server component.
 */
export default function NavLink({ href, external, children }) {
  const pathname = usePathname()
  const active = pathname === href || (href !== '/' && pathname.startsWith(href))

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
        {children}
      </a>
    )
  }

  return (
    <Link
      href={href}
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
