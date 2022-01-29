import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify'
import { wishlist } from '../../models'

export const getAll = <any>{
  method: 'GET',
  url: '/',
  schema: {
    response: {
      200: {
        type: 'array',
        items: {
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
      200: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          imageSrc: { type: 'string' },
          description: { type: 'string' },
          slugUrlText: { type: 'string' },
          items: {
            type: 'array',
            items: {
              properties: {
                id: { type: 'number' },
                title: { type: 'string' },
                url: { type: 'string' },
                imageSrc: { type: 'string' },
                description: { type: 'string' },
                comment: { type: 'string' },
                bought: { type: 'boolean' },
                wishlistId: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  handler: async (request: GetBySlugUrlTextRequest, reply: FastifyReply) => {
    const list = await wishlist.getBySlugUrlText(request.params.slugText, true)
    if (list) {
      return list
    } else {
      return reply.code(404).send({
        error: 'notFound',
        http: 404,
      })
    }
  },
}
