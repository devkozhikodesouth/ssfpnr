import { ensureModuleEnabled } from '@/lib/module-guard'
import ListPageLayout from '@/components/public/ListPageLayout'
import CampaignCard from '@/components/public/cards/CampaignCard'

export const dynamic = 'force-dynamic'

export default async function CampaignsListPage({ searchParams }) {
  await ensureModuleEnabled('campaigns')
  return (
    <ListPageLayout module="campaigns" title="Campaigns" eyebrow="Ongoing" CardComponent={CampaignCard} searchParams={searchParams} />
  )
}
