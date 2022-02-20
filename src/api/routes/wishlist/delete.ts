import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify'
import { wishlist } from '../../models'

interface deleteRequest extends FastifyRequest {
  params: {
    wishlistId: string
  }
}

interface deleteItemRequest extends FastifyRequest {
  params: {
    wishlistId: string
    itemId: number
  }
}

export const deleteList = <RouteOptions>{
  method: 'DELETE',
  url: '/:wishlistId',
  config: {
    protected: true,
  },
  schema: {
    params: {
      type: 'object',
      properties: {
        wishlistId: { type: 'string' },
      },
    },
  },
  handler: async (request: deleteRequest, reply: FastifyReply) => {
    await wishlist.delete(request.params.wishlistId)
    reply.code(204).send()
  },
}

export const deleteItem = <RouteOptions>{
  method: 'DELETE',
  url: '/:wishlistId/item/:itemId',
  config: {
    protected: true,
  },
  schema: {
    params: {
      type: 'object',
      properties: {
        wishlistId: { type: 'string' },
        itemId: { type: 'number' },
      },
    },
  },
  handler: async (request: deleteItemRequest, reply: FastifyReply) => {
    await wishlist.deleteItem(request.params.itemId)
    reply.code(204).send()
  },
}
