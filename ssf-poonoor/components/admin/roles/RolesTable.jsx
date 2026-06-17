'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

/** Roles list with edit links; system roles are protected from deletion. */
export default function RolesTable({ roles: initial }) {
  const router = useRouter()
  const [roles, setRoles] = useState(initial)
  const [busy, setBusy] = useState(false)

  async function handleDelete(role) {
    if (!confirm(`Delete role "${role.name}"? This cannot be undone.`)) return
    setBusy(true)
    try {
      const res = await fetch(`/api/roles/${role._id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) {
        alert(json.error || 'Could not delete role')
        return
      }
      setRoles((prev) => prev.filter((r) => r._id !== role._id))
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-left">
              <th className="px-4 py-3 text-gray-400 font-medium">Role</th>
              <th className="px-4 py-3 text-gray-400 font-medium">Description</th>
              <th className="px-4 py-3 text-gray-400 font-medium">Permissions</th>
              <th className="px-4 py-3 text-gray-400 font-medium">Type</th>
              <th className="px-4 py-3 text-gray-400 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color || '#6b7280' }} />
                    <span className="text-white font-medium">{r.name}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{r.description || '—'}</td>
                <td className="px-4 py-3 text-gray-300">{(r.permissions || []).length}</td>
                <td className="px-4 py-3">
                  {r.isSystem ? (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-gray-800 text-gray-400">System</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-950 text-emerald-300">Custom</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/app/roles/${r._id}`}
                      className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                    >
                      {r.isSystem ? 'View' : 'Edit'}
                    </Link>
                    <button
                      onClick={() => handleDelete(r)}
                      disabled={busy || r.isSystem}
                      title={r.isSystem ? 'System roles cannot be deleted' : 'Delete role'}
                      className="px-3 py-1 text-xs bg-red-950 hover:bg-red-900 disabled:opacity-40 disabled:cursor-not-allowed text-red-300 rounded transition-colors"
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
  )
}
