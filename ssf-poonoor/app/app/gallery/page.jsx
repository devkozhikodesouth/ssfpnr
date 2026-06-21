import connectDB from '@/lib/db'
import { requirePageAccess } from '@/lib/admin-guard'
import '@/models/Category'
import Gallery from '@/models/Gallery'
import ContentListView from '@/components/admin/tables/ContentListView'

export const dynamic = 'force-dynamic'

export default async function GalleryListPage() {
  await requirePageAccess('gallery.read')
  await connectDB()
  const raw = await Gallery.find().sort({ createdAt: -1 }).populate('categoryId', 'name').lean()
  const items = JSON.parse(JSON.stringify(raw))
  return <ContentListView module="gallery" items={items} />
}
