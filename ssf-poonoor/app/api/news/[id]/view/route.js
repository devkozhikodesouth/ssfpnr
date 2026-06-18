import { makeViewHandler } from '@/lib/view-counter'
import News from '@/models/News'

export const dynamic = 'force-dynamic'

export const POST = makeViewHandler({ Model: News })
