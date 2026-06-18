import { makeViewHandler } from '@/lib/view-counter'
import Blog from '@/models/Blog'

export const dynamic = 'force-dynamic'

export const POST = makeViewHandler({ Model: Blog })
