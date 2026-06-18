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
import JsonLd from '@/components/public/seo/JsonLd'
import { fetchPublicItem, fetchRelated, fetchLinkedItems, getSiteConfig } from '@/lib/public-content'
import { buildMetadata, buildJsonLd, MODULE_SCHEMA_TYPE } from '@/lib/seo'
import { formatDate } from '@/lib/format'
import { REVALIDATE_SECONDS } from '@/lib/perf'

// ISR — detail pages read only `params`; TTL from a constant, no per-request DB hit.
export const revalidate = REVALIDATE_SECONDS

export async function generateMetadata({ params }) {
  const [item, siteConfig] = await Promise.all([fetchPublicItem('campaigns', params.slug), getSiteConfig()])
  if (!item) return {}
  return buildMetadata({ item, siteConfig, type: 'article', path: `/campaigns/${params.slug}` })
}

export default async function CampaignDetailPage({ params }) {
  await ensureModuleEnabled('campaigns')
  const item = await fetchPublicItem('campaigns', params.slug)
  if (!item) notFound()

  const [related, linked, siteConfig] = await Promise.all([
    fetchRelated('campaigns', { categoryId: item.categoryId?._id, excludeId: item._id }),
    fetchLinkedItems(item.linkedItems || {}),
    getSiteConfig(),
  ])
  const range = [item.fromDate, item.toDate].filter(Boolean).map(formatDate).join(' – ')

  const path = `/campaigns/${params.slug}`
  const jsonLd = [
    buildJsonLd({ item, type: MODULE_SCHEMA_TYPE.campaigns, siteConfig, path }),
    buildJsonLd({
      type: 'BreadcrumbList',
      siteConfig,
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Campaigns', href: '/campaigns' }, { label: item.title }],
    }),
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <JsonLd data={jsonLd} />
      <ViewTracker module="campaigns" id={item._id} />

      <div className="mb-4">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Campaigns', href: '/campaigns' }, { label: item.title }]} />
      </div>

      <div className="relative h-52 md:h-80 rounded-soft overflow-hidden bg-darkbg mb-5">
        {item.bannerImage ? (
          <Image src={item.bannerImage} alt={item.title} fill priority sizes="(max-width:768px) 100vw, 896px" className="object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {item.isActive ? (
          <span className="absolute top-3.5 left-3.5 bg-emerald-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Active
          </span>
        ) : null}
      </div>

      <header className="space-y-2 border-b border-gray-100 pb-5 mb-5">
        {item.categoryId ? <CategoryBadge category={item.categoryId} variant="inline" /> : null}
        <h1 className="text-2xl md:text-3xl font-extrabold font-serif text-ink leading-tight">{item.title}</h1>
        {range ? <p className="text-[11px] text-gray-400 font-medium">{range}</p> : null}
      </header>

      <CustomCssScope id={item._id} css={item.customCss} className="article-content">
        {item.content ? <div dangerouslySetInnerHTML={{ __html: item.content }} /> : null}
      </CustomCssScope>

      <div className="mt-8">
        <LinkedItemsPanel linked={linked} />
      </div>

      <div className="mt-6 py-4 border-y border-gray-100 flex items-center justify-between gap-3 flex-wrap">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Share this campaign</span>
        <ShareButtons title={item.title} />
      </div>

      {related.length ? (
        <div className="mt-8">
          <RelatedItems items={related} basePath="/campaigns" title="Related Campaigns" />
        </div>
      ) : null}
    </div>
  )
}
