import { uniqueKeyError } from '../../config/errors'
import { prisma } from '../../services'
import { Wishlist } from '@/types'
import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify'
import { wishlist } from '../../models'

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
    body: {
      type: 'object',
      additionalProperties: false,
      required: ['title', 'imageSrc', 'slugUrlText'],
      properties: {
        title: { type: 'string' },
        imageSrc: { type: 'string' },
        description: { type: 'string' },
        slugUrlText: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          imageSrc: { type: 'string' },
          description: { type: 'string' },
          slugUrlText: { type: 'string' },
        },
      },
    },
  },
  errorHandler: (error, request, reply) => {
    if (error instanceof prisma.errorType && error.code === 'P2002') {
      return reply.send(uniqueKeyError('Slugtext has to be unique'))
    }
    if (error instanceof prisma.errorType && error.code === 'P2025') {
      return reply.callNotFound()
    }
    request.log.error(error)
    reply.send(new Error('Unexptected Error'))
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
    body: {
      type: 'object',
      additionalProperties: false,
      properties: {
        title: { type: 'string' },
        url: { type: 'string' },
        image: { type: 'string' },
        description: { type: 'string' },
        comment: { type: 'string' },
        bought: { type: 'boolean' },
      },
    },
    response: {
      204: {
        type: 'object',
        properties: {
          id: { type: 'number' },
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
  handler: async (request: updateItemRequest, reply: FastifyReply) => {
    request.log.debug(request.body)
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
