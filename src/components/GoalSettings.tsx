import { useState, type FormEvent } from 'react'
import type { GoalProgress, StudyGoal } from '../types'
import { formatDuration } from '../utils/stats'
import { validateGoalForm, type FieldErrors, type GoalFormValues } from '../utils/validation'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Input } from './ui/Input'
import { ProgressBar } from './ui/ProgressBar'

interface GoalSettingsProps {
  goal: StudyGoal
  progress: GoalProgress
  examDays: number | null
  onSave: (goal: StudyGoal) => void
}

export function GoalSettings({ goal, progress, examDays, onSave }: GoalSettingsProps) {
  const [dailyMinutesTarget, setDailyMinutesTarget] = useState(String(goal.dailyMinutesTarget))
  const [weeklyMinutesTarget, setWeeklyMinutesTarget] = useState(String(goal.weeklyMinutesTarget))
  const [examDate, setExamDate] = useState(goal.examDate ?? '')
  const [errors, setErrors] = useState<FieldErrors<keyof GoalFormValues>>({})

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const result = validateGoalForm({
      dailyMinutesTarget,
      weeklyMinutesTarget,
      examDate,
    })

    setErrors(result.errors)
    if (!result.goal) return

    onSave(result.goal)
    setErrors({})
  }

  const examText =
    examDays === null
      ? '未设置考试日期'
      : examDays < 0
        ? `考试日期已过去 ${Math.abs(examDays)} 天`
        : `距离考试还有 ${examDays} 天`

  return (
    <Card className="text-left">
      <div className="mb-4">
        <h2 className="mb-1 text-lg font-semibold text-white">目标设置</h2>
        <p className="text-sm text-slate-400">用每日和每周目标校准复习节奏</p>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-400">今日目标</p>
            <p className="text-sm font-semibold text-white">{progress.dailyPercent}%</p>
          </div>
          <ProgressBar percent={progress.dailyPercent} colorClass="from-emerald-400 to-sky-500" />
          <p className="mt-2 text-sm text-slate-400">
            {progress.dailyAchieved
              ? '今日目标已达成'
              : `还差 ${formatDuration(progress.dailyRemaining)}`}
          </p>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-400">本周目标</p>
            <p className="text-sm font-semibold text-white">{progress.weeklyPercent}%</p>
          </div>
          <ProgressBar percent={progress.weeklyPercent} colorClass="from-sky-400 to-indigo-500" />
          <p className="mt-2 text-sm text-slate-400">
            {progress.weeklyAchieved
              ? '本周目标已达成'
              : `还差 ${formatDuration(progress.weeklyRemaining)}`}
          </p>
        </div>
      </div>

      <p className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
        {examText}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="daily-minutes-target"
            label="每日目标（分钟）"
            type="number"
            min={1}
            step={1}
            value={dailyMinutesTarget}
            onChange={(event) => setDailyMinutesTarget(event.target.value)}
            error={errors.dailyMinutesTarget}
            required
          />
          <Input
            id="weekly-minutes-target"
            label="每周目标（分钟）"
            type="number"
            min={1}
            step={1}
            value={weeklyMinutesTarget}
            onChange={(event) => setWeeklyMinutesTarget(event.target.value)}
            error={errors.weeklyMinutesTarget}
            required
          />
        </div>
        <Input
          id="exam-date"
          label="考试日期（可选）"
          type="date"
          value={examDate}
          onChange={(event) => setExamDate(event.target.value)}
          error={errors.examDate}
        />
        <Button type="submit" className="w-full sm:w-auto" aria-label="保存学习目标">
          保存目标
        </Button>
      </form>
    </Card>
  )
}
