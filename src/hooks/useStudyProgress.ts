import { useCallback, useEffect, useMemo, useState } from 'react'
import { getInitialState } from '../data/mockData'
import type {
  NewStudySessionInput,
  NewTaskInput,
  StudySession,
  Task,
} from '../types'
import {
  aggregateDailyStudy,
  computeStats,
  computeSubjectProgress,
} from '../utils/stats'
import { clearState, loadState, saveState } from '../utils/storage'

export function useStudyProgress() {
  const [tasks, setTasks] = useState<Task[]>(() => loadState().tasks)
  const [studySessions, setStudySessions] = useState<StudySession[]>(
    () => loadState().studySessions,
  )

  useEffect(() => {
    saveState({ tasks, studySessions })
  }, [tasks, studySessions])

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

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task
        const willComplete = !task.completed
        return {
          ...task,
          completed: willComplete,
          completedAt: willComplete ? new Date().toISOString() : null,
        }
      }),
    )
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

    setStudySessions((prev) => [...prev, session])
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

    setTasks((prev) => [...prev, task])
  }, [])

  const resetToInitial = useCallback(() => {
    clearState()
    const initial = getInitialState()
    setTasks(initial.tasks)
    setStudySessions(initial.studySessions)
  }, [])

  return {
    tasks,
    studySessions,
    stats,
    subjectProgress,
    dailyStudy,
    toggleTask,
    addStudySession,
    addTask,
    resetToInitial,
  }
}
