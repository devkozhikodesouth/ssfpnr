import SectionHeader from '@/components/public/SectionHeader'
import { typeStyle } from '@/lib/typography'

/**
 * Homepage "Live" section (Website Builder → Live). Renders one or more
 * livestream embeds under a heading. Supports MULTIPLE live programs: the
 * section `config.items` is an array of { title, embedUrl, active }. Only active
 * streams render; a single legacy `config.embedUrl` is still honoured. Content
 * (eyebrow/title/subtitle/description/bgColor/CTA/typography) is data-driven.
 *
 * @param {{ config?: object }} props
 */
function toEmbedUrl(url = '') {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([\w-]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  return url
}

export default function LiveSection({ config = {} }) {
  const sectionStyle = { backgroundColor: config.bgColor || '#0f1729' }
  const cta = config.cta || {}
  const ctaStyle = { backgroundColor: cta.bgColor || undefined, color: cta.textColor || undefined }
  const ty = config.typography || {}

  // Normalise to a list of programs. New: config.items[]; legacy: single embedUrl.
  const list = Array.isArray(config.items) && config.items.length
    ? config.items.filter((it) => it && it.active !== false && (it.embedUrl || it.url))
    : config.embedUrl || config.video || config.url
      ? [{ title: '', embedUrl: config.embedUrl || config.video || config.url }]
      : []

  const multi = list.length > 1

  return (
    <section className="text-white" style={sectionStyle}>
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-6">
        <div className="[&_*]:text-white">
          <SectionHeader
            eyebrow={config.eyebrow || 'Streaming Now'}
            title={config.title || 'Live'}
            subtitle={config.subtitle}
            size="lg"
            titleStyle={typeStyle(ty.title)}
          />
        </div>
        {config.description ? (
          <p className="text-sm text-gray-200 leading-relaxed max-w-3xl" style={typeStyle(ty.body)}>
            {config.description}
          </p>
        ) : null}

        {list.length ? (
          <div className={multi ? 'grid gap-6 md:grid-cols-2' : ''}>
            {list.map((item, i) => (
              <div key={i} className="space-y-2">
                {item.title ? <h3 className="text-sm font-bold text-accent">{item.title}</h3> : null}
                <div className="relative w-full overflow-hidden rounded-soft shadow-lg" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    src={toEmbedUrl(item.embedUrl || item.url)}
                    title={item.title || config.title || `Live stream ${i + 1}`}
                    className="absolute inset-0 h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
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
