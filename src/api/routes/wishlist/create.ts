import { Wishlist, WishlistItem } from '@/types'
import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify'
import { wishlist } from '../../models'
import {
  wishlistItemRequestSchema,
  wishlistItemResponseSchema,
  wishlistRequestSchema,
  wishlistResponseSchema,
} from '../../config/schemas'

interface createItemRequest extends FastifyRequest {
  params: {
    wishlistId: string
  }
}

export const createList = <RouteOptions>{
  method: 'POST',
  url: '/',
  config: {
    protected: true,
  },
  schema: {
    body: wishlistRequestSchema,
    response: {
      201: wishlistResponseSchema,
    },
  },
  handler: async (request: FastifyRequest, reply: FastifyReply) => {
    request.log.debug(request.body)
    const item = await wishlist.create(request.body as Wishlist)
    reply.code(201).send(item)
  },
}

export const createItem = <RouteOptions>{
  method: 'POST',
  url: '/:wishlistId/item',
  config: {
    protected: true,
  },
  schema: {
    body: wishlistItemRequestSchema,
    params: {
      type: 'object',
      properties: {
        wishlistId: { type: 'string' },
      },
    },
    response: {
      201: wishlistItemResponseSchema,
    },
  },
  handler: async (request: createItemRequest, reply: FastifyReply) => {
    request.log.debug(request.body)
    const item = await wishlist.createItem(
      request.params.wishlistId,
      request.body as WishlistItem
    )
    reply.code(201).send(item)
  },
}
