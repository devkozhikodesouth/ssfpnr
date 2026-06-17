'use client'

import { useEffect, useState } from 'react'
import { labelClass, chipBase } from './field-styles'

// linkedItems sub-key → API list endpoint. Keys match the Campaign/Event
// linkedItems schema (PLAN §7.7–7.8); endpoints are Phase 3's content APIs.
const SOURCES = [
  { key: 'news', label: 'News', api: '/api/news' },
  { key: 'videos', label: 'Videos', api: '/api/video' },
  { key: 'gallery', label: 'Gallery', api: '/api/gallery' },
  { key: 'blogs', label: 'Blogs', api: '/api/blogs' },
]

const EMPTY = { news: [], videos: [], gallery: [], blogs: [] }

function OptionGroup({ source, selected, onToggle }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${source.api}?limit=200&status=all`)
      .then((r) => r.json())
      .then(({ data }) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [source.api])

  return (
    <div>
      <p className="text-xs font-medium text-gray-400 mb-1.5">{source.label}</p>
      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-gray-600 text-sm">None available</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => {
            const id = item._id
            const active = selected.includes(id)
            return (
              <button
                key={id}
                type="button"
                onClick={() => onToggle(id)}
                className={`${chipBase} ${active ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                {item.title}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/**
 * Picker for the four cross-module linkedItems arrays used by Campaign + Event.
 * `value` is { news, videos, gallery, blogs } of id strings; emits the same shape.
 */
export default function LinkedItemsPicker({ label = 'Linked Items', value, onChange }) {
  const current = { ...EMPTY, ...(value || {}) }

  function toggle(key, id) {
    const list = current[key] || []
    const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
    onChange({ ...current, [key]: next })
  }

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="space-y-4 bg-gray-800/40 border border-gray-700 rounded-lg p-4">
        {SOURCES.map((source) => (
          <OptionGroup
            key={source.key}
            source={source}
            selected={current[source.key] || []}
            onToggle={(id) => toggle(source.key, id)}
          />
        ))}
      </div>
    </div>
  )
}
