import Link from 'next/link'
import connectDB from '@/lib/db'
import Role from '@/models/Role'
import UserForm from '@/components/admin/users/UserForm'

export const dynamic = 'force-dynamic'

export default async function NewUserPage() {
  await connectDB()
  const raw = await Role.find().sort({ isSystem: -1, name: 1 }).lean()
  const roles = JSON.parse(JSON.stringify(raw))

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/app/users" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-white">New User</h1>
        </div>
        <UserForm roles={roles} />
      </div>
    </div>
  )
}
