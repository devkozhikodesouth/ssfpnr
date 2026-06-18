import Image from 'next/image'
import Breadcrumbs from '@/components/public/Breadcrumbs'
import ShareButtons from '@/components/public/ShareButtons'
import RelatedItems from '@/components/public/RelatedItems'
import ViewTracker from '@/components/public/ViewTracker'
import CustomCssScope from '@/components/public/CustomCssScope'
import CategoryBadge from '@/components/public/cards/CategoryBadge'
import { formatDate } from '@/lib/format'

/**
 * Shared detail layout for the two prose modules (News, Blogs) — same anatomy:
 * breadcrumb → hero → title/meta → custom-CSS-scoped rich content → tags →
 * author bio → share → related. Keeping it shared means no duplicate detail
 * markup between /news/[slug] and /blogs/[slug].
 *
 * Satisfies the "every detail page MUST" checklist: increments viewCount
 * (ViewTracker), scopes customCss (CustomCssScope), shows related + breadcrumbs
 * + share.
 *
 * @param {{ module:'news'|'blogs', item:object, basePath:string, label:string,
 *   related:object[], showReadTime?:boolean }} props
 */
export default function ArticleDetail({ module, item, basePath, label, related = [], showReadTime = true }) {
  const category = item.categoryId
  const author = item.author || {}

  return (
    <article className="max-w-3xl mx-auto px-4 py-6">
      <ViewTracker module={module} id={item._id} />

      <div className="mb-4">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label, href: basePath },
            { label: item.title },
          ]}
        />
      </div>

      {/* Hero */}
      <div className="relative h-52 md:h-80 rounded-soft overflow-hidden bg-darkbg mb-5">
        {item.image ? <Image src={item.image} alt={item.title} fill priority sizes="(max-width:768px) 100vw, 768px" className="object-cover" /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {category ? (
          <span className="absolute top-3.5 left-3.5">
            <CategoryBadge category={category} />
          </span>
        ) : null}
      </div>

      {/* Title + meta */}
      <header className="space-y-3 border-b border-gray-100 pb-5 mb-5">
        <h1 className="text-2xl md:text-3xl font-extrabold font-serif text-ink leading-tight">{item.title}</h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-400 font-medium">
          <span>{formatDate(item.publishedAt || item.createdAt)}</span>
          {author.name ? (
            <>
              <span className="text-gray-300">·</span>
              <span className="text-ink font-semibold">{author.name}</span>
            </>
          ) : null}
          {showReadTime && item.readTime ? (
            <>
              <span className="text-gray-300">·</span>
              <span>{item.readTime} min read</span>
            </>
          ) : null}
        </div>
      </header>

      {/* Custom-CSS-scoped rich content */}
      <CustomCssScope id={item._id} css={item.customCss} className="article-content">
        {item.content ? (
          <div dangerouslySetInnerHTML={{ __html: item.content }} />
        ) : item.excerpt ? (
          <p>{item.excerpt}</p>
        ) : null}
      </CustomCssScope>

      {/* Tags (blogs) */}
      {item.tags?.length ? (
        <div className="mt-6 flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <span key={t} className="bg-gray-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded">
              #{t}
            </span>
          ))}
        </div>
      ) : null}

      {/* Author bio (blogs) */}
      {author.bio ? (
        <div className="mt-6 bg-lightbg border border-gray-200 rounded-soft p-4 flex gap-3 items-start">
          {author.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={author.image} alt={author.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
          ) : null}
          <div>
            <p className="text-sm font-bold text-ink">{author.name}</p>
            {author.role ? <p className="text-[11px] text-accent font-semibold">{author.role}</p> : null}
            <p className="text-xs text-muted mt-1 leading-relaxed">{author.bio}</p>
          </div>
        </div>
      ) : null}

      {/* Share */}
      <div className="mt-6 py-4 border-y border-gray-100 flex items-center justify-between gap-3 flex-wrap">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Share this {label.toLowerCase()}</span>
        <ShareButtons title={item.title} />
      </div>

      {/* Related */}
      {related.length ? (
        <div className="mt-8">
          <RelatedItems items={related} basePath={basePath} title={`Related ${label}`} />
        </div>
      ) : null}
    </article>
  )
}
