import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { requirePermission, hasPermission } from '@/lib/permissions'
import { isValidPermissionList } from '@/lib/permissions-catalog'
import { errorResponse, httpError } from '@/lib/api-errors'
import { slugify } from '@/lib/slugify'
import connectDB from '@/lib/db'
import Role from '@/models/Role'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Readable by role managers and by user managers (the user form needs the
    // role list for its dropdown).
    const session = await getServerSession(authOptions)
    if (!hasPermission(session, 'roles.manage') && !hasPermission(session, 'users.manage')) {
      requirePermission(session, 'roles.manage')
    }

    await connectDB()
    const roles = await Role.find().sort({ isSystem: -1, name: 1 }).lean()
    return NextResponse.json({ success: true, data: roles })
  } catch (err) {
    return errorResponse(err)
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'roles.manage')

    await connectDB()
    const body = await request.json()

    if (!body.name) throw httpError('Role name is required')

    const permissions = Array.isArray(body.permissions) ? body.permissions : []
    if (!isValidPermissionList(permissions)) {
      throw httpError('Permissions contain unknown permission strings')
    }

    const doc = await Role.create({
      name: body.name,
      slug: slugify(body.slug || body.name),
      description: body.description,
      color: body.color,
      permissions,
      isSystem: false, // custom roles are never system roles
      createdBy: session.user.id,
      updatedBy: session.user.id,
    })

    return NextResponse.json({ success: true, data: doc }, { status: 201 })
  } catch (err) {
    return errorResponse(err)
  }
}
