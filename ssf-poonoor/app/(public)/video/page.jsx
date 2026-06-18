import { ensureModuleEnabled } from '@/lib/module-guard'
import ListPageLayout from '@/components/public/ListPageLayout'
import VideoCard from '@/components/public/cards/VideoCard'
import JsonLd from '@/components/public/seo/JsonLd'
import { getSiteConfig } from '@/lib/public-content'
import { buildMetadata, buildJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const siteConfig = await getSiteConfig()
  return buildMetadata({
    siteConfig,
    title: 'Videos',
    description: 'Watch talks, reports and video stories from SSF Poonoor Division.',
    path: '/video',
    type: 'website',
  })
}

export default async function VideoListPage({ searchParams }) {
  await ensureModuleEnabled('video')
  const siteConfig = await getSiteConfig()
  const breadcrumbLd = buildJsonLd({
    type: 'BreadcrumbList',
    siteConfig,
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Videos' }],
  })
  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <ListPageLayout module="video" title="Videos" eyebrow="Video Stories" CardComponent={VideoCard} searchParams={searchParams} />
    </>
  )
}
