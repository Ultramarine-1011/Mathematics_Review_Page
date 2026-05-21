import type {
  DailyStudy,
  Difficulty,
  GoalProgress,
  Priority,
  StudyGoal,
  StudySession,
  StudyStats,
  Subject,
  SubjectProgress,
  Task,
  TaskFilterStatus,
} from '../types'
import {
  daysUntilDate,
  formatDateTimeLocal,
  getLastNDates,
  parseDateString,
  toDateString,
} from './date'

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

export { toDateString }

export function getWeekdayLabel(dateStr: string): string {
  const date = parseDateString(dateStr)
  if (!date) return dateStr
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
  return formatDateTimeLocal(iso)
}

export function aggregateDailyStudy(
  sessions: StudySession[],
  refDate: Date = new Date(),
): DailyStudy[] {
  const dates = getLastNDates(7, refDate)
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
  const dates = new Set(getLastNDates(7, refDate))
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

export function computeGoalProgress(
  todayMinutes: number,
  weekMinutes: number,
  goal: StudyGoal,
): GoalProgress {
  const dailyTarget = Math.max(goal.dailyMinutesTarget, 1)
  const weeklyTarget = Math.max(goal.weeklyMinutesTarget, 1)
  return {
    dailyPercent: Math.round((todayMinutes / dailyTarget) * 100),
    weeklyPercent: Math.round((weekMinutes / weeklyTarget) * 100),
    dailyRemaining: Math.max(dailyTarget - todayMinutes, 0),
    weeklyRemaining: Math.max(weeklyTarget - weekMinutes, 0),
    dailyAchieved: todayMinutes >= dailyTarget,
    weeklyAchieved: weekMinutes >= weeklyTarget,
  }
}

export function daysUntilExam(examDate: string | undefined, refDate: Date = new Date()): number | null {
  return daysUntilDate(examDate, refDate)
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
  goalProgress?: GoalProgress,
  examDays?: number | null,
): string {
  const { completedTasks, totalTasks } = stats
  const todayMinutes = stats.todayMinutes
  const taskRatio = totalTasks === 0 ? 0 : completedTasks / totalTasks

  if (examDays !== null && examDays !== undefined && examDays >= 0 && examDays < 30) {
    if (goalProgress?.dailyAchieved) {
      return `距离考试还有 ${examDays} 天，今天目标已达成，冲刺期就这样稳住节奏。`
    }
    if (todayMinutes > 0) {
      return `距离考试还有 ${examDays} 天，今天已经开始推进，继续补上关键一段。`
    }
    return `距离考试还有 ${examDays} 天，先安排一段可完成的复习，稳稳进入状态。`
  }

  if (goalProgress?.dailyAchieved && goalProgress.weeklyAchieved) {
    return '今日和本周目标都在轨道上，保持这个节奏很漂亮。'
  }
  if (goalProgress?.dailyAchieved) {
    return '今日学习目标已达成，可以复盘一下最有收获的部分。'
  }
  if (todayMinutes > 0 && goalProgress && !goalProgress.dailyAchieved) {
    return `今天已经记录学习，再推进 ${goalProgress.dailyRemaining} 分钟就能达成目标。`
  }
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
