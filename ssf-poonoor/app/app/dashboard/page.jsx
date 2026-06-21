import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import connectDB from '@/lib/db'
import { MODULES, MODULE_KEYS } from '@/lib/modules'
import Category from '@/models/Category'
import User from '@/models/User'
import Role from '@/models/Role'

export const dynamic = 'force-dynamic'

// Permission required to see each dashboard card / quick link, so the landing
// page reflects the user's role (mirrors lib/admin-nav + the page guards).
const PERM = {
  news: 'news.read',
  gallery: 'gallery.read',
  video: 'video.read',
  blogs: 'blogs.read',
  campaigns: 'campaigns.read',
  events: 'events.read',
  downloads: 'downloads.read',
  categories: 'categories.manage',
  users: 'users.manage',
  roles: 'roles.manage',
  trash: 'trash.view',
  site: 'site.configure',
  paths: 'paths.manage',
  fonts: 'fonts.upload',
}

// Admin landing page. Shows active counts per module plus quick links into every
// admin section. This is the post-login redirect target (see app/app/login).
export default async function DashboardPage({ searchParams }) {
  const session = await getServerSession(authOptions)
  await connectDB()

  const can = (permKey) => hasPermission(session, PERM[permKey])

  // Set when a permission guard bounced the user here (lib/admin-guard).
  const denied = searchParams?.denied

  // Active counts per content module (soft-delete plugin auto-excludes trashed).
  const moduleCounts = await Promise.all(
    MODULE_KEYS.map(async (key) => ({
      key,
      label: MODULES[key].label,
      href: `/app/${key}`,
      count: await MODULES[key].Model.countDocuments(),
    }))
  )

  const [categories, users, roles, trashed] = await Promise.all([
    Category.countDocuments(),
    User.countDocuments(),
    Role.countDocuments(),
    Promise.all(
      MODULE_KEYS.map((key) => MODULES[key].Model.countDocuments({ isDeleted: true }))
    ).then((counts) => counts.reduce((a, b) => a + b, 0)),
  ])

  const cards = [
    ...moduleCounts.filter((c) => can(c.key)),
    { key: 'categories', label: 'Categories', href: '/app/categories', count: categories },
    { key: 'users', label: 'Users', href: '/app/users', count: users },
    { key: 'roles', label: 'Roles', href: '/app/roles', count: roles },
    { key: 'trash', label: 'In Trash', href: '/app/trash', count: trashed },
  ].filter((c) => can(c.key))

  const quickLinks = [
    { key: 'site', label: 'Site Setup', href: '/app/site-setup' },
    { key: 'paths', label: 'Navigation', href: '/app/path-manage' },
    { key: 'categories', label: 'Categories', href: '/app/categories' },
    { key: 'fonts', label: 'Fonts', href: '/app/fonts' },
    { key: 'users', label: 'Users', href: '/app/users' },
    { key: 'roles', label: 'Roles', href: '/app/roles' },
    { key: 'trash', label: 'Trash', href: '/app/trash' },
  ].filter((l) => can(l.key))

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">SSF Poonoor admin overview</p>
        </div>

        {denied ? (
          <div className="mb-6 rounded-lg border border-amber-700/40 bg-amber-950/40 px-4 py-3 text-sm text-amber-200">
            You don’t have permission to access that page
            <span className="text-amber-400/70"> ({denied})</span>. Contact an administrator if you need access.
          </div>
        ) : null}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {cards.map((c) => (
            <Link
              key={c.key}
              href={c.href}
              className="block bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl p-5 transition-colors"
            >
              <div className="text-3xl font-bold text-white">{c.count}</div>
              <div className="text-gray-400 text-sm mt-1">{c.label}</div>
            </Link>
          ))}
        </div>

        {quickLinks.length ? (
          <>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
              Manage
            </h2>
            <div className="flex flex-wrap gap-2">
              {quickLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-200 text-sm rounded-lg transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
