import { PrismaClient, Prisma } from '@prisma/client'

const client = new PrismaClient()
const errorType = Prisma.PrismaClientKnownRequestError

export default {
  client,
  errorType,
}
