'use client'

import { useState } from 'react'
import { TextField, NumberField, SelectField, ToggleField } from './fields'

// The 7 configurable content modules, in nav order. Kept local to this client
// component (lib/modules.js is server-only as it imports Mongoose models).
const MODULES = [
  { key: 'news', label: 'News' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'video', label: 'Video' },
  { key: 'blogs', label: 'Blogs' },
  { key: 'campaigns', label: 'Campaigns' },
  { key: 'events', label: 'Events' },
  { key: 'downloads', label: 'Downloads' },
]

const SORT_OPTIONS = [
  { value: 'publishedAt-desc', label: 'Newest first' },
  { value: 'publishedAt-asc', label: 'Oldest first' },
  { value: 'title-asc', label: 'Title A–Z' },
  { value: 'title-desc', label: 'Title Z–A' },
  { value: 'viewCount-desc', label: 'Most viewed' },
  { value: 'sortOrder-asc', label: 'Manual order' },
]

const CARD_STYLES = [
  { value: 'detailed', label: 'Detailed' },
  { value: 'compact', label: 'Compact' },
  { value: 'minimal', label: 'Minimal' },
]

/**
 * Modules tab — per-module enable/disable plus behaviour settings for all 7
 * content modules. Edits the `modules` branch. Disabling a module here makes its
 * public route 404 (via lib/module-guard.js, wired in Phase 7).
 */
export default function ModulesTab({ value = {}, onChange }) {
  const [open, setOpen] = useState(MODULES[0].key)

  function patchModule(key, patch) {
    const current = value[key] || {}
    onChange({ ...value, [key]: { ...current, ...patch } })
  }

  return (
    <div className="space-y-3">
      <p className="text-gray-400 text-sm">
        Toggle modules on/off and tune how each lists its content. A disabled module is hidden from the
        homepage and navigation, and its public pages return 404.
      </p>

      {MODULES.map(({ key, label }) => {
        const m = value[key] || {}
        const isOpen = open === key
        return (
          <div key={key} className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-5 py-3">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : key)}
                className="flex items-center gap-2 text-left min-w-0"
              >
                <span className="text-gray-500 text-xs">{isOpen ? '▼' : '▶'}</span>
                <span className="text-white font-medium">{m.label || label}</span>
                <span
                  className={[
                    'text-xs px-2 py-0.5 rounded-full',
                    m.enabled === false ? 'bg-red-950 text-red-300' : 'bg-emerald-950 text-emerald-300',
                  ].join(' ')}
                >
                  {m.enabled === false ? 'Disabled' : 'Enabled'}
                </span>
              </button>
              <div className="w-28 flex-shrink-0">
                <ToggleField
                  label={m.enabled === false ? 'Off' : 'On'}
                  value={m.enabled !== false}
                  onChange={(v) => patchModule(key, { enabled: v })}
                />
              </div>
            </div>

            {isOpen && (
              <div className="px-5 pb-5 space-y-4 border-t border-gray-800 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField label="Label (English)" value={m.label} onChange={(v) => patchModule(key, { label: v })} />
                  <TextField label="Label (Malayalam)" lang="ml" value={m.labelMl} onChange={(v) => patchModule(key, { labelMl: v })} />
                  <NumberField label="Items per page" value={m.perPage} min={1} max={60} onChange={(v) => patchModule(key, { perPage: v })} />
                  <NumberField label="Nav order" value={m.navOrder} min={1} max={20} onChange={(v) => patchModule(key, { navOrder: v })} />
                  <SelectField label="Default sort" value={m.defaultSort} onChange={(v) => patchModule(key, { defaultSort: v })} options={SORT_OPTIONS} />
                  <SelectField label="Card style" value={m.cardStyle || 'detailed'} onChange={(v) => patchModule(key, { cardStyle: v })} options={CARD_STYLES} />
                  <NumberField label="Homepage limit" value={m.homeLimit} min={1} max={24} onChange={(v) => patchModule(key, { homeLimit: v })} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  <ToggleField label="Show on homepage" value={m.showOnHome !== false} onChange={(v) => patchModule(key, { showOnHome: v })} />
                  <ToggleField label="Show category badge" value={m.showCategory !== false} onChange={(v) => patchModule(key, { showCategory: v })} />
                  <ToggleField label="Show author" value={!!m.showAuthor} onChange={(v) => patchModule(key, { showAuthor: v })} />
                  <ToggleField label="Show read time" value={!!m.showReadTime} onChange={(v) => patchModule(key, { showReadTime: v })} />
                  <ToggleField label="Enable sharing" value={m.enableSharing !== false} onChange={(v) => patchModule(key, { enableSharing: v })} />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
