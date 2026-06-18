import SectionHeader from '@/components/public/SectionHeader'
import SortDropdown from '@/components/public/filters/SortDropdown'
import FilterSidebar from '@/components/public/filters/FilterSidebar'
import FilterBottomSheet from '@/components/public/filters/FilterBottomSheet'
import FilterChips from '@/components/public/filters/FilterChips'
import Pagination from '@/components/public/filters/Pagination'
import Breadcrumbs from '@/components/public/Breadcrumbs'
import { FILTER_CONFIGS } from '@/components/public/filters/filter-configs'
import { getCategoriesForModule, getModuleConfig, fetchPublicList } from '@/lib/public-content'

/**
 * Shared layout for ALL 7 public list pages (PLAN §15). Each list page is a thin
 * wrapper that passes its module + card; this resolves the data, filters, sort
 * and pagination once so there is zero per-page list/filter markup duplication.
 *
 * Desktop: sticky sidebar filters + 3-col grid. Mobile: filter bottom-sheet +
 * single column. Filter/sort/page state all live in the URL (shareable links).
 *
 * @param {{
 *   module: string,
 *   title: string,
 *   eyebrow?: string,
 *   CardComponent: React.ComponentType,
 *   searchParams: object,
 *   variant?: 'grid'|'list',
 *   gridClassName?: string
 * }} props
 */
export default async function ListPageLayout({
  module,
  title,
  eyebrow = 'Archives',
  CardComponent,
  searchParams = {},
  variant = 'grid',
  gridClassName,
}) {
  const [{ items, meta }, categories, modConfig] = await Promise.all([
    fetchPublicList(module, searchParams),
    getCategoriesForModule(module),
    getModuleConfig(module),
  ])

  const base = FILTER_CONFIGS[module] || { sort: [], fields: [] }
  const catOptions = categories.map((c) => ({ value: c.slug, label: c.name, color: c.color }))
  // Clone so the shared CATEGORY_FIELD object is never mutated across modules.
  const fields = base.fields.map((f) => (f.key === 'category' ? { ...f, options: catOptions } : f))

  const containerClass =
    gridClassName ||
    (variant === 'list'
      ? 'space-y-3'
      : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5')

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div className="mb-4">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: title }]} />
      </div>

      {/* Page header: title + count + sort */}
      <div className="border-b border-gray-200 pb-4 mb-5 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={`${meta.total} item${meta.total === 1 ? '' : 's'}`} size="lg" />
        <div className="flex items-center gap-2">
          <FilterBottomSheet fields={fields} />
          <SortDropdown options={base.sort} />
        </div>
      </div>

      {/* Active filter chips */}
      <div className="mb-4">
        <FilterChips fields={fields} />
      </div>

      <div className="flex gap-6 items-start">
        <FilterSidebar fields={fields} />

        <div className="flex-grow min-w-0">
          {items.length ? (
            <div className={containerClass}>
              {items.map((item) => (
                <CardComponent key={item._id} item={item} config={modConfig} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-sm font-semibold">No items found.</p>
              <p className="text-xs mt-1">Try adjusting your filters.</p>
            </div>
          )}

          <Pagination page={meta.page} totalPages={meta.totalPages} />
        </div>
      </div>
    </div>
  )
}
