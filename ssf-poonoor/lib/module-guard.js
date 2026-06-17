import { notFound } from 'next/navigation'
import connectDB from '@/lib/db'
import SiteConfig from '@/models/SiteConfig'
import { MODULE_KEYS } from '@/lib/modules'

/**
 * Server-side guard for public module routes. Reads
 * SiteConfig.modules[moduleName].enabled and calls Next's notFound() (→ 404)
 * when the module is disabled. Phase 7 calls this at the top of each public
 * list/detail route so toggling a module off in Site Setup → Modules makes its
 * pages 404 with no further wiring.
 *
 * Defaults to enabled when the config or the per-module entry is missing, so a
 * fresh install never hides content unexpectedly.
 *
 * @param {string} moduleName one of MODULE_KEYS (news, gallery, video, blogs,
 *   campaigns, events, downloads)
 */
export async function ensureModuleEnabled(moduleName) {
  if (!MODULE_KEYS.includes(moduleName)) {
    // Unknown module name is a programming error, not a 404 condition.
    throw new Error(`ensureModuleEnabled: unknown module "${moduleName}"`)
  }

  await connectDB()
  const config = await SiteConfig.findOne().select('modules').lean()

  const entry = config?.modules?.[moduleName]
  // Treat a missing entry as enabled; only an explicit `false` hides the route.
  if (entry && entry.enabled === false) {
    notFound()
  }
}
