'use client'

import { inputClass, labelClass } from '@/components/admin/forms/field-styles'
import Switch from '@/components/admin/forms/Switch'

// Small controlled field primitives shared by every Site Setup tab so the tabs
// stay declarative and we don't repeat input markup nine times.

export function TextField({ label, value, onChange, placeholder, type = 'text', lang }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        lang={lang}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  )
}

export function TextareaField({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={inputClass}
      />
    </div>
  )
}

export function NumberField({ label, value, onChange, min, max, step }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type="number"
        value={value ?? ''}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
        className={inputClass}
      />
    </div>
  )
}

export function ColorField({ label, value, onChange }) {
  const safe = value || '#000000'
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={safe}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-10 flex-shrink-0 rounded border border-gray-700 bg-gray-800 cursor-pointer"
          aria-label={`${label} color picker`}
        />
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#1a6b47"
          className={inputClass}
        />
      </div>
    </div>
  )
}

export function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function ToggleField({ label, value, onChange, hint }) {
  return (
    <div className="py-1.5">
      <Switch label={label} hint={hint} checked={!!value} onChange={onChange} />
    </div>
  )
}

export function FieldGroup({ title, description, children, cols = 2 }) {
  const gridCols = cols === 1 ? 'grid-cols-1' : cols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
  return (
    <section className="bg-gray-900 rounded-xl p-5 space-y-4">
      {title && (
        <div>
          <h3 className="text-white font-semibold">{title}</h3>
          {description && <p className="text-gray-500 text-xs mt-0.5">{description}</p>}
        </div>
      )}
      <div className={`grid grid-cols-1 ${gridCols} gap-4`}>{children}</div>
    </section>
  )
}
