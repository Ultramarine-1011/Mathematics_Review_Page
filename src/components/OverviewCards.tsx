import type { StudyStats } from '../types'
import { formatDuration } from '../utils/stats'
import { Card } from './ui/Card'

interface OverviewCardsProps {
  stats: StudyStats
}

const items = [
  { key: 'today', label: '今日学习', icon: '⏱️', getValue: (s: StudyStats) => formatDuration(s.todayMinutes) },
  { key: 'week', label: '本周学习', icon: '📅', getValue: (s: StudyStats) => formatDuration(s.weekMinutes) },
  { key: 'tasks', label: '已完成任务', icon: '✅', getValue: (s: StudyStats) => `${s.completedTasks} / ${s.totalTasks}` },
  { key: 'streak', label: '连续学习', icon: '🔥', getValue: (s: StudyStats) => `${s.streakDays} 天` },
] as const

export function OverviewCards({ stats }: OverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.key} className="text-left">
          <div className="mb-2 text-2xl">{item.icon}</div>
          <p className="text-sm text-slate-400">{item.label}</p>
          <p className="mt-1 text-2xl font-semibold text-white">{item.getValue(stats)}</p>
        </Card>
      ))}
    </div>
  )
}
