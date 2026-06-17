const Font = require('../models/Font')
const SiteConfig = require('../models/SiteConfig')

const ROLE_KEYS = ['heading', 'body', 'arabic']
const ROLE_TO_THEME_KEY = { heading: 'headingFont', body: 'bodyFont', arabic: 'arabicFont' }
const DEFAULT_FONT = 'Inter'

/**
 * Apply a font's role assignment (heading/body/arabic), keeping each role
 * exclusive to one font and mirroring the choice into SiteConfig.theme so the
 * public FontInjector picks it up. Saves the font document.
 *
 * @param {import('mongoose').Document} font  loaded Font document
 * @param {string[]} finalAssignedTo  the desired roles for this font
 */
async function syncFontAssignment(font, finalAssignedTo) {
  const roles = ROLE_KEYS.filter((r) => finalAssignedTo.includes(r))
  const prevRoles = Array.isArray(font.assignedTo) ? [...font.assignedTo] : []

  // A role can belong to only one font — strip it from any other font holding it.
  if (roles.length) {
    await Font.updateMany(
      { _id: { $ne: font._id }, assignedTo: { $in: roles } },
      { $pull: { assignedTo: { $in: roles } } }
    )
  }

  font.assignedTo = roles
  await font.save()

  const config = await SiteConfig.findOne()
  if (!config) return
  let changed = false
  for (const role of ROLE_KEYS) {
    const key = ROLE_TO_THEME_KEY[role]
    if (roles.includes(role)) {
      config.theme[key] = font.slug
      changed = true
    } else if (prevRoles.includes(role) && config.theme[key] === font.slug) {
      // This font previously owned the role and config still points at it.
      config.theme[key] = DEFAULT_FONT
      changed = true
    }
  }
  if (changed) await config.save()
}

/**
 * Detach a font from every role it currently owns, resetting any SiteConfig
 * theme reference back to the default. Used before deleting a font.
 * @param {import('mongoose').Document} font
 */
async function releaseFontFromConfig(font) {
  const config = await SiteConfig.findOne()
  if (!config) return
  let changed = false
  for (const role of ROLE_KEYS) {
    const key = ROLE_TO_THEME_KEY[role]
    if (config.theme[key] === font.slug) {
      config.theme[key] = DEFAULT_FONT
      changed = true
    }
  }
  if (changed) await config.save()
}

module.exports = { syncFontAssignment, releaseFontFromConfig, ROLE_KEYS, DEFAULT_FONT }
