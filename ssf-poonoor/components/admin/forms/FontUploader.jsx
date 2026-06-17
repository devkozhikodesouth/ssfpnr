'use client'

import { useRef, useState } from 'react'
import { inputClass, labelClass } from './field-styles'

const FILE_SLOTS = [
  { key: 'woff2', label: 'WOFF2', required: true },
  { key: 'woff', label: 'WOFF', required: false },
  { key: 'ttf', label: 'TTF', required: false },
]

/**
 * Drag-drop / multi-file font upload form. Collects a name, weights, styles and
 * the woff2 (required) + optional woff/ttf files, then POSTs multipart to
 * /api/fonts. Calls onUploaded(font) on success.
 */
export default function FontUploader({ onUploaded }) {
  const [name, setName] = useState('')
  const [weights, setWeights] = useState('400')
  const [styles, setStyles] = useState('normal')
  const [files, setFiles] = useState({}) // { woff2: File, woff: File, ttf: File }
  const [dragOver, setDragOver] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  function assignFiles(fileList) {
    const next = {}
    for (const file of Array.from(fileList)) {
      const ext = file.name.split('.').pop()?.toLowerCase()
      if (ext === 'woff2' || ext === 'woff' || ext === 'ttf') next[ext] = file
    }
    if (Object.keys(next).length) setFiles((prev) => ({ ...prev, ...next }))
    // Pre-fill the name from the first dropped file if empty.
    if (!name && fileList[0]) {
      setName(fileList[0].name.replace(/\.[^.]+$/, ''))
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer?.files?.length) assignFiles(e.dataTransfer.files)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!name.trim()) return setError('Font name is required')
    if (!files.woff2) return setError('A .woff2 file is required')

    setBusy(true)
    try {
      const fd = new FormData()
      fd.append('name', name.trim())
      fd.append('weights', weights)
      fd.append('styles', styles)
      for (const slot of FILE_SLOTS) {
        if (files[slot.key]) fd.append(slot.key, files[slot.key])
      }
      const res = await fetch('/api/fonts', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Upload failed')
        return
      }
      setName('')
      setWeights('400')
      setStyles('normal')
      setFiles({})
      onUploaded?.(json.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-5 space-y-4">
      <h2 className="text-white font-semibold">Upload a font</h2>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={[
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          dragOver ? 'border-emerald-500 bg-emerald-950/20' : 'border-gray-700 hover:border-gray-600',
        ].join(' ')}
      >
        <p className="text-gray-300 text-sm">Drag &amp; drop font files here, or click to browse</p>
        <p className="text-gray-500 text-xs mt-1">.woff2 (required) · .woff · .ttf — max 2 MB each</p>
        <input
          ref={inputRef}
          type="file"
          accept=".woff2,.woff,.ttf"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && assignFiles(e.target.files)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {FILE_SLOTS.map((slot) => (
          <span
            key={slot.key}
            className={[
              'px-3 py-1 rounded-full text-xs font-medium',
              files[slot.key]
                ? 'bg-emerald-950 text-emerald-300'
                : slot.required
                ? 'bg-red-950/50 text-red-300'
                : 'bg-gray-800 text-gray-500',
            ].join(' ')}
          >
            {slot.label}: {files[slot.key]?.name || (slot.required ? 'required' : '—')}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Font name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="My Font" />
        </div>
        <div>
          <label className={labelClass}>Weights (comma-separated)</label>
          <input value={weights} onChange={(e) => setWeights(e.target.value)} className={inputClass} placeholder="300, 400, 700" />
        </div>
        <div>
          <label className={labelClass}>Styles (comma-separated)</label>
          <input value={styles} onChange={(e) => setStyles(e.target.value)} className={inputClass} placeholder="normal, italic" />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
      >
        {busy ? 'Uploading…' : 'Upload Font'}
      </button>
    </form>
  )
}
