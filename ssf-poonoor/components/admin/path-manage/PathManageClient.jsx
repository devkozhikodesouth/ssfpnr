'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SortableList from '@/components/admin/SortableList'
import { inputClass, labelClass } from '@/components/admin/forms/field-styles'

const LOCATIONS = [
  { key: 'top-nav', label: 'Top Navigation' },
  { key: 'bottom-nav', label: 'Mobile Bottom Nav' },
  { key: 'footer', label: 'Footer Links' },
]

const EMPTY_FORM = {
  label: '',
  labelMl: '',
  path: '',
  icon: '',
  location: 'top-nav',
  isExternal: false,
  isVisible: true,
}

/**
 * Path Manage screen — three location sections (top nav / bottom nav / footer),
 * each drag-to-reorder via SortableList, with an add/edit form. Create/update/
 * delete hit /api/nav-paths; reorder hits /api/nav-paths/reorder with the new id
 * order for that location.
 */
export default function PathManageClient({ paths: initial }) {
  const router = useRouter()
  const [paths, setPaths] = useState(initial)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const setField = (key, v) => setForm((f) => ({ ...f, [key]: v }))

  function resetForm() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setError('')
  }

  function startEdit(item) {
    setEditingId(item._id)
    setForm({
      label: item.label || '',
      labelMl: item.labelMl || '',
      path: item.path || '',
      icon: item.icon || '',
      location: item.location || 'top-nav',
      isExternal: !!item.isExternal,
      isVisible: item.isVisible !== false,
    })
    setError('')
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.label.trim()) return setError('Label is required')
    if (!form.path.trim()) return setError('Path is required')

    setBusy(true)
    try {
      const url = editingId ? `/api/nav-paths/${editingId}` : '/api/nav-paths'
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Save failed')
        return
      }
      setPaths((prev) => {
        const idx = prev.findIndex((p) => p._id === json.data._id)
        if (idx === -1) return [...prev, json.data]
        const next = [...prev]
        next[idx] = json.data
        return next
      })
      resetForm()
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(item) {
    if (!confirm(`Delete nav item "${item.label}"?`)) return
    setBusy(true)
    try {
      const res = await fetch(`/api/nav-paths/${item._id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) {
        alert(json.error || 'Delete failed')
        return
      }
      setPaths((prev) => prev.filter((p) => p._id !== item._id))
      if (editingId === item._id) resetForm()
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  async function handleReorder(location, newIds) {
    // Optimistic: reorder within this location, keep other locations untouched.
    const inLoc = newIds
      .map((id) => paths.find((p) => p._id === id))
      .filter(Boolean)
      .map((p, i) => ({ ...p, order: i }))
    setPaths((prev) => [...prev.filter((p) => p.location !== location), ...inLoc])

    try {
      const res = await fetch('/api/nav-paths/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newIds }),
      })
      if (!res.ok) {
        const json = await res.json()
        alert(json.error || 'Reorder failed')
        router.refresh()
      }
    } catch {
      router.refresh()
    }
  }

  function itemsFor(location) {
    return paths
      .filter((p) => p.location === location)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }

  return (
    <div className="space-y-8">
      {/* Add / edit form */}
      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-5 space-y-4">
        <h2 className="text-white font-semibold">{editingId ? 'Edit nav item' : 'Add nav item'}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Label (English) *</label>
            <input value={form.label} onChange={(e) => setField('label', e.target.value)} className={inputClass} placeholder="News" />
          </div>
          <div>
            <label className={labelClass}>Label (Malayalam)</label>
            <input value={form.labelMl} lang="ml" onChange={(e) => setField('labelMl', e.target.value)} className={inputClass} placeholder="വാർത്തകൾ" />
          </div>
          <div>
            <label className={labelClass}>Path *</label>
            <input value={form.path} onChange={(e) => setField('path', e.target.value)} className={inputClass} placeholder="/news or https://…" />
          </div>
          <div>
            <label className={labelClass}>Icon (optional)</label>
            <input value={form.icon} onChange={(e) => setField('icon', e.target.value)} className={inputClass} placeholder="newspaper" />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <select value={form.location} onChange={(e) => setField('location', e.target.value)} className={inputClass}>
              {LOCATIONS.map((l) => (
                <option key={l.key} value={l.key}>{l.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-6 pb-1">
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" checked={form.isExternal} onChange={(e) => setField('isExternal', e.target.checked)} className="accent-emerald-600" />
              External link
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" checked={form.isVisible} onChange={(e) => setField('isVisible', e.target.checked)} className="accent-emerald-600" />
              Visible
            </label>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-2">
          <button type="submit" disabled={busy} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors">
            {busy ? 'Saving…' : editingId ? 'Update item' : 'Add item'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Location sections */}
      {LOCATIONS.map((loc) => {
        const items = itemsFor(loc.key)
        return (
          <section key={loc.key}>
            <h2 className="text-white font-semibold mb-3">
              {loc.label} <span className="text-gray-500 text-sm font-normal">({items.length})</span>
            </h2>
            {items.length === 0 ? (
              <div className="bg-gray-900 rounded-xl p-6 text-center text-gray-500 text-sm">No items here yet.</div>
            ) : (
              <SortableList
                ids={items.map((i) => i._id)}
                onReorder={(newIds) => handleReorder(loc.key, newIds)}
                renderRow={(id) => {
                  const item = items.find((i) => i._id === id)
                  if (!item) return null
                  return (
                    <div className="bg-gray-900 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium truncate">{item.label}</p>
                          {item.isExternal && <span className="text-xs text-sky-400">↗ external</span>}
                          {item.isVisible === false && <span className="text-xs text-gray-500">hidden</span>}
                        </div>
                        <p className="text-gray-500 text-xs truncate">{item.path}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => startEdit(item)} className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(item)} disabled={busy} className="px-3 py-1 text-xs bg-red-950 hover:bg-red-900 disabled:opacity-50 text-red-300 rounded transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                }}
              />
            )}
          </section>
        )
      })}
    </div>
  )
}
