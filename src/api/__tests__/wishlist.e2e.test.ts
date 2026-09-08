import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import request from 'supertest'
import { AppModule } from '../app.module'
import configuration from '../config/configuration'
import cookieParser from 'cookie-parser'
import { describe, beforeEach, afterEach, it, expect } from 'vitest'

describe('WishlistController (e2e)', () => {
  let app: INestApplication
  let jwtCookie: string
  let sessionExpiryCookie: string

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

    const email = `test-${Date.now()}@example.com`
    const password = 'TestPass123!'

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, password })

    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password })

    const cookies = loginResponse.headers['set-cookie']
    const cookieArray = Array.isArray(cookies)
      ? cookies
      : [cookies]

    jwtCookie = cookieArray.find((c: string) => c.startsWith('access_token=')) || ''
    sessionExpiryCookie = cookieArray.find((c: string) => c.startsWith('session_expiry=')) || ''
  })

  afterEach(() => {
    app.close()
  })

  function getCookies(): string {
    return [jwtCookie, sessionExpiryCookie].filter(Boolean).join('; ')
  }

  describe('POST /wishlist', () => {
    it('should reject missing title', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/wishlist')
        .set('Cookie', getCookies())
        .send({ slugUrlText: 'test', public: true })

      expect(response.status).toBe(400)
    })

    it('should reject missing slugUrlText', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/wishlist')
        .set('Cookie', getCookies())
        .send({ title: 'Test', public: true })

      expect(response.status).toBe(400)
    })

    it('should reject missing public', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/wishlist')
        .set('Cookie', getCookies())
        .send({ title: 'Test', slugUrlText: 'test' })

      expect(response.status).toBe(400)
    })

    it('should reject unauthorized request', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/wishlist')
        .send({ title: 'Test', slugUrlText: 'test', public: true })

      expect(response.status).toBe(401)
    })

    it('should create wishlist with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/wishlist')
        .set('Cookie', getCookies())
        .send({
          title: 'Valid Wishlist',
          slugUrlText: 'valid-' + Date.now(),
          public: true,
        })

      expect(response.status).toBe(201)
    })

    it('should apply default values to description and imageSrc', async () => {
      const slug = 'defaults-' + Date.now()
      const response = await request(app.getHttpServer())
        .post('/api/wishlist')
        .set('Cookie', getCookies())
        .send({
          title: 'With Defaults',
          slugUrlText: slug,
          public: true,
        })

      expect(response.status).toBe(201)
      expect(response.body.description).toBe('')
      expect(response.body.imageSrc).toBe('')
    })
  })

  describe('PUT /wishlist/:id', () => {
    it('should update wishlist with full data', async () => {
      const slug = 'update-' + Date.now()

      const createResponse = await request(app.getHttpServer())
        .post('/api/wishlist')
        .set('Cookie', getCookies())
        .send({ title: 'Original', slugUrlText: slug, public: true })

      const wishlistId = createResponse.body.id

      const response = await request(app.getHttpServer())
        .put(`/api/wishlist/${wishlistId}`)
        .set('Cookie', getCookies())
        .send({
          title: 'Updated',
          slugUrlText: slug,
          public: true,
          description: '',
          imageSrc: '',
        })

      expect(response.status).toBe(200)
    })
  })

  describe('POST /wishlist/:id/item', () => {
    it('should reject item without title', async () => {
      const slug = 'item-' + Date.now()

      const createResponse = await request(app.getHttpServer())
        .post('/api/wishlist')
        .set('Cookie', getCookies())
        .send({ title: 'Test', slugUrlText: slug, public: true })

      const wishlistId = createResponse.body.id

      const response = await request(app.getHttpServer())
        .post(`/api/wishlist/${wishlistId}/item`)
        .set('Cookie', getCookies())
        .send({ description: 'No title' })

      expect(response.status).toBe(400)
    })

    it('should create item with valid data', async () => {
      const slug = 'item-valid-' + Date.now()

      const createResponse = await request(app.getHttpServer())
        .post('/api/wishlist')
        .set('Cookie', getCookies())
        .send({ title: 'Test', slugUrlText: slug, public: true })

      const wishlistId = createResponse.body.id

      const response = await request(app.getHttpServer())
        .post(`/api/wishlist/${wishlistId}/item`)
        .set('Cookie', getCookies())
        .send({
          title: 'New Item',
          description: 'Item description',
          url: 'https://example.com',
          imageSrc: 'https://example.com/img.jpg',
        })

      expect(response.status).toBe(201)
      expect(response.body.title).toBe('New Item')
      expect(response.body.bought).toBe(false)
    })

    it('should apply default values for optional item fields', async () => {
      const slug = 'item-defaults-' + Date.now()

      const createResponse = await request(app.getHttpServer())
        .post('/api/wishlist')
        .set('Cookie', getCookies())
        .send({ title: 'Test', slugUrlText: slug, public: true })

      const wishlistId = createResponse.body.id

      const response = await request(app.getHttpServer())
        .post(`/api/wishlist/${wishlistId}/item`)
        .set('Cookie', getCookies())
        .send({ title: 'Minimal Item' })

      expect(response.status).toBe(201)
      expect(response.body.description).toBe('')
      expect(response.body.url).toBe('')
    })
  })

  describe('PUT /wishlist/:id/item/:itemId', () => {
    it('should update item with full object including extra fields', async () => {
      const slug = 'item-update-' + Date.now()

      const createResponse = await request(app.getHttpServer())
        .post('/api/wishlist')
        .set('Cookie', getCookies())
        .send({ title: 'Test', slugUrlText: slug, public: true })

      const wishlistId = createResponse.body.id

      const itemResponse = await request(app.getHttpServer())
        .post(`/api/wishlist/${wishlistId}/item`)
        .set('Cookie', getCookies())
        .send({ title: 'Test Item' })

      const itemId = itemResponse.body.id

      const updateResponse = await request(app.getHttpServer())
        .put(`/api/wishlist/${wishlistId}/item/${itemId}`)
        .set('Cookie', getCookies())
        .send({
          title: 'Updated Title',
          description: 'Updated description',
          imageSrc: 'https://example.com/img.jpg',
          url: 'https://example.com',
          bought: true,
        })

      expect(updateResponse.status).toBe(200)
      expect(updateResponse.body.title).toBe('Updated Title')
      expect(updateResponse.body.bought).toBe(true)
    })
  })
})
