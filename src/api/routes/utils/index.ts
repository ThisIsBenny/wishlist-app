import { FastifyInstance } from 'fastify'
import { fetchMetaData } from './fetchmetadata'

export default async (app: FastifyInstance) => {
  await app.route(fetchMetaData)
}
