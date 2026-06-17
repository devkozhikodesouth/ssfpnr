'use client'

import { useState } from 'react'
import { inputClass, labelClass } from './field-styles'

async function uploadFile(file, folder) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('folder', folder)
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Upload failed')
  return json.data // { url, publicId, ... }
}

/**
 * Image uploader — single image (value: url string) or multi-image album
 * (value: array of { url, caption, alt, order }). Uploads via /api/upload
 * (Cloudinary) and also accepts a manual URL paste.
 */
export default function ImageUploader({
  label = 'Image',
  value,
  onChange,
  folder = 'misc',
  multiple = false,
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleSingle(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setBusy(true)
    try {
      const data = await uploadFile(file, folder)
      onChange(data.url)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  async function handleMulti(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setError('')
    setBusy(true)
    try {
      const current = Array.isArray(value) ? value : []
      const uploaded = []
      for (const file of files) {
        const data = await uploadFile(file, folder)
        uploaded.push({ url: data.url, caption: '', alt: '', order: current.length + uploaded.length })
      }
      onChange([...current, ...uploaded])
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  if (multiple) {
    const images = Array.isArray(value) ? value : []
    const update = (i, patch) =>
      onChange(images.map((img, idx) => (idx === i ? { ...img, ...patch } : img)))
    const remove = (i) => onChange(images.filter((_, idx) => idx !== i))
    const move = (i, dir) => {
      const j = i + dir
      if (j < 0 || j >= images.length) return
      const next = [...images]
      ;[next[i], next[j]] = [next[j], next[i]]
      onChange(next.map((img, idx) => ({ ...img, order: idx })))
    }

    return (
      <div>
        <label className={labelClass}>{label}</label>
        <div className="space-y-3">
          {images.map((img, i) => (
            <div key={i} className="flex gap-3 items-start bg-gray-800 border border-gray-700 rounded-lg p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt || ''} className="w-20 h-20 object-cover rounded flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={img.caption || ''}
                  onChange={(e) => update(i, { caption: e.target.value })}
                  placeholder="Caption"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={img.alt || ''}
                  onChange={(e) => update(i, { alt: e.target.value })}
                  placeholder="Alt text (for accessibility)"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <button type="button" onClick={() => move(i, -1)} className="px-2 py-0.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded">↑</button>
                <button type="button" onClick={() => move(i, 1)} className="px-2 py-0.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded">↓</button>
                <button type="button" onClick={() => remove(i)} className="px-2 py-0.5 text-xs bg-red-950 hover:bg-red-900 text-red-300 rounded">✕</button>
              </div>
            </div>
          ))}
        </div>
        <label className="mt-3 inline-block">
          <span className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg cursor-pointer inline-block">
            {busy ? 'Uploading…' : '+ Add Images'}
          </span>
          <input type="file" accept="image/*" multiple onChange={handleMulti} disabled={busy} className="hidden" />
        </label>
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      </div>
    )
  }

  return (
    <div>
      <label className={labelClass}>{label}</label>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="w-32 h-32 object-cover rounded-lg mb-2 border border-gray-700" />
      )}
      <div className="flex gap-2 items-center">
        <input
          type="url"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or upload"
          className={inputClass}
        />
        <label className="flex-shrink-0">
          <span className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg cursor-pointer inline-block whitespace-nowrap">
            {busy ? '…' : 'Upload'}
          </span>
          <input type="file" accept="image/*" onChange={handleSingle} disabled={busy} className="hidden" />
        </label>
      </div>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  )
}
