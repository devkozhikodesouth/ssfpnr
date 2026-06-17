'use client'

import { NumberField, ToggleField, FieldGroup } from './fields'

/**
 * Performance tab — ISR caching, revalidate interval, image quality and lazy
 * loading. Edits the `performance` branch.
 */
export default function PerformanceTab({ value = {}, onChange }) {
  const set = (key, v) => onChange({ ...value, [key]: v })

  return (
    <div className="space-y-5">
      <FieldGroup title="Caching (ISR)" cols={2}>
        <div className="md:col-span-2">
          <ToggleField
            label="Enable Incremental Static Regeneration"
            hint="Cache public pages and rebuild them in the background."
            value={value.enableISR !== false}
            onChange={(v) => set('enableISR', v)}
          />
        </div>
        <NumberField label="Revalidate interval (seconds)" value={value.revalidateSeconds} min={0} max={86400} onChange={(v) => set('revalidateSeconds', v)} />
      </FieldGroup>

      <FieldGroup title="Images" cols={2}>
        <NumberField label="Image quality (1–100)" value={value.imageQuality} min={1} max={100} onChange={(v) => set('imageQuality', v)} />
        <div className="flex items-end pb-1">
          <ToggleField label="Lazy-load images" value={value.lazyLoadImages !== false} onChange={(v) => set('lazyLoadImages', v)} />
        </div>
      </FieldGroup>
    </div>
  )
}
