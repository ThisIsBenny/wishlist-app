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

export const uniqueKeyError = (msg: string, code = '4001') => {
  return new httpError(msg, 400, code)
}
