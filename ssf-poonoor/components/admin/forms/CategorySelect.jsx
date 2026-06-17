'use client'

import { useEffect, useState } from 'react'
import { inputClass, labelClass, chipBase } from './field-styles'

/**
 * Async category picker, filtered by the `appliesTo` module.
 * - Single mode (default): value is a category id string.
 * - Multi mode: value is an array of category id strings.
 */
export default function CategorySelect({
  label = 'Category',
  value,
  onChange,
  appliesTo,
  multiple = false,
  required = false,
}) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams({ limit: '200' })
    if (appliesTo) params.set('appliesTo', appliesTo)
    fetch(`/api/categories?${params.toString()}`)
      .then((r) => r.json())
      .then(({ data }) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false))
  }, [appliesTo])

  if (multiple) {
    const selected = Array.isArray(value) ? value : []
    const toggle = (id) =>
      onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id])

    return (
      <div>
        <label className={labelClass}>{label}</label>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading…</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c._id}
                type="button"
                onClick={() => toggle(c._id)}
                className={`${chipBase} ${
                  selected.includes(c._id)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {c.name}
              </button>
            ))}
            {categories.length === 0 && <p className="text-gray-500 text-sm">No categories</p>}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <label className={labelClass}>
        {label} {required && '*'}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={inputClass}
        disabled={loading}
      >
        <option value="">{loading ? 'Loading…' : '— Select —'}</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  )
}
