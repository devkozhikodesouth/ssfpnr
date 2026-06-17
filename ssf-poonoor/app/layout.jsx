import './globals.css'
import ThemeInjector from '@/components/shared/ThemeInjector'
import FontInjector from '@/components/shared/FontInjector'

export const metadata = {
  title: 'SSF Poonoor',
  description: 'SSF Poonoor Division — Official Web Portal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ml">
      <head>
        <ThemeInjector />
        <FontInjector />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
