import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { notAuthorized } from './errors'

const error = notAuthorized('Unauthorized')

export default {
  init: async (app: FastifyInstance) => {
    if (!process.env.API_KEY) {
      throw new Error('ENV API_KEY is not set!')
    }
    app.addHook(
      'onRequest',
      (request: FastifyRequest, reply: FastifyReply, done) => {
        //@ts-expect-error: custom attribute
        if (!reply.context.config.protected) {
          return done()
        }
        if (!request.headers.authorization) {
          return done(error)
        }
        const authHeader = request.headers.authorization.split(' ')
        request.log.debug(authHeader)
        if (
          authHeader[0] &&
          authHeader[0].trim().toLowerCase() === 'api-key' &&
          authHeader[1]
        ) {
          if (authHeader[1] === process.env.API_KEY) {
            return done()
          }
        }
        done(error)
      }
    )
  },
}
