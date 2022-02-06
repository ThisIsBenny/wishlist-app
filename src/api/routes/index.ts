import { FastifyInstance } from 'fastify'
import { default as wishlistRoute } from './wishlist/'
import { default as utilsRoute } from './utils/'

export default {
  register: (app: FastifyInstance) => {
    return app.register(
      async (app) => {
        await app.register(wishlistRoute, { prefix: '/wishlist' })
        await app.register(utilsRoute, { prefix: '/utils' })
      },
      { prefix: '/api' }
    )
  },
}
