export type Subject = 'math-analysis' | 'linear-algebra' | 'english'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type Priority = 'low' | 'medium' | 'high'

export type TaskFilterStatus = 'all' | 'pending' | 'completed'

export interface Task {
  id: string
  name: string
  subject: Subject
  difficulty: Difficulty
  estimatedMinutes: number
  completed: boolean
  priority: Priority
  dueDate?: string
  createdAt: string
  completedAt: string | null
}

export interface StudySession {
  id: string
  subject: Subject
  minutes: number
  date: string
  note?: string
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
  completedMinutes?: number
  totalMinutes?: number
  progressMode: 'minutes' | 'count'
}

export interface StudyStats {
  todayMinutes: number
  weekMinutes: number
  completedTasks: number
  totalTasks: number
  streakDays: number
}

export interface PersistedState {
  tasks: Task[]
  studySessions: StudySession[]
}

export interface NewStudySessionInput {
  subject: Subject
  minutes: number
  date: string
  note?: string
}

export interface NewTaskInput {
  name: string
  subject: Subject
  difficulty: Difficulty
  estimatedMinutes: number
  priority: Priority
  dueDate?: string
}
