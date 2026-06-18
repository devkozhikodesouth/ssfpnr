import { notFound } from 'next/navigation'
import { ensureModuleEnabled } from '@/lib/module-guard'
import ArticleDetail from '@/components/public/ArticleDetail'
import { fetchPublicItem, fetchRelated, getModuleConfig } from '@/lib/public-content'

export const dynamic = 'force-dynamic'

export default async function BlogDetailPage({ params }) {
  await ensureModuleEnabled('blogs')
  const item = await fetchPublicItem('blogs', params.slug)
  if (!item) notFound()

  const [related, config] = await Promise.all([
    fetchRelated('blogs', { categoryId: item.categoryId?._id, excludeId: item._id }),
    getModuleConfig('blogs'),
  ])

  return (
    <ArticleDetail
      module="blogs"
      item={item}
      basePath="/blogs"
      label="Blogs"
      related={related}
      showReadTime={config.showReadTime !== false}
    />
  )
}
