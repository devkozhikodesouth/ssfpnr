import { ensureModuleEnabled } from '@/lib/module-guard'
import ListPageLayout from '@/components/public/ListPageLayout'
import EventCard from '@/components/public/cards/EventCard'

export const dynamic = 'force-dynamic'

// Mockup groups events under swipeable status tabs; we use the shared filter
// system (status segment + shareable URL) so all 7 list pages keep ONE layout.
export default async function EventsListPage({ searchParams }) {
  await ensureModuleEnabled('events')
  return (
    <ListPageLayout
      module="events"
      title="Events"
      eyebrow="Calendar"
      CardComponent={EventCard}
      searchParams={searchParams}
      variant="list"
      gridClassName="space-y-3 max-w-3xl"
    />
  )
}
