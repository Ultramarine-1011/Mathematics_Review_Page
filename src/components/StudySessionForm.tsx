import { useState, type FormEvent } from 'react'
import type { NewStudySessionInput, StudySession, Subject } from '../types'
import { toDateString } from '../utils/date'
import { SUBJECT_LABELS } from '../utils/stats'
import {
  validateStudySessionForm,
  type FieldErrors,
  type StudySessionFormValues,
} from '../utils/validation'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Input } from './ui/Input'
import { Select } from './ui/Select'

interface StudySessionFormProps {
  onSubmit: (input: NewStudySessionInput) => void
  initialValue?: StudySession
  mode?: 'create' | 'edit'
  onCancel?: () => void
  embedded?: boolean
}

const subjectOptions = (Object.keys(SUBJECT_LABELS) as Subject[]).map((key) => ({
  value: key,
  label: SUBJECT_LABELS[key],
}))

function getInitialValues(session?: StudySession): StudySessionFormValues {
  return {
    subject: session?.subject ?? 'math-analysis',
    minutes: session ? String(session.minutes) : '',
    date: session?.date ?? toDateString(new Date()),
    note: session?.note ?? '',
  }
}

export function StudySessionForm({
  onSubmit,
  initialValue,
  mode = 'create',
  onCancel,
  embedded = false,
}: StudySessionFormProps) {
  const initialValues = getInitialValues(initialValue)
  const [subject, setSubject] = useState<Subject>(initialValues.subject)
  const [minutes, setMinutes] = useState(initialValues.minutes)
  const [note, setNote] = useState(initialValues.note)
  const [date, setDate] = useState(initialValues.date)
  const [errors, setErrors] = useState<FieldErrors<keyof StudySessionFormValues>>({})

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const result = validateStudySessionForm({
      subject,
      minutes,
      date,
      note,
    })

    setErrors(result.errors)
    if (!result.input) return

    onSubmit(result.input)

    if (mode === 'create') {
      const values = getInitialValues()
      setSubject(values.subject)
      setMinutes(values.minutes)
      setDate(values.date)
      setNote(values.note)
    }
    setErrors({})
  }

  const content = (
    <>
      {!embedded && (
        <>
          <h2 className="mb-1 text-lg font-semibold text-white">
            {mode === 'edit' ? '编辑学习记录' : '记录学习时长'}
          </h2>
          <p className="mb-4 text-sm text-slate-400">学习记录与任务完成相互独立</p>
        </>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            id={embedded ? `session-subject-${initialValue?.id}` : 'session-subject'}
            label="科目"
            value={subject}
            onChange={(e) => setSubject(e.target.value as Subject)}
            options={subjectOptions}
          />
          <Input
            id={embedded ? `session-minutes-${initialValue?.id}` : 'session-minutes'}
            label="学习时长（分钟）"
            type="number"
            min={1}
            max={720}
            step={1}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            placeholder="例如 45"
            error={errors.minutes}
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id={embedded ? `session-date-${initialValue?.id}` : 'session-date'}
            label="日期"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            error={errors.date}
            required
          />
          <Input
            id={embedded ? `session-note-${initialValue?.id}` : 'session-note'}
            label="备注（可选）"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="例如：极限证明练习"
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" className="w-full sm:w-auto" aria-label={mode === 'edit' ? '保存学习记录修改' : '保存学习记录'}>
            {mode === 'edit' ? '保存修改' : '保存学习记录'}
          </Button>
          {mode === 'edit' && onCancel && (
            <Button
              type="button"
              variant="ghost"
              className="w-full sm:w-auto"
              onClick={onCancel}
              aria-label="取消编辑学习记录"
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
