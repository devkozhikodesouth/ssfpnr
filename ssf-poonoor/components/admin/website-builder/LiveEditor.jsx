'use client'

import { TextField, ToggleField, FieldGroup } from '@/components/admin/site-setup/fields'
import ContentSectionEditor from './ContentSectionEditor'

/**
 * Live block editor (Website Builder → Live). Standard content section plus a
 * repeatable list of live programs — each with a title, embed URL and an
 * active toggle — so multiple simultaneous streams can be shown and individual
 * ones switched off without deleting them.
 *
 * @param {{ value?: object, onChange: (next:object)=>void }} props
 */
export default function LiveEditor({ value = {}, onChange }) {
  // Migrate a legacy single embedUrl into the items list on first edit.
  const items = Array.isArray(value.items)
    ? value.items
    : value.embedUrl
      ? [{ title: '', embedUrl: value.embedUrl, active: true }]
      : []

  const setItems = (next) => onChange({ ...value, items: next, embedUrl: undefined })
  const update = (i, patch) => setItems(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)))
  const remove = (i) => setItems(items.filter((_, idx) => idx !== i))
  const add = () => setItems([...items, { title: '', embedUrl: '', active: true }])
  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    setItems(next)
  }

  return (
    <ContentSectionEditor value={value} onChange={onChange} title="Live Content" description="Heading shown above the livestream(s).">
      <FieldGroup title="Live Programs" description="Add one or more streams (YouTube / Facebook live / any embeddable URL). Toggle a program off to hide it without deleting.">
        <div className="md:col-span-2 space-y-3">
          {items.length === 0 && <p className="text-gray-500 text-sm">No live programs yet — add one below.</p>}
          {items.map((it, i) => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs font-medium">Program {i + 1}</span>
                <div className="flex gap-1">
                  <button type="button" onClick={() => move(i, -1)} className="px-2 py-0.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded">↑</button>
                  <button type="button" onClick={() => move(i, 1)} className="px-2 py-0.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded">↓</button>
                  <button type="button" onClick={() => remove(i)} className="px-2 py-0.5 text-xs bg-red-950 hover:bg-red-900 text-red-300 rounded">✕</button>
                </div>
              </div>
              <TextField label="Title" value={it.title} onChange={(v) => update(i, { title: v })} placeholder="Main Stage" />
              <TextField label="Embed URL" value={it.embedUrl} onChange={(v) => update(i, { embedUrl: v })} placeholder="https://www.youtube.com/watch?v=…" />
              <ToggleField label={it.active === false ? 'Hidden' : 'Live (shown)'} value={it.active !== false} onChange={(v) => update(i, { active: v })} />
            </div>
          ))}
          <button type="button" onClick={add} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg">
            + Add Live Program
          </button>
        </div>
      </FieldGroup>
    </ContentSectionEditor>
  )
}
