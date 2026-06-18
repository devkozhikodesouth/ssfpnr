'use client'

import FilterControls from './FilterControls'
import { useFilters } from './useFilters'

/**
 * Desktop sidebar filters (PLAN §12.4) — always visible at >= md. Each change
 * commits straight to the URL. Hidden on mobile, where FilterBottomSheet is used
 * instead. Both share FilterControls so the field markup is never duplicated.
 *
 * @param {{ fields: object[] }} props
 */
export default function FilterSidebar({ fields = [] }) {
  const { searchParams, setParam, setMany } = useFilters()

  const values = {}
  for (const [k, v] of searchParams.entries()) values[k] = v

  const hasActive = fields.some((f) =>
    f.type === 'daterange' ? values.from || values.to : values[f.key]
  )

  const reset = () => {
    const cleared = { category: '', language: '', 'album-type': '', status: '', active: '', featured: '', from: '', to: '' }
    setMany(cleared)
  }

  return (
    <aside className="hidden md:block w-64 shrink-0 bg-white border border-gray-200 rounded-soft p-5 shadow-sm self-start sticky top-20">
      <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-4">
        <span className="text-sm font-bold font-serif text-ink">Filters</span>
        {hasActive ? (
          <button onClick={reset} className="text-[10px] text-red-500 font-bold hover:underline">
            Reset
          </button>
        ) : null}
      </div>
      <FilterControls fields={fields} values={values} onChange={setParam} />
    </aside>
  )
}
