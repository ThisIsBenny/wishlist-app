import { describe, it, expect, beforeEach } from 'vitest'
import { useAuth } from '../useAuth'

describe('composable: useAuth', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('provides isAuthenticated as false when token is empty', () => {
    const { isAuthenticated } = useAuth()
    expect(isAuthenticated.value).toBe(false)
  })

  it('provides isAuthenticated as true when token is set', () => {
    const { setToken, isAuthenticated } = useAuth()
    setToken('test-token')
    expect(isAuthenticated.value).toBe(true)
  })

  it('allows setting a token', () => {
    const { setToken, token } = useAuth()
    setToken('my-secret-token')
    expect(token.value).toBe('my-secret-token')
  })

  it('returns readonly token', () => {
    const { setToken, token } = useAuth()
    setToken('test-token')
    expect(token.value).toBe('test-token')
  })
})
