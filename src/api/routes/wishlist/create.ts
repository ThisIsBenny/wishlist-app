import { Wishlist } from '@/types'
import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify'
import { wishlist } from '../../models'
import { prisma } from '../../services'
import { uniqueKeyError } from '../../config/errors'
import {
  wishlistRequestSchema,
  wishlistResponseSchema,
} from '../../config/schemas'

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
