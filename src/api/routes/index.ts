import { FastifyInstance } from 'fastify'
import { default as wishlistRoute } from './wishlist/'
import { defaultErrorHandler, notFoundHandler } from '../config/errors'
import { default as utilsRoute } from './utils/'

export default {
  register: (app: FastifyInstance) => {
    return app.register(
      async (app) => {
        await app.setNotFoundHandler(notFoundHandler)
        await app.setErrorHandler(defaultErrorHandler)
        await app.register(wishlistRoute, { prefix: '/wishlist' })
        await app.register(utilsRoute, { prefix: '/utils' })
      },
      { prefix: '/api' }
    )
  },
}
