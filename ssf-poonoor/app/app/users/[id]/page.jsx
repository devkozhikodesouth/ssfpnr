import Link from 'next/link'
import { notFound } from 'next/navigation'
import connectDB from '@/lib/db'
import { requirePageAccess } from '@/lib/admin-guard'
import Role from '@/models/Role'
import User from '@/models/User'
import UserForm from '@/components/admin/users/UserForm'

export const dynamic = 'force-dynamic'

export default async function EditUserPage({ params }) {
  await requirePageAccess('users.manage')
  await connectDB()
  const [rawUser, rawRoles] = await Promise.all([
    User.findById(params.id).populate('roleId', 'name slug color').lean(),
    Role.find().sort({ isSystem: -1, name: 1 }).lean(),
  ])
  if (!rawUser) notFound()

  const user = JSON.parse(JSON.stringify(rawUser))
  const roles = JSON.parse(JSON.stringify(rawRoles))

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/app/users" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-white">Edit User</h1>
        </div>
        <UserForm roles={roles} initialData={user} />
      </div>
    </div>
  )
}
