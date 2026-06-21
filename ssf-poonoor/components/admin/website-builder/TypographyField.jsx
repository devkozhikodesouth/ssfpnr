'use client'

import { useState } from 'react'
import { SelectField, TextField, ColorField } from '@/components/admin/site-setup/fields'

// Curated font stacks (the site also injects Google/uploaded fonts globally, so
// these names resolve when available). "Default" clears the override.
const FONT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'Inter, sans-serif', label: 'Inter (sans)' },
  { value: "'Playfair Display', serif", label: 'Playfair (serif)' },
  { value: 'Georgia, serif', label: 'Georgia (serif)' },
  { value: 'system-ui, sans-serif', label: 'System UI' },
  { value: "'Courier New', monospace", label: 'Monospace' },
]
const WEIGHT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: '300', label: 'Light (300)' },
  { value: '400', label: 'Regular (400)' },
  { value: '500', label: 'Medium (500)' },
  { value: '600', label: 'Semibold (600)' },
  { value: '700', label: 'Bold (700)' },
  { value: '800', label: 'Extrabold (800)' },
]
const ALIGN_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
]

/**
 * Collapsible per-field typography editor: font family, size, weight, alignment
 * and colour. Edits a `{ fontFamily, fontSize, fontWeight, align, color }` object
 * (all optional). Collapsed by default so the section editor stays compact.
 *
 * @param {{ label?: string, value?: object, onChange: (next:object)=>void }} props
 */
export default function TypographyField({ label = 'Typography', value = {}, onChange }) {
  const [open, setOpen] = useState(false)
  const set = (patch) => onChange({ ...value, ...patch })
  const touched = Object.values(value || {}).some((v) => v)

  return (
    <div className="md:col-span-2 border border-gray-800 rounded-lg">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 text-left text-sm text-gray-300 hover:text-white"
      >
        <span>
          {label} {touched ? <span className="text-emerald-400 text-xs">· customised</span> : <span className="text-gray-600 text-xs">· default</span>}
        </span>
        <span className="text-gray-500">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 pt-0">
          <SelectField label="Font" value={value.fontFamily} onChange={(v) => set({ fontFamily: v })} options={FONT_OPTIONS} />
          <TextField label="Size (e.g. 2rem, 32px)" value={value.fontSize} onChange={(v) => set({ fontSize: v })} placeholder="2rem" />
          <SelectField label="Weight" value={value.fontWeight} onChange={(v) => set({ fontWeight: v })} options={WEIGHT_OPTIONS} />
          <SelectField label="Align" value={value.align} onChange={(v) => set({ align: v })} options={ALIGN_OPTIONS} />
          <ColorField label="Text Color" value={value.color} onChange={(v) => set({ color: v })} />
        </div>
      )}
    </div>
  )
}
