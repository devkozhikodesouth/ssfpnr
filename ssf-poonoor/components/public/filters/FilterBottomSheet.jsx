'use client'

import { useEffect, useState } from 'react'
import FilterControls from './FilterControls'
import { useFilters } from './useFilters'
import Icon from '@/components/public/Icon'

const FILTER_KEYS = ['category', 'language', 'album-type', 'status', 'active', 'featured', 'from', 'to']

/**
 * Mobile filter trigger + slide-up bottom sheet (PLAN §12.4). Selections are
 * staged locally and committed only on "Apply" (matching the mockup), then the
 * URL updates and the list re-renders. Shown only < md; FilterSidebar covers
 * desktop. Shares FilterControls with the sidebar.
 *
 * @param {{ fields: object[] }} props
 */
export default function FilterBottomSheet({ fields = [] }) {
  const { searchParams, setMany } = useFilters()
  const [open, setOpen] = useState(false)
  const [staged, setStaged] = useState({})

  // Count active filters for the trigger badge.
  const activeCount = FILTER_KEYS.filter((k) => searchParams.get(k)).length

  useEffect(() => {
    if (!open) return
    const current = {}
    for (const k of FILTER_KEYS) {
      const v = searchParams.get(k)
      if (v) current[k] = v
    }
    setStaged(current)
  }, [open, searchParams])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const onChange = (key, value) =>
    setStaged((s) => {
      const next = { ...s }
      if (value === '' || value == null) delete next[key]
      else next[key] = value
      return next
    })

  const apply = () => {
    const changes = {}
    for (const k of FILTER_KEYS) changes[k] = staged[k] || ''
    setMany(changes)
    setOpen(false)
  }

  const clear = () => setStaged({})

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-white border border-gray-200 text-slate-700 text-xs font-semibold rounded-soft py-2 px-3 shadow-sm"
      >
        <Icon name="filter" className="w-4 h-4" />
        Filters
        {activeCount ? (
          <span className="bg-primary text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {activeCount}
          </span>
        ) : null}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/45" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-2xl p-5 shadow-2xl flex flex-col gap-4 max-h-[85%]">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto -mt-2" />
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-sm text-ink font-serif">Filters</h4>
              <button onClick={clear} className="text-xs text-red-500 font-semibold hover:underline">
                Reset All
              </button>
            </div>
            <div className="overflow-y-auto pr-1 flex-1">
              <FilterControls fields={fields} values={staged} onChange={onChange} />
            </div>
            <div className="flex gap-2.5 pt-1">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-slate-600 text-xs font-bold py-2.5 rounded-soft"
              >
                Cancel
              </button>
              <button
                onClick={apply}
                className="flex-1 bg-primary hover:bg-secondary text-white text-xs font-bold py-2.5 rounded-soft shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
