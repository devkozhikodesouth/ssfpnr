import connectDB from '@/lib/db'
import '@/models/Category'
import Video from '@/models/Video'
import ContentListView from '@/components/admin/tables/ContentListView'

export const dynamic = 'force-dynamic'

export default async function VideoListPage() {
  await connectDB()
  const raw = await Video.find().sort({ createdAt: -1 }).populate('categoryId', 'name').lean()
  const items = JSON.parse(JSON.stringify(raw))
  return <ContentListView module="video" items={items} />
}
