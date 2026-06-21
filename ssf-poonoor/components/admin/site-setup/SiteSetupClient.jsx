'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BrandingTab from './BrandingTab'
import ThemeTab from './ThemeTab'
import FontsTab from './FontsTab'
import HomepageTab from './HomepageTab'
import ModulesTab from './ModulesTab'
import NavigationTab from './NavigationTab'
import SeoTab from './SeoTab'
import SocialContactTab from './SocialContactTab'
import PerformanceTab from './PerformanceTab'

const TABS = [
  'Branding',
  'Theme',
  'Fonts',
  'Homepage',
  'Modules',
  'Navigation',
  'SEO',
  'Social & Contact',
  'Performance',
]

const DEVICES = [
  { key: 'mobile', label: 'Mobile', width: 375 },
  { key: 'tablet', label: 'Tablet', width: 768 },
  { key: 'desktop', label: 'Desktop', width: 1280 },
]

const RADIUS_MAP = { sharp: '0px', soft: '0.5rem', pill: '9999px' }

// Mirror the saved theme onto the admin document so the change is visible
// immediately (the CSS variables are global), matching the live preview.
function applyThemeToDocument(theme = {}, layout = {}) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const map = {
    '--color-primary': theme.primaryColor,
    '--color-secondary': theme.secondaryColor,
    '--color-accent': theme.accentColor,
    '--bg-dark': theme.backgroundDark,
    '--bg-light': theme.backgroundLight,
    '--text-primary': theme.textPrimary,
    '--text-secondary': theme.textSecondary,
    '--radius': RADIUS_MAP[layout.radius] || RADIUS_MAP.soft,
  }
  for (const [k, v] of Object.entries(map)) {
    if (v) root.style.setProperty(k, v)
  }
}

/**
 * Site Setup container — left side is the 9-tab editor over a working draft of
 * the SiteConfig; right side is a live preview iframe of the public homepage
 * that reloads (key bump) after each save, with a mobile/tablet/desktop width
 * toggle. Saving PUTs the whole draft to /api/site-config (server deep-merges).
 */
export default function SiteSetupClient({ initialConfig, fonts }) {
  const router = useRouter()
  const [config, setConfig] = useState(initialConfig)
  const [active, setActive] = useState('Branding')
  const [device, setDevice] = useState('desktop')
  const [previewKey, setPreviewKey] = useState(0)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [message, setMessage] = useState(null)

  function setSection(section, nextValue) {
    setConfig((prev) => ({ ...prev, [section]: nextValue }))
    setDirty(true)
    setMessage(null)
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      const json = await res.json()
      if (!res.ok) {
        setMessage({ type: 'error', text: json.error || 'Save failed' })
        return
      }
      // Server returns the merged singleton — adopt it as the new baseline.
      setConfig(JSON.parse(JSON.stringify(json.data)))
      applyThemeToDocument(json.data.theme, json.data.layout)
      setDirty(false)
      setMessage({ type: 'success', text: 'Saved' })
      setPreviewKey((k) => k + 1) // reload preview iframe
      router.refresh() // re-render server components (ThemeInjector etc.)
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  const deviceWidth = DEVICES.find((d) => d.key === device)?.width || 1280

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,520px)] gap-6">
      {/* Editor */}
      <div className="min-w-0">
        <div className="flex flex-wrap gap-1.5 mb-5 border-b border-gray-800 pb-3">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={[
                'px-3 py-1.5 text-sm rounded-lg transition-colors',
                active === tab ? 'bg-emerald-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800',
              ].join(' ')}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="pb-24">
          {active === 'Branding' && <BrandingTab value={config.branding} onChange={(v) => setSection('branding', v)} />}
          {active === 'Theme' && (
            <ThemeTab
              theme={config.theme}
              layout={config.layout}
              fonts={fonts}
              onChangeTheme={(v) => setSection('theme', v)}
              onChangeLayout={(v) => setSection('layout', v)}
            />
          )}
          {active === 'Fonts' && <FontsTab fonts={fonts} />}
          {active === 'Homepage' && <HomepageTab value={config.homepage} onChange={(v) => setSection('homepage', v)} />}
          {active === 'Modules' && <ModulesTab value={config.modules} onChange={(v) => setSection('modules', v)} />}
          {active === 'Navigation' && (
            <NavigationTab
              mobile={config.mobile}
              footer={config.footer}
              onChangeMobile={(v) => setSection('mobile', v)}
              onChangeFooter={(v) => setSection('footer', v)}
            />
          )}
          {active === 'SEO' && <SeoTab value={config.seo} onChange={(v) => setSection('seo', v)} />}
          {active === 'Social & Contact' && (
            <SocialContactTab
              social={config.social}
              contact={config.contact}
              onChangeSocial={(v) => setSection('social', v)}
              onChangeContact={(v) => setSection('contact', v)}
            />
          )}
          {active === 'Performance' && <PerformanceTab value={config.performance} onChange={(v) => setSection('performance', v)} />}
        </div>
      </div>

      {/* Live preview */}
      <div className="xl:sticky xl:top-6 self-start">
        <div className="bg-gray-900 rounded-xl p-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-xs font-medium">Live preview</span>
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
              key={previewKey}
              src="/"
              title="Homepage preview"
              style={{ width: deviceWidth, maxWidth: '100%', height: 640 }}
              className="border-0 bg-white"
            />
          </div>
          <p className="text-gray-600 text-[11px] mt-2 text-center">
            Showing {deviceWidth}px · reloads on save
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
