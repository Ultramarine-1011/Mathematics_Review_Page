import type {
  DailyStudy,
  Difficulty,
  StudyStats,
  Subject,
  SubjectProgress,
  Task,
} from '../types'

export const SUBJECT_LABELS: Record<Subject, string> = {
  'math-analysis': '数学分析',
  'linear-algebra': '高等代数',
  english: '英语',
}

export const SUBJECT_COLORS: Record<Subject, string> = {
  'math-analysis': 'from-sky-400 to-blue-600',
  'linear-algebra': 'from-violet-400 to-purple-600',
  english: 'from-emerald-400 to-green-600',
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
}

export const DIFFICULTY_MINUTES: Record<Difficulty, number> = {
  easy: 30,
  medium: 45,
  hard: 60,
}

const ALL_SUBJECTS: Subject[] = ['math-analysis', 'linear-algebra', 'english']

export function minutesForDifficulty(difficulty: Difficulty): number {
  return DIFFICULTY_MINUTES[difficulty]
}

export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes} 分钟`
  if (minutes === 0) return `${hours} 小时`
  return `${hours} 小时 ${minutes} 分钟`
}

export function computeStreakDays(dailyStudy: DailyStudy[]): number {
  let streak = 0
  for (let i = dailyStudy.length - 1; i >= 0; i--) {
    if (dailyStudy[i].minutes > 0) streak++
    else break
  }
  return streak
}

export function computeSubjectProgress(tasks: Task[]): SubjectProgress[] {
  return ALL_SUBJECTS.map((subject) => {
    const subjectTasks = tasks.filter((t) => t.subject === subject)
    const total = subjectTasks.length
    const completed = subjectTasks.filter((t) => t.completed).length
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
    return {
      subject,
      label: SUBJECT_LABELS[subject],
      completed,
      total,
      percent,
      remaining: total - completed,
      color: SUBJECT_COLORS[subject],
    }
  })
}

export function computeStats(tasks: Task[], dailyStudy: DailyStudy[]): StudyStats {
  const todayMinutes = dailyStudy[dailyStudy.length - 1]?.minutes ?? 0
  const weekMinutes = dailyStudy.reduce((sum, d) => sum + d.minutes, 0)
  const completedTasks = tasks.filter((t) => t.completed).length

  return {
    todayMinutes,
    weekMinutes,
    completedTasks,
    totalTasks: tasks.length,
    streakDays: computeStreakDays(dailyStudy),
  }
}

export function getEncouragement(completed: number, total: number): string {
  if (total === 0) return '添加任务，开启今日复习！'
  const ratio = completed / total
  if (ratio === 1) return '今日任务全部完成，太棒了！'
  if (ratio >= 0.75) return '胜利在望，再加一把劲！'
  if (ratio >= 0.5) return '过半啦，保持节奏稳步前进！'
  if (ratio > 0) return '开局不错，继续保持！'
  return '千里之行始于足下，先从一个小任务开始吧！'
}
