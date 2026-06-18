import { makeViewHandler } from '@/lib/view-counter'
import Gallery from '@/models/Gallery'

export const dynamic = 'force-dynamic'

export const POST = makeViewHandler({ Model: Gallery })
