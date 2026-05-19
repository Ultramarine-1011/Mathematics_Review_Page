import type {
  DailyStudy,
  Difficulty,
  Priority,
  StudySession,
  StudyStats,
  Subject,
  SubjectProgress,
  Task,
  TaskFilterStatus,
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

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: '低',
  medium: '中',
  high: '高',
}

export const DIFFICULTY_MINUTES: Record<Difficulty, number> = {
  easy: 30,
  medium: 45,
  hard: 60,
}

const ALL_SUBJECTS: Subject[] = ['math-analysis', 'linear-algebra', 'english']

const WEEKDAY_LABELS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export function toDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getWeekdayLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return WEEKDAY_LABELS[date.getDay()]
}

export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes} 分钟`
  if (minutes === 0) return `${hours} 小时`
  return `${hours} 小时 ${minutes} 分钟`
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso)
  const datePart = toDateString(date)
  const timePart = date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${datePart} ${timePart}`
}

function getLast7DayDates(refDate: Date): string[] {
  const dates: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(refDate)
    d.setDate(refDate.getDate() - i)
    dates.push(toDateString(d))
  }
  return dates
}

export function aggregateDailyStudy(
  sessions: StudySession[],
  refDate: Date = new Date(),
): DailyStudy[] {
  const dates = getLast7DayDates(refDate)
  const minutesByDate = new Map<string, number>()

  for (const date of dates) {
    minutesByDate.set(date, 0)
  }

  for (const session of sessions) {
    const current = minutesByDate.get(session.date)
    if (current !== undefined) {
      minutesByDate.set(session.date, current + session.minutes)
    }
  }

  return dates.map((date) => ({
    date,
    label: getWeekdayLabel(date),
    minutes: minutesByDate.get(date) ?? 0,
  }))
}

export function computeTodayMinutes(
  sessions: StudySession[],
  refDate: Date = new Date(),
): number {
  const today = toDateString(refDate)
  return sessions
    .filter((s) => s.date === today)
    .reduce((sum, s) => sum + s.minutes, 0)
}

export function computeWeekMinutes(
  sessions: StudySession[],
  refDate: Date = new Date(),
): number {
  const dates = new Set(getLast7DayDates(refDate))
  return sessions
    .filter((s) => dates.has(s.date))
    .reduce((sum, s) => sum + s.minutes, 0)
}

function hasStudyOnDate(sessions: StudySession[], date: string): boolean {
  return sessions.some((s) => s.date === date && s.minutes > 0)
}

export function computeStreakDays(
  sessions: StudySession[],
  refDate: Date = new Date(),
): number {
  const today = toDateString(refDate)
  let streak = 0
  const checkDate = new Date(refDate)

  if (!hasStudyOnDate(sessions, today)) {
    checkDate.setDate(checkDate.getDate() - 1)
  }

  while (hasStudyOnDate(sessions, toDateString(checkDate))) {
    streak++
    checkDate.setDate(checkDate.getDate() - 1)
  }

  return streak
}

export function computeSubjectProgress(tasks: Task[]): SubjectProgress[] {
  return ALL_SUBJECTS.map((subject) => {
    const subjectTasks = tasks.filter((t) => t.subject === subject)
    const total = subjectTasks.length
    const completed = subjectTasks.filter((t) => t.completed).length
    const totalMinutes = subjectTasks.reduce((sum, t) => sum + t.estimatedMinutes, 0)
    const completedMinutes = subjectTasks
      .filter((t) => t.completed)
      .reduce((sum, t) => sum + t.estimatedMinutes, 0)

    const progressMode: 'minutes' | 'count' = totalMinutes > 0 ? 'minutes' : 'count'
    const percent =
      progressMode === 'minutes'
        ? totalMinutes === 0
          ? 0
          : Math.round((completedMinutes / totalMinutes) * 100)
        : total === 0
          ? 0
          : Math.round((completed / total) * 100)

    return {
      subject,
      label: SUBJECT_LABELS[subject],
      completed,
      total,
      percent,
      remaining: total - completed,
      color: SUBJECT_COLORS[subject],
      completedMinutes,
      totalMinutes,
      progressMode,
    }
  })
}

export function computeStats(
  tasks: Task[],
  sessions: StudySession[],
  refDate: Date = new Date(),
): StudyStats {
  return {
    todayMinutes: computeTodayMinutes(sessions, refDate),
    weekMinutes: computeWeekMinutes(sessions, refDate),
    completedTasks: tasks.filter((t) => t.completed).length,
    totalTasks: tasks.length,
    streakDays: computeStreakDays(sessions, refDate),
  }
}

export function isOverdue(dueDate: string | undefined, completed: boolean): boolean {
  if (!dueDate || completed) return false
  const today = toDateString(new Date())
  return dueDate < today
}

export function filterTasks(
  tasks: Task[],
  status: TaskFilterStatus,
  subject?: Subject | 'all',
): Task[] {
  return tasks.filter((task) => {
    if (status === 'pending' && task.completed) return false
    if (status === 'completed' && !task.completed) return false
    if (subject && subject !== 'all' && task.subject !== subject) return false
    return true
  })
}

export function getEncouragement(
  stats: StudyStats,
  todayMinutes: number,
): string {
  const { completedTasks, totalTasks } = stats
  const taskRatio = totalTasks === 0 ? 0 : completedTasks / totalTasks

  if (todayMinutes >= 120 && taskRatio === 1 && totalTasks > 0) {
    return '今日学习充实，任务也全部完成，太棒了！'
  }
  if (todayMinutes >= 120) {
    return '今日学习时长很充实，继续保持这个节奏！'
  }
  if (todayMinutes >= 60 && taskRatio >= 0.5) {
    return '学习进度和任务推进都不错，稳步前进！'
  }
  if (todayMinutes > 0 && taskRatio === 0 && totalTasks > 0) {
    return '已有学习记录，再完成一个小任务吧！'
  }
  if (todayMinutes === 0 && totalTasks > 0 && completedTasks === 0) {
    return '先记录一段学习时长，或从一个小任务开始！'
  }
  if (totalTasks === 0) {
    return '添加任务并记录学习，开启今日复习！'
  }
  if (taskRatio === 1) {
    return '任务全部完成，记得记录今日学习时长哦！'
  }
  if (taskRatio >= 0.75) {
    return '胜利在望，再加一把劲！'
  }
  if (taskRatio >= 0.5) {
    return '过半啦，保持节奏稳步前进！'
  }
  if (taskRatio > 0) {
    return '开局不错，继续保持！'
  }
  if (todayMinutes > 0) {
    return '已有学习记录，继续加油！'
  }
  return '千里之行始于足下，先从记录一段学习时长开始吧！'
}

export function defaultEstimatedMinutes(difficulty: Difficulty): number {
  return DIFFICULTY_MINUTES[difficulty]
}
