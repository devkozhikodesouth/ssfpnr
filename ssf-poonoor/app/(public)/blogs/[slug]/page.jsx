import { notFound } from 'next/navigation'
import { ensureModuleEnabled } from '@/lib/module-guard'
import ArticleDetail from '@/components/public/ArticleDetail'
import JsonLd from '@/components/public/seo/JsonLd'
import { fetchPublicItem, fetchRelated, getModuleConfig, getSiteConfig } from '@/lib/public-content'
import { buildMetadata, buildJsonLd, MODULE_SCHEMA_TYPE } from '@/lib/seo'
import { REVALIDATE_SECONDS } from '@/lib/perf'

// ISR — detail pages read only `params`; TTL from a constant, no per-request DB hit.
export const revalidate = REVALIDATE_SECONDS

export async function generateMetadata({ params }) {
  const [item, siteConfig] = await Promise.all([fetchPublicItem('blogs', params.slug), getSiteConfig()])
  if (!item) return {}
  return buildMetadata({ item, siteConfig, type: 'article', path: `/blogs/${params.slug}` })
}

export default async function BlogDetailPage({ params }) {
  await ensureModuleEnabled('blogs')
  const item = await fetchPublicItem('blogs', params.slug)
  if (!item) notFound()

  const [related, config, siteConfig] = await Promise.all([
    fetchRelated('blogs', { categoryId: item.categoryId?._id, excludeId: item._id }),
    getModuleConfig('blogs'),
    getSiteConfig(),
  ])

  const path = `/blogs/${params.slug}`
  const jsonLd = [
    buildJsonLd({ item, type: MODULE_SCHEMA_TYPE.blogs, siteConfig, path }),
    buildJsonLd({
      type: 'BreadcrumbList',
      siteConfig,
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Blogs', href: '/blogs' }, { label: item.title }],
    }),
  ]

  return (
    <>
      <JsonLd data={jsonLd} />
      <ArticleDetail
        module="blogs"
        item={item}
        basePath="/blogs"
        label="Blogs"
        related={related}
        showReadTime={config.showReadTime !== false}
      />
    </>
  )
}
