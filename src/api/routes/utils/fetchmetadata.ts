import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify'
import ogs, { OpenGraphImage } from 'open-graph-scraper'
import axios from 'axios'
import cheerio from 'cheerio'

interface fetchMetaDataRequest extends FastifyRequest {
  query: {
    url: string
  }
}

export const fetchMetaData = <RouteOptions>{
  method: 'GET',
  url: '/fetch-meta-data-from-url',
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
  handler: async (request: fetchMetaDataRequest, reply: FastifyReply) => {
    const url = request.query.url
    const response = {
      title: '',
      description: '',
      imageSrc: '',
    }
    if (url.includes('amazon.de')) {
      const { data } = await axios.get(url)
      const $ = cheerio.load(data)
      response.title = $('#productTitle').text().trim() || ''
      response.description = response.title
      response.imageSrc = ($('#landingImage').attr('src') || '').trim()
    } else {
      const { result } = await ogs({
        url: request.query.url,
      })
      request.log.debug(result)
      if (result.success) {
        response.imageSrc =
          result.ogImage && (result.ogImage as OpenGraphImage).url
            ? (result.ogImage as OpenGraphImage).url
            : ''
        response.title = result.ogTitle || ''
        response.description = result.ogDescription || ''
      }
    }
    reply.send(response)
  },
}
