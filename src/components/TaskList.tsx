import { useState } from 'react'
import type { NewTaskInput, Task } from '../types'
import {
  DIFFICULTY_LABELS,
  formatDateTime,
  isOverdue,
  PRIORITY_LABELS,
} from '../utils/stats'
import { TaskForm } from './TaskForm'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: string) => void
  onUpdate: (id: string, input: NewTaskInput) => void
  onDelete: (id: string) => void
  onUpdated: () => void
  emptyTitle: string
  emptyDescription: string
}

const difficultyStyles = {
  easy: 'bg-green-500/15 text-green-300',
  medium: 'bg-amber-500/15 text-amber-300',
  hard: 'bg-rose-500/15 text-rose-300',
} as const

const priorityStyles = {
  low: '',
  medium: '',
  high: 'border-l-2 border-amber-400/80 pl-3',
} as const

export function TaskList({
  tasks,
  onToggle,
  onUpdate,
  onDelete,
  onUpdated,
  emptyTitle,
  emptyDescription,
}: TaskListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleUpdate = (id: string, input: NewTaskInput) => {
    onUpdate(id, input)
    setEditingId(null)
    onUpdated()
  }

  return (
    <Card className="text-left">
      <h2 className="mb-1 text-lg font-semibold text-white">任务列表</h2>
      <p className="mb-4 text-sm text-slate-400">切换完成状态不会改变学习时长</p>

      {tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center">
          <p className="text-slate-300">{emptyTitle}</p>
          <p className="mt-1 text-sm text-slate-500">{emptyDescription}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => {
            const overdue = isOverdue(task.dueDate, task.completed)
            return (
              <li
                key={task.id}
                className={`group flex flex-col gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3 transition-all duration-200 hover:border-white/15 hover:bg-white/10 sm:flex-row sm:items-start ${priorityStyles[task.priority]}`}
              >
                {editingId === task.id ? (
                  <div className="min-w-0 flex-1">
                    <TaskForm
                      mode="edit"
                      embedded
                      initialValue={task}
                      onSubmit={(input) => handleUpdate(task.id, input)}
                      onCancel={() => setEditingId(null)}
                    />
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => onToggle(task.id)}
                      aria-label={task.completed ? `标记 ${task.name} 为未完成` : `标记 ${task.name} 为已完成`}
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        task.completed
                          ? 'scale-100 border-emerald-400 bg-emerald-500/30'
                          : 'border-slate-500 bg-transparent hover:scale-105 hover:border-sky-400'
                      }`}
                    >
                      {task.completed && (
                        <svg
                          className="h-4 w-4 text-emerald-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p
                          className={`font-medium transition-all duration-300 ${
                            task.completed ? 'text-slate-500 line-through' : 'text-white'
                          }`}
                        >
                          {task.name}
                        </p>
                        <span
                          className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                            task.completed
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : 'bg-slate-500/15 text-slate-300'
                          }`}
                        >
                          {task.completed ? '已完成' : '待完成'}
                        </span>
                        {task.priority === 'high' && (
                          <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-300">
                            高优先级
                          </span>
                        )}
                        {overdue && (
                          <span className="rounded-md bg-rose-500/15 px-2 py-0.5 text-xs font-medium text-rose-300">
                            已逾期
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <Badge subject={task.subject} />
                        <span
                          className={`rounded-md px-2 py-0.5 text-xs font-medium ${difficultyStyles[task.difficulty]}`}
                        >
                          {DIFFICULTY_LABELS[task.difficulty]}
                        </span>
                        <span className="text-xs text-slate-500">
                          预计 {task.estimatedMinutes} 分钟
                        </span>
                        <span className="text-xs text-slate-500">
                          优先级 {PRIORITY_LABELS[task.priority]}
                        </span>
                        {task.dueDate && (
                          <span className={`text-xs ${overdue ? 'text-rose-400' : 'text-slate-500'}`}>
                            截止 {task.dueDate}
                          </span>
                        )}
                      </div>
                      {task.completed && task.completedAt && (
                        <p className="mt-1.5 text-xs text-emerald-400/80">
                          完成于 {formatDateTime(task.completedAt)}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                      <Button
                        type="button"
                        variant="ghost"
                        className="px-3"
                        onClick={() => setEditingId(task.id)}
                        aria-label={`编辑任务 ${task.name}`}
                      >
                        编辑
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        className="px-3"
                        onClick={() => onDelete(task.id)}
                        aria-label={`删除任务 ${task.name}`}
                      >
                        删除
                      </Button>
                    </div>
                  </>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
