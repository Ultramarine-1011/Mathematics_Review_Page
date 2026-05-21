import type { PersistedState } from '../types'
import { CURRENT_DATA_VERSION, DEFAULT_GOAL } from './defaults'
import { isStudyGoal, isStudySession, isTask } from './validation'

export type ImportResult =
  | { ok: true; state: PersistedState }
  | { ok: false; error: string }

function hasObjectShape(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function validateImportedState(value: unknown): ImportResult {
  if (!hasObjectShape(value)) {
    return { ok: false, error: '备份文件不是有效的数据对象。' }
  }

  const tasks = value.tasks
  const studySessions = value.studySessions
  const goal = value.goal

  if (!Array.isArray(tasks)) {
    return { ok: false, error: '备份文件缺少有效的 tasks 数组。' }
  }
  if (!tasks.every(isTask)) {
    return { ok: false, error: '任务数据结构无效，请检查备份文件。' }
  }

  if (!Array.isArray(studySessions)) {
    return { ok: false, error: '备份文件缺少有效的 studySessions 数组。' }
  }
  if (!studySessions.every(isStudySession)) {
    return { ok: false, error: '学习记录数据结构无效，请检查备份文件。' }
  }

  let normalizedGoal = DEFAULT_GOAL
  if (goal !== undefined) {
    if (!isStudyGoal(goal)) {
      return { ok: false, error: '目标设置数据结构无效，请检查备份文件。' }
    }
    normalizedGoal = goal
  }

  return {
    ok: true,
    state: {
      tasks,
      studySessions,
      goal: normalizedGoal,
      version: CURRENT_DATA_VERSION,
    },
  }
}

export function parseBackupJson(raw: string): ImportResult {
  try {
    const parsed: unknown = JSON.parse(raw)
    return validateImportedState(parsed)
  } catch {
    return { ok: false, error: 'JSON 解析失败，请选择有效的备份文件。' }
  }
}
