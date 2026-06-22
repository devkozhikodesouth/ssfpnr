'use client'

import { usePathname } from 'next/navigation'

/**
 * Per-page chrome gate. The (public) layout pre-renders the Navbar / Footer /
 * BottomNav (server components) and passes them here; this client island reads
 * the current pathname and hides the header and/or footer on pages the admin
 * configured under Website Builder → Layout (`SiteConfig.chrome.pages`).
 *
 * Matching: '/' matches the home page exactly; every other entry matches its
 * path or any sub-path (prefix). The most specific (longest) match wins, so
 * `/news/foo` can inherit the `/news` rule while `/` never leaks into it.
 *
 * @param {{ pages?: Array, header: React.ReactNode, footer: React.ReactNode,
 *   bottomNav: React.ReactNode, children: React.ReactNode }} props
 */
function matchPage(pages, pathname) {
  let best = null
  for (const p of pages) {
    if (!p?.path) continue
    const isMatch = p.path === '/' ? pathname === '/' : pathname === p.path || pathname.startsWith(p.path + '/')
    if (isMatch && (!best || p.path.length > best.path.length)) best = p
  }
  return best
}

export default function PublicChrome({ pages = [], header, footer, bottomNav, children }) {
  const pathname = usePathname() || '/'
  const match = matchPage(pages, pathname)
  const hideHeader = !!match?.hideHeader
  const hideFooter = !!match?.hideFooter

  return (
    <div className="min-h-screen flex flex-col bg-lightbg">
      {hideHeader ? null : header}
      <main className="flex-grow pb-16 md:pb-0">{children}</main>
      {hideFooter ? null : footer}
      {bottomNav}
    </div>
  )
}
