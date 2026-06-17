'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const TYPE_BADGE = {
  'event-based': 'bg-purple-900 text-purple-300',
  topical: 'bg-blue-900 text-blue-300',
  permanent: 'bg-gray-700 text-gray-300',
}

export default function CategoryTable({ categories: initial }) {
  const router = useRouter()
  const [categories, setCategories] = useState(initial)
  const [deleting, setDeleting] = useState(null)

  async function handleDelete(id, name) {
    if (!confirm(`Soft-delete "${name}"? It can be restored from trash.`)) return
    setDeleting(id)

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setCategories(prev => prev.filter(c => c._id !== id))
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || 'Delete failed')
      }
    } finally {
      setDeleting(null)
    }
  }

  if (categories.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl p-10 text-center">
        <p className="text-gray-400 mb-3">No categories yet.</p>
        <Link href="/app/categories/new" className="text-emerald-400 hover:underline text-sm">
          Create the first one →
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-left">
              <th className="px-4 py-3 text-gray-400 font-medium">Name</th>
              <th className="px-4 py-3 text-gray-400 font-medium">Type</th>
              <th className="px-4 py-3 text-gray-400 font-medium">Applies To</th>
              <th className="px-4 py-3 text-gray-400 font-medium">Status</th>
              <th className="px-4 py-3 text-gray-400 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {cat.color && (
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: cat.color }}
                      />
                    )}
                    <div>
                      <p className="text-white font-medium">{cat.name}</p>
                      <p className="text-gray-500 text-xs">{cat.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_BADGE[cat.type] ?? 'bg-gray-700 text-gray-300'}`}>
                    {cat.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(cat.appliesTo ?? []).map(m => (
                      <span key={m} className="text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded border border-gray-700">
                        {m}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5 text-xs">
                    {cat.visibility?.isPublished
                      ? <span className="text-emerald-400">● Live</span>
                      : <span className="text-gray-500">○ Draft</span>
                    }
                    {cat.isFeatured && <span className="text-yellow-400">★ Featured</span>}
                    {cat.isStandalone && <span className="text-sky-400">⟐ Standalone</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/app/categories/${cat._id}`}
                      className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(cat._id, cat.name)}
                      disabled={deleting === cat._id}
                      className="px-3 py-1 text-xs bg-red-950 hover:bg-red-900 disabled:opacity-50 text-red-300 rounded transition-colors"
                    >
                      {deleting === cat._id ? '…' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
