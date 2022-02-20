import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { notAuthorized } from './errors'

const error = notAuthorized('Unauthorized')

export default {
  init: async (app: FastifyInstance) => {
    if (!process.env.API_KEY) {
      throw new Error('ENV API_KEY is not set!')
    }
    app.decorateRequest('isAuthenticated', false)
    app.addHook(
      'onRequest',
      (request: FastifyRequest, reply: FastifyReply, done) => {
        if (request.headers.authorization) {
          const authHeader = request.headers.authorization.split(' ')
          request.log.debug(authHeader)
          if (
            authHeader[0] &&
            authHeader[0].trim().toLowerCase() === 'api-key' &&
            authHeader[1]
          ) {
            if (authHeader[1] === process.env.API_KEY) {
              request.isAuthenticated = true
            }
          }
        }
        if (reply.context.config.protected && !request.isAuthenticated) {
          done(error)
        } else {
          done()
        }
      }
    )
  },
}
