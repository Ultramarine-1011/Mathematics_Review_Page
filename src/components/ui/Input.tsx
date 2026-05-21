import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, id, className = '', error, ...props }: InputProps) {
  const inputId = id ?? label
  const errorId = `${inputId}-error`
  return (
    <label htmlFor={inputId} className="block space-y-1.5">
      <span className="text-sm text-slate-400">{label}</span>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-xl border bg-white/5 px-3 py-2 text-white placeholder-slate-500 transition-colors focus:outline-none ${
          error
            ? 'border-rose-400/70 focus:border-rose-300'
            : 'border-white/10 focus:border-sky-400/50'
        } ${className}`}
        {...props}
      />
      {error && (
        <span id={errorId} className="block text-sm text-rose-300">
          {error}
        </span>
      )}
    </label>
  )
}
