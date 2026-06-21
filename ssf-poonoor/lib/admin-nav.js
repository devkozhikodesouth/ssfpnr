// Single source of truth for the admin panel navigation. Drives the sidebar,
// mobile bottom-nav and the user-menu in components/admin/layout/AdminShell.
// Each item may declare a `perm` (a permission string from
// lib/permissions-catalog); items the current user lacks are filtered out so
// roles actually restrict what shows in the UI — the matching API routes and
// page guards enforce the same permission server-side.

const NAV_GROUPS = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', href: '/app/dashboard', icon: 'grid' }],
  },
  {
    title: 'Content',
    items: [
      { label: 'News', href: '/app/news', icon: 'newspaper', perm: 'news.read' },
      { label: 'Gallery', href: '/app/gallery', icon: 'image', perm: 'gallery.read' },
      { label: 'Videos', href: '/app/video', icon: 'video', perm: 'video.read' },
      { label: 'Blogs', href: '/app/blogs', icon: 'pencil', perm: 'blogs.read' },
      { label: 'Campaigns', href: '/app/campaigns', icon: 'megaphone', perm: 'campaigns.read' },
      { label: 'Events', href: '/app/events', icon: 'calendar', perm: 'events.read' },
      { label: 'Downloads', href: '/app/downloads', icon: 'download', perm: 'downloads.read' },
    ],
  },
  {
    title: 'Organize',
    items: [
      { label: 'Categories', href: '/app/categories', icon: 'tag', perm: 'categories.manage' },
      { label: 'Navigation', href: '/app/path-manage', icon: 'link', perm: 'paths.manage' },
    ],
  },
  {
    title: 'Appearance',
    items: [
      { label: 'Website Builder', href: '/app/website-builder', icon: 'grid', perm: 'site.configure' },
      { label: 'Site Setup', href: '/app/site-setup', icon: 'settings', perm: 'site.configure' },
      { label: 'Fonts', href: '/app/fonts', icon: 'type', perm: 'fonts.upload' },
    ],
  },
  {
    title: 'People',
    items: [
      { label: 'Users', href: '/app/users', icon: 'users', perm: 'users.manage' },
      { label: 'Roles', href: '/app/roles', icon: 'shield', perm: 'roles.manage' },
    ],
  },
  {
    title: 'System',
    items: [{ label: 'Trash', href: '/app/trash', icon: 'trash', perm: 'trash.view' }],
  },
]

/** True if the item is visible for the given permission set (no perm = always). */
function navItemAllowed(item, permissions) {
  if (!item.perm) return true
  return Array.isArray(permissions) && permissions.includes(item.perm)
}

/**
 * Returns the nav groups with items filtered to what `permissions` allows.
 * Empty groups are dropped so the sidebar never shows a bare heading.
 */
function filterNavGroups(permissions = []) {
  return NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => navItemAllowed(item, permissions)),
  })).filter((group) => group.items.length > 0)
}

/** Flat list of items for the mobile bottom-nav (most-used first). */
function bottomNavItems(groups) {
  const flat = groups.flatMap((g) => g.items)
  // Prefer Dashboard + first few content items, capped to 5 for the bar.
  return flat.slice(0, 5)
}

module.exports = { NAV_GROUPS, filterNavGroups, navItemAllowed, bottomNavItems }
