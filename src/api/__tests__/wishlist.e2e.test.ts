import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import request from 'supertest'
import { AppModule } from '../app.module'
import configuration from '../config/configuration'
import { describe, beforeEach, afterEach, it, expect } from 'vitest'

describe('WishlistController (e2e)', () => {
  let app: INestApplication
  const apiKey = 'TOP_SECRET'

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
    await app.init()
  })

  afterEach(() => {
    app.close()
  })

  describe('POST /wishlist', () => {
    it('should reject missing title', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/wishlist')
        .set('Authorization', 'API-Key ' + apiKey)
        .send({ slugUrlText: 'test', public: true })

      expect(response.status).toBe(400)
    })

    it('should reject missing slugUrlText', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/wishlist')
        .set('Authorization', 'API-Key ' + apiKey)
        .send({ title: 'Test', public: true })

      expect(response.status).toBe(400)
    })

    it('should reject missing public', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/wishlist')
        .set('Authorization', 'API-Key ' + apiKey)
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
        .set('Authorization', 'API-Key ' + apiKey)
        .send({
          title: 'Valid Wishlist',
          slugUrlText: 'valid-' + Date.now(),
          public: true,
        })

      console.log('Create wishlist response:', response.status, response.body)
      expect(response.status).toBe(201)
    })

    it('should apply default values to description and imageSrc', async () => {
      const slug = 'defaults-' + Date.now()
      const response = await request(app.getHttpServer())
        .post('/api/wishlist')
        .set('Authorization', 'API-Key ' + apiKey)
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
    it('should update wishlist with partial data', async () => {
      const slug = 'update-' + Date.now()

      const createResponse = await request(app.getHttpServer())
        .post('/api/wishlist')
        .set('Authorization', 'API-Key ' + apiKey)
        .send({ title: 'Original', slugUrlText: slug, public: true })

      const wishlistId = createResponse.body.id

      const response = await request(app.getHttpServer())
        .put(`/api/wishlist/${wishlistId}`)
        .set('Authorization', 'API-Key ' + apiKey)
        .send({ title: 'Updated' })

      expect(response.status).toBe(200)
    })
  })

  describe('POST /wishlist/:id/item', () => {
    it('should reject item without title', async () => {
      const slug = 'item-' + Date.now()

      const createResponse = await request(app.getHttpServer())
        .post('/api/wishlist')
        .set('Authorization', 'API-Key ' + apiKey)
        .send({ title: 'Test', slugUrlText: slug, public: true })

      const wishlistId = createResponse.body.id

      const response = await request(app.getHttpServer())
        .post(`/api/wishlist/${wishlistId}/item`)
        .set('Authorization', 'API-Key ' + apiKey)
        .send({ description: 'No title' })

      expect(response.status).toBe(400)
    })

    it('should create item with valid data', async () => {
      const slug = 'item-valid-' + Date.now()

      const createResponse = await request(app.getHttpServer())
        .post('/api/wishlist')
        .set('Authorization', 'API-Key ' + apiKey)
        .send({ title: 'Test', slugUrlText: slug, public: true })

      const wishlistId = createResponse.body.id

      const response = await request(app.getHttpServer())
        .post(`/api/wishlist/${wishlistId}/item`)
        .set('Authorization', 'API-Key ' + apiKey)
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
        .set('Authorization', 'API-Key ' + apiKey)
        .send({ title: 'Test', slugUrlText: slug, public: true })

      const wishlistId = createResponse.body.id

      const response = await request(app.getHttpServer())
        .post(`/api/wishlist/${wishlistId}/item`)
        .set('Authorization', 'API-Key ' + apiKey)
        .send({ title: 'Minimal Item' })

      expect(response.status).toBe(201)
      expect(response.body.description).toBe('')
      expect(response.body.url).toBe('')
    })
  })
})
