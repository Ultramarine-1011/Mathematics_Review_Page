import { useState, type FormEvent } from 'react'
import type { NewStudySessionInput, Subject } from '../types'
import { SUBJECT_LABELS, toDateString } from '../utils/stats'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Input } from './ui/Input'
import { Select } from './ui/Select'

interface StudySessionFormProps {
  onSubmit: (input: NewStudySessionInput) => void
}

const subjectOptions = (Object.keys(SUBJECT_LABELS) as Subject[]).map((key) => ({
  value: key,
  label: SUBJECT_LABELS[key],
}))

export function StudySessionForm({ onSubmit }: StudySessionFormProps) {
  const [subject, setSubject] = useState<Subject>('math-analysis')
  const [minutes, setMinutes] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(() => toDateString(new Date()))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const parsedMinutes = Number(minutes)
    if (!parsedMinutes || parsedMinutes <= 0) return

    onSubmit({
      subject,
      minutes: parsedMinutes,
      date,
      note: note.trim() || undefined,
    })

    setMinutes('')
    setNote('')
    setDate(toDateString(new Date()))
  }

  return (
    <Card className="text-left">
      <h2 className="mb-1 text-lg font-semibold text-white">记录学习时长</h2>
      <p className="mb-4 text-sm text-slate-400">学习记录与任务完成相互独立</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="科目"
            value={subject}
            onChange={(e) => setSubject(e.target.value as Subject)}
            options={subjectOptions}
          />
          <Input
            label="学习时长（分钟）"
            type="number"
            min={1}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            placeholder="例如 45"
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="日期"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            label="备注（可选）"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="例如：极限证明练习"
          />
        </div>
        <Button type="submit" className="w-full sm:w-auto">
          保存学习记录
        </Button>
      </form>
    </Card>
  )
}
