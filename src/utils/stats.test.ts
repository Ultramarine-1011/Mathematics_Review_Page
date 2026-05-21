import { describe, expect, it } from 'vitest'
import type { StudySession, Task } from '../types'
import {
  aggregateDailyStudy,
  computeGoalProgress,
  computeStreakDays,
  computeSubjectProgress,
  computeTodayMinutes,
  computeWeekMinutes,
  filterTasks,
  formatDuration,
} from './stats'

const refDate = new Date(2026, 4, 21)

function session(id: string, date: string, minutes: number): StudySession {
  return {
    id,
    date,
    minutes,
    subject: 'math-analysis',
  }
}

function task(overrides: Partial<Task>): Task {
  return {
    id: 'task-1',
    name: '默认任务',
    subject: 'math-analysis',
    difficulty: 'medium',
    estimatedMinutes: 60,
    completed: false,
    priority: 'medium',
    createdAt: '2026-05-01T00:00:00.000Z',
    completedAt: null,
    ...overrides,
  }
}

describe('stats utilities', () => {
  it('formats duration', () => {
    expect(formatDuration(45)).toBe('45 分钟')
    expect(formatDuration(120)).toBe('2 小时')
    expect(formatDuration(135)).toBe('2 小时 15 分钟')
  })

  it('aggregates the last 7 days and ignores older records', () => {
    const result = aggregateDailyStudy(
      [
        session('1', '2026-05-15', 30),
        session('2', '2026-05-21', 45),
        session('3', '2026-05-14', 999),
      ],
      refDate,
    )

    expect(result).toHaveLength(7)
    expect(result[0]).toMatchObject({ date: '2026-05-15', minutes: 30 })
    expect(result[6]).toMatchObject({ date: '2026-05-21', minutes: 45 })
  })

  it('computes today and recent 7-day minutes', () => {
    const sessions = [
      session('1', '2026-05-21', 45),
      session('2', '2026-05-21', 30),
      session('3', '2026-05-18', 60),
      session('4', '2026-05-10', 120),
    ]

    expect(computeTodayMinutes(sessions, refDate)).toBe(75)
    expect(computeWeekMinutes(sessions, refDate)).toBe(135)
  })

  it('keeps streak when today is empty but yesterday has study', () => {
    const sessions = [
      session('1', '2026-05-20', 45),
      session('2', '2026-05-19', 30),
      session('3', '2026-05-17', 60),
    ]

    expect(computeStreakDays(sessions, refDate)).toBe(2)
  })

  it('computes empty states safely', () => {
    expect(computeTodayMinutes([], refDate)).toBe(0)
    expect(computeWeekMinutes([], refDate)).toBe(0)
    expect(computeStreakDays([], refDate)).toBe(0)
    expect(filterTasks([], 'all')).toEqual([])
  })

  it('uses estimated minutes for subject progress weighting', () => {
    const progress = computeSubjectProgress([
      task({ id: '1', estimatedMinutes: 30, completed: true }),
      task({ id: '2', estimatedMinutes: 90, completed: false }),
    ])

    expect(progress.find((item) => item.subject === 'math-analysis')?.percent).toBe(25)
  })

  it('filters tasks by status and subject', () => {
    const tasks = [
      task({ id: '1', subject: 'math-analysis', completed: true }),
      task({ id: '2', subject: 'english', completed: false }),
    ]

    expect(filterTasks(tasks, 'completed')).toHaveLength(1)
    expect(filterTasks(tasks, 'pending', 'english')).toHaveLength(1)
    expect(filterTasks(tasks, 'pending', 'linear-algebra')).toHaveLength(0)
  })

  it('computes goal progress', () => {
    expect(
      computeGoalProgress(90, 630, {
        dailyMinutesTarget: 180,
        weeklyMinutesTarget: 1260,
      }),
    ).toMatchObject({
      dailyPercent: 50,
      weeklyPercent: 50,
      dailyRemaining: 90,
      weeklyRemaining: 630,
      dailyAchieved: false,
      weeklyAchieved: false,
    })
  })
})

