'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Logo from './Logo'
import Icon from '@/components/public/Icon'

/**
 * Mobile top-bar content + interactive overlays (PLAN §14.2):
 *  - hamburger → slide-in left drawer with the primary nav
 *  - centered brand
 *  - search → full-screen overlay that routes to /news?q=…
 *
 * Rendered only at < md (Navbar shows the desktop bar above that). Kept as one
 * client island so the server Navbar stays a server component.
 */
export default function MobileMenu({ navItems = [], siteName = 'SSF Poonoor', logo }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [q, setQ] = useState('')
  const pathname = usePathname()
  const router = useRouter()

  // Close the drawer whenever navigation completes.
  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [pathname])

  // Lock body scroll while an overlay is open.
  useEffect(() => {
    const open = menuOpen || searchOpen
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen, searchOpen])

  function submitSearch(e) {
    e.preventDefault()
    const term = q.trim()
    if (!term) return
    setSearchOpen(false)
    router.push(`/news?q=${encodeURIComponent(term)}`)
  }

  const isActive = (path) => pathname === path || (path !== '/' && pathname.startsWith(path))

  return (
    <>
      {/* Mobile bar inner row */}
      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
        className="text-white hover:text-accent p-1 transition-colors"
      >
        <Icon name="menu" className="w-6 h-6" />
      </button>

      <Link href="/" className="flex items-center gap-1.5" aria-label={siteName}>
        {logo ? (
          <Logo src={logo} alt={siteName} className="h-7 w-auto max-w-[120px]" />
        ) : (
          <span className="bg-primary/20 p-1 rounded-full border border-primary/30 shrink-0">
            <Logo className="h-5 w-5 text-accent" />
          </span>
        )}
        <span className="text-white font-bold text-xs tracking-wider leading-none">{siteName}</span>
      </Link>

      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        aria-label="Search"
        className="text-white hover:text-accent p-1 transition-colors"
      >
        <Icon name="search" className="w-5 h-5" />
      </button>

      {/* Drawer + backdrop */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[80%] bg-darkbg text-white shadow-2xl flex flex-col">
            <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
              <span className="flex items-center gap-2">
                <Logo className="h-6 w-6 text-accent" />
                <span className="font-bold text-sm tracking-wider">{siteName}</span>
              </span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="p-1 text-white hover:text-accent">
                <Icon name="close" className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-2">
              {navItems.map((item) => (
                <Link
                  key={item.path + item.label}
                  href={item.path}
                  target={item.isExternal ? '_blank' : undefined}
                  className={`block px-5 py-3 text-sm font-semibold border-l-2 transition-colors ${
                    isActive(item.path)
                      ? 'border-accent text-accent bg-white/5'
                      : 'border-transparent text-gray-200 hover:text-accent hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  {item.labelMl ? <span className="block text-[10px] text-gray-400 font-normal">{item.labelMl}</span> : null}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Full-screen search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-darkbg/95 flex flex-col p-4" role="dialog" aria-modal="true">
          <div className="flex items-center justify-end">
            <button onClick={() => setSearchOpen(false)} aria-label="Close search" className="p-2 text-white hover:text-accent">
              <Icon name="close" className="w-7 h-7" />
            </button>
          </div>
          <form onSubmit={submitSearch} className="mt-8 px-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-accent mb-2">Search News</label>
            <div className="flex items-center gap-2 border-b-2 border-white/30 focus-within:border-accent">
              <Icon name="search" className="w-5 h-5 text-gray-400" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search…"
                className="flex-1 bg-transparent text-white text-lg py-3 placeholder-gray-500 focus:outline-none"
              />
            </div>
          </form>
        </div>
      )}
    </>
  )
}
