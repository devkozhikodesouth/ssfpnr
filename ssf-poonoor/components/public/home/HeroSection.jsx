import Image from 'next/image'
import Link from 'next/link'

/**
 * Full-bleed dark hero (PLAN §15.1 #1). Background image OR video with gradient
 * overlay, organisation name + tagline, and a CTA. All content is data-driven
 * from SiteConfig.branding plus the homepage section's own `config`, which the
 * Website Builder writes (eyebrow, title, subtitle, description, media, CTA).
 *
 * @param {{ branding?: object, config?: object }} props
 */
export default function HeroSection({ branding = {}, config = {} }) {
  const image = config.image || branding.ogDefaultImage
  const video = config.video || config.videoUrl
  const eyebrow = config.eyebrow
  const title = config.title || branding.siteName || 'SSF Poonoor'
  const subtitle = config.subtitle || branding.tagline || 'Sunni Student Federation, Poonoor Division'
  const description = config.description
  // CTA: enabled unless explicitly turned off (back-compat with older configs).
  const ctaEnabled = config.cta?.enabled ?? config.ctaEnabled ?? true
  const cta = config.cta || {}
  const ctaLabel = cta.text || config.ctaLabel || 'Explore'
  const ctaHref = cta.url || config.ctaHref || '/about'
  const ctaBg = cta.bgColor || config.ctaBg
  const ctaText = cta.textColor || config.ctaText

  const sectionStyle = config.bgColor ? { backgroundColor: config.bgColor } : undefined
  const ctaStyle = ctaBg || ctaText ? { backgroundColor: ctaBg, color: ctaText } : undefined

  return (
    <section className="relative bg-darkbg text-white overflow-hidden" style={sectionStyle}>
      {video ? (
        <video
          src={video}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
      ) : image ? (
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-30" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-darkbg via-darkbg/70 to-darkbg/30" />
      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="max-w-2xl space-y-4">
          {eyebrow ? (
            <p className="text-xs md:text-sm text-accent tracking-[0.2em] uppercase font-semibold">{eyebrow}</p>
          ) : null}
          <h1 className="text-4xl md:text-6xl font-bold font-serif tracking-wide leading-tight">{title}</h1>
          <p className="text-xs md:text-sm text-gray-300 tracking-wider uppercase font-medium">{subtitle}</p>
          {description ? (
            <p className="text-sm md:text-base text-gray-200 leading-relaxed max-w-xl">{description}</p>
          ) : null}
          {ctaEnabled && ctaLabel ? (
            <div className="pt-2">
              <Link
                href={ctaHref}
                style={ctaStyle}
                className="inline-block bg-accent text-darkbg hover:opacity-90 font-bold px-7 py-2.5 rounded-full text-xs tracking-wider uppercase shadow-md transition-opacity"
              >
                {ctaLabel}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
