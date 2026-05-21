import { describe, expect, it } from 'vitest'
import { DEFAULT_GOAL } from './defaults'
import { parseBackupJson, validateImportedState } from './import'

describe('import validation', () => {
  it('accepts a valid backup', () => {
    const result = validateImportedState({
      tasks: [],
      studySessions: [],
      goal: DEFAULT_GOAL,
      exportedAt: '2026-05-21T00:00:00.000Z',
      version: 3,
    })

    expect(result.ok).toBe(true)
  })

  it('rejects invalid backup structures', () => {
    const result = validateImportedState({
      tasks: [{ id: 'bad' }],
      studySessions: [],
      goal: DEFAULT_GOAL,
    })

    expect(result.ok).toBe(false)
  })

  it('rejects invalid JSON', () => {
    expect(parseBackupJson('{broken').ok).toBe(false)
  })
})

