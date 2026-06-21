import connectDB from '@/lib/db'
import { requirePageAccess } from '@/lib/admin-guard'
import '@/models/Category'
import News from '@/models/News'
import ContentListView from '@/components/admin/tables/ContentListView'

export const dynamic = 'force-dynamic'

export default async function NewsListPage() {
  await requirePageAccess('news.read')
  await connectDB()
  const raw = await News.find().sort({ createdAt: -1 }).populate('categoryId', 'name').lean()
  const items = JSON.parse(JSON.stringify(raw))
  return <ContentListView module="news" items={items} />
}
