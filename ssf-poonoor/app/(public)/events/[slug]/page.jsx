import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ensureModuleEnabled } from '@/lib/module-guard'
import Breadcrumbs from '@/components/public/Breadcrumbs'
import ShareButtons from '@/components/public/ShareButtons'
import RelatedItems from '@/components/public/RelatedItems'
import ViewTracker from '@/components/public/ViewTracker'
import CustomCssScope from '@/components/public/CustomCssScope'
import CategoryBadge from '@/components/public/cards/CategoryBadge'
import LinkedItemsPanel from '@/components/public/LinkedItemsPanel'
import Icon from '@/components/public/Icon'
import JsonLd from '@/components/public/seo/JsonLd'
import { fetchPublicItem, fetchRelated, fetchLinkedItems, getSiteConfig } from '@/lib/public-content'
import { buildMetadata, buildJsonLd, MODULE_SCHEMA_TYPE } from '@/lib/seo'
import { formatDate, eventStatus } from '@/lib/format'
import { REVALIDATE_SECONDS } from '@/lib/perf'

// ISR — detail pages read only `params`; TTL from a constant, no per-request DB hit.
export const revalidate = REVALIDATE_SECONDS

const STATUS_STYLES = {
  upcoming: 'bg-emerald-100 text-emerald-800',
  ongoing: 'bg-accent/20 text-amber-800',
  past: 'bg-gray-100 text-gray-500',
}

export async function generateMetadata({ params }) {
  const [item, siteConfig] = await Promise.all([fetchPublicItem('events', params.slug), getSiteConfig()])
  if (!item) return {}
  return buildMetadata({ item, siteConfig, type: 'article', path: `/events/${params.slug}` })
}

export default async function EventDetailPage({ params }) {
  await ensureModuleEnabled('events')
  const item = await fetchPublicItem('events', params.slug)
  if (!item) notFound()

  const [related, linked, siteConfig] = await Promise.all([
    fetchRelated('events', { categoryId: item.categoryId?._id, excludeId: item._id }),
    fetchLinkedItems(item.linkedItems || {}),
    getSiteConfig(),
  ])
  const status = item.status || eventStatus(item.fromDate, item.toDate)
  const range = [item.fromDate, item.toDate].filter(Boolean).map(formatDate).join(' – ')

  const path = `/events/${params.slug}`
  const jsonLd = [
    buildJsonLd({ item, type: MODULE_SCHEMA_TYPE.events, siteConfig, path }),
    buildJsonLd({
      type: 'BreadcrumbList',
      siteConfig,
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Events', href: '/events' }, { label: item.title }],
    }),
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <JsonLd data={jsonLd} />
      <ViewTracker module="events" id={item._id} />

      <div className="mb-4">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Events', href: '/events' }, { label: item.title }]} />
      </div>

      {item.image ? (
        <div className="relative h-52 md:h-80 rounded-soft overflow-hidden bg-darkbg mb-5">
          <Image src={item.image} alt={item.title} fill priority sizes="(max-width:768px) 100vw, 896px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      ) : null}

      <header className="space-y-3 border-b border-gray-100 pb-5 mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          {item.categoryId ? <CategoryBadge category={item.categoryId} variant="inline" /> : null}
          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${STATUS_STYLES[status]}`}>{status}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold font-serif text-ink leading-tight">{item.title}</h1>
        <div className="grid sm:grid-cols-2 gap-2 text-xs text-muted">
          {range ? (
            <span className="flex items-center gap-2">
              <Icon name="calendar" className="w-4 h-4 text-primary shrink-0" /> {range}
            </span>
          ) : null}
          {item.venue || item.location ? (
            <span className="flex items-center gap-2">
              <Icon name="map-pin" className="w-4 h-4 text-primary shrink-0" /> {[item.venue, item.location].filter(Boolean).join(', ')}
            </span>
          ) : null}
          {item.capacity ? (
            <span className="flex items-center gap-2">
              <Icon name="newspaper" className="w-4 h-4 text-primary shrink-0" /> Capacity: {item.capacity}
            </span>
          ) : null}
        </div>
        {item.registrationLink && status !== 'past' ? (
          <a
            href={item.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md transition-colors"
          >
            Register Now <Icon name="arrow-right" className="w-4 h-4" />
          </a>
        ) : null}
      </header>

      <CustomCssScope id={item._id} css={item.customCss} className="article-content">
        {item.content ? <div dangerouslySetInnerHTML={{ __html: item.content }} /> : null}
      </CustomCssScope>

      <div className="mt-8">
        <LinkedItemsPanel linked={linked} />
      </div>

      <div className="mt-6 py-4 border-y border-gray-100 flex items-center justify-between gap-3 flex-wrap">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Share this event</span>
        <ShareButtons title={item.title} />
      </div>

      {related.length ? (
        <div className="mt-8">
          <RelatedItems items={related} basePath="/events" title="Related Events" />
        </div>
      ) : null}
    </div>
  )
}
