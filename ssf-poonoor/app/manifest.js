// PWA web app manifest (PLAN §14.4). Implemented as Next's app/manifest.js
// metadata route (emitted at /manifest.webmanifest and auto-linked) rather than a
// raw app/manifest.json, since a static .json under app/ is not served by the
// App Router. Icons are placeholders in public/icons — replace with real PNGs
// before launch.
export default function manifest() {
  return {
    name: 'SSF Poonoor Division',
    short_name: 'SSF Poonoor',
    description: 'SSF Poonoor Division — Official Web Portal',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#1a6b47',
    icons: [
      { src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
  }
}
