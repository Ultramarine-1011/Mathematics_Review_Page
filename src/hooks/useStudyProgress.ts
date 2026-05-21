import { useCallback, useEffect, useMemo, useState } from 'react'
import { getInitialState } from '../data/mockData'
import type {
  NewStudySessionInput,
  NewTaskInput,
  PersistedState,
  StudyGoal,
  StudySession,
  Task,
} from '../types'
import {
  aggregateDailyStudy,
  computeGoalProgress,
  computeStats,
  computeSubjectProgress,
  daysUntilExam,
} from '../utils/stats'
import { clearState, loadState, saveState } from '../utils/storage'
import { CURRENT_DATA_VERSION } from '../utils/defaults'

export function useStudyProgress() {
  const [loadResult] = useState(() => loadState())
  const [state, setState] = useState<PersistedState>(loadResult.state)
  const [storageError, setStorageError] = useState<string | undefined>(loadResult.error)

  const { tasks, studySessions, goal } = state

  useEffect(() => {
    const error = saveState(state)
    if (error) {
      window.setTimeout(() => setStorageError(error), 0)
    }
  }, [state])

  const stats = useMemo(
    () => computeStats(tasks, studySessions),
    [tasks, studySessions],
  )

  const subjectProgress = useMemo(
    () => computeSubjectProgress(tasks),
    [tasks],
  )

  const dailyStudy = useMemo(
    () => aggregateDailyStudy(studySessions),
    [studySessions],
  )

  const goalProgress = useMemo(
    () => computeGoalProgress(stats.todayMinutes, stats.weekMinutes, goal),
    [goal, stats.todayMinutes, stats.weekMinutes],
  )

  const examDays = useMemo(
    () => daysUntilExam(goal.examDate),
    [goal.examDate],
  )

  const toggleTask = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => {
        if (task.id !== id) return task
        const willComplete = !task.completed
        return {
          ...task,
          completed: willComplete,
          completedAt: willComplete ? new Date().toISOString() : null,
        }
      }),
    }))
  }, [])

  const addStudySession = useCallback((input: NewStudySessionInput) => {
    if (input.minutes <= 0) return

    const session: StudySession = {
      id: crypto.randomUUID(),
      subject: input.subject,
      minutes: input.minutes,
      date: input.date,
      note: input.note?.trim() || undefined,
    }

    setState((prev) => ({
      ...prev,
      studySessions: [...prev.studySessions, session],
    }))
  }, [])

  const updateStudySession = useCallback((id: string, input: NewStudySessionInput) => {
    setState((prev) => ({
      ...prev,
      studySessions: prev.studySessions.map((session) =>
        session.id === id
          ? {
              ...session,
              subject: input.subject,
              minutes: input.minutes,
              date: input.date,
              note: input.note?.trim() || undefined,
            }
          : session,
      ),
    }))
  }, [])

  const deleteStudySession = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      studySessions: prev.studySessions.filter((session) => session.id !== id),
    }))
  }, [])

  const addTask = useCallback((input: NewTaskInput) => {
    const task: Task = {
      id: crypto.randomUUID(),
      name: input.name.trim(),
      subject: input.subject,
      difficulty: input.difficulty,
      estimatedMinutes: input.estimatedMinutes,
      priority: input.priority,
      dueDate: input.dueDate || undefined,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    }

    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, task],
    }))
  }, [])

  const updateTask = useCallback((id: string, input: NewTaskInput) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              name: input.name.trim(),
              subject: input.subject,
              difficulty: input.difficulty,
              estimatedMinutes: input.estimatedMinutes,
              priority: input.priority,
              dueDate: input.dueDate || undefined,
            }
          : task,
      ),
    }))
  }, [])

  const deleteTask = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== id),
    }))
  }, [])

  const updateGoal = useCallback((nextGoal: StudyGoal) => {
    setState((prev) => ({
      ...prev,
      goal: nextGoal,
    }))
  }, [])

  const importState = useCallback((nextState: PersistedState) => {
    setState({
      ...nextState,
      version: CURRENT_DATA_VERSION,
    })
  }, [])

  const resetToInitial = useCallback(() => {
    const error = clearState()
    if (error) setStorageError(error)
    const initial = getInitialState()
    setState(initial)
  }, [])

  return {
    tasks,
    studySessions,
    goal,
    persistedState: state,
    stats,
    subjectProgress,
    dailyStudy,
    goalProgress,
    examDays,
    storageError,
    toggleTask,
    addStudySession,
    updateStudySession,
    deleteStudySession,
    addTask,
    updateTask,
    deleteTask,
    updateGoal,
    importState,
    resetToInitial,
  }
}
