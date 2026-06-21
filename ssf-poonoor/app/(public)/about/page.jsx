import Link from 'next/link'
import Breadcrumbs from '@/components/public/Breadcrumbs'
import SectionHeader from '@/components/public/SectionHeader'
import Icon from '@/components/public/Icon'
import JsonLd from '@/components/public/seo/JsonLd'
import { getSiteConfig } from '@/lib/public-content'
import { buildMetadata, buildJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const siteConfig = await getSiteConfig()
  const siteName = siteConfig?.branding?.siteName || 'SSF Poonoor'
  return buildMetadata({
    siteConfig,
    title: 'About',
    description: `About ${siteName} — the Sunni Student Federation, Poonoor Division: history, mission, leadership and wings.`,
    path: '/about',
    type: 'website',
  })
}

// Fallbacks used only when the admin hasn't entered content yet. Everything here
// is overridable via Website Builder → About Page (SiteConfig.about).
const DEFAULT_PILLARS = [
  { title: 'Cultural', icon: 'image' },
  { title: 'Spiritual', icon: 'megaphone' },
  { title: 'Education', icon: 'document' },
  { title: 'Environment', icon: 'map-pin' },
  { title: 'Political', icon: 'newspaper' },
]
const DEFAULT_WINGS = [
  { name: 'IPB', desc: 'Idea Production Bureau' },
  { name: 'Risala', desc: 'Publication & study circle' },
  { name: "Let's Smile", desc: 'Charity & welfare wing' },
  { name: 'WEFI', desc: 'Welfare & finance initiative' },
  { name: 'Kalalayam', desc: 'Arts & culture wing' },
]
const DEFAULT_LEADERSHIP = [
  { role: 'President', name: '—' },
  { role: 'General Secretary', name: '—' },
  { role: 'Finance Secretary', name: '—' },
]

function CtaButton({ cta }) {
  if (!cta?.enabled || !cta?.text) return null
  const style = { backgroundColor: cta.bgColor || undefined, color: cta.textColor || undefined }
  return (
    <Link
      href={cta.url || '#'}
      style={style}
      className="inline-block bg-primary hover:bg-secondary text-white font-bold px-7 py-2.5 rounded-full text-xs tracking-wider uppercase shadow-md transition-opacity"
    >
      {cta.text}
    </Link>
  )
}

export default async function AboutPage() {
  const config = await getSiteConfig()
  const siteName = config?.branding?.siteName || 'SSF Poonoor'
  const contact = config?.contact || {}
  const about = config?.about || {}

  const hero = about.hero || {}
  const mv = about.missionVision || {}
  const mission = mv.mission || {}
  const vision = mv.vision || {}
  const pillars = about.pillars || {}
  const leadership = about.leadership || {}
  const wings = about.wings || {}

  const pillarItems = pillars.items?.length ? pillars.items : DEFAULT_PILLARS
  const leadershipItems = leadership.items?.length ? leadership.items : DEFAULT_LEADERSHIP
  const wingItems = wings.items?.length ? wings.items : DEFAULT_WINGS

  const breadcrumbLd = buildJsonLd({
    type: 'BreadcrumbList',
    siteConfig: config,
    crumbs: [{ label: 'Home', href: '/' }, { label: 'About' }],
  })

  return (
    <div>
      <JsonLd data={breadcrumbLd} />

      {/* Hero */}
      <section className="bg-darkbg text-white" style={hero.bgColor ? { backgroundColor: hero.bgColor } : undefined}>
        <div className="max-w-7xl mx-auto px-6 py-16 space-y-4">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
          {hero.eyebrow ? (
            <span className="block text-[10px] font-bold text-accent uppercase tracking-widest">{hero.eyebrow}</span>
          ) : null}
          <h1 className="text-3xl md:text-5xl font-bold font-serif">{hero.title || siteName}</h1>
          {hero.subtitle ? <p className="text-sm text-accent tracking-wider uppercase">{hero.subtitle}</p> : null}
          <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
            {hero.description ||
              'Sunni Student Federation (SSF) has, since 1973, nurtured students through education, spirituality and socio-cultural engagement. The Poonoor Division carries that legacy forward across its campuses and communities.'}
          </p>
          <CtaButton cta={hero.cta} />
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="bg-white" style={mv.bgColor ? { backgroundColor: mv.bgColor } : undefined}>
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-6">
          <div className="bg-lightbg border border-gray-200 rounded-soft p-6 space-y-2">
            <SectionHeader eyebrow={mission.eyebrow || 'Our Mission'} title={mission.title || 'Empowering Students'} />
            <p className="text-sm text-muted leading-relaxed">
              {mission.text ||
                'To shape ethically grounded, intellectually active students who serve society while staying rooted in traditional values.'}
            </p>
          </div>
          <div className="bg-lightbg border border-gray-200 rounded-soft p-6 space-y-2">
            <SectionHeader eyebrow={vision.eyebrow || 'Our Vision'} title={vision.title || 'A Knowledge Community'} />
            <p className="text-sm text-muted leading-relaxed">
              {vision.text ||
                'A vibrant generation of students leading cultural, educational, environmental and spiritual progress in the Poonoor Division and beyond.'}
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-lightbg" style={pillars.bgColor ? { backgroundColor: pillars.bgColor } : undefined}>
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-6">
          <SectionHeader eyebrow={pillars.eyebrow || 'What We Do'} title={pillars.title || 'Our Pillars'} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {pillarItems.map((p, i) => (
              <div
                key={`${p.title}-${i}`}
                className="bg-white border border-gray-200 rounded-soft p-4 flex flex-col items-center text-center gap-2 shadow-sm"
              >
                <span className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Icon name={p.icon || 'image'} className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold font-serif text-ink">{p.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-white" style={leadership.bgColor ? { backgroundColor: leadership.bgColor } : undefined}>
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-6">
          <SectionHeader eyebrow={leadership.eyebrow || 'Our Team'} title={leadership.title || 'Leadership'} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {leadershipItems.map((l, i) => (
              <div key={`${l.role}-${i}`} className="bg-lightbg border border-gray-200 rounded-soft p-5 text-center">
                {l.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={l.photo} alt={l.name || l.role} className="w-14 h-14 rounded-full object-cover mx-auto mb-2" />
                ) : (
                  <span className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                    <Icon name="user" className="w-6 h-6" />
                  </span>
                )}
                <p className="text-sm font-bold font-serif text-ink">{l.name || '—'}</p>
                <p className="text-[11px] text-accent font-semibold uppercase tracking-wide">{l.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wings */}
      <section className="bg-lightbg" style={wings.bgColor ? { backgroundColor: wings.bgColor } : undefined}>
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-6">
          <SectionHeader eyebrow={wings.eyebrow || 'Portfolios'} title={wings.title || 'Wings & Initiatives'} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {wingItems.map((w, i) => (
              <div key={`${w.name}-${i}`} className="bg-white border border-gray-200 rounded-soft p-4 text-center space-y-1">
                <p className="text-sm font-bold font-serif text-ink">{w.name}</p>
                <p className="text-[10px] text-muted">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact (from Site Setup → Social & Contact) */}
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
