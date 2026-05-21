import { getInitialState } from '../data/mockData'
import type { PersistedState } from '../types'
import { CURRENT_DATA_VERSION, DEFAULT_GOAL } from './defaults'
import { isStudyGoal, isStudySession, isTask } from './validation'

export const STORAGE_KEY = 'mathematics-review-v2'

export interface LoadStateResult {
  state: PersistedState
  error?: string
}

function normalizePersistedState(value: unknown): PersistedState | null {
  if (!value || typeof value !== 'object') return null
  const state = value as Record<string, unknown>
  const tasks = state.tasks
  const studySessions = state.studySessions
  const goal = state.goal

  if (!Array.isArray(tasks) || !tasks.every(isTask)) return null
  if (!Array.isArray(studySessions) || !studySessions.every(isStudySession)) return null

  return {
    tasks,
    studySessions,
    goal: isStudyGoal(goal) ? goal : DEFAULT_GOAL,
    version: CURRENT_DATA_VERSION,
  }
}

export function loadState(): LoadStateResult {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { state: getInitialState() }

    const parsed: unknown = JSON.parse(raw)
    const normalized = normalizePersistedState(parsed)
    if (normalized) return { state: normalized }

    return {
      state: getInitialState(),
      error: '本地保存的数据结构无效，已载入初始数据。',
    }
  } catch {
    return {
      state: getInitialState(),
      error: '读取本地数据失败，已载入初始数据。',
    }
  }
}

export function saveState(state: PersistedState): string | undefined {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return undefined
  } catch {
    return '保存到本地存储失败，请检查浏览器存储空间或隐私设置。'
  }
}

export function clearState(): string | undefined {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return undefined
  } catch {
    return '清空本地数据失败，请稍后重试。'
  }
}
