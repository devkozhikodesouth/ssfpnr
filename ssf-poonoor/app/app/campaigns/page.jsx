import connectDB from '@/lib/db'
import '@/models/Category'
import Campaign from '@/models/Campaign'
import ContentListView from '@/components/admin/tables/ContentListView'

export const dynamic = 'force-dynamic'

export default async function CampaignsListPage() {
  await connectDB()
  const raw = await Campaign.find().sort({ createdAt: -1 }).populate('categoryId', 'name').lean()
  const items = JSON.parse(JSON.stringify(raw))
  return <ContentListView module="campaigns" items={items} />
}
