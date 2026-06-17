'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getModuleConfig } from '@/components/admin/content-configs'

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'title-asc', label: 'Title A–Z' },
  { value: 'title-desc', label: 'Title Z–A' },
  { value: 'most-viewed', label: 'Most viewed' },
]

function sortItems(items, key) {
  const arr = [...items]
  switch (key) {
    case 'oldest':
      return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    case 'title-asc':
      return arr.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    case 'title-desc':
      return arr.sort((a, b) => (b.title || '').localeCompare(a.title || ''))
    case 'most-viewed':
      return arr.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    case 'newest':
    default:
      return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
}

function categoryName(item) {
  const c = item.categoryId
  if (c && typeof c === 'object') return c.name
  return null
}

/**
 * Generic admin content table — shared by News, Blogs, Video, Gallery.
 * Client-side search + sort + bulk delete over a server-provided dataset.
 */
export default function ContentTable({ module, items: initial }) {
  const config = getModuleConfig(module)
  const router = useRouter()

  const [items, setItems] = useState(initial)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('newest')
  const [selected, setSelected] = useState([])
  const [busy, setBusy] = useState(false)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q ? items.filter((i) => (i.title || '').toLowerCase().includes(q)) : items
    return sortItems(filtered, sort)
  }, [items, query, sort])

  const allChecked = visible.length > 0 && visible.every((i) => selected.includes(i._id))

  function toggleAll() {
    setSelected(allChecked ? [] : visible.map((i) => i._id))
  }

  function toggleOne(id) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  async function deleteIds(ids) {
    setBusy(true)
    try {
      const results = await Promise.allSettled(
        ids.map((id) => fetch(`${config.apiBase}/${id}`, { method: 'DELETE' }))
      )
      const ok = new Set()
      results.forEach((r, idx) => {
        if (r.status === 'fulfilled' && r.value.ok) ok.add(ids[idx])
      })
      setItems((prev) => prev.filter((i) => !ok.has(i._id)))
      setSelected((prev) => prev.filter((id) => !ok.has(id)))
      if (ok.size < ids.length) alert('Some items could not be deleted (check permissions).')
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  function handleDelete(id, title) {
    if (!confirm(`Soft-delete "${title}"? It can be restored from trash.`)) return
    deleteIds([id])
  }

  function handleBulkDelete() {
    if (!selected.length) return
    if (!confirm(`Soft-delete ${selected.length} item(s)?`)) return
    deleteIds(selected)
  }

  if (items.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl p-10 text-center">
        <p className="text-gray-400 mb-3">No {config.label.toLowerCase()} yet.</p>
        <Link href={`${config.basePath}/new`} className="text-emerald-400 hover:underline text-sm">
          Create the first one →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title…"
          className="flex-1 min-w-[180px] px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-sm"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        {selected.length > 0 && (
          <button
            onClick={handleBulkDelete}
            disabled={busy}
            className="px-4 py-2 bg-red-950 hover:bg-red-900 disabled:opacity-50 text-red-300 text-sm rounded-lg"
          >
            Delete {selected.length}
          </button>
        )}
      </div>

      <div className="bg-gray-900 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-left">
                <th className="px-4 py-3 w-8">
                  <input type="checkbox" checked={allChecked} onChange={toggleAll} className="w-4 h-4 accent-emerald-600" />
                </th>
                <th className="px-4 py-3 text-gray-400 font-medium">Title</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Category</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Status</th>
                <th className="px-4 py-3 text-gray-400 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr key={item._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(item._id)}
                      onChange={() => toggleOne(item._id)}
                      className="w-4 h-4 accent-emerald-600"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-white font-medium">{item.title}</p>
                    <p className="text-gray-500 text-xs">{item.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{categoryName(item) || <span className="text-gray-600">—</span>}</td>
                  <td className="px-4 py-3">
                    {item.visibility?.isPublished ? (
                      <span className="text-emerald-400 text-xs">● Published</span>
                    ) : (
                      <span className="text-gray-500 text-xs">○ Draft</span>
                    )}
                    {item.visibility?.isFeatured && <span className="ml-2 text-yellow-400 text-xs">★</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`${config.basePath}/${item._id}`}
                        className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id, item.title)}
                        disabled={busy}
                        className="px-3 py-1 text-xs bg-red-950 hover:bg-red-900 disabled:opacity-50 text-red-300 rounded transition-colors"
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
    </div>
  )
}
