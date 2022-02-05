import { FastifyInstance } from 'fastify'
import { getAll, getBySlugUrl } from './read'
import { updateList, updateItem } from './update'
import { createList, createItem } from './create'

export default async (app: FastifyInstance) => {
  await app.route(getAll)
  await app.route(getBySlugUrl)
  await app.route(createList)
  await app.route(createItem)
  await app.route(updateList)
  await app.route(updateItem)
}
