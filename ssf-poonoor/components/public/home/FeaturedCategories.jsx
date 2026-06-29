import Link from 'next/link'
import CardImage from '@/components/public/cards/CardImage'
import SectionHeader from '@/components/public/SectionHeader'
import { getFeaturedCategories } from '@/lib/public-content'
import { typeStyle } from '@/lib/typography'

/**
 * Featured standalone categories (PLAN §15.1 #3) — the "special categories"
 * strip. Horizontal "peek" scroller on mobile, an even grid on desktop. Each
 * card links to the standalone category page /c/[slug]. Content (eyebrow, title,
 * subtitle, description, background, CTA, typography) is editable in
 * Website Builder → Featured Categories, mirroring ModuleSection so the section
 * aligns identically across mobile/tablet/desktop. Renders nothing when no
 * categories are flagged featured.
 *
 * @param {{ config?: object, alt?: boolean }} props
 */
export default async function FeaturedCategories({ config = {}, alt = false }) {
  const categories = await getFeaturedCategories()
  if (!categories.length) return null

  const sectionStyle = config.bgColor ? { backgroundColor: config.bgColor } : undefined
  const cta = config.cta || {}
  const ctaStyle = { backgroundColor: cta.bgColor || undefined, color: cta.textColor || undefined }
  const ty = config.typography || {}

  return (
    <section className={alt ? 'bg-lightbg' : 'bg-white'} style={sectionStyle}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-5">
        <SectionHeader
          eyebrow={config.eyebrow || 'Portals & Initiatives'}
          title={config.title || 'Featured Categories'}
          subtitle={config.subtitle}
          titleStyle={typeStyle(ty.title)}
        />
        {config.description ? (
          <p className="text-sm text-muted leading-relaxed max-w-3xl" style={typeStyle(ty.body)}>
            {config.description}
          </p>
        ) : null}
        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory hide-scrollbar pb-2 items-stretch">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/c/${cat.slug}`}
              className="w-[280px] md:w-auto shrink-0 snap-center bg-white rounded-soft shadow-sm border border-gray-200 overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
            >
              <div className="relative h-28">
                <CardImage src={cat.coverImage} alt={cat.name} sizes="280px" />
              </div>
              <div className="p-3.5 flex items-center justify-between gap-2 mt-auto">
                <h3 className="font-bold text-sm text-ink font-serif line-clamp-1">{cat.name}</h3>
                <span className="text-[11px] text-primary font-bold group-hover:underline shrink-0">View →</span>
              </div>
            </Link>
          ))}
        </div>
        {cta.enabled && cta.text ? (
          <div>
            <a
              href={cta.url || '#'}
              style={ctaStyle}
              className="inline-block bg-primary hover:bg-secondary text-white font-bold px-7 py-2.5 rounded-full text-xs tracking-wider uppercase shadow-md transition-colors"
            >
              {cta.text}
            </a>
          </div>
        ) : null}
      </div>
    </section>
  )
}
