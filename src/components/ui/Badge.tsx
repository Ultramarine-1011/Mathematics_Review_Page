import type { Subject } from '../../types'
import { SUBJECT_LABELS } from '../../utils/stats'

const subjectStyles: Record<Subject, string> = {
  'math-analysis': 'bg-sky-500/20 text-sky-300 ring-sky-500/30',
  'linear-algebra': 'bg-violet-500/20 text-violet-300 ring-violet-500/30',
  english: 'bg-emerald-500/20 text-emerald-300 ring-emerald-500/30',
}

interface BadgeProps {
  subject: Subject
}

export function Badge({ subject }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${subjectStyles[subject]}`}
    >
      {SUBJECT_LABELS[subject]}
    </span>
  )
}
