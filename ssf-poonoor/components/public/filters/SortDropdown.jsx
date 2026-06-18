'use client'

import { useFilters } from './useFilters'

/**
 * Sort dropdown shared by all list pages (PLAN §12.1). Writes ?sort= to the URL.
 *
 * @param {{ options: {value,label}[] }} props
 */
export default function SortDropdown({ options = [] }) {
  const { get, setParam } = useFilters()
  const value = get('sort') || options[0]?.value || 'newest'

  return (
    <label className="flex items-center gap-2 shrink-0">
      <span className="text-xs text-gray-400 hidden sm:inline">Sort by:</span>
      <select
        value={value}
        onChange={(e) => setParam('sort', e.target.value)}
        className="bg-white border border-gray-200 text-xs font-semibold text-slate-700 rounded-soft py-2 px-3 focus:outline-none focus:border-primary shadow-sm"
        aria-label="Sort order"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
