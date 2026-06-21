'use client'

import { TextField, NumberField, ColorField, SelectField, FieldGroup } from '@/components/admin/site-setup/fields'
import ImageUploader from '@/components/admin/forms/ImageUploader'
import CtaEditor from './CtaEditor'

/**
 * Header block editor (Website Builder → Header). Edits the `header` config
 * branch: colors, logo (image/text + width + url), and a CTA button. Navigation
 * *links* are managed under Navigation (path-manage); this controls presentation.
 *
 * @param {{ value?: object, onChange: (next:object)=>void }} props
 */
export default function HeaderEditor({ value = {}, onChange }) {
  const set = (patch) => onChange({ ...value, ...patch })

  return (
    <div className="space-y-4">
      <FieldGroup title="Header Colors" cols={2}>
        <ColorField label="Background Color" value={value.bgColor} onChange={(v) => set({ bgColor: v })} />
        <ColorField label="Text Color" value={value.textColor} onChange={(v) => set({ textColor: v })} />
        <ColorField label="Active Link Color" value={value.activeColor} onChange={(v) => set({ activeColor: v })} />
        <ColorField label="Active Text Color" value={value.activeTextColor} onChange={(v) => set({ activeTextColor: v })} />
      </FieldGroup>

      <FieldGroup title="Logo" description="Use an uploaded image, or fall back to the site name as text.">
        <SelectField
          label="Logo Type"
          value={value.logoType || 'image'}
          onChange={(v) => set({ logoType: v })}
          options={[
            { value: 'image', label: 'Image' },
            { value: 'text', label: 'Text (site name)' },
          ]}
        />
        <NumberField label="Logo Width (px)" value={value.logoWidth} min={40} max={400} onChange={(v) => set({ logoWidth: v })} />
        <div className="md:col-span-2">
          <ImageUploader label="Logo Image" value={value.logoUrl} folder="website-builder/logo" onChange={(url) => set({ logoUrl: url })} />
        </div>
      </FieldGroup>

      <CtaEditor title="Header CTA Button" value={value.cta} onChange={(cta) => set({ cta })} />

      <p className="text-gray-500 text-xs px-1">
        Navigation links (labels, URLs, order, page picker) are managed under{' '}
        <span className="text-gray-300">Navigation</span> in the sidebar.
      </p>
    </div>
  )
}
