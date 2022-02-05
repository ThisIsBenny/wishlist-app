import { Wishlist } from '@/types'
import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify'
import { wishlist } from '../../models'
import { prisma } from '../../services'
import { uniqueKeyError } from '../../config/errors'

interface GetBySlugUrlTextRequest extends FastifyRequest {
  params: {
    wishlistId: string
    itemId: number
  }
}

export const createList = <RouteOptions>{
  method: 'POST',
  url: '/',
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
      201: {
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
  handler: async (request: GetBySlugUrlTextRequest, reply: FastifyReply) => {
    request.log.debug(request.body)
    try {
      const item = await wishlist.create(request.body as Wishlist)
      return item
    } catch (error) {
      if (error instanceof prisma.errorType && error.code === 'P2002') {
        return reply.send(uniqueKeyError('Slugtext has to be unique'))
      }
      request.log.error(error)
      throw new Error('Unexptected Error')
    }
  },
}