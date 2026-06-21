'use client'

/**
 * Shared on/off switch for admin forms. Single source for toggle styling so
 * every boolean setting looks and aligns the same (previously a mix of bare
 * checkboxes and ad-hoc switches). The knob is centered vertically and travels
 * symmetrically inside the track.
 *
 * @param {{ checked: boolean, onChange: (v:boolean)=>void, label?: string,
 *   hint?: string, disabled?: boolean }} props
 */
export default function Switch({ checked, onChange, label, hint, disabled = false }) {
  const control = (
    <button
      type="button"
      role="switch"
      aria-checked={!!checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={[
        'relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        checked ? 'bg-emerald-600' : 'bg-gray-700',
      ].join(' ')}
    >
      <span
        className={[
          'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-[22px]' : 'translate-x-0.5',
        ].join(' ')}
      />
    </button>
  )

  if (!label) return control

  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
      <span className="text-sm text-gray-300">
        {label}
        {hint ? <span className="block text-xs text-gray-500">{hint}</span> : null}
      </span>
      {control}
    </label>
  )
}
