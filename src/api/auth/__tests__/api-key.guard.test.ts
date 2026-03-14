import { ApiKeyGuard } from '../api-key.guard'
import { ConfigService } from '@nestjs/config'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard
  let mockConfigService: { get: ReturnType<typeof vi.fn> }
  let mockReflector: { get: ReturnType<typeof vi.fn> }

  const createMockContext = (headers: Record<string, string>) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ headers }),
      }),
      getHandler: () => ({}),
    }) as unknown as ExecutionContext

  beforeEach(() => {
    mockConfigService = {
      get: vi.fn().mockReturnValue('TOP_SECRET'),
    }
    mockReflector = {
      get: vi.fn().mockReturnValue(false),
    }

    guard = new ApiKeyGuard(
      mockConfigService as unknown as ConfigService,
      mockReflector as unknown as Reflector
    )
  })

  it('should allow request with valid API key in Authorization header', () => {
    const context = createMockContext({ authorization: 'API-Key TOP_SECRET' })
    const result = guard.canActivate(context)
    expect(result).toBe(true)
  })

  it('should reject request without API key when required', () => {
    const context = createMockContext({})
    expect(() => guard.canActivate(context)).toThrow()
  })

  it('should allow request without API key when optional', () => {
    mockReflector.get = vi.fn().mockReturnValue(true)
    const context = createMockContext({})
    const result = guard.canActivate(context)
    expect(result).toBe(true)
  })

  it('should reject request with invalid API key', () => {
    const context = createMockContext({ authorization: 'API-Key wrong-key' })
    expect(() => guard.canActivate(context)).toThrow()
  })

  it('should handle Authorization header without API-Key prefix', () => {
    const context = createMockContext({ authorization: 'Bearer some-token' })
    expect(() => guard.canActivate(context)).toThrow()
  })
})
