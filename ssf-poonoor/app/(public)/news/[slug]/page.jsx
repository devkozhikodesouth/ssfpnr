import { notFound } from 'next/navigation'
import { ensureModuleEnabled } from '@/lib/module-guard'
import ArticleDetail from '@/components/public/ArticleDetail'
import { fetchPublicItem, fetchRelated, getModuleConfig } from '@/lib/public-content'

export const dynamic = 'force-dynamic'

export default async function NewsDetailPage({ params }) {
  await ensureModuleEnabled('news')
  const item = await fetchPublicItem('news', params.slug)
  if (!item) notFound()

  const [related, config] = await Promise.all([
    fetchRelated('news', { categoryId: item.categoryId?._id, excludeId: item._id }),
    getModuleConfig('news'),
  ])

  return (
    <ArticleDetail
      module="news"
      item={item}
      basePath="/news"
      label="News"
      related={related}
      showReadTime={config.showReadTime !== false}
    />
  )
}
