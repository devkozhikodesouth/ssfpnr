import { ensureModuleEnabled } from '@/lib/module-guard'
import ListPageLayout from '@/components/public/ListPageLayout'
import DownloadItem from '@/components/public/cards/DownloadItem'

export const dynamic = 'force-dynamic'

// Mockup groups downloads by collapsible category; we render the shared list
// layout with a category filter instead, to reuse ListPageLayout across all 7.
export default async function DownloadsListPage({ searchParams }) {
  await ensureModuleEnabled('downloads')
  return (
    <ListPageLayout
      module="downloads"
      title="Downloads"
      eyebrow="Resources"
      CardComponent={DownloadItem}
      searchParams={searchParams}
      variant="list"
      gridClassName="space-y-3 max-w-3xl"
    />
  )
}
