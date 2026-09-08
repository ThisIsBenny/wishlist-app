import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('composable: useAuth', () => {
  beforeEach(() => {
    document.cookie = 'session_expiry=; Max-Age=0'
    vi.resetModules()
  })

  it('provides isAuthenticated as false when session_expiry cookie is absent', async () => {
    const { useAuth } = await import('../useAuth')
    const { isAuthenticated } = useAuth()
    expect(isAuthenticated.value).toBe(false)
  })

  it('provides isAuthenticated as true when session_expiry cookie is present', async () => {
    document.cookie = 'session_expiry=2026-12-31T23:59:59Z'
    const { useAuth } = await import('../useAuth')
    const { isAuthenticated } = useAuth()
    expect(isAuthenticated.value).toBe(true)
  })
})
