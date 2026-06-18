import { ImageResponse } from 'next/og'

/**
 * Dynamic Open Graph image (PLAN §13.2). Renders a 1200×630 PNG from query
 * params so any page without a custom OG image still gets a branded share card
 * (lib/seo `resolveOgImage` falls back to this URL).
 *
 *   /api/seo/og-image?title=...&subtitle=...&theme=dark|light
 *
 * Uses Next's built-in @vercel/og (next/og) on the Edge runtime — no DB access.
 */
export const runtime = 'edge'

const THEMES = {
  dark: { bg: '#141414', fg: '#ffffff', muted: '#cbd5e1', accent: '#c9a84c', primary: '#1a6b47' },
  light: { bg: '#ffffff', fg: '#141414', muted: '#475569', accent: '#c9a84c', primary: '#1a6b47' },
}

export function GET(request) {
  const { searchParams } = new URL(request.url)
  const title = (searchParams.get('title') || 'SSF Poonoor Division').slice(0, 120)
  const subtitle = (searchParams.get('subtitle') || 'SSF Poonoor').slice(0, 80)
  const theme = THEMES[searchParams.get('theme')] || THEMES.dark

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: theme.bg,
          padding: '70px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: theme.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '30px',
              fontWeight: 800,
            }}
          >
            S
          </div>
          <span style={{ color: theme.accent, fontSize: '26px', fontWeight: 700, letterSpacing: '2px' }}>
            {subtitle.toUpperCase()}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              color: theme.fg,
              fontSize: title.length > 60 ? '56px' : '72px',
              fontWeight: 800,
              lineHeight: 1.1,
              display: 'flex',
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: theme.muted, fontSize: '24px' }}>Sunni Student Federation · Poonoor Division</span>
          <div style={{ width: '180px', height: '8px', borderRadius: '4px', background: theme.accent }} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800' },
    }
  )
}
