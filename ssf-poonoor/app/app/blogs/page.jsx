import connectDB from '@/lib/db'
import { requirePageAccess } from '@/lib/admin-guard'
import '@/models/Category'
import Blog from '@/models/Blog'
import ContentListView from '@/components/admin/tables/ContentListView'

export const dynamic = 'force-dynamic'

export default async function BlogsListPage() {
  await requirePageAccess('blogs.read')
  await connectDB()
  const raw = await Blog.find().sort({ createdAt: -1 }).populate('categoryId', 'name').lean()
  const items = JSON.parse(JSON.stringify(raw))
  return <ContentListView module="blogs" items={items} />
}
