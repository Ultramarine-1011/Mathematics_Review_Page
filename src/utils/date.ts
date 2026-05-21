const DAY_IN_MS = 24 * 60 * 60 * 1000

export function toDateString(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseDateString(dateString: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
}

export function isValidDateString(value: unknown): value is string {
  return typeof value === 'string' && parseDateString(value) !== null
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function getLastNDates(count: number, refDate: Date = new Date()): string[] {
  const dates: string[] = []
  for (let i = count - 1; i >= 0; i--) {
    dates.push(toDateString(addDays(refDate, -i)))
  }
  return dates
}

export function daysUntilDate(dateString: string | undefined, refDate: Date = new Date()): number | null {
  if (!dateString) return null
  const target = parseDateString(dateString)
  if (!target) return null

  const today = parseDateString(toDateString(refDate))
  if (!today) return null

  return Math.ceil((target.getTime() - today.getTime()) / DAY_IN_MS)
}

export function formatDateTimeLocal(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso

  const datePart = toDateString(date)
  const timePart = date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${datePart} ${timePart}`
}

