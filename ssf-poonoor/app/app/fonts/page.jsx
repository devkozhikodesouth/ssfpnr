import connectDB from '@/lib/db'
import { requirePageAccess } from '@/lib/admin-guard'
import Font from '@/models/Font'
import FontsManager from '@/components/admin/fonts/FontsManager'

export const dynamic = 'force-dynamic'

export default async function FontsPage() {
  await requirePageAccess('fonts.upload')
  await connectDB()
  const raw = await Font.find().sort({ createdAt: -1 }).select('-cloudinaryIds').lean()
  const fonts = JSON.parse(JSON.stringify(raw))

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Fonts</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Upload custom fonts and assign them to the heading, body, or Arabic/Malayalam roles.
          </p>
        </div>
        <FontsManager fonts={fonts} />
      </div>
    </div>
  )
}
