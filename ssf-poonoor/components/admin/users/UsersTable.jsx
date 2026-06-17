'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

/** Admin users table with edit links and soft-delete. */
export default function UsersTable({ users: initial }) {
  const router = useRouter()
  const [users, setUsers] = useState(initial)
  const [busy, setBusy] = useState(false)

  async function handleDelete(id, name) {
    if (!confirm(`Delete user "${name}"? They will lose access immediately.`)) return
    setBusy(true)
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) {
        alert(json.error || 'Could not delete user')
        return
      }
      setUsers((prev) => prev.filter((u) => u._id !== id))
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  if (!users.length) {
    return (
      <div className="bg-gray-900 rounded-xl p-10 text-center">
        <p className="text-gray-400 mb-3">No users yet.</p>
        <Link href="/app/users/new" className="text-emerald-400 hover:underline text-sm">
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
              <th className="px-4 py-3 text-gray-400 font-medium">Username</th>
              <th className="px-4 py-3 text-gray-400 font-medium">Role</th>
              <th className="px-4 py-3 text-gray-400 font-medium">Status</th>
              <th className="px-4 py-3 text-gray-400 font-medium">Last login</th>
              <th className="px-4 py-3 text-gray-400 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-white font-medium">{u.name}</p>
                  {u.email && <p className="text-gray-500 text-xs">{u.email}</p>}
                </td>
                <td className="px-4 py-3 text-gray-300">{u.username}</td>
                <td className="px-4 py-3">
                  {u.roleId ? (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: (u.roleId.color || '#374151') + '33', color: u.roleId.color || '#d1d5db' }}
                    >
                      {u.roleId.name}
                    </span>
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {u.isActive ? (
                    <span className="text-emerald-400 text-xs">● Active</span>
                  ) : (
                    <span className="text-gray-500 text-xs">○ Inactive</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(u.lastLogin)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/app/users/${u._id}`}
                      className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(u._id, u.name)}
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
  )
}
