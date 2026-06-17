'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { inputClass, labelClass } from '@/components/admin/forms/field-styles'
import PermissionGrid from '@/components/admin/PermissionGrid'

/**
 * Create / edit form for a role. System roles render read-only (the grid and
 * fields are locked) so their presets can't be altered.
 */
export default function RoleForm({ initialData = null }) {
  const router = useRouter()
  const isEdit = !!initialData
  const readOnly = !!initialData?.isSystem

  const [form, setForm] = useState(() => ({
    name: initialData?.name || '',
    description: initialData?.description || '',
    color: initialData?.color || '#10b981',
    permissions: initialData?.permissions || [],
  }))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (readOnly) return
    setError('')
    setLoading(true)
    try {
      const url = isEdit ? `/api/roles/${initialData._id}` : '/api/roles'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Something went wrong')
        return
      }
      router.push('/app/roles')
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-gray-900 rounded-xl p-6">
      {readOnly && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-300">
          This is a system role and is read-only. Create a custom role to define your own permissions.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className={labelClass}>Name *</label>
          <input
            value={form.name}
            required
            disabled={readOnly}
            onChange={(e) => set('name', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Color</label>
          <input
            type="color"
            value={form.color}
            disabled={readOnly}
            onChange={(e) => set('color', e.target.value)}
            className="w-full h-[42px] bg-gray-800 border border-gray-700 rounded-lg cursor-pointer disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          value={form.description}
          rows={2}
          disabled={readOnly}
          onChange={(e) => set('description', e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Permissions ({form.permissions.length})</label>
        <PermissionGrid
          value={form.permissions}
          readOnly={readOnly}
          onChange={(next) => set('permissions', next)}
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3 pt-1">
        {!readOnly && (
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {loading ? 'Saving…' : isEdit ? 'Update Role' : 'Create Role'}
          </button>
        )}
        <button
          type="button"
          onClick={() => router.push('/app/roles')}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
        >
          {readOnly ? 'Back' : 'Cancel'}
        </button>
      </div>
    </form>
  )
}
