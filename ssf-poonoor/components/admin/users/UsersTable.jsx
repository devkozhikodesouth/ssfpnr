'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

/** Read-only details modal opened by clicking a user row. */
function UserDetailsModal({ user, onClose }) {
  if (!user) return null
  const rows = [
    ['Name', user.name],
    ['Username', user.username],
    ['Email', user.email || '—'],
    ['Phone', user.phone || '—'],
    ['Role', user.roleId?.name || '—'],
    ['Status', user.isActive ? 'Active' : 'Inactive'],
    ['Last login', formatDate(user.lastLogin)],
    ['Created', formatDate(user.createdAt)],
  ]
  const overrides = Array.isArray(user.permissions) ? user.permissions : []

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-base font-semibold text-white">User details</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 text-gray-400 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="px-5 py-4 space-y-2.5">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="text-gray-100 text-right font-medium">{value}</span>
            </div>
          ))}
          <div className="pt-2">
            <span className="text-gray-500 text-sm">Permission overrides</span>
            {overrides.length ? (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {overrides.map((p) => (
                  <span key={p} className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-[11px] font-mono">
                    {p}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-xs mt-1">None — inherits role permissions only.</p>
            )}
          </div>
        </div>
        <div className="px-5 py-3 border-t border-gray-800 flex justify-end">
          <Link
            href={`/app/users/${user._id}`}
            className="px-4 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            Edit user
          </Link>
        </div>
      </div>
    </div>
  )
}

/** Admin users table with edit links and soft-delete. */
export default function UsersTable({ users: initial }) {
  const router = useRouter()
  const [users, setUsers] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [selected, setSelected] = useState(null)

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
              <tr
                key={u._id}
                onClick={() => setSelected(u)}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
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
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(u._id, u.name)
                      }}
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
      <UserDetailsModal user={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
