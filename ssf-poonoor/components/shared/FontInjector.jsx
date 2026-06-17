import connectDB from '@/lib/db'
import SiteConfig from '@/models/SiteConfig'
import Font from '@/models/Font'
import { buildFontFace } from '@/lib/font-face'

// Generic fallbacks per site role, matching globals.css.
const ROLE_FALLBACK = {
  heading: 'serif',
  body: 'sans-serif',
  arabic: 'serif',
}
const ROLE_THEME_KEY = {
  heading: 'headingFont',
  body: 'bodyFont',
  arabic: 'arabicFont',
}

/**
 * Server component that reads the active fonts referenced by SiteConfig.theme,
 * injects their @font-face declarations, and overrides the --font-{role} CSS
 * variables. Rendered in the document <head> (app/layout.jsx). Replaces the
 * Phase 1 FontInjector stub.
 */
export default async function FontInjector() {
  let css = ''
  try {
    await connectDB()
    const [config, fonts] = await Promise.all([
      SiteConfig.findOne().lean(),
      Font.find({ isActive: true }).lean(),
    ])

    const theme = config?.theme || {}
    const faces = []
    const vars = []
    const emitted = new Set()

    for (const role of ['heading', 'body', 'arabic']) {
      const ref = theme[ROLE_THEME_KEY[role]]
      if (!ref) continue
      const font = fonts.find(
        (f) => f.slug === ref || String(f._id) === String(ref) || f.name === ref
      )
      if (!font) continue

      vars.push(`  --font-${role}: '${font.name}', ${ROLE_FALLBACK[role]};`)
      const id = String(font._id)
      if (!emitted.has(id)) {
        const face = font.fontFace || buildFontFace(font)
        if (face) faces.push(face)
        emitted.add(id)
      }
    }

    if (faces.length || vars.length) {
      css = [faces.join('\n'), vars.length ? `:root {\n${vars.join('\n')}\n}` : ''].join('\n').trim()
    }
  } catch {
    return null
  }

  if (!css) return null
  return <style id="ssf-font-injector" dangerouslySetInnerHTML={{ __html: css }} />
}
