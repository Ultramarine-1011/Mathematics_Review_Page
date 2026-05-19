import type { SelectHTMLAttributes } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
}

export function Select({ label, id, options, className = '', ...props }: SelectProps) {
  const selectId = id ?? label
  return (
    <label htmlFor={selectId} className="block space-y-1.5">
      <span className="text-sm text-slate-400">{label}</span>
      <select
        id={selectId}
        className={`w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white transition-colors focus:border-sky-400/50 focus:outline-none ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-900">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
