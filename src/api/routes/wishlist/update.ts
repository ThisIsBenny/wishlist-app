import { Wishlist } from '@/types'
import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify'
import { wishlist } from '../../models'
import {
  wishlistRequestSchema,
  wishlistResponseSchema,
  wishlistItemRequestSchema,
  wishlistItemResponseSchema,
} from '../../config/schemas'

interface updateRequest extends FastifyRequest {
  params: {
    wishlistId: string
  }
}

interface updateItemRequest extends FastifyRequest {
  params: {
    wishlistId: string
    itemId: number
  }
}

export const updateList = <RouteOptions>{
  method: 'PUT',
  url: '/:wishlistId',
  schema: {
    body: wishlistRequestSchema,
    params: {
      type: 'object',
      properties: {
        wishlistId: { type: 'string' },
      },
    },
    response: {
      200: wishlistResponseSchema,
    },
  },
  handler: async (request: updateRequest, reply: FastifyReply) => {
    request.log.debug(request.body)
    const item = await wishlist.update(
      request.params.wishlistId,
      request.body as Wishlist
    )
    reply.code(201).send(item)
  },
}

export const updateItem = <RouteOptions>{
  method: 'PUT',
  url: '/:wishlistId/item/:itemId',
  schema: {
    body: wishlistItemRequestSchema,
    params: {
      type: 'object',
      properties: {
        wishlistId: { type: 'string' },
        itemId: { type: 'number' },
      },
    },
    response: {
      200: wishlistItemResponseSchema,
    },
  },
  handler: async (request: updateItemRequest, reply: FastifyReply) => {
    request.log.debug(request.body)
    reply.send(await wishlist.updateItem(request.params.itemId, request.body))
  },
}
