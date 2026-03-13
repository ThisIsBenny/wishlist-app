import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import request from 'supertest'
import { AppModule } from '../app.module'
import configuration from '../config/configuration'
import { describe, beforeEach, afterEach, it, expect } from 'vitest'

describe('HealthController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
          ignoreEnvFile: true,
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

  describe('GET /healthz', () => {
    it('should return health status', async () => {
      const response = await request(app.getHttpServer()).get('/api/healthz')

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('status')
      expect(response.body).toHaveProperty('database')
    })

    it('should return connected when db is available', async () => {
      const response = await request(app.getHttpServer()).get('/api/healthz')

      expect(response.body.status).toBe('ok')
      expect(response.body.database).toBeDefined()
    })
  })
})
