import type { DailyStudy, Task } from '../types'

function buildDailyStudy(): DailyStudy[] {
  const minutes = [90, 120, 60, 0, 150, 80, 45]
  const labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const today = new Date()

  return minutes.map((m, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    return {
      date: d.toISOString().slice(0, 10),
      label: labels[i],
      minutes: m,
    }
  })
}

export const initialTasks: Task[] = [
  {
    id: '1',
    name: 'ε-δ 极限证明专项',
    subject: 'math-analysis',
    difficulty: 'hard',
    completed: false,
  },
  {
    id: '2',
    name: '一致连续性与可积性',
    subject: 'math-analysis',
    difficulty: 'medium',
    completed: true,
  },
  {
    id: '3',
    name: '特征值与特征向量计算',
    subject: 'linear-algebra',
    difficulty: 'medium',
    completed: false,
  },
  {
    id: '4',
    name: 'Jordan 标准型复习',
    subject: 'linear-algebra',
    difficulty: 'hard',
    completed: false,
  },
  {
    id: '5',
    name: '考研词汇 Unit 5',
    subject: 'english',
    difficulty: 'easy',
    completed: true,
  },
  {
    id: '6',
    name: '2018 英语一阅读精读',
    subject: 'english',
    difficulty: 'medium',
    completed: false,
  },
  {
    id: '7',
    name: '定积分换元与分部积分',
    subject: 'math-analysis',
    difficulty: 'easy',
    completed: false,
  },
  {
    id: '8',
    name: '二次型正定性判定',
    subject: 'linear-algebra',
    difficulty: 'easy',
    completed: true,
  },
]

export const initialDailyStudy: DailyStudy[] = buildDailyStudy()
