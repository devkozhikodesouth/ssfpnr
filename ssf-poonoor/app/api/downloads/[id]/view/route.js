import { makeViewHandler } from '@/lib/view-counter'
import Download from '@/models/Download'

export const dynamic = 'force-dynamic'

// Downloads track engagement as downloadCount (PLAN §7.9) rather than viewCount,
// so this route increments that field instead.
export const POST = makeViewHandler({ Model: Download, field: 'downloadCount' })
