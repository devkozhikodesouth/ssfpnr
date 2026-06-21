import connectDB from '@/lib/db'
import { requirePageAccess } from '@/lib/admin-guard'
import SiteConfig from '@/models/SiteConfig'
import WebsiteBuilderClient from '@/components/admin/website-builder/WebsiteBuilderClient'

export const dynamic = 'force-dynamic'

export default async function WebsiteBuilderPage() {
  await requirePageAccess('site.configure')
  await connectDB()

  let config = await SiteConfig.findOne().lean()
  if (!config) {
    const created = await SiteConfig.create({})
    config = created.toObject()
  }

  const initialConfig = JSON.parse(JSON.stringify(config))

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Website Builder</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Edit the content of each section — Header, Hero, Live, Gallery, About and Footer. Preview every page on
            mobile, tablet and desktop. Changes apply site-wide on save.
          </p>
        </div>
        <WebsiteBuilderClient initialConfig={initialConfig} />
      </div>
    </div>
  )
}
