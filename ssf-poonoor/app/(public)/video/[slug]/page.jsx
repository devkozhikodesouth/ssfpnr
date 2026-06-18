import { notFound } from 'next/navigation'
import { ensureModuleEnabled } from '@/lib/module-guard'
import Breadcrumbs from '@/components/public/Breadcrumbs'
import ShareButtons from '@/components/public/ShareButtons'
import RelatedItems from '@/components/public/RelatedItems'
import ViewTracker from '@/components/public/ViewTracker'
import CustomCssScope from '@/components/public/CustomCssScope'
import CategoryBadge from '@/components/public/cards/CategoryBadge'
import JsonLd from '@/components/public/seo/JsonLd'
import { fetchPublicItem, fetchRelated, getSiteConfig } from '@/lib/public-content'
import { buildMetadata, buildJsonLd, MODULE_SCHEMA_TYPE } from '@/lib/seo'
import { youTubeId, formatDate } from '@/lib/format'
import { REVALIDATE_SECONDS } from '@/lib/perf'

// ISR — detail pages read only `params`; TTL from a constant, no per-request DB hit.
export const revalidate = REVALIDATE_SECONDS

export async function generateMetadata({ params }) {
  const [item, siteConfig] = await Promise.all([fetchPublicItem('video', params.slug), getSiteConfig()])
  if (!item) return {}
  return buildMetadata({ item, siteConfig, type: 'article', path: `/video/${params.slug}` })
}

export default async function VideoDetailPage({ params }) {
  await ensureModuleEnabled('video')
  const item = await fetchPublicItem('video', params.slug)
  if (!item) notFound()

  const [related, siteConfig] = await Promise.all([
    fetchRelated('video', { categoryId: item.categoryId?._id, excludeId: item._id }),
    getSiteConfig(),
  ])
  const vid = youTubeId(item.youTubeLink)

  const path = `/video/${params.slug}`
  const jsonLd = [
    buildJsonLd({ item, type: MODULE_SCHEMA_TYPE.video, siteConfig, path }),
    buildJsonLd({
      type: 'BreadcrumbList',
      siteConfig,
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Videos', href: '/video' }, { label: item.title }],
    }),
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <JsonLd data={jsonLd} />
      <ViewTracker module="video" id={item._id} />

      <div className="mb-4">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Videos', href: '/video' }, { label: item.title }]} />
      </div>

      {/* Player */}
      <div className="aspect-video bg-darkbg rounded-soft overflow-hidden mb-5">
        {vid ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${vid}?rel=0`}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-sm">Video unavailable</div>
        )}
      </div>

      <header className="space-y-2 border-b border-gray-100 pb-5 mb-5">
        {item.categoryId ? <CategoryBadge category={item.categoryId} variant="inline" /> : null}
        <h1 className="text-2xl md:text-3xl font-extrabold font-serif text-ink leading-tight">{item.title}</h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-400 font-medium">
          <span>{formatDate(item.publishedAt || item.createdAt)}</span>
          {item.duration ? (
            <>
              <span className="text-gray-300">·</span>
              <span>{item.duration}</span>
            </>
          ) : null}
        </div>
        {item.speakers?.length ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {item.speakers.map((s, i) => (
              <span key={i} className="bg-primary/10 text-primary text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                {s.name}
                {s.role ? ` · ${s.role}` : ''}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      <CustomCssScope id={item._id} css={item.customCss} className="article-content">
        {item.description ? <div dangerouslySetInnerHTML={{ __html: item.description }} /> : null}
      </CustomCssScope>

      {item.transcript ? (
        <details className="mt-6 bg-lightbg border border-gray-200 rounded-soft p-4">
          <summary className="text-sm font-bold text-ink cursor-pointer">Transcript</summary>
          <div className="text-sm text-muted leading-relaxed mt-3 whitespace-pre-line">{item.transcript}</div>
        </details>
      ) : null}

      <div className="mt-6 py-4 border-y border-gray-100 flex items-center justify-between gap-3 flex-wrap">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Share this video</span>
        <ShareButtons title={item.title} />
      </div>

      {related.length ? (
        <div className="mt-8">
          <RelatedItems items={related} basePath="/video" title="Related Videos" />
        </div>
      ) : null}
    </div>
  )
}
