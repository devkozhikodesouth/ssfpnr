import connectDB from '@/lib/db'
import SiteConfig from '@/models/SiteConfig'
import Font from '@/models/Font'
import { googleFontByName, googleFontsHref } from '@/lib/google-fonts'

// CSS generic fallback per catalog category.
const CAT_FALLBACK = {
  sans: 'sans-serif',
  serif: 'serif',
  display: 'sans-serif',
  handwriting: 'cursive',
  malayalam: 'sans-serif',
}
const ROLE_THEME_KEY = { heading: 'headingFont', body: 'bodyFont', arabic: 'arabicFont' }

/**
 * Loads Google-hosted families chosen in Site Setup → Theme so they apply on the
 * public site without uploading a font file. Complements the upload-based
 * FontInjector: a role whose theme value matches an uploaded font is left to
 * that injector; a role pointing at a Google catalog family is wired here.
 * Rendered in <head> (app/layout.jsx) after FontInjector.
 */
export default async function GoogleFontInjector() {
  try {
    await connectDB()
    const [config, uploaded] = await Promise.all([
      SiteConfig.findOne().lean(),
      Font.find({ isActive: true }).select('name slug').lean(),
    ])

    const theme = config?.theme || {}
    const uploadedRefs = new Set()
    for (const f of uploaded) {
      if (f.name) uploadedRefs.add(f.name)
      if (f.slug) uploadedRefs.add(f.slug)
    }

    const names = []
    const vars = []
    for (const role of ['heading', 'body', 'arabic']) {
      const ref = theme[ROLE_THEME_KEY[role]]
      if (!ref || uploadedRefs.has(ref)) continue // handled by an uploaded font
      const gf = googleFontByName(ref)
      if (!gf) continue
      names.push(gf.name)
      vars.push(`  --font-${role}: '${gf.name}', ${CAT_FALLBACK[gf.cat] || 'sans-serif'};`)
    }

    const href = googleFontsHref(names)
    if (!href) return null

    const css = vars.length ? `:root {\n${vars.join('\n')}\n}` : ''
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href={href} />
        {css ? <style id="ssf-google-font-injector" dangerouslySetInnerHTML={{ __html: css }} /> : null}
      </>
    )
  } catch {
    return null
  }
}
