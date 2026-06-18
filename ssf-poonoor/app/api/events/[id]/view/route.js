import { makeViewHandler } from '@/lib/view-counter'
import Event from '@/models/Event'

export const dynamic = 'force-dynamic'

export const POST = makeViewHandler({ Model: Event })
