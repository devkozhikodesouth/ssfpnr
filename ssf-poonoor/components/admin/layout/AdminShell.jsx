'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Icon from '@/components/public/Icon'

/**
 * Admin panel chrome: fixed top bar, collapsible left sidebar (desktop),
 * slide-in drawer + bottom tab bar (mobile), a user menu with sign-out, and a
 * footer. Receives the permission-filtered nav from the server layout so it
 * never renders links the user can't use.
 *
 * @param {{ groups, bottomItems, user, children }} props
 */
export default function AdminShell({ groups = [], bottomItems = [], user = {}, children }) {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Close the mobile drawer + user menu on navigation.
  useEffect(() => {
    setDrawerOpen(false)
    setMenuOpen(false)
  }, [pathname])

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  const isActive = (href) =>
    pathname === href || (href !== '/app/dashboard' && pathname.startsWith(href))

  const initials = (user.name || user.username || 'U')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const SidebarNav = ({ onNavigate }) => (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            {group.title}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-emerald-600/15 text-emerald-400'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon name={item.icon} className="w-[18px] h-[18px] shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )

  const brand = (
    <Link href="/app/dashboard" className="flex items-center gap-2 px-2">
      <span className="grid place-items-center w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-sm">
        S
      </span>
      <span className="font-bold text-white text-sm tracking-wide">SSF Admin</span>
    </Link>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Top bar */}
      <header className="fixed top-0 inset-x-0 z-40 h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-3 lg:pl-[17rem]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="lg:hidden p-2 text-gray-300 hover:text-white"
          >
            <Icon name="menu" className="w-5 h-5" />
          </button>
          <span className="lg:hidden">{brand}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Icon name="globe" className="w-4 h-4" /> View site
          </a>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span className="grid place-items-center w-8 h-8 rounded-full bg-gray-700 text-white text-xs font-semibold">
                {initials}
              </span>
              <span className="hidden sm:block text-left leading-tight">
                <span className="block text-xs font-medium text-white">{user.name || user.username}</span>
                {user.roleName ? (
                  <span className="block text-[10px] text-gray-400">{user.roleName}</span>
                ) : null}
              </span>
              <Icon name="chevron-down" className="w-4 h-4 text-gray-400" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-1 w-52 z-50 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl py-1.5">
                  <div className="px-3 py-2 border-b border-gray-800">
                    <p className="text-sm font-medium text-white truncate">{user.name || user.username}</p>
                    <p className="text-xs text-gray-400 truncate">{user.username}</p>
                  </div>
                  <Link
                    href="/app/reset"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <Icon name="settings" className="w-4 h-4" /> Change password
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: '/app/login' })}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-gray-800"
                  >
                    <Icon name="log-out" className="w-4 h-4" /> Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 z-30 bg-gray-900 border-r border-gray-800 flex-col">
        <div className="h-14 flex items-center border-b border-gray-800">{brand}</div>
        <SidebarNav />
        <div className="border-t border-gray-800 p-3">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/app/login' })}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Icon name="log-out" className="w-[18px] h-[18px]" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[82%] bg-gray-900 border-r border-gray-800 flex flex-col">
            <div className="h-14 flex items-center justify-between border-b border-gray-800 pr-2">
              {brand}
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="p-2 text-gray-400 hover:text-white"
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>
            <SidebarNav onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="lg:pl-64 pt-14 pb-20 lg:pb-0 min-h-screen flex flex-col">
        <div className="flex-1">{children}</div>

        {/* Footer */}
        <footer className="border-t border-gray-800 px-6 py-4 text-center text-xs text-gray-500">
          SSF Poonoor Admin · © {new Date().getFullYear()} ·{' '}
          <a href="/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
            View public site
          </a>
        </footer>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 h-16 bg-gray-900 border-t border-gray-800 flex">
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
              isActive(item.href) ? 'text-emerald-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icon name={item.icon} className="w-5 h-5" />
            <span className="truncate max-w-full px-1">{item.label}</span>
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-gray-400 hover:text-white"
        >
          <Icon name="menu" className="w-5 h-5" />
          <span>More</span>
        </button>
      </nav>
    </div>
  )
}
