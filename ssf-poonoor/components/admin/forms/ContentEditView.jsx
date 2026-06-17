'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getModuleConfig } from '@/components/admin/content-configs'
import ContentForm from './ContentForm'

/**
 * Shared edit screen for every content module. Fetches the item from the
 * module's API and hands it to the config-driven ContentForm.
 */
export default function ContentEditView({ module }) {
  const config = getModuleConfig(module)
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${config.apiBase}/${id}`)
      .then((r) => r.json())
      .then(({ data, error: err }) => {
        if (err) setError(err)
        else setItem(data)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [config.apiBase, id])

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href={config.basePath} className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-white">Edit {config.singular}</h1>
        </div>
        {loading && <p className="text-gray-400 text-sm">Loading…</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {item && <ContentForm module={module} initialData={item} />}
      </div>
    </div>
  )
}
