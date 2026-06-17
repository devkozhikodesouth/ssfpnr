import { notFound } from 'next/navigation'
import mongoose from 'mongoose'
import connectDB from '@/lib/db'
import Category from '@/models/Category'

async function queryModule(modelName, categoryId) {
  const Model = mongoose.models[modelName]
  if (!Model) return []
  try {
    return await Model.find({ categoryId, 'visibility.isPublished': true })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean()
  } catch {
    return []
  }
}

export default async function CategoryPublicPage({ params }) {
  await connectDB()

  const category = await Category.findOne({
    slug: params.slug,
    'visibility.isPublished': true,
  }).lean()

  if (!category) notFound()

  const [news, videos, gallery, blogs, events] = await Promise.all([
    queryModule('News', category._id),
    queryModule('Video', category._id),
    queryModule('Gallery', category._id),
    queryModule('Blog', category._id),
    queryModule('Event', category._id),
  ])

  const tabs = [
    { key: 'news', label: 'News', items: news },
    { key: 'videos', label: 'Videos', items: videos },
    { key: 'gallery', label: 'Gallery', items: gallery },
    { key: 'blogs', label: 'Blogs', items: blogs },
    { key: 'events', label: 'Events', items: events },
  ].filter(t => t.items.length > 0)

  return (
    <main className="min-h-screen bg-white">
      {/* Banner */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        {category.coverImage && (
          <div className="absolute inset-0">
            <img
              src={category.coverImage}
              alt={category.name}
              className="w-full h-full object-cover opacity-25"
            />
          </div>
        )}
        {category.color && (
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ background: category.color }}
          />
        )}
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          {category.icon && (
            <img
              src={category.icon}
              alt=""
              className="w-16 h-16 mx-auto mb-4 rounded-full object-cover"
            />
          )}
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </section>

      {/* Content Tabs — only rendered when content exists (Phase 3/4 will populate) */}
      {tabs.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-8">
          <nav className="flex gap-1 border-b border-gray-200 mb-8 overflow-x-auto">
            {tabs.map(tab => (
              <a
                key={tab.key}
                href={`#${tab.key}`}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap border-b-2 border-transparent hover:border-gray-400 transition-colors"
              >
                {tab.label}
                <span className="ml-1.5 text-xs text-gray-400">({tab.items.length})</span>
              </a>
            ))}
          </nav>

          {tabs.map(tab => (
            <div key={tab.key} id={tab.key} className="mb-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{tab.label}</h2>
              <p className="text-gray-500 text-sm">{tab.items.length} item(s)</p>
            </div>
          ))}
        </section>
      )}
    </main>
  )
}
