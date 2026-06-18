import Link from 'next/link'
import Logo from './Logo'
import Icon from '@/components/public/Icon'

/**
 * Dark site footer (PLAN §15.1 #11). Reads everything from SiteConfig (branding,
 * social, contact, footer text) + footer nav-paths, all passed in from the
 * (public) layout. Server component.
 *
 * @param {{ branding, social, contact, footer, navItems }} props
 */
const SOCIAL_ORDER = ['facebook', 'instagram', 'youtube', 'twitter', 'telegram', 'whatsapp']

export default function Footer({ branding = {}, social = {}, contact = {}, footer = {}, navItems = [] }) {
  const siteName = branding.siteName || 'SSF Poonoor'
  const socialLinks = SOCIAL_ORDER.map((k) => ({ key: k, href: social[k] })).filter((s) => s.href)
  const year = new Date().getFullYear()

  return (
    <footer className="bg-darkbg text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-4">
        {/* Brand + tagline */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-primary/20 p-2 rounded-full border border-primary/40">
              <Logo className="h-7 w-7 text-accent" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-white tracking-widest">{siteName}</h4>
              {branding.tagline ? (
                <p className="text-[10px] text-accent tracking-wider uppercase">{branding.tagline}</p>
              ) : null}
            </div>
          </div>
          <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
            {footer.text ||
              'SSF Poonoor Division Committee. Education, ethical progression, and socio-cultural empowerment.'}
          </p>
        </div>

        {/* Quick links */}
        {navItems.length ? (
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-accent mb-3">Quick Links</span>
            <ul className="space-y-2 text-xs">
              {navItems.map((item) => (
                <li key={item.path + item.label}>
                  <Link
                    href={item.path}
                    target={item.isExternal ? '_blank' : undefined}
                    className="hover:text-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Contact */}
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-widest text-accent mb-3">Contact</span>
          <ul className="space-y-2 text-xs text-gray-400">
            {contact.email ? (
              <li>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-accent">
                  <Icon name="mail" className="w-4 h-4 shrink-0" /> {contact.email}
                </a>
              </li>
            ) : null}
            {contact.phone ? (
              <li>
                <a href={`tel:${contact.phone}`} className="flex items-center gap-2 hover:text-accent">
                  <Icon name="phone" className="w-4 h-4 shrink-0" /> {contact.phone}
                </a>
              </li>
            ) : null}
            {contact.address ? (
              <li>
                <a
                  href={contact.mapLink || undefined}
                  target={contact.mapLink ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 hover:text-accent"
                >
                  <Icon name="map-pin" className="w-4 h-4 shrink-0 mt-0.5" /> <span>{contact.address}</span>
                </a>
              </li>
            ) : null}
          </ul>

          {socialLinks.length ? (
            <div className="flex gap-3 mt-4">
              {socialLinks.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.key}
                  className="bg-white/5 hover:bg-primary p-2 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <Icon name={s.key} className="w-4 h-4" />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-[10px] text-gray-500">
        {footer.copyright || `© ${year} ${siteName} Division Committee. All rights reserved.`}
      </div>
    </footer>
  )
}
