import { ensureModuleEnabled } from '@/lib/module-guard'
import ListPageLayout from '@/components/public/ListPageLayout'
import EventCard from '@/components/public/cards/EventCard'
import JsonLd from '@/components/public/seo/JsonLd'
import { getSiteConfig } from '@/lib/public-content'
import { buildMetadata, buildJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const siteConfig = await getSiteConfig()
  return buildMetadata({
    siteConfig,
    title: 'Events',
    description: 'Upcoming, ongoing and past events from SSF Poonoor Division.',
    path: '/events',
    type: 'website',
  })
}

// Mockup groups events under swipeable status tabs; we use the shared filter
// system (status segment + shareable URL) so all 7 list pages keep ONE layout.
export default async function EventsListPage({ searchParams }) {
  await ensureModuleEnabled('events')
  const siteConfig = await getSiteConfig()
  const breadcrumbLd = buildJsonLd({
    type: 'BreadcrumbList',
    siteConfig,
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Events' }],
  })
  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <ListPageLayout
        module="events"
        title="Events"
        eyebrow="Calendar"
        CardComponent={EventCard}
        searchParams={searchParams}
        variant="list"
        gridClassName="space-y-3 max-w-3xl"
      />
    </>
  )
}
