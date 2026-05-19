import { useState, type FormEvent } from 'react'
import type { Difficulty, NewTaskInput, Priority, Subject } from '../types'
import {
  defaultEstimatedMinutes,
  DIFFICULTY_LABELS,
  PRIORITY_LABELS,
  SUBJECT_LABELS,
} from '../utils/stats'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Input } from './ui/Input'
import { Select } from './ui/Select'

interface TaskFormProps {
  onSubmit: (input: NewTaskInput) => void
}

const subjectOptions = (Object.keys(SUBJECT_LABELS) as Subject[]).map((key) => ({
  value: key,
  label: SUBJECT_LABELS[key],
}))

const difficultyOptions = (Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((key) => ({
  value: key,
  label: DIFFICULTY_LABELS[key],
}))

const priorityOptions = (Object.keys(PRIORITY_LABELS) as Priority[]).map((key) => ({
  value: key,
  label: PRIORITY_LABELS[key],
}))

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [name, setName] = useState('')
  const [subject, setSubject] = useState<Subject>('math-analysis')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [estimatedMinutes, setEstimatedMinutes] = useState(String(defaultEstimatedMinutes('medium')))
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')

  const handleDifficultyChange = (value: Difficulty) => {
    setDifficulty(value)
    setEstimatedMinutes(String(defaultEstimatedMinutes(value)))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()
    const parsedMinutes = Number(estimatedMinutes)
    if (!trimmedName || !parsedMinutes || parsedMinutes <= 0) return

    onSubmit({
      name: trimmedName,
      subject,
      difficulty,
      estimatedMinutes: parsedMinutes,
      priority,
      dueDate: dueDate || undefined,
    })

    setName('')
    setSubject('math-analysis')
    setDifficulty('medium')
    setEstimatedMinutes(String(defaultEstimatedMinutes('medium')))
    setPriority('medium')
    setDueDate('')
  }

  return (
    <Card className="text-left">
      <h2 className="mb-1 text-lg font-semibold text-white">添加任务</h2>
      <p className="mb-4 text-sm text-slate-400">创建新的复习任务并设置预计耗时</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="任务名称"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例如：泰勒展开专项"
          required
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="科目"
            value={subject}
            onChange={(e) => setSubject(e.target.value as Subject)}
            options={subjectOptions}
          />
          <Select
            label="难度"
            value={difficulty}
            onChange={(e) => handleDifficultyChange(e.target.value as Difficulty)}
            options={difficultyOptions}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="预计耗时（分钟）"
            type="number"
            min={1}
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(e.target.value)}
            required
          />
          <Select
            label="优先级"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            options={priorityOptions}
          />
          <Input
            label="截止日期（可选）"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full sm:w-auto">
          添加任务
        </Button>
      </form>
    </Card>
  )
}
