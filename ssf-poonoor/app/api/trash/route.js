import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { requirePermission } from '@/lib/permissions'
import connectDB from '@/lib/db'
import '@/models/User'
import { MODULES, MODULE_KEYS, getModule } from '@/lib/modules'

export const dynamic = 'force-dynamic'

/**
 * GET /api/trash — list soft-deleted items across all 7 modules.
 * Optional ?module=news to scope to one module.
 * Returns [{ module, id, title, deletedAt, deletedBy }].
 */
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'trash.view')

    await connectDB()

    const sp = new URL(request.url).searchParams
    const only = sp.get('module')
    const keys = only ? (getModule(only) ? [only] : []) : MODULE_KEYS

    const results = await Promise.all(
      keys.map(async (key) => {
        const { Model, titleField } = MODULES[key]
        const docs = await Model.find({ isDeleted: true })
          .select(`${titleField} slug deletedAt deletedBy`)
          .populate('deletedBy', 'name username')
          .sort({ deletedAt: -1 })
          .lean()
        return docs.map((d) => ({
          module: key,
          id: String(d._id),
          title: d[titleField] || '(untitled)',
          slug: d.slug,
          deletedAt: d.deletedAt,
          deletedBy: d.deletedBy
            ? { id: String(d.deletedBy._id), name: d.deletedBy.name, username: d.deletedBy.username }
            : null,
        }))
      })
    )

    const items = results.flat().sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt))

    return NextResponse.json({ success: true, data: items })
  } catch (err) {
    const status = err?.status || 500
    return NextResponse.json({ success: false, error: err.message }, { status })
  }
}
