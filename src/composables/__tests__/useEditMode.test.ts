import { describe, it, expect, beforeEach } from 'vitest'
import { useEditMode } from '../useEditMode'
import { useAuth } from '../useAuth'

describe('composable: useEditMode', () => {
  beforeEach(() => {
    localStorage.clear()
    const { setToken } = useAuth()
    setToken('')
    const { deactivate } = useEditMode()
    deactivate()
  })

  it('provides state as false by default', () => {
    const { state } = useEditMode()
    expect(state.value).toBe(false)
  })

  it('provides isActive as false when not authenticated', () => {
    const { isActive } = useEditMode()
    expect(isActive.value).toBe(false)
  })

  it('provides isActive as true when authenticated and activated', () => {
    const { setToken } = useAuth()
    setToken('test-token')
    const { activate, isActive } = useEditMode()
    activate()
    expect(isActive.value).toBe(true)
  })

  it('provides isActive as false when authenticated but deactivated', () => {
    const { setToken } = useAuth()
    setToken('test-token')
    const { activate, deactivate, isActive } = useEditMode()
    activate()
    deactivate()
    expect(isActive.value).toBe(false)
  })

  it('allows activating edit mode', () => {
    const { activate, state } = useEditMode()
    activate()
    expect(state.value).toBe(true)
  })

  it('allows deactivating edit mode', () => {
    const { activate, deactivate, state } = useEditMode()
    activate()
    deactivate()
    expect(state.value).toBe(false)
  })

  it('allows toggling edit mode', () => {
    const { toggle, state } = useEditMode()
    expect(state.value).toBe(false)
    toggle()
    expect(state.value).toBe(true)
    toggle()
    expect(state.value).toBe(false)
  })
})
