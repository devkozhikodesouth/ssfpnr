import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { filterNavGroups, bottomNavItems } from '@/lib/admin-nav'
import AdminShell from '@/components/admin/layout/AdminShell'

export const dynamic = 'force-dynamic'

// Admin pages are an installable PWA in their own right: this overrides the
// root manifest for every /app route so "Install app" opens the admin (scope
// /app, launching at the dashboard) rather than the public site. The service
// worker registered in the root layout already covers /app (scope '/').
export const metadata = {
  title: 'SSF Poonoor Admin',
  manifest: '/admin.webmanifest',
  appleWebApp: { capable: true, title: 'SSF Admin', statusBarStyle: 'black-translucent' },
}

export const viewport = {
  themeColor: '#059669',
}

/**
 * Shared chrome for the admin panel (/app/*). Resolves the session server-side
 * and feeds AdminShell a permission-filtered nav so roles actually shape the UI.
 * Unauthenticated requests (the login / reset pages, which middleware leaves
 * public) render bare — those pages provide their own full-screen layout.
 */
export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return children
  }

  const permissions = session.user.permissions || []
  const groups = filterNavGroups(permissions)
  const bottomItems = bottomNavItems(groups)

  const user = {
    name: session.user.name,
    username: session.user.username,
    roleName: session.user.roleName,
  }

  return (
    <AdminShell groups={groups} bottomItems={bottomItems} user={user}>
      {children}
    </AdminShell>
  )
}
