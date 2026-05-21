import type {
  Difficulty,
  NewStudySessionInput,
  NewTaskInput,
  Priority,
  StudyGoal,
  StudySession,
  Subject,
  Task,
} from '../types'
import { isValidDateString } from './date'

export const VALID_SUBJECTS: Subject[] = ['math-analysis', 'linear-algebra', 'english']
export const VALID_DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']
export const VALID_PRIORITIES: Priority[] = ['low', 'medium', 'high']
export const MAX_MINUTES_PER_RECORD = 720
export const MAX_GOAL_MINUTES = 10080

export type FieldErrors<T extends string> = Partial<Record<T, string>>

export interface TaskFormValues {
  name: string
  subject: Subject
  difficulty: Difficulty
  estimatedMinutes: string
  priority: Priority
  dueDate: string
}

export interface StudySessionFormValues {
  subject: Subject
  minutes: string
  date: string
  note: string
}

export interface GoalFormValues {
  dailyMinutesTarget: string
  weeklyMinutesTarget: string
  examDate: string
}

export function isSubject(value: unknown): value is Subject {
  return typeof value === 'string' && VALID_SUBJECTS.includes(value as Subject)
}

export function isDifficulty(value: unknown): value is Difficulty {
  return typeof value === 'string' && VALID_DIFFICULTIES.includes(value as Difficulty)
}

export function isPriority(value: unknown): value is Priority {
  return typeof value === 'string' && VALID_PRIORITIES.includes(value as Priority)
}

export function validatePositiveInteger(
  value: unknown,
  label: string,
  max = MAX_MINUTES_PER_RECORD,
): string | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return `${label}必须是正整数`
  }
  if (!Number.isInteger(value)) {
    return `${label}不能是小数`
  }
  if (value <= 0) {
    return `${label}必须大于 0`
  }
  if (value > max) {
    return `${label}不能超过 ${max} 分钟`
  }
  return null
}

export function parsePositiveInteger(
  rawValue: string,
  label: string,
  max = MAX_MINUTES_PER_RECORD,
): { value?: number; error?: string } {
  const trimmed = rawValue.trim()
  if (!trimmed) return { error: `请输入${label}` }

  const value = Number(trimmed)
  const error = validatePositiveInteger(value, label, max)
  if (error) return { error }

  return { value }
}

export function validateTaskForm(
  values: TaskFormValues,
): { input?: NewTaskInput; errors: FieldErrors<keyof TaskFormValues> } {
  const errors: FieldErrors<keyof TaskFormValues> = {}
  const name = values.name.trim()
  const minutesResult = parsePositiveInteger(values.estimatedMinutes, '预计耗时')

  if (!name) errors.name = '请输入任务名称'
  if (minutesResult.error) errors.estimatedMinutes = minutesResult.error
  if (values.dueDate && !isValidDateString(values.dueDate)) {
    errors.dueDate = '请选择有效的截止日期'
  }

  if (Object.keys(errors).length > 0 || minutesResult.value === undefined) {
    return { errors }
  }

  return {
    errors,
    input: {
      name,
      subject: values.subject,
      difficulty: values.difficulty,
      estimatedMinutes: minutesResult.value,
      priority: values.priority,
      dueDate: values.dueDate || undefined,
    },
  }
}

export function validateStudySessionForm(
  values: StudySessionFormValues,
): { input?: NewStudySessionInput; errors: FieldErrors<keyof StudySessionFormValues> } {
  const errors: FieldErrors<keyof StudySessionFormValues> = {}
  const minutesResult = parsePositiveInteger(values.minutes, '学习时长')

  if (minutesResult.error) errors.minutes = minutesResult.error
  if (!values.date) {
    errors.date = '请选择学习日期'
  } else if (!isValidDateString(values.date)) {
    errors.date = '请选择有效的学习日期'
  }

  if (Object.keys(errors).length > 0 || minutesResult.value === undefined) {
    return { errors }
  }

  return {
    errors,
    input: {
      subject: values.subject,
      minutes: minutesResult.value,
      date: values.date,
      note: values.note.trim() || undefined,
    },
  }
}

export function validateGoalForm(
  values: GoalFormValues,
): { goal?: StudyGoal; errors: FieldErrors<keyof GoalFormValues> } {
  const errors: FieldErrors<keyof GoalFormValues> = {}
  const dailyResult = parsePositiveInteger(values.dailyMinutesTarget, '每日目标', MAX_GOAL_MINUTES)
  const weeklyResult = parsePositiveInteger(values.weeklyMinutesTarget, '每周目标', MAX_GOAL_MINUTES)

  if (dailyResult.error) errors.dailyMinutesTarget = dailyResult.error
  if (weeklyResult.error) errors.weeklyMinutesTarget = weeklyResult.error
  if (values.examDate && !isValidDateString(values.examDate)) {
    errors.examDate = '请选择有效的考试日期'
  }

  if (
    Object.keys(errors).length > 0 ||
    dailyResult.value === undefined ||
    weeklyResult.value === undefined
  ) {
    return { errors }
  }

  return {
    errors,
    goal: {
      dailyMinutesTarget: dailyResult.value,
      weeklyMinutesTarget: weeklyResult.value,
      examDate: values.examDate || undefined,
    },
  }
}

export function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false
  const task = value as Record<string, unknown>
  return (
    typeof task.id === 'string' &&
    typeof task.name === 'string' &&
    task.name.trim().length > 0 &&
    isSubject(task.subject) &&
    isDifficulty(task.difficulty) &&
    validatePositiveInteger(task.estimatedMinutes, '预计耗时') === null &&
    typeof task.completed === 'boolean' &&
    isPriority(task.priority) &&
    typeof task.createdAt === 'string' &&
    (task.completedAt === null || typeof task.completedAt === 'string') &&
    (task.dueDate === undefined || isValidDateString(task.dueDate))
  )
}

export function isStudySession(value: unknown): value is StudySession {
  if (!value || typeof value !== 'object') return false
  const session = value as Record<string, unknown>
  return (
    typeof session.id === 'string' &&
    isSubject(session.subject) &&
    validatePositiveInteger(session.minutes, '学习时长') === null &&
    isValidDateString(session.date) &&
    (session.note === undefined || typeof session.note === 'string')
  )
}

export function isStudyGoal(value: unknown): value is StudyGoal {
  if (!value || typeof value !== 'object') return false
  const goal = value as Record<string, unknown>
  return (
    validatePositiveInteger(goal.dailyMinutesTarget, '每日目标', MAX_GOAL_MINUTES) === null &&
    validatePositiveInteger(goal.weeklyMinutesTarget, '每周目标', MAX_GOAL_MINUTES) === null &&
    (goal.examDate === undefined || isValidDateString(goal.examDate))
  )
}

