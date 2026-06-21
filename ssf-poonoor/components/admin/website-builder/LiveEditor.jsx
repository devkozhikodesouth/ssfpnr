'use client'

import { TextField, FieldGroup } from '@/components/admin/site-setup/fields'
import ContentSectionEditor from './ContentSectionEditor'

/**
 * Live block editor (Website Builder → Live). Standard content section plus the
 * livestream embed URL (YouTube / Facebook / any iframe-able stream).
 *
 * @param {{ value?: object, onChange: (next:object)=>void }} props
 */
export default function LiveEditor({ value = {}, onChange }) {
  const set = (patch) => onChange({ ...value, ...patch })

  return (
    <ContentSectionEditor value={value} onChange={onChange} title="Live Content" description="Heading shown above the livestream embed.">
      <FieldGroup title="Live Stream" description="Paste a YouTube / Facebook live URL or any embeddable stream link.">
        <div className="md:col-span-2">
          <TextField label="Embed URL" value={value.embedUrl} onChange={(v) => set({ embedUrl: v })} placeholder="https://www.youtube.com/watch?v=…" />
        </div>
      </FieldGroup>
    </ContentSectionEditor>
  )
}
