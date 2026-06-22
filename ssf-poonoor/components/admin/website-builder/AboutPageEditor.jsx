'use client'

import { TextField, TextareaField, ColorField, SelectField, FieldGroup } from '@/components/admin/site-setup/fields'
import ImageUploader from '@/components/admin/forms/ImageUploader'
import CtaEditor from './CtaEditor'
import TypographyField from './TypographyField'

const ICON_OPTIONS = [
  'image', 'megaphone', 'document', 'map-pin', 'newspaper', 'calendar',
  'globe', 'users', 'home', 'video', 'pencil', 'tag',
].map((v) => ({ value: v, label: v }))

// Generic repeatable-list control (add / remove / reorder) used for pillars,
// leadership and wings. `fields` describes each row's inputs.
function RepeatableList({ label, hint, items, onChange, blank, renderRow }) {
  const list = Array.isArray(items) ? items : []
  const update = (i, patch) => onChange(list.map((it, idx) => (idx === i ? { ...it, ...patch } : it)))
  const remove = (i) => onChange(list.filter((_, idx) => idx !== i))
  const add = () => onChange([...list, { ...blank }])
  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= list.length) return
    const next = [...list]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  return (
    <div className="md:col-span-2 space-y-3">
      {hint && <p className="text-gray-500 text-xs">{hint}</p>}
      {list.length === 0 && <p className="text-gray-500 text-sm">No {label} yet — defaults will show on the site.</p>}
      {list.map((it, i) => (
        <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs font-medium">{label} {i + 1}</span>
            <div className="flex gap-1">
              <button type="button" onClick={() => move(i, -1)} className="px-2 py-0.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded">↑</button>
              <button type="button" onClick={() => move(i, 1)} className="px-2 py-0.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded">↓</button>
              <button type="button" onClick={() => remove(i)} className="px-2 py-0.5 text-xs bg-red-950 hover:bg-red-900 text-red-300 rounded">✕</button>
            </div>
          </div>
          {renderRow(it, (patch) => update(i, patch))}
        </div>
      ))}
      <button type="button" onClick={add} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg">
        + Add {label}
      </button>
    </div>
  )
}

/**
 * About Page editor (Website Builder → About Page). Edits the `about` config
 * branch end-to-end: hero, mission & vision, pillars, leadership and wings —
 * each with copy, background colour and (where relevant) repeatable item lists.
 * The public /about page renders entirely from these values.
 *
 * @param {{ value?: object, onChange: (next:object)=>void }} props
 */
export default function AboutPageEditor({ value = {}, onChange }) {
  const set = (key, patch) => onChange({ ...value, [key]: { ...(value[key] || {}), ...patch } })
  const hero = value.hero || {}
  const mv = value.missionVision || {}
  const pillars = value.pillars || {}
  const leadership = value.leadership || {}
  const wings = value.wings || {}

  const setMV = (patch) => set('missionVision', patch)

  return (
    <div className="space-y-4">
      {/* Hero */}
      <FieldGroup title="About — Hero" description="Top banner of the /about page.">
        <TextField label="Eyebrow" value={hero.eyebrow} onChange={(v) => set('hero', { eyebrow: v })} placeholder="About Us" />
        <TextField label="Title" value={hero.title} onChange={(v) => set('hero', { title: v })} placeholder="SSF Poonoor" />
        <TextField label="Subtitle" value={hero.subtitle} onChange={(v) => set('hero', { subtitle: v })} />
        <ColorField label="Background Color" value={hero.bgColor} onChange={(v) => set('hero', { bgColor: v })} />
        <div className="md:col-span-2">
          <TextareaField label="Description" value={hero.description} onChange={(v) => set('hero', { description: v })} rows={4} />
        </div>
        <TypographyField
          label="Title typography"
          value={hero.typography?.title}
          onChange={(t) => set('hero', { typography: { ...(hero.typography || {}), title: t } })}
        />
        <TypographyField
          label="Description typography"
          value={hero.typography?.description}
          onChange={(t) => set('hero', { typography: { ...(hero.typography || {}), description: t } })}
        />
      </FieldGroup>
      <CtaEditor title="About Hero CTA" value={hero.cta} onChange={(cta) => set('hero', { cta })} />

      {/* Mission / Vision */}
      <FieldGroup title="Mission & Vision" description="The two cards below the hero.">
        <ColorField label="Section Background" value={mv.bgColor} onChange={(v) => setMV({ bgColor: v })} />
        <div className="hidden md:block" />
        <TextField label="Mission Eyebrow" value={mv.mission?.eyebrow} onChange={(v) => setMV({ mission: { ...(mv.mission || {}), eyebrow: v } })} placeholder="Our Mission" />
        <TextField label="Mission Title" value={mv.mission?.title} onChange={(v) => setMV({ mission: { ...(mv.mission || {}), title: v } })} />
        <div className="md:col-span-2">
          <TextareaField label="Mission Text" value={mv.mission?.text} onChange={(v) => setMV({ mission: { ...(mv.mission || {}), text: v } })} />
        </div>
        <TextField label="Vision Eyebrow" value={mv.vision?.eyebrow} onChange={(v) => setMV({ vision: { ...(mv.vision || {}), eyebrow: v } })} placeholder="Our Vision" />
        <TextField label="Vision Title" value={mv.vision?.title} onChange={(v) => setMV({ vision: { ...(mv.vision || {}), title: v } })} />
        <div className="md:col-span-2">
          <TextareaField label="Vision Text" value={mv.vision?.text} onChange={(v) => setMV({ vision: { ...(mv.vision || {}), text: v } })} />
        </div>
      </FieldGroup>

      {/* Pillars */}
      <FieldGroup title="Our Pillars">
        <TextField label="Eyebrow" value={pillars.eyebrow} onChange={(v) => set('pillars', { eyebrow: v })} placeholder="What We Do" />
        <TextField label="Title" value={pillars.title} onChange={(v) => set('pillars', { title: v })} placeholder="Our Pillars" />
        <ColorField label="Section Background" value={pillars.bgColor} onChange={(v) => set('pillars', { bgColor: v })} />
        <RepeatableList
          label="Pillar"
          items={pillars.items}
          onChange={(items) => set('pillars', { items })}
          blank={{ title: '', icon: 'image' }}
          renderRow={(it, upd) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <TextField label="Title" value={it.title} onChange={(v) => upd({ title: v })} placeholder="Cultural" />
              <SelectField label="Icon" value={it.icon} onChange={(v) => upd({ icon: v })} options={ICON_OPTIONS} />
            </div>
          )}
        />
      </FieldGroup>

      {/* Leadership */}
      <FieldGroup title="Leadership">
        <TextField label="Eyebrow" value={leadership.eyebrow} onChange={(v) => set('leadership', { eyebrow: v })} placeholder="Our Team" />
        <TextField label="Title" value={leadership.title} onChange={(v) => set('leadership', { title: v })} placeholder="Leadership" />
        <ColorField label="Section Background" value={leadership.bgColor} onChange={(v) => set('leadership', { bgColor: v })} />
        <RepeatableList
          label="Member"
          items={leadership.items}
          onChange={(items) => set('leadership', { items })}
          blank={{ name: '', role: '', photo: '' }}
          renderRow={(it, upd) => (
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <TextField label="Name" value={it.name} onChange={(v) => upd({ name: v })} placeholder="Full name" />
                <TextField label="Role" value={it.role} onChange={(v) => upd({ role: v })} placeholder="President" />
              </div>
              <ImageUploader label="Photo" value={it.photo} folder="website-builder/leadership" onChange={(url) => upd({ photo: url })} />
            </div>
          )}
        />
      </FieldGroup>

      {/* Wings */}
      <FieldGroup title="Wings & Initiatives">
        <TextField label="Eyebrow" value={wings.eyebrow} onChange={(v) => set('wings', { eyebrow: v })} placeholder="Portfolios" />
        <TextField label="Title" value={wings.title} onChange={(v) => set('wings', { title: v })} placeholder="Wings & Initiatives" />
        <ColorField label="Section Background" value={wings.bgColor} onChange={(v) => set('wings', { bgColor: v })} />
        <RepeatableList
          label="Wing"
          items={wings.items}
          onChange={(items) => set('wings', { items })}
          blank={{ name: '', desc: '' }}
          renderRow={(it, upd) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <TextField label="Name" value={it.name} onChange={(v) => upd({ name: v })} placeholder="IPB" />
              <TextField label="Description" value={it.desc} onChange={(v) => upd({ desc: v })} placeholder="Idea Production Bureau" />
            </div>
          )}
        />
      </FieldGroup>
    </div>
  )
}
