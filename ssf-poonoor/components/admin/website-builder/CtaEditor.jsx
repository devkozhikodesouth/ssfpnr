'use client'

import { TextField, ColorField, ToggleField, FieldGroup } from '@/components/admin/site-setup/fields'

/**
 * Reusable CTA-button editor used by every Website Builder section. Edits a
 * `{ enabled, text, url, bgColor, textColor }` object. Pure controlled component.
 *
 * @param {{ value?: object, onChange: (next:object)=>void, title?: string }} props
 */
export default function CtaEditor({ value = {}, onChange, title = 'CTA Button' }) {
  const set = (patch) => onChange({ ...value, ...patch })
  return (
    <FieldGroup title={title} description="An optional call-to-action button for this section.">
      <ToggleField
        label={value.enabled ? 'Button shown' : 'Button hidden'}
        value={value.enabled}
        onChange={(v) => set({ enabled: v })}
      />
      <div className="hidden md:block" />
      <TextField label="Button Text" value={value.text} onChange={(v) => set({ text: v })} placeholder="Read More" />
      <TextField label="Action URL" value={value.url} onChange={(v) => set({ url: v })} placeholder="/about or https://…" />
      <ColorField label="Background Color" value={value.bgColor} onChange={(v) => set({ bgColor: v })} />
      <ColorField label="Text Color" value={value.textColor} onChange={(v) => set({ textColor: v })} />
    </FieldGroup>
  )
}
