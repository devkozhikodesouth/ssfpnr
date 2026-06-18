'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getModuleConfig } from '@/components/admin/content-configs'
import { getModuleSchema, collectErrors } from '@/lib/validation'
import { slugify } from '@/lib/slugify'
import { inputClass, labelClass } from './field-styles'
import CategorySelect from './CategorySelect'
import ImageUploader from './ImageUploader'
import LinkedItemsPicker from './LinkedItemsPicker'
import SeoFields from './SeoFields'
import VisibilityFields from './VisibilityFields'
import RichTextEditor from '@/components/admin/editor/RichTextEditor'
import CssEditor from '@/components/admin/editor/CssEditor'

/** Inline raw-file (PDF/doc) uploader for the Download module's `file` field. */
function FileField({ label, value, onUploaded, folder }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setBusy(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', folder || 'downloads')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Upload failed')
      onUploaded({ url: json.data.url, fileType: json.data.format || file.type, fileSize: json.data.bytes || file.size })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex gap-2 items-center">
        <input
          type="url"
          value={value || ''}
          onChange={(e) => onUploaded({ url: e.target.value })}
          placeholder="https://… or upload a file"
          className={inputClass}
        />
        <label className="flex-shrink-0">
          <span className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg cursor-pointer inline-block whitespace-nowrap">
            {busy ? '…' : 'Upload'}
          </span>
          <input type="file" onChange={handleChange} disabled={busy} className="hidden" />
        </label>
      </div>
      {value && <p className="text-gray-500 text-xs mt-1 break-all">{value}</p>}
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  )
}

function defaultFor(field) {
  switch (field.type) {
    case 'categories':
    case 'images':
    case 'tags':
    case 'speakers':
      return []
    case 'author':
      return Object.fromEntries((field.subFields || []).map((k) => [k, '']))
    case 'linkedItems':
      return { news: [], videos: [], gallery: [], blogs: [] }
    case 'boolean':
      return field.default ?? false
    case 'seo':
      return { metaTitle: '', metaDescription: '', metaKeywords: [], ogImage: '', canonicalUrl: '', noIndex: false }
    case 'visibility':
      return { isPublished: false, isFeatured: false, isPinned: false, publishAt: null, unpublishAt: null }
    case 'select':
      return field.default ?? field.options?.[0]?.value ?? ''
    default:
      return ''
  }
}

/** Inline validation message shown beneath a field. Renders nothing when valid. */
function FieldError({ msg }) {
  if (!msg) return null
  return <p className="text-red-400 text-xs mt-1">{msg}</p>
}

/** Format a Date / ISO string into the yyyy-MM-dd value an <input type=date> wants. */
function toDateInput(value) {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10)
}

/** Reduce a possibly-populated ref array to plain id strings. */
const toIds = (arr) => (Array.isArray(arr) ? arr.map((x) => (x && typeof x === 'object' ? x._id : x)) : [])

function buildInitialState(config, initialData) {
  const state = {}
  for (const field of config.fields) {
    const existing = initialData?.[field.name]
    if (existing === undefined || existing === null) {
      state[field.name] = defaultFor(field)
      continue
    }
    if (field.type === 'linkedItems') {
      // The edit API populates linked refs; collapse them back to id arrays.
      state[field.name] = {
        news: toIds(existing.news),
        videos: toIds(existing.videos),
        gallery: toIds(existing.gallery),
        blogs: toIds(existing.blogs),
      }
    } else if (field.type === 'categories') {
      state[field.name] = toIds(existing)
    } else if (field.type === 'category') {
      state[field.name] = existing && typeof existing === 'object' ? existing._id : existing
    } else {
      state[field.name] = existing
    }
  }
  return state
}

/**
 * Config-driven form shared by all four content modules. The module's field
 * list (components/admin/content-configs) decides what renders; this component
 * owns no module-specific logic.
 */
export default function ContentForm({ module, initialData = null }) {
  const config = getModuleConfig(module)
  const router = useRouter()
  const isEdit = !!initialData

  const schema = getModuleSchema(module)
  const [form, setForm] = useState(() => buildInitialState(config, initialData))
  const [slugManual, setSlugManual] = useState(isEdit)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }))
  const err = (name) => fieldErrors[name]

  function handleTitleLikeChange(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field.name]: value }
      const slugField = config.fields.find((f) => f.type === 'slug' && f.from === field.name)
      if (slugField && !slugManual) next[slugField.name] = slugify(value)
      return next
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Client-side validation against the module's zod schema (lib/validation).
    const errors = collectErrors(schema, form)
    if (Object.keys(errors).length) {
      setFieldErrors(errors)
      setError('Please fix the highlighted fields.')
      return
    }
    setFieldErrors({})

    setLoading(true)
    try {
      const url = isEdit ? `${config.apiBase}/${initialData._id}` : config.apiBase
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
      router.push(config.basePath)
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function renderField(field) {
    const value = form[field.name]
    switch (field.type) {
      case 'text':
      case 'url':
        return (
          <div key={field.name}>
            <label className={labelClass}>
              {field.label} {field.required && '*'}
            </label>
            <input
              type={field.type === 'url' ? 'url' : 'text'}
              value={value}
              required={field.required}
              onChange={(e) =>
                config.fields.some((f) => f.type === 'slug' && f.from === field.name)
                  ? handleTitleLikeChange(field, e.target.value)
                  : setField(field.name, e.target.value)
              }
              className={inputClass}
            />
            <FieldError msg={err(field.name)} />
          </div>
        )

      case 'slug':
        return (
          <div key={field.name}>
            <label className={labelClass}>{field.label}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setSlugManual(true)
                setField(field.name, e.target.value)
              }}
              placeholder="auto-generated from title"
              className={inputClass}
            />
            <FieldError msg={err(field.name)} />
          </div>
        )

      case 'textarea':
        return (
          <div key={field.name}>
            <label className={labelClass}>{field.label}</label>
            <textarea
              value={value}
              rows={field.name === 'transcript' ? 5 : 3}
              onChange={(e) => setField(field.name, e.target.value)}
              className={inputClass}
            />
          </div>
        )

      case 'select':
        return (
          <div key={field.name}>
            <label className={labelClass}>{field.label}</label>
            <select value={value} onChange={(e) => setField(field.name, e.target.value)} className={inputClass}>
              {field.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        )

      case 'image':
        return (
          <ImageUploader
            key={field.name}
            label={field.label}
            folder={field.folder}
            value={value}
            onChange={(v) => setField(field.name, v)}
          />
        )

      case 'images':
        return (
          <ImageUploader
            key={field.name}
            label={field.label}
            folder={field.folder}
            multiple
            value={value}
            onChange={(v) => setField(field.name, v)}
          />
        )

      case 'category':
        return (
          <div key={field.name}>
            <CategorySelect
              label={field.label}
              appliesTo={config.appliesTo}
              required={field.required}
              value={value}
              onChange={(v) => setField(field.name, v)}
            />
            <FieldError msg={err(field.name)} />
          </div>
        )

      case 'categories':
        return (
          <CategorySelect
            key={field.name}
            label={field.label}
            appliesTo={config.appliesTo}
            multiple
            value={value}
            onChange={(v) => setField(field.name, v)}
          />
        )

      case 'richtext':
        return (
          <RichTextEditor key={field.name} label={field.label} value={value} onChange={(v) => setField(field.name, v)} />
        )

      case 'css':
        return <CssEditor key={field.name} label={field.label} value={value} onChange={(v) => setField(field.name, v)} />

      case 'tags':
        return (
          <div key={field.name}>
            <label className={labelClass}>{field.label} (comma-separated)</label>
            <input
              type="text"
              value={(value || []).join(', ')}
              onChange={(e) =>
                setField(
                  field.name,
                  e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                )
              }
              className={inputClass}
            />
          </div>
        )

      case 'author':
        return (
          <div key={field.name}>
            <label className={labelClass}>{field.label}</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {field.subFields.map((sub) => (
                <input
                  key={sub}
                  type="text"
                  value={value?.[sub] || ''}
                  placeholder={sub.charAt(0).toUpperCase() + sub.slice(1)}
                  onChange={(e) => setField(field.name, { ...value, [sub]: e.target.value })}
                  className={inputClass}
                />
              ))}
            </div>
          </div>
        )

      case 'speakers': {
        const speakers = value || []
        const update = (i, patch) =>
          setField(field.name, speakers.map((s, idx) => (idx === i ? { ...s, ...patch } : s)))
        return (
          <div key={field.name}>
            <label className={labelClass}>{field.label}</label>
            <div className="space-y-2">
              {speakers.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={s.name || ''}
                    placeholder="Name"
                    onChange={(e) => update(i, { name: e.target.value })}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={s.role || ''}
                    placeholder="Role"
                    onChange={(e) => update(i, { role: e.target.value })}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setField(field.name, speakers.filter((_, idx) => idx !== i))}
                    className="px-3 bg-red-950 hover:bg-red-900 text-red-300 rounded-lg text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setField(field.name, [...speakers, { name: '', role: '' }])}
              className="mt-2 px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              + Add Speaker
            </button>
          </div>
        )
      }

      case 'number':
        return (
          <div key={field.name}>
            <label className={labelClass}>{field.label}</label>
            <input
              type="number"
              value={value === '' || value === undefined || value === null ? '' : value}
              onChange={(e) => setField(field.name, e.target.value === '' ? '' : Number(e.target.value))}
              className={inputClass}
            />
            <FieldError msg={err(field.name)} />
          </div>
        )

      case 'date':
        return (
          <div key={field.name}>
            <label className={labelClass}>{field.label}</label>
            <input
              type="date"
              value={toDateInput(value)}
              onChange={(e) => setField(field.name, e.target.value || null)}
              className={inputClass}
            />
          </div>
        )

      case 'boolean':
        return (
          <label key={field.name} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => setField(field.name, e.target.checked)}
              className="w-4 h-4 accent-emerald-600"
            />
            <span className="text-sm text-gray-300">{field.label}</span>
          </label>
        )

      case 'file':
        return (
          <FileField
            key={field.name}
            label={field.label}
            folder={field.folder}
            value={value}
            onUploaded={({ url, fileType, fileSize }) =>
              setForm((prev) => ({
                ...prev,
                [field.name]: url,
                ...(fileType !== undefined ? { fileType } : {}),
                ...(fileSize !== undefined ? { fileSize } : {}),
              }))
            }
          />
        )

      case 'linkedItems':
        return (
          <LinkedItemsPicker key={field.name} label={field.label} value={value} onChange={(v) => setField(field.name, v)} />
        )

      case 'seo':
        return <SeoFields key={field.name} value={value} onChange={(v) => setField(field.name, v)} />

      case 'visibility':
        return <VisibilityFields key={field.name} value={value} onChange={(v) => setField(field.name, v)} />

      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-gray-900 rounded-xl p-6">
      {config.fields.map(renderField)}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {loading ? 'Saving…' : isEdit ? `Update ${config.singular}` : `Create ${config.singular}`}
        </button>
        <button
          type="button"
          onClick={() => router.push(config.basePath)}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
