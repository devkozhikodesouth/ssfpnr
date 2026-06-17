/**
 * @param {string[]} rolePermissions - Default permissions from the user's role
 * @param {string[]} userPermissions - User-specific permission overrides (additive)
 * @returns {string[]} Merged, deduplicated permission set
 */
function resolvePermissions(rolePermissions = [], userPermissions = []) {
  return [...new Set([...rolePermissions, ...userPermissions])]
}

/**
 * @param {import('next-auth').Session} session - NextAuth session
 * @param {string} permission - Permission string, e.g. 'news.create'
 * @returns {boolean}
 */
function hasPermission(session, permission) {
  return Array.isArray(session?.user?.permissions) &&
    session.user.permissions.includes(permission)
}

/**
 * Asserts that the session user holds the given permission.
 * Throws with .status 401 if unauthenticated, 403 if unauthorized.
 * @param {import('next-auth').Session|null} session
 * @param {string} permission
 */
function requirePermission(session, permission) {
  if (!session?.user) {
    const err = new Error('Unauthorized')
    err.status = 401
    throw err
  }
  if (!hasPermission(session, permission)) {
    const err = new Error('Forbidden')
    err.status = 403
    throw err
  }
}

module.exports = { resolvePermissions, hasPermission, requirePermission }
