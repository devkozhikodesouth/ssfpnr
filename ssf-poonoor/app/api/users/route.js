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

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'users.manage')

    await connectDB()
    const users = await User.find()
      .populate('roleId', 'name slug color')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ success: true, data: users })
  } catch (err) {
    return errorResponse(err)
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'users.manage')

    await connectDB()
    const body = await request.json()

    const { name, username, password, roleId } = body
    if (!name || !username || !password) {
      throw httpError('Name, username and password are required')
    }

    const role = await Role.findById(roleId).select('_id')
    if (!role) throw httpError('Selected role does not exist')

    const permissions = Array.isArray(body.permissions) ? body.permissions : []
    if (!isValidPermissionList(permissions)) {
      throw httpError('Permission overrides contain unknown permission strings')
    }

    const doc = await User.create({
      name,
      username,
      email: body.email,
      phone: body.phone,
      password, // hashed by the User pre-save hook
      roleId,
      permissions,
      avatar: body.avatar,
      isActive: body.isActive !== false,
      createdBy: session.user.id,
      updatedBy: session.user.id,
    })

    const safe = doc.toObject()
    delete safe.password
    return NextResponse.json({ success: true, data: safe }, { status: 201 })
  } catch (err) {
    return errorResponse(err)
  }
}
