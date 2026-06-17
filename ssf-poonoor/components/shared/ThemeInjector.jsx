import connectDB from '@/lib/db'
import SiteConfig from '@/models/SiteConfig'

// Maps the layout.radius enum to a concrete CSS length for --radius.
const RADIUS_MAP = {
  sharp: '0px',
  soft: '0.5rem',
  pill: '9999px',
}

/**
 * Server component that reads the SiteConfig singleton and injects the theme
 * CSS variables (colors, radius, base font size) into :root — per PLAN §9.5.
 * Tailwind components reference these variables (see tailwind.config.js), so the
 * whole site recolors on save with no redeploy.
 *
 * Rendered in <head> BEFORE FontInjector so that custom uploaded fonts (which
 * override --font-{role}) win over the family names emitted here.
 *
 * Replaces the Phase 1 stub.
 */
export default async function ThemeInjector() {
  let theme = null
  let radius = 'soft'
  try {
    await connectDB()
    const config = await SiteConfig.findOne().select('theme layout').lean()
    theme = config?.theme || null
    radius = config?.layout?.radius || 'soft'
  } catch {
    return null
  }

  if (!theme) return null

  const vars = []
  const push = (name, value) => {
    if (value) vars.push(`  ${name}: ${value};`)
  }

  push('--color-primary', theme.primaryColor)
  push('--color-secondary', theme.secondaryColor)
  push('--color-accent', theme.accentColor)
  push('--bg-dark', theme.backgroundDark)
  push('--bg-light', theme.backgroundLight)
  push('--text-primary', theme.textPrimary)
  push('--text-secondary', theme.textSecondary)
  push('--radius', RADIUS_MAP[radius] || RADIUS_MAP.soft)
  if (theme.fontSize?.base) push('--font-size-base', theme.fontSize.base)

  // Base font-family vars; FontInjector overrides these for custom fonts.
  if (theme.headingFont) push('--font-heading', `'${theme.headingFont}', serif`)
  if (theme.bodyFont) push('--font-body', `'${theme.bodyFont}', sans-serif`)
  if (theme.arabicFont) push('--font-arabic', `'${theme.arabicFont}', serif`)

  if (!vars.length) return null

  const css = `:root {\n${vars.join('\n')}\n}`
  return <style id="ssf-theme-injector" dangerouslySetInnerHTML={{ __html: css }} />
}
