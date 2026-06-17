import Link from 'next/link'
import CategoryForm from '@/components/admin/forms/CategoryForm'

export default function NewCategoryPage() {
  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/app/categories" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-white">New Category</h1>
        </div>
        <CategoryForm />
      </div>
    </div>
  )
}
