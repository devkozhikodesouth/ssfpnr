import { makeViewHandler } from '@/lib/view-counter'
import Campaign from '@/models/Campaign'

export const dynamic = 'force-dynamic'

export const POST = makeViewHandler({ Model: Campaign })
