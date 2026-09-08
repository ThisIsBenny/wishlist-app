import { JwtAuthGuard } from '../jwt-auth.guard'
import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Reflector } from '@nestjs/core'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ExecutionContext } from '@nestjs/common'

const createMockDb = () => {
  const chain: any = {}
  chain.select = vi.fn().mockReturnValue(chain)
  chain.from = vi.fn().mockReturnValue(chain)
  chain.where = vi.fn().mockReturnValue(chain)
  chain.get = vi.fn()
  return chain
}

const createContext = (token?: string) => {
  const request = { cookies: token ? { access_token: token } : {} }
  return {
    switchToHttp: () => ({ getRequest: () => request }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as unknown as ExecutionContext
}

const createReflector = (isPublic = false) => ({
  getAllAndOverride: vi.fn().mockReturnValue(isPublic),
})

describe('JwtAuthGuard', () => {
  let db: ReturnType<typeof createMockDb>
  let jwtService: { verifyAsync: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    db = createMockDb()
    jwtService = { verifyAsync: vi.fn() }
  })

  const createGuard = (isPublic = false) =>
    new JwtAuthGuard(
      jwtService as unknown as JwtService,
      createReflector(isPublic) as unknown as Reflector,
      db as never
    )

  it('allows @Public() routes without a token', async () => {
    const guard = createGuard(true)
    await expect(guard.canActivate(createContext())).resolves.toBe(true)
    expect(jwtService.verifyAsync).not.toHaveBeenCalled()
  })

  it('rejects requests without a cookie', async () => {
    const guard = createGuard()
    await expect(guard.canActivate(createContext())).rejects.toThrow(
      UnauthorizedException
    )
  })

  it('rejects invalid JWT signatures', async () => {
    jwtService.verifyAsync.mockRejectedValueOnce(new Error('jwt malformed'))
    const guard = createGuard()
    await expect(guard.canActivate(createContext('bad-token'))).rejects.toThrow(
      UnauthorizedException
    )
  })

  it('rejects a token whose session was revoked', async () => {
    jwtService.verifyAsync.mockResolvedValueOnce({
      sub: 'user-1',
      jti: 'jti-1',
    })
    db.get.mockReturnValueOnce(undefined) // session gone (revoked/expired/wrong owner)
    const guard = createGuard()
    await expect(guard.canActivate(createContext('valid-jwt'))).rejects.toThrow(
      'Session has been invalidated'
    )
  })

  it('accepts a valid token with an unexpired, owned session', async () => {
    jwtService.verifyAsync.mockResolvedValueOnce({
      sub: 'user-1',
      jti: 'jti-1',
    })
    db.get.mockReturnValueOnce({ userId: 'user-1' })
    const guard = createGuard()
    await expect(guard.canActivate(createContext('valid-jwt'))).resolves.toBe(
      true
    )
    // Guard filters on jti + userId + expiry in ONE query.
    expect(db.where).toHaveBeenCalledTimes(1)
  })

  it('rejects a session that belongs to another user (jti/sub mismatch)', async () => {
    jwtService.verifyAsync.mockResolvedValueOnce({
      sub: 'attacker',
      jti: 'jti-1',
    })
    // Query filters userId = 'attacker' but the session row belongs to user-1
    db.get.mockReturnValueOnce(undefined)
    const guard = createGuard()
    await expect(guard.canActivate(createContext('valid-jwt'))).rejects.toThrow(
      'Session has been invalidated'
    )
  })
})
