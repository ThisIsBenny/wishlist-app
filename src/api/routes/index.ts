import { FastifyInstance } from 'fastify'
import { default as wishlistRoute } from './wishlist/'

export default {
  register: (app: FastifyInstance) => {
    return app.register(
      async (app) => {
        await app.register(wishlistRoute, { prefix: '/wishlist' })
      },
      { prefix: '/api' }
    )
  },
}
