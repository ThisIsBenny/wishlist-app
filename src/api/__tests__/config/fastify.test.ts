import { describe, it, expect } from 'vitest'
import fastifyConfig from '@/api/config/fastify'

describe('config: fastify', () => {
  it('returns silent log level in test environment (default)', () => {
    expect(fastifyConfig.logger?.level).toBe('silent')
  })

  it('has prettyPrint disabled by default', () => {
    expect(fastifyConfig.logger?.prettyPrint).toBe(false)
  })

  it('redacts err.stack from logs', () => {
    expect(fastifyConfig.logger?.redact).toContain('err.stack')
  })
})
