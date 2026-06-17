import Link from 'next/link'
import RoleForm from '@/components/admin/roles/RoleForm'

export default function NewRolePage() {
  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/app/roles" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-white">New Role</h1>
        </div>
        <RoleForm />
      </div>
    </div>
  )
}
