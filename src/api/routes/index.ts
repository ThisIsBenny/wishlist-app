import { FastifyInstance } from 'fastify'
import { default as wishlistRoute } from './wishlist/'
import { defaultErrorHandler, notFoundHandler } from '../config/errors'

export default {
  register: (app: FastifyInstance) => {
    return app.register(
      async (app) => {
        await app.setNotFoundHandler(notFoundHandler)
        await app.setErrorHandler(defaultErrorHandler)
        await app.register(wishlistRoute, { prefix: '/wishlist' })
      },
      { prefix: '/api' }
    )
  },
}
