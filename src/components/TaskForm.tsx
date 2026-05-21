import { useState, type FormEvent } from 'react'
import type { Difficulty, NewTaskInput, Priority, Subject, Task } from '../types'
import {
  defaultEstimatedMinutes,
  DIFFICULTY_LABELS,
  PRIORITY_LABELS,
  SUBJECT_LABELS,
} from '../utils/stats'
import { validateTaskForm, type FieldErrors, type TaskFormValues } from '../utils/validation'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Input } from './ui/Input'
import { Select } from './ui/Select'

interface TaskFormProps {
  onSubmit: (input: NewTaskInput) => void
  initialValue?: Task
  mode?: 'create' | 'edit'
  onCancel?: () => void
  embedded?: boolean
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

function getInitialValues(task?: Task): TaskFormValues {
  return {
    name: task?.name ?? '',
    subject: task?.subject ?? 'math-analysis',
    difficulty: task?.difficulty ?? 'medium',
    estimatedMinutes: String(task?.estimatedMinutes ?? defaultEstimatedMinutes('medium')),
    priority: task?.priority ?? 'medium',
    dueDate: task?.dueDate ?? '',
  }
}

export function TaskForm({
  onSubmit,
  initialValue,
  mode = 'create',
  onCancel,
  embedded = false,
}: TaskFormProps) {
  const initialValues = getInitialValues(initialValue)
  const [name, setName] = useState(initialValues.name)
  const [subject, setSubject] = useState<Subject>(initialValues.subject)
  const [difficulty, setDifficulty] = useState<Difficulty>(initialValues.difficulty)
  const [estimatedMinutes, setEstimatedMinutes] = useState(initialValues.estimatedMinutes)
  const [priority, setPriority] = useState<Priority>(initialValues.priority)
  const [dueDate, setDueDate] = useState(initialValues.dueDate)
  const [errors, setErrors] = useState<FieldErrors<keyof TaskFormValues>>({})

  const handleDifficultyChange = (value: Difficulty) => {
    setDifficulty(value)
    if (mode === 'create') {
      setEstimatedMinutes(String(defaultEstimatedMinutes(value)))
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const result = validateTaskForm({
      name,
      subject,
      difficulty,
      estimatedMinutes,
      priority,
      dueDate,
    })

    setErrors(result.errors)
    if (!result.input) return

    onSubmit(result.input)

    if (mode === 'create') {
      const values = getInitialValues()
      setName(values.name)
      setSubject(values.subject)
      setDifficulty(values.difficulty)
      setEstimatedMinutes(values.estimatedMinutes)
      setPriority(values.priority)
      setDueDate(values.dueDate)
    }
    setErrors({})
  }

  const content = (
    <>
      {!embedded && (
        <>
          <h2 className="mb-1 text-lg font-semibold text-white">
            {mode === 'edit' ? '编辑任务' : '添加任务'}
          </h2>
          <p className="mb-4 text-sm text-slate-400">创建新的复习任务并设置预计耗时</p>
        </>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id={embedded ? `task-name-${initialValue?.id}` : 'task-name'}
          label="任务名称"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例如：泰勒展开专项"
          error={errors.name}
          required
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            id={embedded ? `task-subject-${initialValue?.id}` : 'task-subject'}
            label="科目"
            value={subject}
            onChange={(e) => setSubject(e.target.value as Subject)}
            options={subjectOptions}
          />
          <Select
            id={embedded ? `task-difficulty-${initialValue?.id}` : 'task-difficulty'}
            label="难度"
            value={difficulty}
            onChange={(e) => handleDifficultyChange(e.target.value as Difficulty)}
            options={difficultyOptions}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            id={embedded ? `task-minutes-${initialValue?.id}` : 'task-minutes'}
            label="预计耗时（分钟）"
            type="number"
            min={1}
            max={720}
            step={1}
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(e.target.value)}
            error={errors.estimatedMinutes}
            required
          />
          <Select
            id={embedded ? `task-priority-${initialValue?.id}` : 'task-priority'}
            label="优先级"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            options={priorityOptions}
          />
          <Input
            id={embedded ? `task-due-date-${initialValue?.id}` : 'task-due-date'}
            label="截止日期（可选）"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            error={errors.dueDate}
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" className="w-full sm:w-auto" aria-label={mode === 'edit' ? '保存任务修改' : '添加任务'}>
            {mode === 'edit' ? '保存修改' : '添加任务'}
          </Button>
          {mode === 'edit' && onCancel && (
            <Button
              type="button"
              variant="ghost"
              className="w-full sm:w-auto"
              onClick={onCancel}
              aria-label="取消编辑任务"
            >
              取消
            </Button>
          )}
        </div>
      </form>
    </>
  )

  if (embedded) return content

  return (
    <Card className="text-left">
      {content}
    </Card>
  )
}
