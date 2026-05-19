export type Subject = 'math-analysis' | 'linear-algebra' | 'english'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Task {
  id: string
  name: string
  subject: Subject
  difficulty: Difficulty
  completed: boolean
}

export interface DailyStudy {
  date: string
  label: string
  minutes: number
}

export interface SubjectProgress {
  subject: Subject
  label: string
  completed: number
  total: number
  percent: number
  remaining: number
  color: string
}

export interface StudyStats {
  todayMinutes: number
  weekMinutes: number
  completedTasks: number
  totalTasks: number
  streakDays: number
}
