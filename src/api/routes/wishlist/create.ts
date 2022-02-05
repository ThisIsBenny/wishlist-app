import { Wishlist, WishlistItem } from '@/types'
import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify'
import { wishlist } from '../../models'
import { prisma } from '../../services'
import { uniqueKeyError } from '../../config/errors'
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
  schema: {
    body: wishlistRequestSchema,
    response: {
      201: wishlistResponseSchema,
    },
  },
  errorHandler: (error, request, reply) => {
    if (error instanceof prisma.errorType && error.code === 'P2002') {
      return reply.send(uniqueKeyError('Slugtext has to be unique'))
    }
    request.log.error(error)
    reply.send(new Error('Unexptected Error'))
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
  schema: {
    body: wishlistItemRequestSchema,
    response: {
      201: wishlistItemResponseSchema,
    },
  },
  errorHandler: (error, request, reply) => {
    if (error instanceof prisma.errorType && error.code === 'P2025') {
      return reply.callNotFound()
    }
    request.log.error(error)
    reply.send(new Error('Unexptected Error'))
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
