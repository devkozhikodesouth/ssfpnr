import { makeViewHandler } from '@/lib/view-counter'
import Video from '@/models/Video'

export const dynamic = 'force-dynamic'

export const POST = makeViewHandler({ Model: Video })
