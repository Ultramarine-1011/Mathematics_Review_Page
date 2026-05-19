import type { Task } from '../types'
import { DIFFICULTY_LABELS } from '../utils/stats'
import { Badge } from './ui/Badge'
import { Card } from './ui/Card'

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: string) => void
}

const difficultyStyles = {
  easy: 'bg-green-500/15 text-green-300',
  medium: 'bg-amber-500/15 text-amber-300',
  hard: 'bg-rose-500/15 text-rose-300',
} as const

export function TaskList({ tasks, onToggle }: TaskListProps) {
  return (
    <Card className="text-left">
      <h2 className="mb-1 text-lg font-semibold text-white">今日任务</h2>
      <p className="mb-4 text-sm text-slate-400">点击左侧圆圈切换完成状态</p>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3 transition-all duration-200 hover:border-white/15 hover:bg-white/10"
          >
            <button
              type="button"
              onClick={() => onToggle(task.id)}
              aria-label={task.completed ? '标记为未完成' : '标记为已完成'}
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                task.completed
                  ? 'border-emerald-400 bg-emerald-500/30 scale-100'
                  : 'border-slate-500 bg-transparent hover:border-sky-400 hover:scale-110'
              }`}
            >
              {task.completed && (
                <svg className="h-3.5 w-3.5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <div className="min-w-0 flex-1">
              <p
                className={`font-medium transition-all duration-300 ${
                  task.completed ? 'text-slate-500 line-through' : 'text-white'
                }`}
              >
                {task.name}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <Badge subject={task.subject} />
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-medium ${difficultyStyles[task.difficulty]}`}
                >
                  {DIFFICULTY_LABELS[task.difficulty]}
                </span>
              </div>
            </div>
            <span
              className={`shrink-0 text-xs font-medium transition-colors ${
                task.completed ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
              }`}
            >
              {task.completed ? '已完成' : '待完成'}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
