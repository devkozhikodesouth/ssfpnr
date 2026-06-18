import { notFound } from 'next/navigation'
import { ensureModuleEnabled } from '@/lib/module-guard'
import Breadcrumbs from '@/components/public/Breadcrumbs'
import ShareButtons from '@/components/public/ShareButtons'
import RelatedItems from '@/components/public/RelatedItems'
import ViewTracker from '@/components/public/ViewTracker'
import Lightbox from '@/components/public/Lightbox'
import CategoryBadge from '@/components/public/cards/CategoryBadge'
import JsonLd from '@/components/public/seo/JsonLd'
import { fetchPublicItem, fetchRelated, getSiteConfig } from '@/lib/public-content'
import { buildMetadata, buildJsonLd, MODULE_SCHEMA_TYPE } from '@/lib/seo'
import { formatDate } from '@/lib/format'
import { REVALIDATE_SECONDS } from '@/lib/perf'

// ISR — detail pages read only `params`; TTL from a constant, no per-request DB hit.
export const revalidate = REVALIDATE_SECONDS

export async function generateMetadata({ params }) {
  const [item, siteConfig] = await Promise.all([fetchPublicItem('gallery', params.slug), getSiteConfig()])
  if (!item) return {}
  return buildMetadata({ item, siteConfig, type: 'article', path: `/gallery/${params.slug}` })
}

export default async function GalleryDetailPage({ params }) {
  await ensureModuleEnabled('gallery')
  const item = await fetchPublicItem('gallery', params.slug)
  if (!item) notFound()

  const [related, siteConfig] = await Promise.all([
    fetchRelated('gallery', { categoryId: item.categoryId?._id, excludeId: item._id }),
    getSiteConfig(),
  ])
  const images = [...(item.images || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  const path = `/gallery/${params.slug}`
  const jsonLd = [
    buildJsonLd({ item, type: MODULE_SCHEMA_TYPE.gallery, siteConfig, path }),
    buildJsonLd({
      type: 'BreadcrumbList',
      siteConfig,
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Gallery', href: '/gallery' }, { label: item.title }],
    }),
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <JsonLd data={jsonLd} />
      <ViewTracker module="gallery" id={item._id} />

      <div className="mb-4">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Gallery', href: '/gallery' }, { label: item.title }]} />
      </div>

      <header className="space-y-2 border-b border-gray-100 pb-5 mb-6">
        {item.categoryId ? <CategoryBadge category={item.categoryId} variant="inline" /> : null}
        <h1 className="text-2xl md:text-3xl font-extrabold font-serif text-ink leading-tight">{item.title}</h1>
        <p className="text-[11px] text-gray-400 font-medium">
          {formatDate(item.publishedAt || item.createdAt)} · {images.length} photo{images.length === 1 ? '' : 's'}
        </p>
      </header>

      {images.length ? (
        <Lightbox images={images} />
      ) : (
        <p className="text-sm text-gray-400 py-10 text-center">No images in this album.</p>
      )}

      <div className="mt-8 py-4 border-y border-gray-100 flex items-center justify-between gap-3 flex-wrap">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Share this album</span>
        <ShareButtons title={item.title} />
      </div>

      {related.length ? (
        <div className="mt-8">
          <RelatedItems items={related} basePath="/gallery" title="Related Albums" />
        </div>
      ) : null}
    </div>
  )
}
