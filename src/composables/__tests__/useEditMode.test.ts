import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('composable: useEditMode', () => {
  beforeEach(() => {
    document.cookie = 'session_expiry=; Max-Age=0'
    vi.resetModules()
  })

  it('provides state as false by default', async () => {
    const { useEditMode } = await import('../useEditMode')
    const { state } = useEditMode()
    expect(state.value).toBe(false)
  })

  it('provides isActive as false when not authenticated', async () => {
    const { useEditMode } = await import('../useEditMode')
    const { isActive } = useEditMode()
    expect(isActive.value).toBe(false)
  })

  it('provides isActive as true when authenticated and activated', async () => {
    document.cookie = 'session_expiry=2026-12-31T23:59:59Z'
    const { useEditMode } = await import('../useEditMode')
    const { activate, isActive } = useEditMode()
    activate()
    expect(isActive.value).toBe(true)
  })

  it('provides isActive as false when authenticated but deactivated', async () => {
    document.cookie = 'session_expiry=2026-12-31T23:59:59Z'
    const { useEditMode } = await import('../useEditMode')
    const { activate, deactivate, isActive } = useEditMode()
    activate()
    deactivate()
    expect(isActive.value).toBe(false)
  })

  it('allows activating edit mode', async () => {
    const { useEditMode } = await import('../useEditMode')
    const { activate, state } = useEditMode()
    activate()
    expect(state.value).toBe(true)
  })

  it('allows deactivating edit mode', async () => {
    const { useEditMode } = await import('../useEditMode')
    const { activate, deactivate, state } = useEditMode()
    activate()
    deactivate()
    expect(state.value).toBe(false)
  })

  it('allows toggling edit mode', async () => {
    const { useEditMode } = await import('../useEditMode')
    const { toggle, state } = useEditMode()
    expect(state.value).toBe(false)
    toggle()
    expect(state.value).toBe(true)
    toggle()
    expect(state.value).toBe(false)
  })
})
