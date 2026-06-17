import './globals.css'
import FontInjector from '@/components/shared/FontInjector'

export const metadata = {
  title: 'SSF Poonoor',
  description: 'SSF Poonoor Division — Official Web Portal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ml">
      <head>
        <FontInjector />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
