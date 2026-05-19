import type { SubjectProgress as SubjectProgressType } from '../types'
import { Card } from './ui/Card'
import { ProgressBar } from './ui/ProgressBar'

interface SubjectProgressProps {
  subjects: SubjectProgressType[]
}

export function SubjectProgress({ subjects }: SubjectProgressProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {subjects.map((s) => (
        <Card key={s.subject} className="text-left">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-white">{s.label}</h3>
            <span className="text-lg font-bold text-white">{s.percent}%</span>
          </div>
          <ProgressBar percent={s.percent} colorClass={s.color} />
          <p className="mt-3 text-sm text-slate-400">
            {s.total === 0 ? (
              '暂无任务'
            ) : s.progressMode === 'minutes' ? (
              <>
                已完成 {s.completedMinutes}/{s.totalMinutes} 分钟 · 剩余 {s.remaining} 项任务
              </>
            ) : (
              <>
                已完成 {s.completed}/{s.total} · 剩余 {s.remaining} 项任务
              </>
            )}
          </p>
        </Card>
      ))}
    </div>
  )
}
