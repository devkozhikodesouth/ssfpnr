import Link from 'next/link'
import connectDB from '@/lib/db'
import { requirePageAccess } from '@/lib/admin-guard'
import Role from '@/models/Role'
import RolesTable from '@/components/admin/roles/RolesTable'

export const dynamic = 'force-dynamic'

export default async function RolesListPage() {
  await requirePageAccess('roles.manage')
  await connectDB()
  const raw = await Role.find().sort({ isSystem: -1, name: 1 }).lean()
  const roles = JSON.parse(JSON.stringify(raw))

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Roles</h1>
            <p className="text-gray-400 text-sm mt-0.5">{roles.length} total</p>
          </div>
          <Link
            href="/app/roles/new"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            + Add Role
          </Link>
        </div>
        <RolesTable roles={roles} />
      </div>
    </div>
  )
}
