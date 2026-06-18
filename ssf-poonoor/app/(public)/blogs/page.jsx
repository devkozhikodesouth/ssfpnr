import { ensureModuleEnabled } from '@/lib/module-guard'
import ListPageLayout from '@/components/public/ListPageLayout'
import BlogCard from '@/components/public/cards/BlogCard'

export const dynamic = 'force-dynamic'

export default async function BlogsListPage({ searchParams }) {
  await ensureModuleEnabled('blogs')
  return (
    <ListPageLayout module="blogs" title="Blogs" eyebrow="Ideas & Writing" CardComponent={BlogCard} searchParams={searchParams} />
  )
}
