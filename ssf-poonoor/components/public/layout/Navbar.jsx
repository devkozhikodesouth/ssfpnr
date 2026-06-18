import Link from 'next/link'
import Logo from './Logo'
import MobileMenu from './MobileMenu'
import NavLink from './NavLink'

/**
 * Public top navigation (PLAN §14.2). Dark sticky bar. Desktop shows the full
 * link row + CTA; below md it collapses to hamburger / brand / search handled by
 * the MobileMenu client island. Nav items + branding are resolved server-side
 * in the (public) layout and passed down, so this stays a server component.
 *
 * @param {{ navItems: {label,path,labelMl?,isExternal?}[], siteName: string,
 *   donateHref?: string }} props
 */
export default function Navbar({ navItems = [], siteName = 'SSF Poonoor', donateHref }) {
  return (
    <header className="sticky top-0 z-40 bg-darkbg border-b border-white/10 select-none">
      {/* Desktop bar */}
      <div className="hidden md:flex max-w-7xl mx-auto px-6 lg:px-8 h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={siteName}>
          <span className="bg-primary/20 p-1.5 rounded-full border border-primary/30">
            <Logo className="h-6 w-6 text-accent" />
          </span>
          <span className="text-white font-bold text-sm tracking-wider">{siteName}</span>
        </Link>

        <nav className="flex items-center gap-6 text-xs font-semibold text-gray-300">
          {navItems.map((item) => (
            <NavLink key={item.path + item.label} href={item.path} external={item.isExternal}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {donateHref ? (
          <a
            href={donateHref}
            className="bg-primary hover:bg-secondary text-white text-xs font-bold px-5 py-2 rounded-full shadow-md transition-colors"
          >
            Donate
          </a>
        ) : (
          <span className="w-[1px]" />
        )}
      </div>

      {/* Mobile bar */}
      <div className="md:hidden h-14 px-4 flex items-center justify-between">
        <MobileMenu navItems={navItems} siteName={siteName} />
      </div>
    </header>
  )
}
