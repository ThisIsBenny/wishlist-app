import FastifyHelmet from '@fastify/helmet'
import Fastify, { FastifyContextConfig } from 'fastify'
import FastifyCompress from '@fastify/compress'
import FastifyCors from '@fastify/cors'
import fastifyConfig from './fastify'
import auth from './auth'

declare module 'fastify' {
  interface FastifyRequest {
    isAuthenticated: boolean
  }
  interface FastifyContextConfig {
    protected?: boolean
  }
}

export default async (opts: FastifyContextConfig = {}) => {
  const app = Fastify({
    ...fastifyConfig,
    ...opts,
  })

  await app.register(FastifyHelmet, {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })

  await app.register(FastifyCors, {
    origin:
      process.env.NODE_ENV === 'development'
        ? /https?:\/\/localhost(:\d+)?/
        : false,
  })

  await app.register(FastifyCompress)
  await auth.init(app as any)

  return app
}
