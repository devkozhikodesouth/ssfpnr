import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'

/**
 * Server-side page guard for admin (/app) pages. Mirrors the permission the
 * matching API route enforces, so a user whose role lacks the permission cannot
 * reach the page UI either (previously every logged-in user could open every
 * admin page — "everyone has full access").
 *
 * Usage at the top of a server page component:
 *   const session = await requirePageAccess('users.manage')
 *
 * @param {string} [permission] permission string; omit for auth-only pages.
 * @returns {Promise<import('next-auth').Session>} the session (guaranteed user).
 */
export async function requirePageAccess(permission) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/app/login')
  }
  if (permission && !hasPermission(session, permission)) {
    // Send them somewhere they can see rather than a raw 403; the dashboard is
    // always accessible to any authenticated user.
    redirect('/app/dashboard?denied=' + encodeURIComponent(permission))
  }
  return session
}
