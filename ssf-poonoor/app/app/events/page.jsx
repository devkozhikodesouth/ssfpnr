import connectDB from '@/lib/db'
import { requirePageAccess } from '@/lib/admin-guard'
import '@/models/Category'
import Event from '@/models/Event'
import ContentListView from '@/components/admin/tables/ContentListView'

export const dynamic = 'force-dynamic'

export default async function EventsListPage() {
  await requirePageAccess('events.read')
  await connectDB()
  const raw = await Event.find().sort({ createdAt: -1 }).populate('categoryId', 'name').lean()
  const items = JSON.parse(JSON.stringify(raw))
  return <ContentListView module="events" items={items} />
}
