import { FastifyRequest, FastifyReply, FastifyError } from 'fastify'

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

export const notFoundHandler = (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  reply.send(notFoundError())
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

export const defaultErrorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (error.validation) {
    error.code = '400'
    reply.send(error)
  } else if (error.message?.includes('UNIQUE constraint failed')) {
    const fieldMatch = error.message.match(
      /UNIQUE constraint failed: (\w+)\.(\w+)/
    )
    reply.send(
      uniqueKeyError(
        `${fieldMatch?.[2] || 'One of the fields'} has to be unique`
      )
    )
  } else if (error.message?.includes('FOREIGN KEY constraint failed')) {
    reply.callNotFound()
  } else if (error instanceof httpError) {
    reply.send(error)
  } else {
    request.log.error(error)
    const e = new httpError('unexpected error', 500, '500')
    reply.send(e)
  }
}
