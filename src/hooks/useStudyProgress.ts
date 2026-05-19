import { useCallback, useMemo, useState } from 'react'
import { initialDailyStudy, initialTasks } from '../data/mockData'
import type { DailyStudy, StudyStats, SubjectProgress, Task } from '../types'
import {
  computeStats,
  computeSubjectProgress,
  minutesForDifficulty,
} from '../utils/stats'

export function useStudyProgress() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [dailyStudy, setDailyStudy] = useState<DailyStudy[]>(initialDailyStudy)

  const stats: StudyStats = useMemo(
    () => computeStats(tasks, dailyStudy),
    [tasks, dailyStudy],
  )

  const subjectProgress: SubjectProgress[] = useMemo(
    () => computeSubjectProgress(tasks),
    [tasks],
  )

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === id)
      if (!task) return prev

      const willComplete = !task.completed
      const delta = willComplete
        ? minutesForDifficulty(task.difficulty)
        : -minutesForDifficulty(task.difficulty)

      setDailyStudy((daily) => {
        if (daily.length === 0) return daily
        const next = [...daily]
        const last = next[next.length - 1]
        next[next.length - 1] = {
          ...last,
          minutes: Math.max(0, last.minutes + delta),
        }
        return next
      })

      return prev.map((t) =>
        t.id === id ? { ...t, completed: willComplete } : t,
      )
    })
  }, [])

  return { tasks, dailyStudy, stats, subjectProgress, toggleTask }
}
