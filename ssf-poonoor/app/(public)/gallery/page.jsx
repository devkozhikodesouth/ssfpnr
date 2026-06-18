import { ensureModuleEnabled } from '@/lib/module-guard'
import ListPageLayout from '@/components/public/ListPageLayout'
import GalleryCard from '@/components/public/cards/GalleryCard'
import JsonLd from '@/components/public/seo/JsonLd'
import { getSiteConfig } from '@/lib/public-content'
import { buildMetadata, buildJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const siteConfig = await getSiteConfig()
  return buildMetadata({
    siteConfig,
    title: 'Gallery',
    description: 'Photo albums and moments from SSF Poonoor Division.',
    path: '/gallery',
    type: 'website',
  })
}

export default async function GalleryListPage({ searchParams }) {
  await ensureModuleEnabled('gallery')
  const siteConfig = await getSiteConfig()
  const breadcrumbLd = buildJsonLd({
    type: 'BreadcrumbList',
    siteConfig,
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Gallery' }],
  })
  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <ListPageLayout module="gallery" title="Gallery" eyebrow="Memories" CardComponent={GalleryCard} searchParams={searchParams} />
    </>
  )
}
