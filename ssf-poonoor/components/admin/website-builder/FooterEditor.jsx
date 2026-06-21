'use client'

import { TextareaField, TextField, ColorField, FieldGroup } from '@/components/admin/site-setup/fields'
import CtaEditor from './CtaEditor'

/**
 * Footer block editor (Website Builder → Footer). Edits the `footer` config
 * branch: brand text, copyright, background color and a CTA button. Quick links
 * come from Navigation (footer paths); social links and contact info are managed
 * under Site Setup → Social & Contact.
 *
 * @param {{ value?: object, onChange: (next:object)=>void }} props
 */
export default function FooterEditor({ value = {}, onChange }) {
  const set = (patch) => onChange({ ...value, ...patch })

  return (
    <div className="space-y-4">
      <FieldGroup title="Footer Content">
        <ColorField label="Background Color" value={value.bgColor} onChange={(v) => set({ bgColor: v })} />
        <TextField label="Copyright" value={value.copyright} onChange={(v) => set({ copyright: v })} placeholder="© SSF Poonoor Division" />
        <div className="md:col-span-2">
          <TextareaField label="Brand Text" value={value.text} onChange={(v) => set({ text: v })} placeholder="Short description shown under the footer logo…" />
        </div>
      </FieldGroup>

      <CtaEditor title="Footer CTA Button" value={value.cta} onChange={(cta) => set({ cta })} />

      <p className="text-gray-500 text-xs px-1">
        Quick links come from <span className="text-gray-300">Navigation</span> (footer paths); social links and
        contact info are under <span className="text-gray-300">Site Setup → Social &amp; Contact</span>.
      </p>
    </div>
  )
}
