import type { PersistedState, StudySession, Task } from '../types'
import { toDateString } from './date'
import { CURRENT_DATA_VERSION } from './defaults'
import { DIFFICULTY_LABELS, PRIORITY_LABELS, SUBJECT_LABELS } from './stats'

const JSON_MIME_TYPE = 'application/json;charset=utf-8'
const CSV_MIME_TYPE = 'text/csv;charset=utf-8'

function csvEscape(value: string | number | boolean | null | undefined): string {
  const text = value === null || value === undefined ? '' : String(value)
  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`
  }
  return text
}

function buildCsv(headers: string[], rows: Array<Array<string | number | boolean | null | undefined>>): string {
  const lines = [
    headers.map(csvEscape).join(','),
    ...rows.map((row) => row.map(csvEscape).join(',')),
  ]
  return `\uFEFF${lines.join('\n')}`
}

export function buildBackupFilename(refDate: Date = new Date()): string {
  return `mathematics-review-backup-${toDateString(refDate)}.json`
}

export function createJsonBackup(state: PersistedState, exportedAt: string = new Date().toISOString()): string {
  return JSON.stringify(
    {
      ...state,
      version: CURRENT_DATA_VERSION,
      exportedAt,
    },
    null,
    2,
  )
}

export function createTasksCsv(tasks: Task[]): string {
  return buildCsv(
    [
      'id',
      'name',
      'subject',
      'subjectLabel',
      'difficulty',
      'difficultyLabel',
      'estimatedMinutes',
      'completed',
      'priority',
      'priorityLabel',
      'dueDate',
      'createdAt',
      'completedAt',
    ],
    tasks.map((task) => [
      task.id,
      task.name,
      task.subject,
      SUBJECT_LABELS[task.subject],
      task.difficulty,
      DIFFICULTY_LABELS[task.difficulty],
      task.estimatedMinutes,
      task.completed,
      task.priority,
      PRIORITY_LABELS[task.priority],
      task.dueDate,
      task.createdAt,
      task.completedAt,
    ]),
  )
}

export function createStudySessionsCsv(studySessions: StudySession[]): string {
  return buildCsv(
    ['id', 'date', 'subject', 'subjectLabel', 'minutes', 'note'],
    studySessions.map((session) => [
      session.id,
      session.date,
      session.subject,
      SUBJECT_LABELS[session.subject],
      session.minutes,
      session.note,
    ]),
  )
}

export function downloadTextFile(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function downloadJsonBackup(state: PersistedState): void {
  downloadTextFile(buildBackupFilename(), createJsonBackup(state), JSON_MIME_TYPE)
}

export function downloadTasksCsv(tasks: Task[]): void {
  downloadTextFile('tasks.csv', createTasksCsv(tasks), CSV_MIME_TYPE)
}

export function downloadStudySessionsCsv(studySessions: StudySession[]): void {
  downloadTextFile('study-sessions.csv', createStudySessionsCsv(studySessions), CSV_MIME_TYPE)
}

