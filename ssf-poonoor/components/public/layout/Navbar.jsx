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
 * Colors and the CTA button come from SiteConfig.header (Website Builder →
 * Header). When unset, the Tailwind dark defaults apply.
 *
 * @param {{ navItems: {label,path,labelMl?,isExternal?}[], siteName: string,
 *   logo?: string, header?: object }} props
 */
export default function Navbar({ navItems = [], siteName = 'SSF Poonoor', logo, header = {} }) {
  const barStyle = header.bgColor ? { backgroundColor: header.bgColor } : undefined
  const textStyle = header.textColor ? { color: header.textColor } : undefined
  const logoWidth = header.logoWidth ? `${header.logoWidth}px` : '160px'
  const showLogoImage = header.logoType !== 'text' && logo
  const cta = header.cta || {}
  const ctaStyle = {
    backgroundColor: cta.bgColor || undefined,
    color: cta.textColor || undefined,
  }

  return (
    <header className="sticky top-0 z-40 bg-darkbg border-b border-white/10 select-none" style={barStyle}>
      {/* Desktop bar */}
      <div className="hidden md:flex max-w-7xl mx-auto px-6 lg:px-8 h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={siteName}>
          {showLogoImage ? (
            <Logo src={logo} alt={siteName} className="h-9 w-auto" style={{ maxWidth: logoWidth }} />
          ) : (
            <span className="bg-primary/20 p-1.5 rounded-full border border-primary/30">
              <Logo className="h-6 w-6 text-accent" />
            </span>
          )}
          <span className="text-white font-bold text-sm tracking-wider" style={textStyle}>
            {siteName}
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-xs font-semibold text-gray-300">
          {navItems.map((item) => (
            <NavLink
              key={item.path + item.label}
              href={item.path}
              external={item.isExternal}
              textColor={header.textColor}
              activeColor={header.activeColor}
              activeTextColor={header.activeTextColor}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {cta.enabled !== false && cta.text ? (
          <a
            href={cta.url || '#'}
            target={cta.url?.startsWith('http') ? '_blank' : undefined}
            rel={cta.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
            style={ctaStyle}
            className="bg-primary hover:bg-secondary text-white text-xs font-bold px-5 py-2 rounded-full shadow-md transition-colors"
          >
            {cta.text}
          </a>
        ) : (
          <span className="w-[1px]" />
        )}
      </div>

      {/* Mobile bar */}
      <div className="md:hidden h-14 px-4 flex items-center justify-between">
        <MobileMenu navItems={navItems} siteName={siteName} logo={showLogoImage ? logo : undefined} />
      </div>
    </header>
  )
}
