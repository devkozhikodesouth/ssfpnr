import SectionHeader from '@/components/public/SectionHeader'

/**
 * Homepage "Live" section (Website Builder → Live). Renders a livestream embed
 * (YouTube/Facebook/iframe URL) under a heading. All content is data-driven from
 * the section `config`: eyebrow, title, subtitle, description, bgColor, embedUrl,
 * and an optional CTA. Renders on dark by default to suit a video embed.
 *
 * @param {{ config?: object }} props
 */
function toEmbedUrl(url = '') {
  // Normalise common YouTube watch/share links to an embeddable form.
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  return url
}

export default function LiveSection({ config = {} }) {
  const embed = config.embedUrl || config.video || config.url
  const sectionStyle = { backgroundColor: config.bgColor || '#0f1729' }
  const cta = config.cta || {}
  const ctaStyle = { backgroundColor: cta.bgColor || undefined, color: cta.textColor || undefined }

  return (
    <section className="text-white" style={sectionStyle}>
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-6">
        <div className="[&_*]:text-white">
          <SectionHeader
            eyebrow={config.eyebrow || 'Streaming Now'}
            title={config.title || 'Live'}
            subtitle={config.subtitle}
            size="lg"
          />
        </div>
        {config.description ? (
          <p className="text-sm text-gray-200 leading-relaxed max-w-3xl">{config.description}</p>
        ) : null}
        {embed ? (
          <div className="relative w-full overflow-hidden rounded-soft shadow-lg" style={{ paddingTop: '56.25%' }}>
            <iframe
              src={toEmbedUrl(embed)}
              title={config.title || 'Live stream'}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="rounded-soft border border-white/10 bg-white/5 p-10 text-center text-sm text-gray-300">
            No live stream is configured right now. Check back soon.
          </div>
        )}
        {cta.enabled && cta.text ? (
          <div>
            <a
              href={cta.url || '#'}
              target={cta.url?.startsWith('http') ? '_blank' : undefined}
              rel={cta.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
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
