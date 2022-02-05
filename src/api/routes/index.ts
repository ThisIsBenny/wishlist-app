import { FastifyInstance } from 'fastify'
import { default as wishlistRoute } from './wishlist/'
import { notFoundError } from '../config/errors'

export default {
  register: (app: FastifyInstance) => {
    return app.register(
      async (app) => {
        app.setNotFoundHandler((request, reply) => {
          reply.send(notFoundError())
        })
        await app.register(wishlistRoute, { prefix: '/wishlist' })
      },
      { prefix: '/api' }
    )
  },
}
