'use client'

import { MODULES, USED_ACTIONS, permString } from '@/lib/permissions-catalog'

/**
 * Visual permission grid — rows = modules, columns = actions. Click a cell to
 * toggle that permission. Reused by the Role editor (editing a role's preset)
 * and the User editor (editing additive overrides on top of a role baseline).
 *
 * Props:
 *  - value:    string[]  the editable permission set
 *  - onChange: (next: string[]) => void
 *  - readOnly: boolean   render-only (system roles)
 *  - baseline: string[]  permissions granted elsewhere (e.g. the user's role);
 *                        shown as locked-on and never written into `value`
 */
export default function PermissionGrid({ value = [], onChange, readOnly = false, baseline = [] }) {
  const valueSet = new Set(value)
  const baselineSet = new Set(baseline)

  function toggle(perm) {
    if (readOnly || baselineSet.has(perm)) return
    const next = new Set(valueSet)
    if (next.has(perm)) next.delete(perm)
    else next.add(perm)
    onChange?.([...next])
  }

  return (
    <div className="overflow-x-auto border border-gray-800 rounded-xl">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-900">
            <th className="sticky left-0 z-10 bg-gray-900 px-3 py-2 text-left text-gray-400 font-medium">
              Module
            </th>
            {USED_ACTIONS.map((a) => (
              <th key={a.key} className="px-2 py-2 text-center text-gray-400 font-medium whitespace-nowrap">
                {a.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MODULES.map((m) => (
            <tr key={m.key} className="border-t border-gray-800">
              <td className="sticky left-0 z-10 bg-gray-950 px-3 py-2 text-white font-medium whitespace-nowrap">
                {m.label}
              </td>
              {USED_ACTIONS.map((a) => {
                const valid = m.actions.includes(a.key)
                if (!valid) {
                  return <td key={a.key} className="px-2 py-2 text-center text-gray-700">·</td>
                }
                const perm = permString(m.prefix, a.key)
                const fromBaseline = baselineSet.has(perm)
                const checked = valueSet.has(perm) || fromBaseline
                const locked = readOnly || fromBaseline
                return (
                  <td key={a.key} className="px-2 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => toggle(perm)}
                      disabled={locked}
                      title={fromBaseline ? `${perm} (from role)` : perm}
                      aria-pressed={checked}
                      className={[
                        'w-5 h-5 rounded border transition-colors',
                        checked
                          ? fromBaseline
                            ? 'bg-emerald-900 border-emerald-700'
                            : 'bg-emerald-600 border-emerald-500'
                          : 'bg-gray-800 border-gray-700 hover:border-gray-500',
                        locked ? 'cursor-not-allowed' : 'cursor-pointer',
                      ].join(' ')}
                    >
                      {checked && (
                        <span className={fromBaseline ? 'text-emerald-300' : 'text-white'}>✓</span>
                      )}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
