import { FastifyInstance } from 'fastify'
import { fetchOpenGraph } from './opengraph'

export default async (app: FastifyInstance) => {
  await app.route(fetchOpenGraph)
}
