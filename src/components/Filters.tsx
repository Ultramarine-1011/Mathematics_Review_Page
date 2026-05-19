import type { Subject, TaskFilterStatus } from '../types'
import { SUBJECT_LABELS } from '../utils/stats'

interface FiltersProps {
  status: TaskFilterStatus
  subject: Subject | 'all'
  onStatusChange: (status: TaskFilterStatus) => void
  onSubjectChange: (subject: Subject | 'all') => void
}

const statusOptions: { value: TaskFilterStatus; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待完成' },
  { value: 'completed', label: '已完成' },
]

export function Filters({
  status,
  subject,
  onStatusChange,
  onSubjectChange,
}: FiltersProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onStatusChange(option.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              status === option.value
                ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/40'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <select
        value={subject}
        onChange={(e) => onSubjectChange(e.target.value as Subject | 'all')}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-sky-400/50 focus:outline-none sm:w-auto"
        aria-label="按科目筛选"
      >
        <option value="all" className="bg-slate-900">
          全部科目
        </option>
        {(Object.keys(SUBJECT_LABELS) as Subject[]).map((key) => (
          <option key={key} value={key} className="bg-slate-900">
            {SUBJECT_LABELS[key]}
          </option>
        ))}
      </select>
    </div>
  )
}
