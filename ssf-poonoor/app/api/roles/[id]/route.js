import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { requirePermission } from '@/lib/permissions'
import { isValidPermissionList } from '@/lib/permissions-catalog'
import { errorResponse, httpError } from '@/lib/api-errors'
import { slugify } from '@/lib/slugify'
import connectDB from '@/lib/db'
import Role from '@/models/Role'
import User from '@/models/User'

export const dynamic = 'force-dynamic'

export async function GET(_request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'roles.manage')

    await connectDB()
    const role = await Role.findById(params.id).lean()
    if (!role) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: role })
  } catch (err) {
    return errorResponse(err)
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'roles.manage')

    await connectDB()
    const role = await Role.findById(params.id)
    if (!role) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    // System roles are read-only — their presets are relied upon by the app.
    if (role.isSystem) throw httpError('System roles cannot be modified', 403)

    const body = await request.json()

    if (body.permissions !== undefined) {
      if (!isValidPermissionList(body.permissions)) {
        throw httpError('Permissions contain unknown permission strings')
      }
      role.permissions = body.permissions
    }
    if (body.name !== undefined) role.name = body.name
    if (body.slug !== undefined || body.name !== undefined) {
      role.slug = slugify(body.slug || body.name)
    }
    if (body.description !== undefined) role.description = body.description
    if (body.color !== undefined) role.color = body.color

    role.updatedBy = session.user.id
    await role.save()

    return NextResponse.json({ success: true, data: role })
  } catch (err) {
    return errorResponse(err)
  }
}

export async function DELETE(_request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'roles.manage')

    await connectDB()
    const role = await Role.findById(params.id)
    if (!role) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    if (role.isSystem) throw httpError('System roles cannot be deleted', 403)

    const inUse = await User.countDocuments({ roleId: role._id })
    if (inUse > 0) {
      throw httpError(`Role is assigned to ${inUse} user(s); reassign them first`, 409)
    }

    await Role.findByIdAndDelete(role._id)
    return NextResponse.json({ success: true, data: { id: params.id } })
  } catch (err) {
    return errorResponse(err)
  }
}
