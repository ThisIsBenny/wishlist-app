import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify'
import { wishlist } from '../../models'

interface GetBySlugUrlTextRequest extends FastifyRequest {
  params: {
    wishlistId: string
    itemId: number
  }
}

export const updateItem = <RouteOptions>{
  method: 'PUT',
  url: '/:wishlistId/item/:itemId',
  schema: {
    response: {
      204: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          url: { type: 'string' },
          image: { type: 'string' },
          description: { type: 'string' },
          comment: { type: 'string' },
          bought: { type: 'boolean' },
          wishlistId: { type: 'string' },
        },
      },
    },
  },
  handler: async (request: GetBySlugUrlTextRequest, reply: FastifyReply) => {
    const item = await wishlist.updateItem(
      Number(request.params.itemId),
      request.body
    )
    if (item) {
      return item
    } else {
      return reply.code(404).send({
        error: 'notFound',
        http: 404,
      })
    }
  },
}
