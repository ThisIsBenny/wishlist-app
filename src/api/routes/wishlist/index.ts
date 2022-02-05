import { FastifyInstance } from 'fastify'
import { getAll, getBySlugUrl } from './read'
import { updateItem } from './update'
import { createList } from './create'

export default async (app: FastifyInstance) => {
  await app.route(getAll)
  await app.route(getBySlugUrl)
  await app.route(createList)
  await app.route(updateItem)
}
