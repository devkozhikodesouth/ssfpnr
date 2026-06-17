import './globals.css'

export const metadata = {
  title: 'SSF Poonoor',
  description: 'SSF Poonoor Division — Official Web Portal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ml">
      <head />
      <body className="antialiased">{children}</body>
    </html>
  )
}
