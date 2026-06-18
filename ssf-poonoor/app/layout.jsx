import './globals.css'
import ThemeInjector from '@/components/shared/ThemeInjector'
import FontInjector from '@/components/shared/FontInjector'
import ServiceWorkerRegister from '@/components/public/ServiceWorkerRegister'

export const metadata = {
  title: 'SSF Poonoor',
  description: 'SSF Poonoor Division — Official Web Portal',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'SSF Poonoor', statusBarStyle: 'black-translucent' },
}

export const viewport = {
  themeColor: '#1a6b47',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="ml">
      <head>
        {/* Default brand fonts (custom uploads override via FontInjector). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/*
          Site-wide brand defaults loaded once here (every route shares this root
          layout, so next/font's per-page concern does not apply); custom uploads
          override these live via FontInjector/ThemeInjector (PLAN §9.5).
        */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Serif+Malayalam:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <ThemeInjector />
        <FontInjector />
      </head>
      <body className="antialiased">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
