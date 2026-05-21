import { describe, expect, it } from 'vitest'
import { parsePositiveInteger, validatePositiveInteger } from './validation'

describe('validation utilities', () => {
  it('rejects invalid minute values', () => {
    expect(validatePositiveInteger(0, '学习时长')).toBe('学习时长必须大于 0')
    expect(validatePositiveInteger(-1, '学习时长')).toBe('学习时长必须大于 0')
    expect(validatePositiveInteger(1.5, '学习时长')).toBe('学习时长不能是小数')
    expect(validatePositiveInteger(Number.NaN, '学习时长')).toBe('学习时长必须是正整数')
    expect(validatePositiveInteger(Number.POSITIVE_INFINITY, '学习时长')).toBe('学习时长必须是正整数')
  })

  it('parses valid positive integers', () => {
    expect(parsePositiveInteger('45', '学习时长')).toEqual({ value: 45 })
  })
})

