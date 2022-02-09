import helmet from 'fastify-helmet'
import Fastify, { FastifyContextConfig } from 'fastify'
import compress from 'fastify-compress'
import cors from 'fastify-cors'
import { fastify as defaultConfig } from './'
import auth from './auth'

export default async (opts: FastifyContextConfig = {}) => {
  const app = Fastify({
    ...defaultConfig,
    ...opts,
  })

  await app.register(helmet, {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })

  await app.register(cors, {
    origin:
      process.env.NODE_ENV === 'development'
        ? /https?:\/\/localhost(:\d+)?/
        : false,
  })

  await app.register(compress)
  await auth.init(app)

  return app
}
