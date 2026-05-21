import { useMemo, useState } from 'react'
import type { NewStudySessionInput, StudySession } from '../types'
import { SUBJECT_LABELS } from '../utils/stats'
import { StudySessionForm } from './StudySessionForm'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

interface StudySessionListProps {
  studySessions: StudySession[]
  onUpdate: (id: string, input: NewStudySessionInput) => void
  onDelete: (id: string) => void
  onUpdated: () => void
}

export function StudySessionList({
  studySessions,
  onUpdate,
  onDelete,
  onUpdated,
}: StudySessionListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const recentSessions = useMemo(
    () =>
      studySessions
        .map((session, index) => ({ session, index }))
        .sort((a, b) => b.session.date.localeCompare(a.session.date) || b.index - a.index)
        .slice(0, 10)
        .map((item) => item.session),
    [studySessions],
  )

  const handleUpdate = (id: string, input: NewStudySessionInput) => {
    onUpdate(id, input)
    setEditingId(null)
    onUpdated()
  }

  return (
    <Card className="text-left">
      <h2 className="mb-1 text-lg font-semibold text-white">最近学习记录</h2>
      <p className="mb-4 text-sm text-slate-400">显示最近 10 条，修改后统计会自动更新</p>

      {recentSessions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center">
          <p className="text-slate-300">记录今天的第一段学习</p>
          <p className="mt-1 text-sm text-slate-500">保存学习记录后会出现在这里</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {recentSessions.map((session) => (
            <li
              key={session.id}
              className="rounded-xl border border-white/5 bg-white/5 px-4 py-3"
            >
              {editingId === session.id ? (
                <StudySessionForm
                  mode="edit"
                  embedded
                  initialValue={session}
                  onSubmit={(input) => handleUpdate(session.id, input)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-white">{session.date}</span>
                      <Badge subject={session.subject} />
                      <span className="rounded-md bg-sky-500/15 px-2 py-0.5 text-xs font-medium text-sky-300">
                        {session.minutes} 分钟
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">
                      {session.note?.trim() || '无备注'}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      科目：{SUBJECT_LABELS[session.subject]}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="px-3"
                      onClick={() => setEditingId(session.id)}
                      aria-label={`编辑 ${session.date} 的学习记录`}
                    >
                      编辑
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      className="px-3"
                      onClick={() => onDelete(session.id)}
                      aria-label={`删除 ${session.date} 的学习记录`}
                    >
                      删除
                    </Button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
