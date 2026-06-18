import { ensureModuleEnabled } from '@/lib/module-guard'
import ListPageLayout from '@/components/public/ListPageLayout'
import VideoCard from '@/components/public/cards/VideoCard'

export const dynamic = 'force-dynamic'

export default async function VideoListPage({ searchParams }) {
  await ensureModuleEnabled('video')
  return (
    <ListPageLayout module="video" title="Videos" eyebrow="Video Stories" CardComponent={VideoCard} searchParams={searchParams} />
  )
}
