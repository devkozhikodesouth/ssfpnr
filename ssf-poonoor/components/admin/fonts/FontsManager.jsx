'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FontUploader from '@/components/admin/forms/FontUploader'

const PREVIEW_TEXT = 'Aa Bb Cc 1234 വാർത്തകൾ'
const ROLES = [
  { key: 'heading', label: 'Heading' },
  { key: 'body', label: 'Body' },
  { key: 'arabic', label: 'Arabic / Malayalam' },
]

/**
 * Fonts admin screen — upload zone, live-preview list, activate toggle,
 * role assignment, and delete (with a warning when a font is in use).
 * Each font's @font-face is injected inline so its preview renders in its own
 * typeface.
 */
export default function FontsManager({ fonts: initial }) {
  const router = useRouter()
  const [fonts, setFonts] = useState(initial)
  const [busyId, setBusyId] = useState(null)

  function upsert(font) {
    setFonts((prev) => {
      const idx = prev.findIndex((f) => f._id === font._id)
      if (idx === -1) return [font, ...prev]
      const next = [...prev]
      next[idx] = font
      return next
    })
  }

  async function patchActivation(font, body) {
    setBusyId(font._id)
    try {
      const res = await fetch(`/api/fonts/${font._id}/activate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) {
        alert(json.error || 'Update failed')
        return
      }
      // Role assignment is exclusive, so other fonts may have changed too.
      router.refresh()
      // Reflect the returned font and clear roles on others locally.
      setFonts((prev) =>
        prev.map((f) => {
          if (f._id === json.data._id) return json.data
          if (!json.data.assignedTo?.length) return f
          return { ...f, assignedTo: (f.assignedTo || []).filter((r) => !json.data.assignedTo.includes(r)) }
        })
      )
    } finally {
      setBusyId(null)
    }
  }

  function toggleActive(font) {
    patchActivation(font, { isActive: !font.isActive })
  }

  function toggleRole(font, role) {
    const current = new Set(font.assignedTo || [])
    if (current.has(role)) current.delete(role)
    else current.add(role)
    patchActivation(font, { isActive: true, assignedTo: [...current] })
  }

  async function handleDelete(font) {
    const assigned = (font.assignedTo || []).length > 0
    const message = assigned
      ? `"${font.name}" is currently assigned to: ${font.assignedTo.join(', ')}.\nDeleting it will unassign it (those roles fall back to the default font). Continue?`
      : `Delete "${font.name}"? This cannot be undone.`
    if (!confirm(message)) return

    setBusyId(font._id)
    try {
      const res = await fetch(`/api/fonts/${font._id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) {
        alert(json.error || 'Could not delete font')
        return
      }
      setFonts((prev) => prev.filter((f) => f._id !== font._id))
      router.refresh()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-8">
      <FontUploader onUploaded={(font) => upsert(font)} />

      <div>
        <h2 className="text-white font-semibold mb-3">Uploaded fonts ({fonts.length})</h2>
        {!fonts.length ? (
          <div className="bg-gray-900 rounded-xl p-10 text-center text-gray-400 text-sm">
            No fonts uploaded yet.
          </div>
        ) : (
          <div className="space-y-4">
            {fonts.map((font) => (
              <div key={font._id} className="bg-gray-900 rounded-xl p-5">
                {font.fontFace && <style dangerouslySetInnerHTML={{ __html: font.fontFace }} />}

                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-medium">{font.name}</h3>
                      {font.isActive ? (
                        <span className="text-emerald-400 text-xs">● Active</span>
                      ) : (
                        <span className="text-gray-500 text-xs">○ Inactive</span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {(font.weights || []).join(', ') || '400'} · {(font.styles || []).join(', ') || 'normal'}
                    </p>
                    <p
                      className="text-2xl text-gray-100 mt-3"
                      style={{ fontFamily: `'${font.name}', sans-serif` }}
                      lang="ml"
                    >
                      {PREVIEW_TEXT}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <button
                      onClick={() => toggleActive(font)}
                      disabled={busyId === font._id}
                      className={[
                        'px-3 py-1 text-xs rounded-lg transition-colors disabled:opacity-50',
                        font.isActive
                          ? 'bg-gray-700 hover:bg-gray-600 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white',
                      ].join(' ')}
                    >
                      {font.isActive ? 'Deactivate' : 'Activate'}
                    </button>

                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {ROLES.map((role) => {
                        const on = (font.assignedTo || []).includes(role.key)
                        return (
                          <button
                            key={role.key}
                            onClick={() => toggleRole(font, role.key)}
                            disabled={busyId === font._id}
                            className={[
                              'px-2.5 py-1 text-xs rounded-full border transition-colors disabled:opacity-50',
                              on
                                ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500',
                            ].join(' ')}
                          >
                            {role.label}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      onClick={() => handleDelete(font)}
                      disabled={busyId === font._id}
                      className="px-3 py-1 text-xs bg-red-950 hover:bg-red-900 disabled:opacity-50 text-red-300 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
