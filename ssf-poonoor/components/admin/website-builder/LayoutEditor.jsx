'use client'

import { TextField, ToggleField, FieldGroup } from '@/components/admin/site-setup/fields'

// Shown when no pages are configured yet (e.g. a SiteConfig created before this
// feature) so the admin starts from the standard public pages instead of blank.
const DEFAULT_PAGES = [
  { label: 'Home', path: '/', hideHeader: false, hideFooter: false },
  { label: 'About', path: '/about', hideHeader: false, hideFooter: false },
  { label: 'News', path: '/news', hideHeader: false, hideFooter: false },
  { label: 'Gallery', path: '/gallery', hideHeader: false, hideFooter: false },
  { label: 'Videos', path: '/video', hideHeader: false, hideFooter: false },
  { label: 'Events', path: '/events', hideHeader: false, hideFooter: false },
  { label: 'Blogs', path: '/blogs', hideHeader: false, hideFooter: false },
  { label: 'Campaigns', path: '/campaigns', hideHeader: false, hideFooter: false },
  { label: 'Downloads', path: '/downloads', hideHeader: false, hideFooter: false },
]

/**
 * Layout editor (Website Builder → Layout). Controls per-page chrome: toggle the
 * header and/or footer off for individual pages so they can sit edge-to-edge.
 * Edits `SiteConfig.chrome.pages` — an array of { label, path, hideHeader,
 * hideFooter }. Admins can add custom paths (e.g. a campaign landing route).
 *
 * @param {{ value?: object, onChange: (next:object)=>void }} props
 */
export default function LayoutEditor({ value = {}, onChange }) {
  // Fall back to the standard pages when none are stored yet; the first edit
  // commits the full list to the config.
  const pages = Array.isArray(value.pages) && value.pages.length ? value.pages : DEFAULT_PAGES
  const setPages = (next) => onChange({ ...value, pages: next })

  const update = (i, patch) => setPages(pages.map((p, idx) => (idx === i ? { ...p, ...patch } : p)))
  const remove = (i) => setPages(pages.filter((_, idx) => idx !== i))
  const add = () => setPages([...pages, { label: '', path: '', hideHeader: false, hideFooter: false }])

  return (
    <div className="space-y-4">
      <FieldGroup
        title="Per-page Header & Footer"
        description="Turn the header or footer off for specific pages. '/' matches the home page exactly; any other path also covers its sub-pages (e.g. /news covers /news/article)."
      >
        <div className="md:col-span-2 space-y-3">
          {pages.map((p, i) => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-3 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <TextField label="Label" value={p.label} onChange={(v) => update(i, { label: v })} placeholder="About" />
                <TextField label="Path" value={p.path} onChange={(v) => update(i, { path: v })} placeholder="/about" />
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <div className="w-44">
                  <ToggleField label={p.hideHeader ? 'Header hidden' : 'Header shown'} value={p.hideHeader} onChange={(v) => update(i, { hideHeader: v })} />
                </div>
                <div className="w-44">
                  <ToggleField label={p.hideFooter ? 'Footer hidden' : 'Footer shown'} value={p.hideFooter} onChange={(v) => update(i, { hideFooter: v })} />
                </div>
                <button type="button" onClick={() => remove(i)} className="ml-auto px-3 py-1 text-xs bg-red-950 hover:bg-red-900 text-red-300 rounded">
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={add} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg">
            + Add Page
          </button>
        </div>
      </FieldGroup>

      <p className="text-gray-500 text-xs px-1">
        Tip: hide the header and footer on an immersive landing or live page so the content fills the screen.
      </p>
    </div>
  )
}
