import Link from 'next/link'
import Icon from '@/components/public/Icon'
import SectionHeader from '@/components/public/SectionHeader'

// The five SSF pillars (PLAN §15.1 #2). Defaults shown when no config override.
const DEFAULT_PILLARS = [
  { title: 'Cultural', icon: 'image' },
  { title: 'Spiritual', icon: 'megaphone' },
  { title: 'Education', icon: 'document' },
  { title: 'Environment', icon: 'map-pin' },
  { title: 'Political', icon: 'newspaper' },
]

/**
 * Homepage "About" pillars strip (PLAN §15.1 #2). Content is data-driven: the
 * section `config` (Website Builder → About) may override the heading/intro,
 * background color, CTA and supply its own pillars.
 *
 * @param {{ config?: object, alt?: boolean }} props
 */
export default function AboutSection({ config = {}, alt = false }) {
  const pillars = config.pillars?.length ? config.pillars : DEFAULT_PILLARS
  const sectionStyle = config.bgColor ? { backgroundColor: config.bgColor } : undefined
  const cta = config.cta || {}
  const ctaStyle = { backgroundColor: cta.bgColor || undefined, color: cta.textColor || undefined }

  return (
    <section className={alt ? 'bg-lightbg' : 'bg-white'} style={sectionStyle}>
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
        <SectionHeader
          eyebrow={config.eyebrow || 'Who We Are'}
          title={config.title || 'Our Pillars'}
          subtitle={config.subtitle}
        />
        <p className="text-sm text-muted leading-relaxed max-w-3xl">
          {config.description ||
            config.intro ||
            'SSF Poonoor Division works across cultural, spiritual, educational, environmental and political fronts to empower the student community.'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="bg-white border border-gray-200 rounded-soft p-4 flex flex-col items-center text-center gap-2 shadow-sm"
            >
              <span className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Icon name={p.icon || 'image'} className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold font-serif text-ink">{p.title}</span>
            </div>
          ))}
        </div>
        {cta.enabled && cta.text ? (
          <div>
            <Link
              href={cta.url || '/about'}
              style={ctaStyle}
              className="inline-block bg-primary hover:bg-secondary text-white font-bold px-7 py-2.5 rounded-full text-xs tracking-wider uppercase shadow-md transition-colors"
            >
              {cta.text}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
