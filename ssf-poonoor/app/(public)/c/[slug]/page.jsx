import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/public/Breadcrumbs'
import CategoryTabs from '@/components/public/category/CategoryTabs'
import { aggregateForCategory } from '@/lib/category-aggregator'

export const dynamic = 'force-dynamic'

/**
 * Standalone category page (PLAN §5.5, §15.10). Banner + tabs aggregating all
 * published content linked to the category across modules. Only tabs that have
 * content are shown. Replaces the Phase 2 skeleton.
 */
export default async function CategoryPublicPage({ params }) {
  const result = await aggregateForCategory(params.slug, { requirePublished: true })
  if (!result) notFound()

  const { category, news, videos, gallery, blogs, events, campaigns } = JSON.parse(JSON.stringify(result))

  const groups = [
    { key: 'news', label: 'News', type: 'news', items: news },
    { key: 'videos', label: 'Videos', type: 'videos', items: videos },
    { key: 'gallery', label: 'Gallery', type: 'gallery', items: gallery },
    { key: 'blogs', label: 'Blogs', type: 'blogs', items: blogs },
    { key: 'events', label: 'Events', type: 'events', items: events },
    { key: 'campaigns', label: 'Campaigns', type: 'campaigns', items: campaigns },
  ].filter((g) => g.items?.length)

  return (
    <main>
      {/* Banner */}
      <section className="relative bg-darkbg text-white overflow-hidden">
        {category.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={category.coverImage} alt={category.name} className="absolute inset-0 w-full h-full object-cover opacity-25" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-darkbg via-darkbg/70 to-darkbg/40" />
        {category.color ? (
          <div className="absolute bottom-0 inset-x-0 h-1" style={{ background: category.color }} />
        ) : null}
        <div className="relative max-w-5xl mx-auto px-6 py-16 text-center space-y-4">
          <div className="flex justify-center">
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: category.name }]} />
          </div>
          {category.icon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={category.icon} alt="" className="w-16 h-16 mx-auto rounded-full object-cover" />
          ) : null}
          <h1 className="text-3xl md:text-5xl font-bold font-serif">{category.name}</h1>
          {category.description ? (
            <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">{category.description}</p>
          ) : null}
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {groups.length ? (
          <CategoryTabs groups={groups} />
        ) : (
          <p className="text-center text-gray-400 py-16 text-sm">No published content in this category yet.</p>
        )}
      </section>
    </main>
  )
}
