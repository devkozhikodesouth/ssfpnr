'use client'

import { TextField, TextareaField, ColorField, FieldGroup } from '@/components/admin/site-setup/fields'
import CtaEditor from './CtaEditor'
import TypographyField from './TypographyField'

/**
 * Shared content-block editor for the homepage sections that follow the standard
 * pattern: Eyebrow / Title / Subtitle / Description + background color + CTA.
 * Used by the Gallery, Live and About editors (each adding its own extra fields
 * via `children`, rendered between the content group and the CTA editor).
 *
 * @param {{ value?: object, onChange: (next:object)=>void, title?: string,
 *   description?: string, children?: React.ReactNode }} props
 */
export default function ContentSectionEditor({ value = {}, onChange, title = 'Section Content', description, children }) {
  const set = (patch) => onChange({ ...value, ...patch })
  const ty = value.typography || {}
  const setType = (key, t) => set({ typography: { ...ty, [key]: t } })

  return (
    <div className="space-y-4">
      <FieldGroup title={title} description={description}>
        <TextField label="Eyebrow" value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} placeholder="Section label" />
        <TextField label="Title" value={value.title} onChange={(v) => set({ title: v })} placeholder="Section title" />
        <TextField label="Subtitle" value={value.subtitle} onChange={(v) => set({ subtitle: v })} placeholder="Optional subtitle" />
        <ColorField label="Background Color" value={value.bgColor} onChange={(v) => set({ bgColor: v })} />
        <div className="md:col-span-2">
          <TextareaField label="Description" value={value.description} onChange={(v) => set({ description: v })} placeholder="Supporting copy for this section…" />
        </div>
        <TypographyField label="Title typography" value={ty.title} onChange={(t) => setType('title', t)} />
        <TypographyField label="Body typography" value={ty.body} onChange={(t) => setType('body', t)} />
      </FieldGroup>

      {children}

      <CtaEditor value={value.cta} onChange={(cta) => set({ cta })} />
    </div>
  )
}
