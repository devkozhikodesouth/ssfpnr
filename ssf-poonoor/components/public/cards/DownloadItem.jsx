'use client'

import Icon from '@/components/public/Icon'
import { formatFileSize } from '@/lib/format'

/**
 * Download list row (PLAN §15.9): file-type icon, name, size, download button.
 * Clicking counts the download server-side (downloadCount) before opening the
 * Cloudinary file, so the count reflects real fetches.
 *
 * @param {{ item: object }} props
 */
export default function DownloadItem({ item }) {
  async function handleDownload(e) {
    if (!item.file) {
      e.preventDefault()
      return
    }
    // Fire-and-forget the counter; never block the actual download on it.
    try {
      navigator.sendBeacon?.(`/api/downloads/${item._id}/view`)
    } catch {
      /* ignore */
    }
  }

  const ext = (item.fileType || item.file?.split('.').pop() || '').toUpperCase().slice(0, 4)

  return (
    <div className="bg-white rounded-soft border border-gray-200 p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
      <span className="w-11 h-11 rounded-soft bg-primary/10 text-primary flex flex-col items-center justify-center shrink-0">
        <Icon name="document" className="w-5 h-5" />
        {ext ? <span className="text-[7px] font-bold mt-0.5">{ext}</span> : null}
      </span>
      <div className="min-w-0 flex-grow">
        <h3 className="font-bold text-sm text-ink leading-snug line-clamp-1">{item.name}</h3>
        <span className="text-[10px] text-gray-400">{formatFileSize(item.fileSize) || 'Document'}</span>
      </div>
      <a
        href={item.file || '#'}
        target="_blank"
        rel="noopener noreferrer"
        download
        onClick={handleDownload}
        className="bg-primary hover:bg-secondary text-white text-xs font-bold px-3 py-2 rounded-soft flex items-center gap-1.5 shrink-0 transition-colors"
        aria-label={`Download ${item.name}`}
      >
        <Icon name="download" className="w-4 h-4" />
        <span className="hidden sm:inline">Download</span>
      </a>
    </div>
  )
}
