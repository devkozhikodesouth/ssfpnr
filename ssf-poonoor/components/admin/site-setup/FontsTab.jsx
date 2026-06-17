'use client'

import FontsManager from '@/components/admin/fonts/FontsManager'

/**
 * Fonts tab — reuses the Phase 5 FontsManager (which itself reuses FontUploader)
 * with no duplication. Font activation/assignment writes directly to SiteConfig
 * .theme server-side (see lib/font-assignment.js), so this tab manages its own
 * state independently of the Site Setup draft.
 */
export default function FontsTab({ fonts = [] }) {
  return (
    <div className="space-y-3">
      <p className="text-gray-400 text-sm">
        Upload custom fonts and assign them to the heading, body, or Arabic/Malayalam roles. Assignments
        save immediately and are reflected in the live preview after it reloads.
      </p>
      <FontsManager fonts={fonts} />
    </div>
  )
}
