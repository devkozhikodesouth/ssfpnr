import connectDB from '@/lib/db'
import '@/models/Category'
import Download from '@/models/Download'
import ContentListView from '@/components/admin/tables/ContentListView'

export const dynamic = 'force-dynamic'

export default async function DownloadsListPage() {
  await connectDB()
  const raw = await Download.find().sort({ createdAt: -1 }).populate('categoryId', 'name').lean()
  const items = JSON.parse(JSON.stringify(raw))
  return <ContentListView module="downloads" items={items} />
}
