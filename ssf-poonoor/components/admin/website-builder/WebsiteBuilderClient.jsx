'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import HeaderEditor from './HeaderEditor'
import HeroEditor from './HeroEditor'
import LiveEditor from './LiveEditor'
import GallerySectionEditor from './GallerySectionEditor'
import AboutEditor from './AboutEditor'
import FooterEditor from './FooterEditor'

// Builder sections in editing order. `kind` decides where the data lives:
//  - 'branch'  → a top-level SiteConfig branch (header / footer)
//  - 'section' → an entry in homepage.sections matched by `type`
const SECTIONS = [
  { key: 'header', label: 'Header', kind: 'branch', branch: 'header', Editor: HeaderEditor },
  { key: 'hero', label: 'Hero', kind: 'section', type: 'hero', Editor: HeroEditor },
  { key: 'live', label: 'Live', kind: 'section', type: 'live', Editor: LiveEditor },
  { key: 'gallery', label: 'Gallery', kind: 'section', type: 'gallery', Editor: GallerySectionEditor },
  { key: 'about', label: 'About', kind: 'section', type: 'about', Editor: AboutEditor },
  { key: 'footer', label: 'Footer', kind: 'branch', branch: 'footer', Editor: FooterEditor },
]

const DEVICES = [
  { key: 'mobile', label: 'Mobile', width: 375 },
  { key: 'tablet', label: 'Tablet', width: 768 },
  { key: 'desktop', label: 'Desktop', width: 1280 },
]

// Pages the preview can show, so the admin can check every screen's alignment.
const PREVIEW_PAGES = [
  { key: 'home', label: 'Home', path: '/' },
  { key: 'about', label: 'About', path: '/about' },
  { key: 'gallery', label: 'Gallery', path: '/gallery' },
  { key: 'video', label: 'Videos', path: '/video' },
  { key: 'news', label: 'News', path: '/news' },
  { key: 'events', label: 'Events', path: '/events' },
]

/**
 * Website Builder — left column edits one section at a time (Header, Hero, Live,
 * Gallery, About, Footer); right column is a live preview iframe of the public
 * site with device (mobile/tablet/desktop) and page switchers so every screen
 * can be checked. Saving PUTs the whole draft to /api/site-config (deep-merge)
 * and reloads the preview.
 */
export default function WebsiteBuilderClient({ initialConfig }) {
  const router = useRouter()
  const [config, setConfig] = useState(initialConfig)
  const [active, setActive] = useState('header')
  const [device, setDevice] = useState('desktop')
  const [page, setPage] = useState('home')
  const [previewKey, setPreviewKey] = useState(0)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [message, setMessage] = useState(null)

  const current = SECTIONS.find((s) => s.key === active)

  // Resolve the value object for the active section's editor.
  function getValue(section) {
    if (section.kind === 'branch') return config[section.branch] || {}
    const sections = config.homepage?.sections || []
    const found = sections.find((s) => s.type === section.type)
    return found?.config || {}
  }

  // Apply an editor change back into the draft (branch or homepage.section.config).
  function setValue(section, nextValue) {
    setDirty(true)
    setMessage(null)
    if (section.kind === 'branch') {
      setConfig((prev) => ({ ...prev, [section.branch]: nextValue }))
      return
    }
    setConfig((prev) => {
      const sections = Array.isArray(prev.homepage?.sections) ? [...prev.homepage.sections] : []
      const idx = sections.findIndex((s) => s.type === section.type)
      if (idx === -1) {
        const order = sections.length + 1
        sections.push({ type: section.type, enabled: true, order, config: nextValue })
      } else {
        sections[idx] = { ...sections[idx], config: nextValue }
      }
      return { ...prev, homepage: { ...prev.homepage, sections } }
    })
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ header: config.header, footer: config.footer, homepage: config.homepage }),
      })
      const json = await res.json()
      if (!res.ok) {
        setMessage({ type: 'error', text: json.error || 'Save failed' })
        return
      }
      setConfig(JSON.parse(JSON.stringify(json.data)))
      setDirty(false)
      setMessage({ type: 'success', text: 'Saved' })
      setPreviewKey((k) => k + 1)
      router.refresh()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  const deviceWidth = DEVICES.find((d) => d.key === device)?.width || 1280
  const previewPath = PREVIEW_PAGES.find((p) => p.key === page)?.path || '/'
  const Editor = current?.Editor

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,560px)] gap-6">
      {/* Editor */}
      <div className="min-w-0">
        <div className="flex flex-wrap gap-1.5 mb-5 border-b border-gray-800 pb-3">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={[
                'px-3 py-1.5 text-sm rounded-lg transition-colors',
                active === s.key ? 'bg-emerald-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800',
              ].join(' ')}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="pb-24">
          {Editor && current && (
            <Editor value={getValue(current)} onChange={(v) => setValue(current, v)} />
          )}
        </div>
      </div>

      {/* Live preview */}
      <div className="xl:sticky xl:top-6 self-start">
        <div className="bg-gray-900 rounded-xl p-3">
          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
            <div className="flex gap-1 flex-wrap">
              {PREVIEW_PAGES.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPage(p.key)}
                  className={[
                    'px-2 py-1 text-xs rounded transition-colors',
                    page === p.key ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white',
                  ].join(' ')}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {DEVICES.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setDevice(d.key)}
                  className={[
                    'px-2 py-1 text-xs rounded transition-colors',
                    device === d.key ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white',
                  ].join(' ')}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-gray-950 rounded-lg overflow-hidden flex justify-center">
            <iframe
              key={`${previewKey}-${previewPath}`}
              src={previewPath}
              title="Website preview"
              style={{ width: deviceWidth, maxWidth: '100%', height: 680 }}
              className="border-0 bg-white"
            />
          </div>
          <p className="text-gray-600 text-[11px] mt-2 text-center">
            {previewPath} · {deviceWidth}px · reloads on save
          </p>
        </div>
      </div>

      {/* Save bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur border-t border-gray-800 px-6 py-3 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-end gap-4">
          {message && (
            <span className={message.type === 'error' ? 'text-red-400 text-sm' : 'text-emerald-400 text-sm'}>
              {message.text}
            </span>
          )}
          {dirty && !message && <span className="text-gray-500 text-sm">Unsaved changes</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
