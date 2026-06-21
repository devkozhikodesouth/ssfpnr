'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { inputClass, labelClass } from '@/components/admin/forms/field-styles'
import Switch from '@/components/admin/forms/Switch'

const EMPTY_FORM = {
  label: '',
  slug: '',
  destination: '',
  permanent: false,
  isActive: true,
}

/**
 * Redirects manager — admin-managed short links. Each rule is reached at
 * `/go/<slug>` and forwards to `destination` (an external URL or internal path)
 * without appearing in any menu. Create/update/delete hit /api/redirects.
 * Reuses the `paths.manage` permission (no new role needed).
 */
export default function RedirectsManager({ redirects: initial = [] }) {
  const router = useRouter()
  const [rules, setRules] = useState(initial)
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
      slug: item.slug || '',
      destination: item.destination || '',
      permanent: !!item.permanent,
      isActive: item.isActive !== false,
    })
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.destination.trim()) return setError('Destination is required')
    if (!form.slug.trim() && !form.label.trim()) return setError('Slug or label is required')

    setBusy(true)
    try {
      const url = editingId ? `/api/redirects/${editingId}` : '/api/redirects'
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
      setRules((prev) => {
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
    if (!confirm(`Delete redirect "/go/${item.slug}"?`)) return
    setBusy(true)
    try {
      const res = await fetch(`/api/redirects/${item._id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) {
        alert(json.error || 'Delete failed')
        return
      }
      setRules((prev) => prev.filter((p) => p._id !== item._id))
      if (editingId === item._id) resetForm()
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-white font-semibold">Redirects</h2>
        <p className="text-gray-400 text-sm mt-0.5">
          Short links that forward visitors elsewhere without appearing in any menu. Each is reached at{' '}
          <code className="text-gray-300">/go/&lt;slug&gt;</code> and redirects to its destination.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-5 space-y-4">
        <h3 className="text-white font-medium text-sm">{editingId ? 'Edit redirect' : 'Add redirect'}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Label (optional)</label>
            <input value={form.label} onChange={(e) => setField('label', e.target.value)} className={inputClass} placeholder="Registration form" />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input value={form.slug} onChange={(e) => setField('slug', e.target.value)} className={inputClass} placeholder="register" />
            <p className="text-gray-500 text-xs mt-1">Reached at /go/{(form.slug || 'slug').trim() || 'slug'}</p>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Destination URL *</label>
            <input value={form.destination} onChange={(e) => setField('destination', e.target.value)} className={inputClass} placeholder="https://forms.gle/…" />
          </div>
          <div className="flex flex-col justify-end gap-3 pb-1">
            <Switch label="Active" checked={form.isActive} onChange={(v) => setField('isActive', v)} />
            <Switch label="Permanent (308)" checked={form.permanent} onChange={(v) => setField('permanent', v)} />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-2">
          <button type="submit" disabled={busy} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors">
            {busy ? 'Saving…' : editingId ? 'Update redirect' : 'Add redirect'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        <h3 className="text-white font-medium text-sm mb-3">
          Existing redirects <span className="text-gray-500 font-normal">({rules.length})</span>
        </h3>
        {rules.length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-6 text-center text-gray-500 text-sm">No redirects yet.</div>
        ) : (
          <div className="space-y-2">
            {rules.map((item) => (
              <div key={item._id} className="bg-gray-900 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium truncate">/go/{item.slug}</p>
                    {item.permanent && <span className="text-xs text-amber-400">308</span>}
                    {item.isActive === false && <span className="text-xs text-gray-500">inactive</span>}
                    <span className="text-xs text-gray-500">{item.hits || 0} hits</span>
                  </div>
                  <p className="text-gray-500 text-xs truncate">↗ {item.destination}</p>
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
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
