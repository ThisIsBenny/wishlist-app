import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify'
import ogs, { OpenGraphImage } from 'open-graph-scraper'

interface fetchOpenGraphRequest extends FastifyRequest {
  query: {
    url: string
  }
}

export const fetchOpenGraph = <RouteOptions>{
  method: 'GET',
  url: '/fetch-open-graph',
  schema: {
    querystring: {
      type: 'object',
      required: ['url'],
      properties: {
        url: { type: 'string', format: 'uri' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          imageSrc: { type: 'string' },
        },
      },
    },
  },
  handler: async (request: fetchOpenGraphRequest, reply: FastifyReply) => {
    const { result } = await ogs({
      url: request.query.url,
    })
    request.log.debug(result)
    if (result.success) {
      const image =
        result.ogImage && (result.ogImage as OpenGraphImage).url
          ? (result.ogImage as OpenGraphImage).url
          : ''
      reply.send({
        title: result.ogTitle || '',
        description: result.ogDescription || '',
        imageSrc: image,
      })
    }
  },
}
