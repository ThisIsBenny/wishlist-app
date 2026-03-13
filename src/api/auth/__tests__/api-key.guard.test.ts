import { ApiKeyGuard } from '../api-key.guard'
import { ConfigService } from '@nestjs/config'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ExecutionContext } from '@nestjs/common'

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard
  let mockConfigService: { get: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    mockConfigService = {
      get: vi.fn().mockReturnValue('TOP_SECRET'),
    }

    guard = new ApiKeyGuard(mockConfigService as unknown as ConfigService)
  })

  it('should allow request with valid API key', () => {
    const mockRequest = { headers: { 'x-api-key': 'TOP_SECRET' } }
    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext

    const result = guard.canActivate(context)

    expect(result).toBe(true)
  })

  it('should reject request without API key', () => {
    const mockRequest = { headers: {} }
    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext

    expect(() => guard.canActivate(context)).toThrow()
  })

  it('should reject request with invalid API key', () => {
    const mockRequest = { headers: { 'x-api-key': 'wrong-key' } }
    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext

    expect(() => guard.canActivate(context)).toThrow()
  })
})
