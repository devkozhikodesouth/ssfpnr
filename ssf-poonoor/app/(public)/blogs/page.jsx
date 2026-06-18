import { ensureModuleEnabled } from '@/lib/module-guard'
import ListPageLayout from '@/components/public/ListPageLayout'
import BlogCard from '@/components/public/cards/BlogCard'
import JsonLd from '@/components/public/seo/JsonLd'
import { getSiteConfig } from '@/lib/public-content'
import { buildMetadata, buildJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const siteConfig = await getSiteConfig()
  return buildMetadata({
    siteConfig,
    title: 'Blogs',
    description: 'Ideas, reflections and writing from SSF Poonoor Division.',
    path: '/blogs',
    type: 'website',
  })
}

export default async function BlogsListPage({ searchParams }) {
  await ensureModuleEnabled('blogs')
  const siteConfig = await getSiteConfig()
  const breadcrumbLd = buildJsonLd({
    type: 'BreadcrumbList',
    siteConfig,
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Blogs' }],
  })
  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <ListPageLayout module="blogs" title="Blogs" eyebrow="Ideas & Writing" CardComponent={BlogCard} searchParams={searchParams} />
    </>
  )
}
