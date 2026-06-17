import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { requirePermission } from '@/lib/permissions'
import { isValidPermissionList } from '@/lib/permissions-catalog'
import { errorResponse, httpError } from '@/lib/api-errors'
import connectDB from '@/lib/db'
import User from '@/models/User'
import Role from '@/models/Role'

export const dynamic = 'force-dynamic'

export async function GET(_request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'users.manage')

    await connectDB()
    const user = await User.findById(params.id).populate('roleId', 'name slug color').lean()
    if (!user) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: user })
  } catch (err) {
    return errorResponse(err)
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'users.manage')

    await connectDB()
    const body = await request.json()

    const user = await User.findById(params.id).select('+password')
    if (!user) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    if (body.roleId && String(body.roleId) !== String(user.roleId)) {
      const role = await Role.findById(body.roleId).select('_id')
      if (!role) throw httpError('Selected role does not exist')
      user.roleId = body.roleId
    }

    if (body.permissions !== undefined) {
      if (!isValidPermissionList(body.permissions)) {
        throw httpError('Permission overrides contain unknown permission strings')
      }
      user.permissions = body.permissions
    }

    for (const field of ['name', 'email', 'phone', 'avatar']) {
      if (body[field] !== undefined) user[field] = body[field]
    }
    if (body.isActive !== undefined) user.isActive = body.isActive

    // Optional password reset — only when a non-empty value is supplied.
    if (body.password) {
      user.password = body.password // re-hashed by the pre-save hook
    }

    user.updatedBy = session.user.id
    await user.save()

    const safe = user.toObject()
    delete safe.password
    return NextResponse.json({ success: true, data: safe })
  } catch (err) {
    return errorResponse(err)
  }
}

export async function DELETE(_request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'users.manage')

    if (String(params.id) === String(session.user.id)) {
      throw httpError('You cannot delete your own account', 409)
    }

    await connectDB()
    const doc = await User.findByIdAndUpdate(
      params.id,
      { isDeleted: true, deletedAt: new Date(), deletedBy: session.user.id, isActive: false },
      { new: true }
    )
    if (!doc) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: { id: params.id } })
  } catch (err) {
    return errorResponse(err)
  }
}
