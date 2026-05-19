interface ProgressBarProps {
  percent: number
  colorClass: string
}

export function ProgressBar({ percent, colorClass }: ProgressBarProps) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out ${colorClass}`}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  )
}
