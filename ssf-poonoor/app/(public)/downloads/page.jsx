import { ensureModuleEnabled } from '@/lib/module-guard'
import ListPageLayout from '@/components/public/ListPageLayout'
import DownloadItem from '@/components/public/cards/DownloadItem'
import JsonLd from '@/components/public/seo/JsonLd'
import { getSiteConfig } from '@/lib/public-content'
import { buildMetadata, buildJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const siteConfig = await getSiteConfig()
  return buildMetadata({
    siteConfig,
    title: 'Downloads',
    description: 'Downloadable resources, documents and PDFs from SSF Poonoor Division.',
    path: '/downloads',
    type: 'website',
  })
}

// Mockup groups downloads by collapsible category; we render the shared list
// layout with a category filter instead, to reuse ListPageLayout across all 7.
export default async function DownloadsListPage({ searchParams }) {
  await ensureModuleEnabled('downloads')
  const siteConfig = await getSiteConfig()
  const breadcrumbLd = buildJsonLd({
    type: 'BreadcrumbList',
    siteConfig,
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Downloads' }],
  })
  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <ListPageLayout
        module="downloads"
        title="Downloads"
        eyebrow="Resources"
        CardComponent={DownloadItem}
        searchParams={searchParams}
        variant="list"
        gridClassName="space-y-3 max-w-3xl"
      />
    </>
  )
}
