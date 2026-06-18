import { ensureModuleEnabled } from '@/lib/module-guard'
import ListPageLayout from '@/components/public/ListPageLayout'
import NewsCard from '@/components/public/cards/NewsCard'
import JsonLd from '@/components/public/seo/JsonLd'
import { getSiteConfig } from '@/lib/public-content'
import { buildMetadata, buildJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const siteConfig = await getSiteConfig()
  return buildMetadata({
    siteConfig,
    title: 'News',
    description: 'Latest news and updates from SSF Poonoor Division.',
    path: '/news',
    type: 'website',
  })
}

export default async function NewsListPage({ searchParams }) {
  await ensureModuleEnabled('news')
  const siteConfig = await getSiteConfig()
  const breadcrumbLd = buildJsonLd({
    type: 'BreadcrumbList',
    siteConfig,
    crumbs: [{ label: 'Home', href: '/' }, { label: 'News' }],
  })
  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <ListPageLayout module="news" title="News" eyebrow="Archives" CardComponent={NewsCard} searchParams={searchParams} />
    </>
  )
}
