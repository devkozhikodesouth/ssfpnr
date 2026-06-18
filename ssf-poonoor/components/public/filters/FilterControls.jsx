'use client'

/**
 * Presentational filter field renderer shared by FilterSidebar (desktop) and
 * FilterBottomSheet (mobile) — so filter markup exists once. Driven entirely by
 * `values` + `onChange(key, value)`; the parent decides whether a change commits
 * to the URL immediately (sidebar) or is staged until "Apply" (bottom sheet).
 *
 * Selecting an already-active single value clears it (toggle-off).
 *
 * @param {{ fields: object[], values: Record<string,string>, onChange: (k,v)=>void }} props
 */
export default function FilterControls({ fields = [], values = {}, onChange }) {
  const toggle = (key, value) => onChange(key, String(values[key]) === String(value) ? '' : value)

  return (
    <div className="space-y-5">
      {fields.map((field) => {
        if (field.type === 'chips') {
          const opts = field.options || []
          if (!opts.length) return null
          return (
            <div key={field.key} className="space-y-2">
              <span className="block text-[9px] font-bold text-accent uppercase tracking-widest">{field.label}</span>
              <div className="flex flex-wrap gap-2">
                {opts.map((o) => {
                  const active = String(values[field.key]) === String(o.value)
                  return (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => toggle(field.key, o.value)}
                      className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-colors ${
                        active
                          ? 'bg-primary text-white border-primary'
                          : 'bg-gray-50 border-gray-200 text-slate-600 hover:bg-gray-100'
                      }`}
                      style={active && o.color ? { backgroundColor: o.color, borderColor: o.color } : undefined}
                    >
                      {o.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        }

        if (field.type === 'segment') {
          return (
            <div key={field.key} className="space-y-2">
              <span className="block text-[9px] font-bold text-accent uppercase tracking-widest">{field.label}</span>
              <div className="bg-gray-100 p-0.5 rounded-lg flex items-center">
                {field.options.map((o) => {
                  const active = String(values[field.key]) === String(o.value)
                  return (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => toggle(field.key, o.value)}
                      className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-colors ${
                        active ? 'bg-white shadow text-primary' : 'text-slate-600 hover:bg-white/50'
                      }`}
                    >
                      {o.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        }

        if (field.type === 'toggle') {
          const active = values[field.key] === 'true'
          return (
            <label key={field.key} className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-semibold text-slate-700">{field.label}</span>
              <button
                type="button"
                role="switch"
                aria-checked={active}
                onClick={() => onChange(field.key, active ? '' : 'true')}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors ${active ? 'bg-primary' : 'bg-gray-300'}`}
              >
                <span className={`block w-4 h-4 bg-white rounded-full transition-transform ${active ? 'translate-x-4' : ''}`} />
              </button>
            </label>
          )
        }

        if (field.type === 'daterange') {
          return (
            <div key={field.key} className="space-y-2">
              <span className="block text-[9px] font-bold text-accent uppercase tracking-widest">{field.label}</span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={values.from || ''}
                  onChange={(e) => onChange('from', e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 text-[10px] text-slate-700 rounded-lg py-2 px-2 focus:outline-none focus:border-primary"
                />
                <span className="text-gray-400 text-xs">–</span>
                <input
                  type="date"
                  value={values.to || ''}
                  onChange={(e) => onChange('to', e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 text-[10px] text-slate-700 rounded-lg py-2 px-2 focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )
        }

        return null
      })}
    </div>
  )
}
