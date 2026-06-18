import Image from 'next/image'
import Link from 'next/link'

/**
 * Full-bleed dark hero (PLAN §15.1 #1). Background image with gradient overlay,
 * organisation name + tagline, and an Explore CTA. All content is data-driven
 * from SiteConfig.branding plus the homepage section's own `config`.
 *
 * @param {{ branding?: object, config?: object }} props
 */
export default function HeroSection({ branding = {}, config = {} }) {
  const image = config.image || branding.ogDefaultImage
  const title = config.title || branding.siteName || 'SSF Poonoor'
  const subtitle = config.subtitle || branding.tagline || 'Sunni Student Federation, Poonoor Division'
  const ctaLabel = config.ctaLabel || 'Explore'
  const ctaHref = config.ctaHref || '/about'

  return (
    <section className="relative bg-darkbg text-white overflow-hidden">
      {image ? (
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-30" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-darkbg via-darkbg/70 to-darkbg/30" />
      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold font-serif tracking-wide leading-tight">{title}</h1>
          <p className="text-xs md:text-sm text-gray-300 tracking-wider uppercase font-medium">{subtitle}</p>
          <div className="pt-2">
            <Link
              href={ctaHref}
              className="inline-block bg-accent text-darkbg hover:opacity-90 font-bold px-7 py-2.5 rounded-full text-xs tracking-wider uppercase shadow-md transition-opacity"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
