import { describe, expect, it } from 'vitest'
import { addDays, daysUntilDate, isValidDateString, toDateString } from './date'

describe('date utilities', () => {
  it('formats local YYYY-MM-DD without UTC slicing', () => {
    expect(toDateString(new Date(2026, 4, 21, 23, 30))).toBe('2026-05-21')
  })

  it('adds days using local calendar dates', () => {
    expect(toDateString(addDays(new Date(2026, 4, 21), -7))).toBe('2026-05-14')
  })

  it('validates real calendar dates', () => {
    expect(isValidDateString('2026-02-28')).toBe(true)
    expect(isValidDateString('2026-02-30')).toBe(false)
    expect(isValidDateString('2026-2-3')).toBe(false)
  })

  it('computes days until a local date', () => {
    expect(daysUntilDate('2026-06-01', new Date(2026, 4, 21))).toBe(11)
  })
})

