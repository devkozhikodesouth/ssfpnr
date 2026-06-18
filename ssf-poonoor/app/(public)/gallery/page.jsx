import { ensureModuleEnabled } from '@/lib/module-guard'
import ListPageLayout from '@/components/public/ListPageLayout'
import GalleryCard from '@/components/public/cards/GalleryCard'

export const dynamic = 'force-dynamic'

export default async function GalleryListPage({ searchParams }) {
  await ensureModuleEnabled('gallery')
  return (
    <ListPageLayout module="gallery" title="Gallery" eyebrow="Memories" CardComponent={GalleryCard} searchParams={searchParams} />
  )
}
