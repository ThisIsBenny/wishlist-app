import { FastifyInstance } from 'fastify'
import { getAll, getBySlugUrl } from './read'
import { updateItem } from './update'

export default async (app: FastifyInstance) => {
  await app.route(getAll)
  await app.route(getBySlugUrl)
  await app.route(updateItem)
}
