'use client'

import { inputClass, labelClass } from './field-styles'
import Switch from './Switch'

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
        {toggles.map(({ field, label }) => (
          <Switch
            key={field}
            label={label}
            checked={!!value[field]}
            onChange={(v) => set({ [field]: v })}
          />
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
