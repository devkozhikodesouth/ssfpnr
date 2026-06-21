'use client'

import { TextField, SelectField, FieldGroup } from '@/components/admin/site-setup/fields'
import ContentSectionEditor from './ContentSectionEditor'

// Icon options available to pillar cards (subset of components/public/Icon.jsx).
const ICON_OPTIONS = [
  'image', 'megaphone', 'document', 'map-pin', 'newspaper', 'calendar',
  'globe', 'users', 'home', 'video', 'pencil', 'tag', 'mail', 'phone',
].map((v) => ({ value: v, label: v }))

/**
 * About block editor (Website Builder → About). Standard content section plus a
 * repeatable "Our Pillars" list (title + icon, add/remove/reorder). Writes the
 * homepage about section's Mixed `config`.
 *
 * @param {{ value?: object, onChange: (next:object)=>void }} props
 */
export default function AboutEditor({ value = {}, onChange }) {
  const pillars = Array.isArray(value.pillars) ? value.pillars : []
  const setPillars = (next) => onChange({ ...value, pillars: next })

  const update = (i, patch) => setPillars(pillars.map((p, idx) => (idx === i ? { ...p, ...patch } : p)))
  const remove = (i) => setPillars(pillars.filter((_, idx) => idx !== i))
  const add = () => setPillars([...pillars, { title: '', icon: 'image' }])
  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= pillars.length) return
    const next = [...pillars]
    ;[next[i], next[j]] = [next[j], next[i]]
    setPillars(next)
  }

  return (
    <ContentSectionEditor value={value} onChange={onChange} title="About Content" description="Intro copy for the About / Pillars section.">
      <FieldGroup title="Our Pillars" description="Cards shown in the About section. Leave empty to use the defaults.">
        <div className="md:col-span-2 space-y-3">
          {pillars.length === 0 && <p className="text-gray-500 text-sm">No custom pillars — defaults will show.</p>}
          {pillars.map((p, i) => (
            <div key={i} className="flex gap-2 items-end bg-gray-800 border border-gray-700 rounded-lg p-3">
              <div className="flex-1">
                <TextField label={`Pillar ${i + 1}`} value={p.title} onChange={(v) => update(i, { title: v })} placeholder="Cultural" />
              </div>
              <div className="w-40">
                <SelectField label="Icon" value={p.icon} onChange={(v) => update(i, { icon: v })} options={ICON_OPTIONS} />
              </div>
              <div className="flex flex-col gap-1 pb-0.5">
                <button type="button" onClick={() => move(i, -1)} className="px-2 py-0.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded">↑</button>
                <button type="button" onClick={() => move(i, 1)} className="px-2 py-0.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded">↓</button>
                <button type="button" onClick={() => remove(i)} className="px-2 py-0.5 text-xs bg-red-950 hover:bg-red-900 text-red-300 rounded">✕</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={add} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg">
            + Add Pillar
          </button>
        </div>
      </FieldGroup>

      <p className="text-gray-500 text-xs px-1">
        Vision, Mission, Leadership and Wings &amp; Initiatives for the full{' '}
        <span className="text-gray-300">/about</span> page are managed as content pages (see roadmap in docs).
      </p>
    </ContentSectionEditor>
  )
}
