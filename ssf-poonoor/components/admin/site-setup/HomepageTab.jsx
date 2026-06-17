'use client'

import SortableList from '@/components/admin/SortableList'
import { ToggleField, NumberField } from './fields'

// Friendly labels for the known homepage section types.
const SECTION_LABELS = {
  hero: 'Hero Banner',
  about: 'About Section',
  campaigns: 'Active Campaigns',
  news: 'Latest News',
  videos: 'Latest Videos',
  gallery: 'Gallery Moments',
  blogs: 'Latest Blogs',
  events: 'Upcoming Events',
  newsletter: 'Newsletter Signup',
}

// Sections whose `config.limit` (how many items to show) is meaningful.
const HAS_LIMIT = new Set(['campaigns', 'news', 'videos', 'gallery', 'blogs', 'events'])

/**
 * Homepage tab — drag-to-reorder the homepage sections and toggle each on/off,
 * with a per-section item limit where relevant. Edits the `homepage` branch.
 * The `order` field is rewritten from array position on every change.
 */
export default function HomepageTab({ value = {}, onChange }) {
  const sections = Array.isArray(value.sections) ? value.sections : []

  function commit(nextSections) {
    onChange({ ...value, sections: nextSections.map((s, i) => ({ ...s, order: i + 1 })) })
  }

  function handleReorder(newIds) {
    const byType = new Map(sections.map((s) => [s.type, s]))
    commit(newIds.map((type) => byType.get(type)))
  }

  function patchSection(type, patch) {
    commit(sections.map((s) => (s.type === type ? { ...s, ...patch } : s)))
  }

  const ids = sections.map((s) => s.type)

  return (
    <div className="space-y-4">
      <p className="text-gray-400 text-sm">
        Drag sections to reorder how they appear on the homepage. Toggle a section off to hide it.
      </p>

      <SortableList
        ids={ids}
        onReorder={handleReorder}
        renderRow={(type) => {
          const section = sections.find((s) => s.type === type)
          if (!section) return null
          return (
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-gray-500 text-xs font-mono w-6 text-right">{section.order}</span>
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{SECTION_LABELS[type] || type}</p>
                    <p className="text-gray-500 text-xs">{type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {HAS_LIMIT.has(type) && (
                    <div className="w-24">
                      <NumberField
                        label="Limit"
                        value={section.config?.limit}
                        min={1}
                        max={24}
                        onChange={(v) => patchSection(type, { config: { ...(section.config || {}), limit: v } })}
                      />
                    </div>
                  )}
                  <div className="w-32">
                    <ToggleField
                      label={section.enabled ? 'Enabled' : 'Disabled'}
                      value={section.enabled}
                      onChange={(v) => patchSection(type, { enabled: v })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        }}
      />
    </div>
  )
}
