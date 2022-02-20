import { FastifyRequest, FastifyReply, FastifyError } from 'fastify'
import { Prisma } from '@prisma/client'

const errorIs = (e: unknown, c: string) =>
  e instanceof Prisma.PrismaClientKnownRequestError && e.code === c

export const defaultErrorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (error.validation) {
    error.code = '400'
    reply.send(error)
  } else if (errorIs(error, 'P2002')) {
    reply.send(
      uniqueKeyError(
        // @ts-expect-error: Object is possibly 'undefined'
        `${error.meta.target[0] || 'One of the fields'} has to be unique`
      )
    )
  } else if (errorIs(error, 'P2025')) {
    reply.callNotFound()
  } else if (error instanceof httpError) {
    reply.send(error)
  } else {
    request.log.error(error)
    const e = new httpError('unexpected error', 500, '500')
    reply.send(e)
  }
}

export const notFoundHandler = (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  reply.send(notFoundError())
}

class httpError extends Error {
  code: string
  statusCode: number
  constructor(message: string, statusCode: number, code: string) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
    this.statusCode = statusCode
    this.code = code
  }
}

export const notFoundError = () => {
  return new httpError('Not Found', 404, '404')
}

export const uniqueKeyError = (msg: string, code = '4001') => {
  return new httpError(msg, 422, code)
}
export const notAuthorized = (msg: string, code = '401') => {
  return new httpError(msg, 401, code)
}
