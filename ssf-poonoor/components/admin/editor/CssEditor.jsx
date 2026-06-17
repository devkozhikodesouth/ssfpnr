'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { css } from '@codemirror/lang-css'
import sanitizeCss from '@/lib/css-sanitizer'
import { labelClass } from '../forms/field-styles'

// CodeMirror touches the DOM — load it client-side only.
const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), {
  ssr: false,
  loading: () => <div className="min-h-[160px] bg-gray-900 rounded-lg border border-gray-700" />,
})

const SCOPE_HINT = 'Scoped to this item only. Available vars: --primary, --accent.'

/**
 * Per-item custom CSS editor (CodeMirror). Runs the shared sanitizer on every
 * change so forbidden patterns (@import, expression(), behavior:, javascript:
 * URLs, body-level position:fixed) surface immediately; the API re-sanitizes
 * authoritatively on save.
 */
export default function CssEditor({ label = 'Custom CSS', value = '', onChange }) {
  const [errors, setErrors] = useState([])

  function handleChange(next) {
    onChange(next)
    const { errors: errs } = sanitizeCss(next)
    setErrors(errs)
  }

  return (
    <details className="bg-gray-800/50 border border-gray-700 rounded-lg">
      <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-gray-200 select-none">
        Custom Styling
      </summary>
      <div className="p-4 pt-0 space-y-2">
        <label className={labelClass}>{label}</label>
        <div className="rounded-lg overflow-hidden border border-gray-700">
          <CodeMirror
            value={value || ''}
            height="200px"
            theme="dark"
            extensions={[css()]}
            onChange={handleChange}
          />
        </div>
        <p className="text-xs text-gray-500">{SCOPE_HINT} Max 50 KB.</p>
        {errors.length > 0 && (
          <ul className="text-xs text-red-400 list-disc list-inside">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        )}
      </div>
    </details>
  )
}
