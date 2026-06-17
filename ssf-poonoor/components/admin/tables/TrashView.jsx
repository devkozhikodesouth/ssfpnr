'use client'

import { useEffect, useMemo, useState } from 'react'

// Module tabs in the trash view. Keys match the trash API's module params.
const TABS = [
  { key: 'all', label: 'All' },
  { key: 'news', label: 'News' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'video', label: 'Video' },
  { key: 'blogs', label: 'Blogs' },
  { key: 'campaigns', label: 'Campaigns' },
  { key: 'events', label: 'Events' },
  { key: 'downloads', label: 'Downloads' },
]

const MODULE_LABEL = Object.fromEntries(TABS.filter((t) => t.key !== 'all').map((t) => [t.key, t.label]))

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString()
}

/**
 * Cross-module trash browser: tabbed soft-deleted items with restore + purge
 * (single and bulk). Specialised for the trash item shape
 * ({ module, id, title, deletedAt, deletedBy }), which differs from the
 * content-table row shape — hence a dedicated view rather than ContentTable.
 */
export default function TrashView() {
  const [items, setItems] = useState([])
  const [tab, setTab] = useState('all')
  const [selected, setSelected] = useState([]) // array of "module:id" keys
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/trash')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load trash')
      setItems(json.data || [])
      setSelected([])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const visible = useMemo(
    () => (tab === 'all' ? items : items.filter((i) => i.module === tab)),
    [items, tab]
  )

  const counts = useMemo(() => {
    const c = {}
    for (const i of items) c[i.module] = (c[i.module] || 0) + 1
    return c
  }, [items])

  const keyOf = (i) => `${i.module}:${i.id}`
  const allChecked = visible.length > 0 && visible.every((i) => selected.includes(keyOf(i)))

  function toggleAll() {
    setSelected(allChecked ? [] : visible.map(keyOf))
  }
  function toggleOne(i) {
    const k = keyOf(i)
    setSelected((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]))
  }

  async function act(targets, kind) {
    setBusy(true)
    try {
      const results = await Promise.allSettled(
        targets.map((i) =>
          fetch(`/api/trash/${i.module}/${i.id}/${kind === 'restore' ? 'restore' : 'purge'}`, {
            method: kind === 'restore' ? 'POST' : 'DELETE',
          })
        )
      )
      const done = new Set()
      results.forEach((r, idx) => {
        if (r.status === 'fulfilled' && r.value.ok) done.add(keyOf(targets[idx]))
      })
      setItems((prev) => prev.filter((i) => !done.has(keyOf(i))))
      setSelected((prev) => prev.filter((k) => !done.has(k)))
      if (done.size < targets.length) alert('Some items could not be processed (check permissions).')
    } finally {
      setBusy(false)
    }
  }

  function restore(i) {
    act([i], 'restore')
  }
  function purge(i) {
    if (!confirm(`Permanently delete "${i.title}"? This cannot be undone and removes its files.`)) return
    act([i], 'purge')
  }

  function selectedItems() {
    return visible.filter((i) => selected.includes(keyOf(i)))
  }
  function bulkRestore() {
    const t = selectedItems()
    if (t.length) act(t, 'restore')
  }
  function bulkPurge() {
    const t = selectedItems()
    if (!t.length) return
    if (!confirm(`Permanently delete ${t.length} item(s)? This cannot be undone.`)) return
    act(t, 'purge')
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Trash</h1>
            <p className="text-gray-400 text-sm mt-0.5">{items.length} deleted item(s)</p>
          </div>
          <button
            onClick={load}
            disabled={loading || busy}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-sm rounded-lg"
          >
            Refresh
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key)
                setSelected([])
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                tab === t.key ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {t.label}
              {t.key !== 'all' && counts[t.key] ? <span className="ml-1.5 text-xs opacity-80">{counts[t.key]}</span> : null}
            </button>
          ))}
        </div>

        {selected.length > 0 && (
          <div className="flex items-center gap-3 mb-3">
            <span className="text-gray-400 text-sm">{selected.length} selected</span>
            <button
              onClick={bulkRestore}
              disabled={busy}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm rounded-lg"
            >
              Restore
            </button>
            <button
              onClick={bulkPurge}
              disabled={busy}
              className="px-4 py-2 bg-red-950 hover:bg-red-900 disabled:opacity-50 text-red-300 text-sm rounded-lg"
            >
              Delete forever
            </button>
          </div>
        )}

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        {loading ? (
          <p className="text-gray-400 text-sm">Loading…</p>
        ) : visible.length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-10 text-center text-gray-400">Trash is empty.</div>
        ) : (
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700 text-left">
                    <th className="px-4 py-3 w-8">
                      <input type="checkbox" checked={allChecked} onChange={toggleAll} className="w-4 h-4 accent-emerald-600" />
                    </th>
                    <th className="px-4 py-3 text-gray-400 font-medium">Title</th>
                    <th className="px-4 py-3 text-gray-400 font-medium">Module</th>
                    <th className="px-4 py-3 text-gray-400 font-medium">Deleted</th>
                    <th className="px-4 py-3 text-gray-400 font-medium">By</th>
                    <th className="px-4 py-3 text-gray-400 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((i) => (
                    <tr key={keyOf(i)} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.includes(keyOf(i))}
                          onChange={() => toggleOne(i)}
                          className="w-4 h-4 accent-emerald-600"
                        />
                      </td>
                      <td className="px-4 py-3 text-white font-medium">{i.title}</td>
                      <td className="px-4 py-3 text-gray-300">{MODULE_LABEL[i.module] || i.module}</td>
                      <td className="px-4 py-3 text-gray-400">{formatDate(i.deletedAt)}</td>
                      <td className="px-4 py-3 text-gray-400">{i.deletedBy?.name || i.deletedBy?.username || '—'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => restore(i)}
                            disabled={busy}
                            className="px-3 py-1 text-xs bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded"
                          >
                            Restore
                          </button>
                          <button
                            onClick={() => purge(i)}
                            disabled={busy}
                            className="px-3 py-1 text-xs bg-red-950 hover:bg-red-900 disabled:opacity-50 text-red-300 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
