import type { PersistedState } from '../types'
import { CURRENT_DATA_VERSION, DEFAULT_GOAL } from '../utils/defaults'

export const initialTasks: PersistedState['tasks'] = []

export const initialStudySessions: PersistedState['studySessions'] = []

export function getInitialState(): PersistedState {
  return {
    tasks: initialTasks,
    studySessions: initialStudySessions,
    goal: DEFAULT_GOAL,
    version: CURRENT_DATA_VERSION,
  }
}
