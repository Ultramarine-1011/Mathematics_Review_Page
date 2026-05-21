import type { SelectHTMLAttributes } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  error?: string
}

export function Select({ label, id, options, className = '', error, ...props }: SelectProps) {
  const selectId = id ?? label
  const errorId = `${selectId}-error`
  return (
    <label htmlFor={selectId} className="block space-y-1.5">
      <span className="text-sm text-slate-400">{label}</span>
      <select
        id={selectId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-xl border bg-white/5 px-3 py-2 text-white transition-colors focus:outline-none ${
          error
            ? 'border-rose-400/70 focus:border-rose-300'
            : 'border-white/10 focus:border-sky-400/50'
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-900">
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={errorId} className="block text-sm text-rose-300">
          {error}
        </span>
      )}
    </label>
  )
}
