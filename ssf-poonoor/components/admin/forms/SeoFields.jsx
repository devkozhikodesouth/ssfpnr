'use client'

import { inputClass, labelClass } from './field-styles'

/**
 * Edits the embedded `seo` sub-document. value/onChange operate on the seo object.
 * Rendered inside a collapsible <details> accordion to keep forms compact.
 */
export default function SeoFields({ value = {}, onChange }) {
  const set = (patch) => onChange({ ...value, ...patch })

  return (
    <details className="bg-gray-800/50 border border-gray-700 rounded-lg">
      <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-gray-200 select-none">
        SEO &amp; Metadata
      </summary>
      <div className="p-4 pt-0 space-y-4">
        <div>
          <label className={labelClass}>Meta Title</label>
          <input
            type="text"
            value={value.metaTitle || ''}
            onChange={(e) => set({ metaTitle: e.target.value })}
            maxLength={70}
            placeholder="Defaults to the item title"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Meta Description</label>
          <textarea
            value={value.metaDescription || ''}
            onChange={(e) => set({ metaDescription: e.target.value })}
            maxLength={160}
            rows={2}
            placeholder="Up to 160 characters"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Meta Keywords (comma-separated)</label>
          <input
            type="text"
            value={(value.metaKeywords || []).join(', ')}
            onChange={(e) =>
              set({
                metaKeywords: e.target.value
                  .split(',')
                  .map((k) => k.trim())
                  .filter(Boolean),
              })
            }
            placeholder="ssf, poonoor, sahityotsav"
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>OG Image URL</label>
            <input
              type="url"
              value={value.ogImage || ''}
              onChange={(e) => set({ ogImage: e.target.value })}
              placeholder="Defaults to the item image"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Canonical URL</label>
            <input
              type="url"
              value={value.canonicalUrl || ''}
              onChange={(e) => set({ canonicalUrl: e.target.value })}
              placeholder="https://…"
              className={inputClass}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!value.noIndex}
            onChange={(e) => set({ noIndex: e.target.checked })}
            className="w-4 h-4 accent-emerald-600"
          />
          <span className="text-sm text-gray-300">No index (hide from search engines)</span>
        </label>
      </div>
    </details>
  )
}
