import { ensureModuleEnabled } from '@/lib/module-guard'
import ListPageLayout from '@/components/public/ListPageLayout'
import NewsCard from '@/components/public/cards/NewsCard'

export const dynamic = 'force-dynamic'

export default async function NewsListPage({ searchParams }) {
  await ensureModuleEnabled('news')
  return (
    <ListPageLayout module="news" title="News" eyebrow="Archives" CardComponent={NewsCard} searchParams={searchParams} />
  )
}
