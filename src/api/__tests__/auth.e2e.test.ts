import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import request from 'supertest'
import { AppModule } from '../app.module'
import configuration from '../config/configuration'
import cookieParser from 'cookie-parser'
import { describe, beforeEach, afterEach, it, expect } from 'vitest'

describe('AuthController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
        AppModule,
      ],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.setGlobalPrefix('api')
    app.use(cookieParser())
    await app.init()
  })

  afterEach(() => {
    app.close()
  })

  const extractCookies = (res: request.Response): string => {
    const cookies = res.headers['set-cookie']
    const cookieArray = Array.isArray(cookies) ? cookies : [cookies]
    return cookieArray
      .filter(
        (c: string) =>
          c.startsWith('access_token=') && !c.includes('access_token=;')
      )
      .join('; ')
  }

  describe('GET /api/auth/config', () => {
    it('is public and exposes auth feature flags', async () => {
      const res = await request(app.getHttpServer()).get('/api/auth/config')
      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({
        emailLoginEnabled: true,
        emailRegisterEnabled: true,
        oidcProviders: [],
      })
    })
  })

  describe('POST /api/auth/register + login + logout', () => {
    it('registers, authenticates, and revokes on logout', async () => {
      const email = `auth-e2e-${Date.now()}@example.com`
      const password = 'TestPass123!'

      const registerRes = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email, password })
      expect(registerRes.status).toBe(201)

      const loginRes = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email, password })
      expect(loginRes.status).toBe(200)
      const cookies = extractCookies(loginRes)
      expect(cookies).toContain('access_token=')

      // Authenticated request works with the session cookie.
      const meRes = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Cookie', cookies)
      expect(meRes.status).toBe(200)
      expect(meRes.body.user.email).toBe(email)

      const logoutRes = await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Cookie', cookies)
      expect(logoutRes.status).toBe(200)

      // The revoked session must no longer authenticate.
      const afterLogout = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Cookie', cookies)
      expect(afterLogout.status).toBe(401)
    })

    it('rejects registration with a weak password', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: `weak-${Date.now()}@example.com`, password: 'weak' })
      expect(res.status).toBe(400)
    })

    it('keeps other-device sessions alive on a second login (multi-device)', async () => {
      const email = `multi-${Date.now()}@example.com`
      const password = 'TestPass123!'
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email, password })

      const deviceA = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email, password })
      const deviceB = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email, password })

      const cookiesA = extractCookies(deviceA)
      const cookiesB = extractCookies(deviceB)

      // Regression test for the single-session bug: logging in on device B
      // must NOT revoke device A's session.
      const checkA = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Cookie', cookiesA)
      expect(checkA.status).toBe(200)

      const checkB = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Cookie', cookiesB)
      expect(checkB.status).toBe(200)

      // Only the logged-out device loses access.
      await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Cookie', cookiesB)
      const afterLogoutA = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Cookie', cookiesA)
      expect(afterLogoutA.status).toBe(200)
      const afterLogoutB = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Cookie', cookiesB)
      expect(afterLogoutB.status).toBe(401)
    })

    it('rejects /me without authentication', async () => {
      const res = await request(app.getHttpServer()).get('/api/auth/me')
      expect(res.status).toBe(401)
    })
  })
})
