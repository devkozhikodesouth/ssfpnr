'use client'

import Link from 'next/link'
import { TextField, TextareaField, ToggleField, FieldGroup } from './fields'

/**
 * Navigation tab — links out to the dedicated Path Manage screen (top nav,
 * bottom nav, footer links with drag-reorder), toggles the mobile bottom nav,
 * and edits the footer text/copyright. Edits the `mobile` and `footer` branches.
 */
export default function NavigationTab({ mobile = {}, footer = {}, onChangeMobile, onChangeFooter }) {
  const setMobile = (key, v) => onChangeMobile({ ...mobile, [key]: v })
  const setFooter = (key, v) => onChangeFooter({ ...footer, [key]: v })

  return (
    <div className="space-y-5">
      <section className="bg-gray-900 rounded-xl p-5">
        <h3 className="text-white font-semibold">Navigation links</h3>
        <p className="text-gray-500 text-xs mt-0.5 mb-3">
          Manage the top navigation, mobile bottom nav, and footer link items — including drag-to-reorder —
          on the dedicated screen.
        </p>
        <Link
          href="/app/path-manage"
          className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Open Path Manager →
        </Link>
      </section>

      <section className="bg-gray-900 rounded-xl p-5 space-y-3">
        <h3 className="text-white font-semibold">Mobile bottom navigation</h3>
        <ToggleField
          label="Enable bottom navigation bar"
          hint="Sticky 4-item nav shown on mobile public pages."
          value={mobile.bottomNavEnabled !== false}
          onChange={(v) => setMobile('bottomNavEnabled', v)}
        />
      </section>

      <FieldGroup title="Footer" cols={1} description="Short text and copyright line shown in the site footer.">
        <TextareaField label="Footer text (English)" value={footer.text} onChange={(v) => setFooter('text', v)} rows={2} />
        <TextareaField label="Footer text (Malayalam)" value={footer.textMl} onChange={(v) => setFooter('textMl', v)} rows={2} />
        <TextField label="Copyright line" value={footer.copyright} onChange={(v) => setFooter('copyright', v)} />
      </FieldGroup>
    </div>
  )
}
