import connectDB from '@/lib/db'
import { requirePageAccess } from '@/lib/admin-guard'
import NavPath from '@/models/NavPath'
import Redirect from '@/models/Redirect'
import PathManageClient from '@/components/admin/path-manage/PathManageClient'
import RedirectsManager from '@/components/admin/path-manage/RedirectsManager'

export const dynamic = 'force-dynamic'

export default async function PathManagePage() {
  await requirePageAccess('paths.manage')
  await connectDB()
  const [rawPaths, rawRedirects] = await Promise.all([
    NavPath.find().sort({ location: 1, order: 1 }).lean(),
    Redirect.find().sort({ slug: 1 }).lean(),
  ])
  const paths = JSON.parse(JSON.stringify(rawPaths))
  const redirects = JSON.parse(JSON.stringify(rawRedirects))

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Path Manage</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Manage navigation links across the top nav, mobile bottom nav, and footer. Drag the handle to
            reorder within each section.
          </p>
        </div>
        <PathManageClient paths={paths} />

        <hr className="border-gray-800 my-10" />
        <RedirectsManager redirects={redirects} />
      </div>
    </div>
  )
}
