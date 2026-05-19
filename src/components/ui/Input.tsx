import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Input({ label, id, className = '', ...props }: InputProps) {
  const inputId = id ?? label
  return (
    <label htmlFor={inputId} className="block space-y-1.5">
      <span className="text-sm text-slate-400">{label}</span>
      <input
        id={inputId}
        className={`w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-slate-500 transition-colors focus:border-sky-400/50 focus:outline-none ${className}`}
        {...props}
      />
    </label>
  )
}
