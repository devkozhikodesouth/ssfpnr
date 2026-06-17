'use client'

import { inputClass, labelClass } from './field-styles'

function toLocalInput(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  // datetime-local wants YYYY-MM-DDTHH:mm in local time
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16)
}

/**
 * Edits the embedded `visibility` sub-document: publish + schedule + featured + pinned.
 */
export default function VisibilityFields({ value = {}, onChange }) {
  const set = (patch) => onChange({ ...value, ...patch })

  const toggles = [
    { field: 'isPublished', label: 'Published' },
    { field: 'isFeatured', label: 'Featured (homepage)' },
    { field: 'isPinned', label: 'Pinned (top of lists)' },
  ]

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-4">
      <p className="text-sm font-medium text-gray-200">Visibility</p>
      <div className="flex flex-wrap gap-6">
        {toggles.map(({ field, label }) => (
          <label key={field} className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!value[field]}
              onChange={(e) => set({ [field]: e.target.checked })}
              className="w-4 h-4 accent-emerald-600"
            />
            <span className="text-sm text-gray-300">{label}</span>
          </label>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Publish At (schedule)</label>
          <input
            type="datetime-local"
            value={toLocalInput(value.publishAt)}
            onChange={(e) => set({ publishAt: e.target.value ? new Date(e.target.value).toISOString() : null })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Unpublish At</label>
          <input
            type="datetime-local"
            value={toLocalInput(value.unpublishAt)}
            onChange={(e) => set({ unpublishAt: e.target.value ? new Date(e.target.value).toISOString() : null })}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  )
}
