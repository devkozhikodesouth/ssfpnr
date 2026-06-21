'use client'

import { TextField, TextareaField, ColorField, SelectField, FieldGroup } from '@/components/admin/site-setup/fields'
import ImageUploader from '@/components/admin/forms/ImageUploader'
import CtaEditor from './CtaEditor'
import TypographyField from './TypographyField'

/**
 * Hero block editor (Website Builder → Hero). Edits the homepage hero section's
 * Mixed `config`: eyebrow, title, subtitle, description, background media
 * (image/video), background color, and a CTA button.
 *
 * @param {{ value?: object, onChange: (next:object)=>void }} props
 */
export default function HeroEditor({ value = {}, onChange }) {
  const set = (patch) => onChange({ ...value, ...patch })
  const mediaKind = value.video ? 'video' : 'image'
  const ty = value.typography || {}
  const setType = (key, t) => set({ typography: { ...ty, [key]: t } })

  return (
    <div className="space-y-4">
      <FieldGroup title="Hero Content" description="Headline area at the top of the homepage.">
        <TextField label="Eyebrow" value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} placeholder="Welcome to" />
        <TextField label="Title" value={value.title} onChange={(v) => set({ title: v })} placeholder="SSF Poonoor" />
        <TextField label="Subtitle" value={value.subtitle} onChange={(v) => set({ subtitle: v })} placeholder="Sunni Student Federation" />
        <ColorField label="Background Color" value={value.bgColor} onChange={(v) => set({ bgColor: v })} />
        <div className="md:col-span-2">
          <TextareaField label="Description" value={value.description} onChange={(v) => set({ description: v })} placeholder="A short introduction…" />
        </div>
        <TypographyField label="Title typography" value={ty.title} onChange={(t) => setType('title', t)} />
        <TypographyField label="Eyebrow typography" value={ty.eyebrow} onChange={(t) => setType('eyebrow', t)} />
        <TypographyField label="Subtitle typography" value={ty.subtitle} onChange={(t) => setType('subtitle', t)} />
        <TypographyField label="Description typography" value={ty.description} onChange={(t) => setType('description', t)} />
      </FieldGroup>

      <FieldGroup title="Background Media" description="Use a background image, or a video URL (MP4 / YouTube) for a moving backdrop.">
        <SelectField
          label="Media Type"
          value={mediaKind}
          onChange={(kind) => (kind === 'video' ? set({ image: '' }) : set({ video: '' }))}
          options={[
            { value: 'image', label: 'Image' },
            { value: 'video', label: 'Video' },
          ]}
        />
        <div className="md:col-span-2">
          {mediaKind === 'video' ? (
            <TextField label="Video URL" value={value.video} onChange={(v) => set({ video: v })} placeholder="https://…/clip.mp4" />
          ) : (
            <ImageUploader label="Background Image" value={value.image} folder="website-builder/hero" onChange={(url) => set({ image: url })} />
          )}
        </div>
      </FieldGroup>

      <CtaEditor value={value.cta} onChange={(cta) => set({ cta })} />
    </div>
  )
}
