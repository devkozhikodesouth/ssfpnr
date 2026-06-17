import connectDB from '@/lib/db'
import SiteConfig from '@/models/SiteConfig'
import Font from '@/models/Font'
import SiteSetupClient from '@/components/admin/site-setup/SiteSetupClient'

export const dynamic = 'force-dynamic'

export default async function SiteSetupPage() {
  await connectDB()

  let config = await SiteConfig.findOne().lean()
  if (!config) {
    const created = await SiteConfig.create({})
    config = created.toObject()
  }
  const fontsRaw = await Font.find().sort({ createdAt: -1 }).select('-cloudinaryIds').lean()

  const initialConfig = JSON.parse(JSON.stringify(config))
  const fonts = JSON.parse(JSON.stringify(fontsRaw))

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Site Setup</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Configure branding, theme, modules, navigation, SEO and more. Changes preview live and apply
            site-wide on save.
          </p>
        </div>
        <SiteSetupClient initialConfig={initialConfig} fonts={fonts} />
      </div>
    </div>
  )
}
