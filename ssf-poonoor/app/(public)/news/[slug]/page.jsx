import { notFound } from 'next/navigation'
import { ensureModuleEnabled } from '@/lib/module-guard'
import ArticleDetail from '@/components/public/ArticleDetail'
import JsonLd from '@/components/public/seo/JsonLd'
import { fetchPublicItem, fetchRelated, getModuleConfig, getSiteConfig } from '@/lib/public-content'
import { buildMetadata, buildJsonLd, MODULE_SCHEMA_TYPE } from '@/lib/seo'
import { REVALIDATE_SECONDS } from '@/lib/perf'

// ISR (PLAN §9.2 / §21.2): detail pages read only `params`, so they can be
// statically generated on demand and revalidated. The TTL comes from a constant
// (mirrors site_config.performance.revalidateSeconds) — no per-request DB hit
// just to learn the revalidate value.
export const revalidate = REVALIDATE_SECONDS

export async function generateMetadata({ params }) {
  const [item, siteConfig] = await Promise.all([fetchPublicItem('news', params.slug), getSiteConfig()])
  if (!item) return {}
  return buildMetadata({ item, siteConfig, type: 'article', path: `/news/${params.slug}` })
}

export default async function NewsDetailPage({ params }) {
  await ensureModuleEnabled('news')
  const item = await fetchPublicItem('news', params.slug)
  if (!item) notFound()

  const [related, config, siteConfig] = await Promise.all([
    fetchRelated('news', { categoryId: item.categoryId?._id, excludeId: item._id }),
    getModuleConfig('news'),
    getSiteConfig(),
  ])

  const path = `/news/${params.slug}`
  const jsonLd = [
    buildJsonLd({ item, type: MODULE_SCHEMA_TYPE.news, siteConfig, path }),
    buildJsonLd({
      type: 'BreadcrumbList',
      siteConfig,
      crumbs: [{ label: 'Home', href: '/' }, { label: 'News', href: '/news' }, { label: item.title }],
    }),
  ]

  return (
    <>
      <JsonLd data={jsonLd} />
      <ArticleDetail
        module="news"
        item={item}
        basePath="/news"
        label="News"
        related={related}
        showReadTime={config.showReadTime !== false}
      />
    </>
  )
}
