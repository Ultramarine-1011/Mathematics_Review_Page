import type { PersistedState, StudySession, Subject, Task } from '../types'

const now = new Date()
const daysAgo = (n: number) => {
  const d = new Date(now)
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

const dateStr = (n: number) => daysAgo(n).slice(0, 10)

export const initialTasks: Task[] = [
  {
    id: '1',
    name: 'ε-δ 极限证明专项',
    subject: 'math-analysis',
    difficulty: 'hard',
    estimatedMinutes: 90,
    completed: false,
    priority: 'high',
    dueDate: dateStr(2),
    createdAt: daysAgo(10),
    completedAt: null,
  },
  {
    id: '2',
    name: '一致连续性与可积性',
    subject: 'math-analysis',
    difficulty: 'medium',
    estimatedMinutes: 60,
    completed: true,
    priority: 'medium',
    createdAt: daysAgo(14),
    completedAt: daysAgo(3),
  },
  {
    id: '3',
    name: '特征值与特征向量计算',
    subject: 'linear-algebra',
    difficulty: 'medium',
    estimatedMinutes: 45,
    completed: false,
    priority: 'medium',
    dueDate: dateStr(-3),
    createdAt: daysAgo(8),
    completedAt: null,
  },
  {
    id: '4',
    name: 'Jordan 标准型复习',
    subject: 'linear-algebra',
    difficulty: 'hard',
    estimatedMinutes: 75,
    completed: false,
    priority: 'high',
    dueDate: dateStr(5),
    createdAt: daysAgo(7),
    completedAt: null,
  },
  {
    id: '5',
    name: '考研词汇 Unit 5',
    subject: 'english',
    difficulty: 'easy',
    estimatedMinutes: 30,
    completed: true,
    priority: 'low',
    createdAt: daysAgo(12),
    completedAt: daysAgo(1),
  },
  {
    id: '6',
    name: '2018 英语一阅读精读',
    subject: 'english',
    difficulty: 'medium',
    estimatedMinutes: 50,
    completed: false,
    priority: 'medium',
    dueDate: dateStr(1),
    createdAt: daysAgo(5),
    completedAt: null,
  },
  {
    id: '7',
    name: '定积分换元与分部积分',
    subject: 'math-analysis',
    difficulty: 'easy',
    estimatedMinutes: 40,
    completed: false,
    priority: 'low',
    createdAt: daysAgo(4),
    completedAt: null,
  },
  {
    id: '8',
    name: '二次型正定性判定',
    subject: 'linear-algebra',
    difficulty: 'easy',
    estimatedMinutes: 35,
    completed: true,
    priority: 'low',
    createdAt: daysAgo(15),
    completedAt: daysAgo(5),
  },
]

function buildStudySessions(): StudySession[] {
  const today = new Date()
  const dailyMinutes = [90, 120, 60, 0, 150, 80, 45]
  const subjects: Subject[] = ['math-analysis', 'linear-algebra', 'english']
  const sessions: StudySession[] = []
  let id = 1

  dailyMinutes.forEach((totalMinutes, dayOffset) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - dayOffset))
    const date = d.toISOString().slice(0, 10)

    if (totalMinutes === 0) return

    const parts = [
      Math.round(totalMinutes * 0.5),
      Math.round(totalMinutes * 0.3),
      totalMinutes - Math.round(totalMinutes * 0.5) - Math.round(totalMinutes * 0.3),
    ]

    parts.forEach((minutes, i) => {
      if (minutes <= 0) return
      sessions.push({
        id: String(id++),
        subject: subjects[i % subjects.length],
        minutes,
        date,
      })
    })
  })

  return sessions
}

export const initialStudySessions: StudySession[] = buildStudySessions()

export function getInitialState(): PersistedState {
  return {
    tasks: initialTasks,
    studySessions: initialStudySessions,
  }
}
