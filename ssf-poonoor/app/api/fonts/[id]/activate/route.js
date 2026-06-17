import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { requirePermission } from '@/lib/permissions'
import { errorResponse, httpError } from '@/lib/api-errors'
import { syncFontAssignment, ROLE_KEYS } from '@/lib/font-assignment'
import connectDB from '@/lib/db'
import Font from '@/models/Font'

export const dynamic = 'force-dynamic'

/**
 * PUT — activate/deactivate a font and assign it to site roles.
 * Body: { isActive?: boolean, assignedTo?: ('heading'|'body'|'arabic')[] }
 * Deactivating clears any role assignment. Assigning implies activation.
 */
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'fonts.upload')

    await connectDB()
    const font = await Font.findById(params.id)
    if (!font) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    const body = await request.json()

    let assignedTo = Array.isArray(body.assignedTo) ? body.assignedTo : font.assignedTo || []
    assignedTo = assignedTo.filter((r) => ROLE_KEYS.includes(r))
    if (Array.isArray(body.assignedTo) && body.assignedTo.some((r) => !ROLE_KEYS.includes(r))) {
      throw httpError('assignedTo may only contain heading, body or arabic')
    }

    // Resolve the active flag: an explicit value wins; assigning implies active.
    let isActive = font.isActive
    if (body.isActive !== undefined) isActive = !!body.isActive
    if (assignedTo.length) isActive = true

    // An inactive font cannot hold role assignments.
    if (!isActive) assignedTo = []

    font.isActive = isActive
    font.updatedBy = session.user.id
    await syncFontAssignment(font, assignedTo) // saves font + mirrors to SiteConfig

    const safe = font.toObject()
    delete safe.cloudinaryIds
    return NextResponse.json({ success: true, data: safe })
  } catch (err) {
    return errorResponse(err)
  }
}
