import Link from 'next/link'
import { getModuleConfig } from '@/components/admin/content-configs'
import ContentForm from './ContentForm'

/** Shared "create" screen for every content module. */
export default function ContentNewView({ module }) {
  const config = getModuleConfig(module)
  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href={config.basePath} className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-white">New {config.singular}</h1>
        </div>
        <ContentForm module={module} />
      </div>
    </div>
  )
}
