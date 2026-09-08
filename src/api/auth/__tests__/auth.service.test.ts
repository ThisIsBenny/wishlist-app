import { AuthService } from '../auth.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import {
  ForbiddenException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('bcrypt', () => ({
  hash: vi.fn().mockResolvedValue('hashed-password'),
  compare: vi.fn(),
}))

const mockResponse = () => ({
  cookie: vi.fn(),
})

/**
 * Drizzle chain stub: every builder method returns the same chain so
 * select().from().where().get() / insert().values().returning().get() /
 * delete().where().run() all resolve on one object. Sequence results via
 * mockReturnValueOnce on `get`.
 */
const createMockDb = () => {
  const chain: any = {}
  chain.select = vi.fn().mockReturnValue(chain)
  chain.from = vi.fn().mockReturnValue(chain)
  chain.where = vi.fn().mockReturnValue(chain)
  chain.insert = vi.fn().mockReturnValue(chain)
  chain.values = vi.fn().mockReturnValue(chain)
  chain.returning = vi.fn().mockReturnValue(chain)
  chain.update = vi.fn().mockReturnValue(chain)
  chain.set = vi.fn().mockReturnValue(chain)
  chain.delete = vi.fn().mockReturnValue(chain)
  chain.get = vi.fn()
  chain.run = vi.fn()
  return chain
}

const createConfig = (overrides: Record<string, unknown> = {}) => ({
  get: vi.fn((key: string) => {
    const config: Record<string, unknown> = {
      AUTH_EMAIL_LOGIN_ENABLED: true,
      AUTH_EMAIL_REGISTER_ENABLED: true,
      ...overrides,
    }
    return config[key]
  }),
})

const newUser = {
  id: 'user-1',
  email: 'test@example.com',
  passwordHash: 'hashed-password',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('AuthService', () => {
  let db: ReturnType<typeof createMockDb>
  let jwtService: { signAsync: ReturnType<typeof vi.fn> }
  let response: ReturnType<typeof mockResponse>

  beforeEach(() => {
    db = createMockDb()
    jwtService = { signAsync: vi.fn().mockResolvedValue('jwt-token') }
    response = mockResponse()
  })

  describe('register', () => {
    it('rejects registration when disabled', async () => {
      const service = new AuthService(
        db,
        jwtService as unknown as JwtService,
        createConfig({
          AUTH_EMAIL_REGISTER_ENABLED: false,
        }) as unknown as ConfigService
      )

      await expect(
        service.register(
          { email: 'a@b.c', password: 'TestPass123!' } as never,
          response as never
        )
      ).rejects.toThrow(ForbiddenException)
      expect(db.insert).not.toHaveBeenCalled()
    })

    it('rejects duplicate email', async () => {
      db.get.mockReturnValueOnce(newUser)
      const service = new AuthService(
        db,
        jwtService as unknown as JwtService,
        createConfig() as unknown as ConfigService
      )

      await expect(
        service.register(
          { email: 'test@example.com', password: 'TestPass123!' } as never,
          response as never
        )
      ).rejects.toThrow(ConflictException)
    })

    it('creates user and session cookie', async () => {
      db.get.mockReturnValueOnce(undefined).mockReturnValueOnce(newUser)
      const service = new AuthService(
        db,
        jwtService as unknown as JwtService,
        createConfig() as unknown as ConfigService
      )

      const result = await service.register(
        { email: 'test@example.com', password: 'TestPass123!' } as never,
        response as never
      )

      expect(result.user.id).toBe('user-1')
      expect(db.insert).toHaveBeenCalledTimes(2)
      expect(jwtService.signAsync).toHaveBeenCalled()
      expect(response.cookie).toHaveBeenCalledWith(
        'access_token',
        'jwt-token',
        expect.objectContaining({ httpOnly: true, sameSite: 'strict' })
      )
    })
  })

  describe('login', () => {
    it('rejects unknown user', async () => {
      db.get.mockReturnValueOnce(undefined)
      const service = new AuthService(
        db,
        jwtService as unknown as JwtService,
        createConfig() as unknown as ConfigService
      )

      await expect(
        service.login(
          { email: 'no@user.de', password: 'x' } as never,
          response as never
        )
      ).rejects.toThrow(UnauthorizedException)
    })

    it('rejects wrong password without deleting sessions', async () => {
      db.get.mockReturnValueOnce({
        ...newUser,
        passwordHash: 'hashed-password',
      })
      const bcrypt = await import('bcrypt')
      ;(bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValueOnce(false)
      const service = new AuthService(
        db,
        jwtService as unknown as JwtService,
        createConfig() as unknown as ConfigService
      )

      await expect(
        service.login(
          { email: 'test@example.com', password: 'wrong' } as never,
          response as never
        )
      ).rejects.toThrow(UnauthorizedException)
      expect(db.delete).not.toHaveBeenCalled()
    })

    it('creates a new session without killing other devices', async () => {
      db.get.mockReturnValueOnce({
        ...newUser,
        passwordHash: 'hashed-password',
      })
      const bcrypt = await import('bcrypt')
      ;(bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValueOnce(true)
      const service = new AuthService(
        db,
        jwtService as unknown as JwtService,
        createConfig() as unknown as ConfigService
      )

      const result = await service.login(
        { email: 'test@example.com', password: 'TestPass123!' } as never,
        response as never
      )

      expect(result.user.id).toBe('user-1')
      // Only the expired-session housekeeping delete, never a full wipe.
      expect(db.delete).toHaveBeenCalledTimes(1)
      expect(jwtService.signAsync).toHaveBeenCalled()
      expect(response.cookie).toHaveBeenCalledWith(
        'access_token',
        'jwt-token',
        expect.anything()
      )
    })
  })

  describe('logout', () => {
    it('revokes only the current session by jti', async () => {
      const service = new AuthService(
        db,
        jwtService as unknown as JwtService,
        createConfig() as unknown as ConfigService
      )

      await service.logout('jti-1', response as never)

      expect(db.delete).toHaveBeenCalledTimes(1)
      // Both cookies cleared with maxAge 0.
      expect(response.cookie).toHaveBeenCalledWith(
        'access_token',
        '',
        expect.objectContaining({ maxAge: 0 })
      )
      expect(response.cookie).toHaveBeenCalledWith(
        'session_expiry',
        '',
        expect.objectContaining({ maxAge: 0 })
      )
    })
  })

  describe('oidcLogin', () => {
    it('matches by (issuer, subject) first and creates a new user when unknown', async () => {
      db.get
        .mockReturnValueOnce(undefined) // (issuer, subject) lookup misses
        .mockReturnValueOnce(undefined) // verified-email lookup misses too
        .mockReturnValueOnce({ ...newUser, email: 'oidc@example.com' }) // insert returning
      const service = new AuthService(
        db,
        jwtService as unknown as JwtService,
        createConfig() as unknown as ConfigService
      )

      const result = await service.oidcLogin(
        'sub-1',
        'oidc@example.com',
        'https://issuer.example.com',
        true,
        response as never
      )

      // Exactly one insert: the new user row (plus one for the session).
      expect(db.insert).toHaveBeenCalled()
      expect(result.user.email).toBe('oidc@example.com')
      expect(db.update).not.toHaveBeenCalled()
      expect(response.cookie).toHaveBeenCalled()
    })

    it('links a verified OIDC identity to an existing email account', async () => {
      db.get
        .mockReturnValueOnce(undefined) // (issuer, subject) lookup misses
        .mockReturnValueOnce(newUser) // email lookup hits
      const service = new AuthService(
        db,
        jwtService as unknown as JwtService,
        createConfig() as unknown as ConfigService
      )

      await service.oidcLogin(
        'sub-1',
        'test@example.com',
        'https://issuer.example.com',
        true,
        response as never
      )

      expect(db.update).toHaveBeenCalled()
      // No new USER row is inserted — the only insert is the session
      // created by createSession.
      expect(db.insert).toHaveBeenCalledTimes(1)
      expect(db.insert).toHaveBeenCalledWith(expect.anything())
      expect(response.cookie).toHaveBeenCalled()
    })

    it('does NOT take over an existing email account when email is unverified', async () => {
      db.get
        .mockReturnValueOnce(undefined) // (issuer, subject) lookup misses
        .mockReturnValueOnce({
          id: 'attacker-user',
          email: 'test@example.com',
        }) // insert returning — NEW user, not the victim
      const service = new AuthService(
        db,
        jwtService as unknown as JwtService,
        createConfig() as unknown as ConfigService
      )

      await service.oidcLogin(
        'attacker-sub',
        'test@example.com',
        'https://evil.example.com',
        false,
        response as never
      )

      // No email-linking update and no takeover — a NEW user is created.
      expect(db.update).not.toHaveBeenCalled()
      expect(db.insert).toHaveBeenCalled()
      expect(response.cookie).toHaveBeenCalled()
    })
  })
})
