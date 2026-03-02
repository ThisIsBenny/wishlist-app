import { Wishlist, WishlistItem, WishlistUpdateInput, Prisma } from '@/types'
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
  config: {
    protected: true,
  },
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
    const payload = request.body as Wishlist
    const updateInput: WishlistUpdateInput = {
      public: payload.public,
      title: payload.title,
      description: payload.description,
      imageSrc: payload.imageSrc,
      slugUrlText: payload.slugUrlText,
    }
    const item = await wishlist.update(request.params.wishlistId, updateInput)
    reply.code(201).send(item)
  },
}

export const updateItem = <RouteOptions>{
  method: 'PUT',
  url: '/:wishlistId/item/:itemId',
  config: {
    protected: true,
  },
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
    const payload = request.body as WishlistItem
    reply.send(await wishlist.updateItem(request.params.itemId, payload))
  },
}

export const itemBought = <RouteOptions>{
  method: 'POST',
  url: '/:wishlistId/item/:itemId/bought',
  schema: {
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
    const updatePayload: Prisma.ItemUpdateInput = {
      bought: true,
    }
    reply.send(
      await wishlist.updateItem(
        request.params.itemId,
        updatePayload as unknown as WishlistItem
      )
    )
  },
}
