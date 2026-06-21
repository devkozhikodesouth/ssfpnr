import Link from 'next/link'
import { notFound } from 'next/navigation'
import connectDB from '@/lib/db'
import { requirePageAccess } from '@/lib/admin-guard'
import Role from '@/models/Role'
import RoleForm from '@/components/admin/roles/RoleForm'

export const dynamic = 'force-dynamic'

export default async function EditRolePage({ params }) {
  await requirePageAccess('roles.manage')
  await connectDB()
  const raw = await Role.findById(params.id).lean()
  if (!raw) notFound()
  const role = JSON.parse(JSON.stringify(raw))

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/app/roles" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-white">{role.isSystem ? 'View Role' : 'Edit Role'}</h1>
        </div>
        <RoleForm initialData={role} />
      </div>
    </div>
  )
}
