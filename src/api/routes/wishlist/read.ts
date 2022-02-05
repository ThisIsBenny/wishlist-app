import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify'
import { wishlist } from '../../models'
import { wishlistResponseSchema } from '../../config/schemas'

export const getAll = <RouteOptions>{
  method: 'GET',
  url: '/',
  schema: {
    response: {
      200: {
        type: 'array',
        items: wishlistResponseSchema,
      },
    },
  },
  handler: async () => {
    return await wishlist.getAll()
  },
}

interface GetBySlugUrlTextRequest extends FastifyRequest {
  params: {
    slugText: string
  }
}

export const getBySlugUrl = <RouteOptions>{
  method: 'GET',
  url: '/:slugText',
  schema: {
    response: {
      200: wishlistResponseSchema,
    },
  },
  handler: async (request: GetBySlugUrlTextRequest, reply: FastifyReply) => {
    const list = await wishlist.getBySlugUrlText(request.params.slugText, true)
    if (list) {
      return list
    } else {
      return reply.callNotFound()
    }
  },
}
