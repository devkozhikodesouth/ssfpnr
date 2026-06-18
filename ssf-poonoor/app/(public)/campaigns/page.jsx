import { ensureModuleEnabled } from '@/lib/module-guard'
import ListPageLayout from '@/components/public/ListPageLayout'
import CampaignCard from '@/components/public/cards/CampaignCard'
import JsonLd from '@/components/public/seo/JsonLd'
import { getSiteConfig } from '@/lib/public-content'
import { buildMetadata, buildJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const siteConfig = await getSiteConfig()
  return buildMetadata({
    siteConfig,
    title: 'Campaigns',
    description: 'Ongoing and past campaigns by SSF Poonoor Division.',
    path: '/campaigns',
    type: 'website',
  })
}

export default async function CampaignsListPage({ searchParams }) {
  await ensureModuleEnabled('campaigns')
  const siteConfig = await getSiteConfig()
  const breadcrumbLd = buildJsonLd({
    type: 'BreadcrumbList',
    siteConfig,
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Campaigns' }],
  })
  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <ListPageLayout module="campaigns" title="Campaigns" eyebrow="Ongoing" CardComponent={CampaignCard} searchParams={searchParams} />
    </>
  )
}
