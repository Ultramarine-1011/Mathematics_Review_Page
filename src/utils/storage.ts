import { getInitialState } from '../data/mockData'
import type { PersistedState, StudySession, Subject, Task } from '../types'

export const STORAGE_KEY = 'mathematics-review-v2'

const VALID_SUBJECTS: Subject[] = ['math-analysis', 'linear-algebra', 'english']

function isSubject(value: unknown): value is Subject {
  return typeof value === 'string' && VALID_SUBJECTS.includes(value as Subject)
}

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false
  const t = value as Record<string, unknown>
  return (
    typeof t.id === 'string' &&
    typeof t.name === 'string' &&
    isSubject(t.subject) &&
    (t.difficulty === 'easy' || t.difficulty === 'medium' || t.difficulty === 'hard') &&
    typeof t.estimatedMinutes === 'number' &&
    typeof t.completed === 'boolean' &&
    (t.priority === 'low' || t.priority === 'medium' || t.priority === 'high') &&
    typeof t.createdAt === 'string' &&
    (t.completedAt === null || typeof t.completedAt === 'string') &&
    (t.dueDate === undefined || typeof t.dueDate === 'string')
  )
}

function isStudySession(value: unknown): value is StudySession {
  if (!value || typeof value !== 'object') return false
  const s = value as Record<string, unknown>
  return (
    typeof s.id === 'string' &&
    isSubject(s.subject) &&
    typeof s.minutes === 'number' &&
    typeof s.date === 'string' &&
    (s.note === undefined || typeof s.note === 'string')
  )
}

function isPersistedState(value: unknown): value is PersistedState {
  if (!value || typeof value !== 'object') return false
  const state = value as Record<string, unknown>
  return (
    Array.isArray(state.tasks) &&
    state.tasks.every(isTask) &&
    Array.isArray(state.studySessions) &&
    state.studySessions.every(isStudySession)
  )
}

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getInitialState()

    const parsed: unknown = JSON.parse(raw)
    if (isPersistedState(parsed)) return parsed

    console.warn('Invalid stored data, falling back to initial state')
    return getInitialState()
  } catch {
    console.warn('Failed to parse stored data, falling back to initial state')
    return getInitialState()
  }
}

export function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    console.warn('Failed to save data to localStorage')
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    console.warn('Failed to clear localStorage')
  }
}
