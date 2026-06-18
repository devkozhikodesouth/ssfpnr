import Breadcrumbs from '@/components/public/Breadcrumbs'
import SectionHeader from '@/components/public/SectionHeader'
import AboutSection from '@/components/public/home/AboutSection'
import Icon from '@/components/public/Icon'
import { getSiteConfig } from '@/lib/public-content'

export const dynamic = 'force-dynamic'

// Semi-static About page (PLAN §15.5). Organisation copy is fixed here; contact
// details come from SiteConfig so they stay editable in Site Setup.
const WINGS = [
  { name: 'IPB', desc: 'Idea Production Bureau' },
  { name: 'Risala', desc: 'Publication & study circle' },
  { name: "Let's Smile", desc: 'Charity & welfare wing' },
  { name: 'WEFI', desc: 'Welfare & finance initiative' },
  { name: 'Kalalayam', desc: 'Arts & culture wing' },
]

const LEADERSHIP = [
  { role: 'President', name: '—' },
  { role: 'General Secretary', name: '—' },
  { role: 'Finance Secretary', name: '—' },
]

export default async function AboutPage() {
  const config = await getSiteConfig()
  const siteName = config?.branding?.siteName || 'SSF Poonoor'
  const contact = config?.contact || {}

  return (
    <div>
      {/* Hero */}
      <section className="bg-darkbg text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 space-y-4">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
          <span className="block text-[10px] font-bold text-accent uppercase tracking-widest">About Us</span>
          <h1 className="text-3xl md:text-5xl font-bold font-serif">{siteName}</h1>
          <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
            Sunni Student Federation (SSF) has, since 1973, nurtured students through education, spirituality and
            socio-cultural engagement. The Poonoor Division carries that legacy forward across its campuses and
            communities.
          </p>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-6">
          <div className="bg-lightbg border border-gray-200 rounded-soft p-6 space-y-2">
            <SectionHeader eyebrow="Our Mission" title="Empowering Students" />
            <p className="text-sm text-muted leading-relaxed">
              To shape ethically grounded, intellectually active students who serve society while staying rooted in
              traditional values.
            </p>
          </div>
          <div className="bg-lightbg border border-gray-200 rounded-soft p-6 space-y-2">
            <SectionHeader eyebrow="Our Vision" title="A Knowledge Community" />
            <p className="text-sm text-muted leading-relaxed">
              A vibrant generation of students leading cultural, educational, environmental and spiritual progress in
              the Poonoor Division and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars (reuses the homepage About component) */}
      <AboutSection alt config={{ eyebrow: 'What We Do', title: 'Our Pillars' }} />

      {/* Leadership */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-6">
          <SectionHeader eyebrow="Our Team" title="Leadership" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {LEADERSHIP.map((l) => (
              <div key={l.role} className="bg-lightbg border border-gray-200 rounded-soft p-5 text-center">
                <span className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                  <Icon name="megaphone" className="w-6 h-6" />
                </span>
                <p className="text-sm font-bold font-serif text-ink">{l.name}</p>
                <p className="text-[11px] text-accent font-semibold uppercase tracking-wide">{l.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wings */}
      <section className="bg-lightbg">
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-6">
          <SectionHeader eyebrow="Portfolios" title="Wings & Initiatives" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {WINGS.map((w) => (
              <div key={w.name} className="bg-white border border-gray-200 rounded-soft p-4 text-center space-y-1">
                <p className="text-sm font-bold font-serif text-ink">{w.name}</p>
                <p className="text-[10px] text-muted">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      {contact.email || contact.phone || contact.address ? (
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-6 py-12 space-y-4">
            <SectionHeader eyebrow="Get in Touch" title="Contact Us" />
            <div className="flex flex-wrap gap-6 text-sm text-muted">
              {contact.email ? (
                <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-primary">
                  <Icon name="mail" className="w-4 h-4 text-primary" /> {contact.email}
                </a>
              ) : null}
              {contact.phone ? (
                <a href={`tel:${contact.phone}`} className="flex items-center gap-2 hover:text-primary">
                  <Icon name="phone" className="w-4 h-4 text-primary" /> {contact.phone}
                </a>
              ) : null}
              {contact.address ? (
                <a
                  href={contact.mapLink || undefined}
                  target={contact.mapLink ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary"
                >
                  <Icon name="map-pin" className="w-4 h-4 text-primary" /> {contact.address}
                </a>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
