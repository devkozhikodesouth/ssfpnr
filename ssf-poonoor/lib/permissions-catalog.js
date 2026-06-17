// Single source of truth for the permission system. Drives both the visual
// PermissionGrid (rows = modules, columns = actions) and server-side validation
// of submitted permission strings. A permission string is `${prefix}.${action}`.
//
// Keep this in sync with the seeded role presets in scripts/seed.js.

const ACTIONS = [
  { key: 'create', label: 'Create' },
  { key: 'read', label: 'Read' },
  { key: 'update', label: 'Update' },
  { key: 'delete', label: 'Delete' },
  { key: 'publish', label: 'Publish' },
  { key: 'custom-css', label: 'Custom CSS' },
  { key: 'manage', label: 'Manage' },
  { key: 'configure', label: 'Configure' },
  { key: 'upload', label: 'Upload' },
  { key: 'view', label: 'View' },
  { key: 'restore', label: 'Restore' },
  { key: 'purge', label: 'Purge' },
]

// Each module declares its permission prefix and the subset of actions that are
// valid for it (the "only valid combos" rule for the grid).
const MODULES = [
  { key: 'news', label: 'News', prefix: 'news', actions: ['create', 'read', 'update', 'delete', 'publish', 'custom-css'] },
  { key: 'gallery', label: 'Gallery', prefix: 'gallery', actions: ['create', 'read', 'update', 'delete', 'publish'] },
  { key: 'video', label: 'Video', prefix: 'video', actions: ['create', 'read', 'update', 'delete', 'publish', 'custom-css'] },
  { key: 'blogs', label: 'Blog', prefix: 'blogs', actions: ['create', 'read', 'update', 'delete', 'publish', 'custom-css'] },
  { key: 'campaigns', label: 'Campaign', prefix: 'campaigns', actions: ['create', 'read', 'update', 'delete', 'publish'] },
  { key: 'events', label: 'Event', prefix: 'events', actions: ['create', 'read', 'update', 'delete', 'publish'] },
  { key: 'downloads', label: 'Download', prefix: 'downloads', actions: ['create', 'read', 'update', 'delete', 'publish'] },
  { key: 'categories', label: 'Category', prefix: 'categories', actions: ['manage'] },
  { key: 'users', label: 'User', prefix: 'users', actions: ['manage'] },
  { key: 'roles', label: 'Role', prefix: 'roles', actions: ['manage'] },
  { key: 'site', label: 'Site', prefix: 'site', actions: ['configure'] },
  { key: 'fonts', label: 'Font', prefix: 'fonts', actions: ['upload'] },
  { key: 'paths', label: 'Path', prefix: 'paths', actions: ['manage'] },
  { key: 'trash', label: 'Trash', prefix: 'trash', actions: ['view', 'restore', 'purge'] },
  { key: 'analytics', label: 'Analytics', prefix: 'analytics', actions: ['view'] },
]

/** Permission string for a module prefix + action key. */
function permString(prefix, action) {
  return `${prefix}.${action}`
}

/** Flat list of every valid permission string in the system. */
function allPermissions() {
  return MODULES.flatMap((m) => m.actions.map((a) => permString(m.prefix, a)))
}

const ALL_PERMISSIONS = allPermissions()

/** True if every string in the list is a known permission. */
function isValidPermissionList(list) {
  if (!Array.isArray(list)) return false
  const set = new Set(ALL_PERMISSIONS)
  return list.every((p) => set.has(p))
}

/** Only the action columns actually used by at least one module, in order. */
const USED_ACTIONS = ACTIONS.filter((a) => MODULES.some((m) => m.actions.includes(a.key)))

module.exports = {
  ACTIONS,
  USED_ACTIONS,
  MODULES,
  ALL_PERMISSIONS,
  permString,
  allPermissions,
  isValidPermissionList,
}
