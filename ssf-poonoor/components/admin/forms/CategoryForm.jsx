'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { categorySchema, collectErrors } from '@/lib/validation'
import Switch from './Switch'

const MODULE_OPTIONS = ['news', 'video', 'gallery', 'blog', 'event', 'campaign', 'download']

const TYPE_OPTIONS = [
  { value: 'event-based', label: 'Event-based' },
  { value: 'topical', label: 'Topical' },
  { value: 'permanent', label: 'Permanent' },
]

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function CategoryForm({ initialData = null }) {
  const router = useRouter()
  const isEdit = !!initialData

  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    slug: initialData?.slug ?? '',
    description: initialData?.description ?? '',
    coverImage: initialData?.coverImage ?? '',
    icon: initialData?.icon ?? '',
    color: initialData?.color ?? '#1a6b47',
    type: initialData?.type ?? 'topical',
    appliesTo: initialData?.appliesTo ?? [],
    isStandalone: initialData?.isStandalone ?? false,
    isFeatured: initialData?.isFeatured ?? false,
    order: initialData?.order ?? 0,
    visibility: { isPublished: initialData?.visibility?.isPublished ?? false },
  })
  const [slugManual, setSlugManual] = useState(isEdit)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const err = (name) => fieldErrors[name]

  function handleNameChange(e) {
    const name = e.target.value
    setForm(prev => ({
      ...prev,
      name,
      slug: slugManual ? prev.slug : slugify(name),
    }))
  }

  function handleSlugChange(e) {
    setSlugManual(true)
    setForm(prev => ({ ...prev, slug: e.target.value }))
  }

  function toggleAppliesTo(module) {
    setForm(prev => ({
      ...prev,
      appliesTo: prev.appliesTo.includes(module)
        ? prev.appliesTo.filter(m => m !== module)
        : [...prev.appliesTo, module],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const errors = collectErrors(categorySchema, form)
    if (Object.keys(errors).length) {
      setFieldErrors(errors)
      setError('Please fix the highlighted fields.')
      return
    }
    setFieldErrors({})

    setLoading(true)

    try {
      const url = isEdit ? `/api/categories/${initialData._id}` : '/api/categories'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      router.push('/app/categories')
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const input = 'w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
  const label = 'block text-sm text-gray-300 mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 rounded-xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={label}>Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={handleNameChange}
            required
            placeholder="e.g. Sahityotsav 26"
            className={input}
          />
          {err('name') && <p className="text-red-400 text-xs mt-1">{err('name')}</p>}
        </div>
        <div>
          <label className={label}>Slug *</label>
          <input
            type="text"
            value={form.slug}
            onChange={handleSlugChange}
            required
            placeholder="e.g. sahityotsav-26"
            className={input}
          />
          {err('slug') && <p className="text-red-400 text-xs mt-1">{err('slug')}</p>}
        </div>
      </div>

      <div>
        <label className={label}>Description</label>
        <textarea
          value={form.description}
          onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          placeholder="Short description of this category"
          className={input}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={label}>Type *</label>
          <select
            value={form.type}
            onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
            required
            className={input}
          >
            {TYPE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Order</label>
          <input
            type="number"
            value={form.order}
            onChange={e => setForm(prev => ({ ...prev, order: parseInt(e.target.value, 10) || 0 }))}
            className={input}
          />
        </div>
        <div>
          <label className={label}>Badge Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={form.color || '#1a6b47'}
              onChange={e => setForm(prev => ({ ...prev, color: e.target.value }))}
              className="h-10 w-12 rounded cursor-pointer border border-gray-700 bg-gray-800 flex-shrink-0"
            />
            <input
              type="text"
              value={form.color}
              onChange={e => setForm(prev => ({ ...prev, color: e.target.value }))}
              placeholder="#1a6b47"
              className={input}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={label}>Cover Image URL</label>
          <input
            type="url"
            value={form.coverImage}
            onChange={e => setForm(prev => ({ ...prev, coverImage: e.target.value }))}
            placeholder="https://..."
            className={input}
          />
        </div>
        <div>
          <label className={label}>Icon URL</label>
          <input
            type="url"
            value={form.icon}
            onChange={e => setForm(prev => ({ ...prev, icon: e.target.value }))}
            placeholder="https://..."
            className={input}
          />
        </div>
      </div>

      <div>
        <label className={label}>Applies To</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {MODULE_OPTIONS.map(m => (
            <button
              key={m}
              type="button"
              onClick={() => toggleAppliesTo(m)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                form.appliesTo.includes(m)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pt-1">
        {[
          { field: 'isStandalone', label: 'Standalone (/c/[slug] page)' },
          { field: 'isFeatured', label: 'Featured (navbar / homepage)' },
        ].map(({ field, label: lbl }) => (
          <Switch
            key={field}
            label={lbl}
            checked={form[field]}
            onChange={(v) => setForm(prev => ({ ...prev, [field]: v }))}
          />
        ))}
        <Switch
          label="Published"
          checked={form.visibility.isPublished}
          onChange={(v) =>
            setForm(prev => ({ ...prev, visibility: { ...prev.visibility, isPublished: v } }))
          }
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {loading ? 'Saving…' : isEdit ? 'Update Category' : 'Create Category'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/app/categories')}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
