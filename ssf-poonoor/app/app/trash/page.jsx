import { requirePageAccess } from '@/lib/admin-guard'
import TrashView from '@/components/admin/tables/TrashView'

export const dynamic = 'force-dynamic'

export default async function TrashPage() {
  await requirePageAccess('trash.view')
  return <TrashView />
}
