import Link from 'next/link'
import { getModuleConfig } from '@/components/admin/content-configs'
import ContentTable from './ContentTable'

/** Shared list screen header + table for every content module. */
export default function ContentListView({ module, items }) {
  const config = getModuleConfig(module)
  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">{config.label}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{items.length} total</p>
          </div>
          <Link
            href={`${config.basePath}/new`}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            + Add {config.singular}
          </Link>
        </div>
        <ContentTable module={module} items={items} />
      </div>
    </div>
  )
}
