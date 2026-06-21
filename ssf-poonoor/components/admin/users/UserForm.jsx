'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { inputClass, labelClass } from '@/components/admin/forms/field-styles'
import PermissionGrid from '@/components/admin/PermissionGrid'
import Switch from '@/components/admin/forms/Switch'

/**
 * Create / edit form for an admin user. Roles (with their permission presets)
 * are passed in so the resolved-permission preview can react to the chosen role
 * without an extra request.
 *
 * Props:
 *  - roles:       [{ _id, name, permissions[] }]
 *  - initialData: existing user (edit mode) or null (create mode)
 */
export default function UserForm({ roles = [], initialData = null }) {
  const router = useRouter()
  const isEdit = !!initialData

  const [form, setForm] = useState(() => ({
    name: initialData?.name || '',
    username: initialData?.username || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    password: '',
    roleId: initialData?.roleId?._id || initialData?.roleId || roles[0]?._id || '',
    permissions: initialData?.permissions || [],
    isActive: initialData?.isActive !== false,
  }))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const rolePermissions = useMemo(() => {
    const role = roles.find((r) => String(r._id) === String(form.roleId))
    return role?.permissions || []
  }, [roles, form.roleId])

  // Resolved = role defaults + user overrides (deduped). Mirrors the server resolver.
  const resolved = useMemo(
    () => [...new Set([...rolePermissions, ...form.permissions])].sort(),
    [rolePermissions, form.permissions]
  )

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const url = isEdit ? `/api/users/${initialData._id}` : '/api/users'
      const method = isEdit ? 'PUT' : 'POST'
      const payload = { ...form }
      if (isEdit && !payload.password) delete payload.password // don't reset unless provided

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Something went wrong')
        return
      }
      router.push('/app/users')
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-gray-900 rounded-xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Name *</label>
          <input value={form.name} required onChange={(e) => set('name', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Username *</label>
          <input
            value={form.username}
            required
            onChange={(e) => set('username', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>
            {isEdit ? 'Reset password (leave blank to keep)' : 'Password *'}
          </label>
          <input
            type="password"
            value={form.password}
            required={!isEdit}
            autoComplete="new-password"
            onChange={(e) => set('password', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Role *</label>
          <select value={form.roleId} required onChange={(e) => set('roleId', e.target.value)} className={inputClass}>
            <option value="" disabled>
              Select a role
            </option>
            {roles.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="max-w-xs">
        <Switch
          label="Active (can sign in)"
          checked={form.isActive}
          onChange={(v) => set('isActive', v)}
        />
      </div>

      <div>
        <label className={labelClass}>Permission overrides</label>
        <p className="text-gray-500 text-xs mb-2">
          Cells from the selected role are locked on. Toggle extra cells to grant additional permissions beyond the
          role defaults. Leave empty to use role defaults only.
        </p>
        <PermissionGrid
          value={form.permissions}
          baseline={rolePermissions}
          onChange={(next) => set('permissions', next)}
        />
      </div>

      <div>
        <label className={labelClass}>Resolved permissions ({resolved.length})</label>
        <div className="flex flex-wrap gap-1.5 bg-gray-950 border border-gray-800 rounded-lg p-3 min-h-[44px]">
          {resolved.length ? (
            resolved.map((p) => (
              <span key={p} className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-xs font-mono">
                {p}
              </span>
            ))
          ) : (
            <span className="text-gray-600 text-xs">No permissions</span>
          )}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {loading ? 'Saving…' : isEdit ? 'Update User' : 'Create User'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/app/users')}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
