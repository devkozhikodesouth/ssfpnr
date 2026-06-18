'use client'

import { useFilters } from './useFilters'
import { labelForValue } from './filter-configs'
import Icon from '@/components/public/Icon'

/**
 * Active-filter chips with one-tap removal (PLAN §12.4). Resolves each active
 * URL param back to a human label via the field config (incl. category names).
 *
 * @param {{ fields: object[] }} props
 */
export default function FilterChips({ fields = [] }) {
  const { searchParams, setParam, setMany } = useFilters()

  // Build a flat list of active chips from the known filter fields.
  const chips = []
  for (const field of fields) {
    if (field.type === 'daterange') {
      if (searchParams.get('from')) chips.push({ key: 'from', label: `From ${searchParams.get('from')}` })
      if (searchParams.get('to')) chips.push({ key: 'to', label: `To ${searchParams.get('to')}` })
      continue
    }
    const value = searchParams.get(field.key)
    if (!value) continue
    chips.push({ key: field.key, label: labelForValue(field, value) })
  }

  const q = searchParams.get('q')
  if (q) chips.push({ key: 'q', label: `“${q}”` })

  if (!chips.length) return null

  const clearAll = () => {
    const changes = {}
    for (const c of chips) changes[c.key] = ''
    setMany(changes)
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {chips.map((c) => (
        <button
          key={c.key}
          onClick={() => setParam(c.key, '')}
          className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 hover:bg-primary/20 transition-colors"
        >
          {c.label}
          <Icon name="close" className="w-2.5 h-2.5" strokeWidth={3} />
        </button>
      ))}
      {chips.length > 1 ? (
        <button onClick={clearAll} className="text-[10px] text-red-500 font-semibold hover:underline ml-1">
          Clear all
        </button>
      ) : null}
    </div>
  )
}
