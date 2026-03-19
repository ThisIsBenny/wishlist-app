import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'

interface ErrorResponse {
  statusCode: number
  message: string | string[]
  error: string
  timestamp: string
  path: string
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR
    let message: string | string[] = 'Internal server error'
    let error = 'Internal Server Error'

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus()
      const exceptionResponse = exception.getResponse()

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>
        message = (resp.message as string | string[]) || exception.message
        error = (resp.error as string) || HttpStatus[statusCode] || 'Error'
      } else {
        message = exception.message
        error = HttpStatus[statusCode] || 'Error'
      }
    } else if (exception instanceof Error) {
      message = exception.message
      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack
      )
    } else {
      this.logger.error(`Unknown exception type: ${String(exception)}`)
    }

    const isProduction = process.env.NODE_ENV === 'production'

    const errorResponse: ErrorResponse = {
      statusCode,
      message:
        isProduction && statusCode >= 500 ? 'Internal server error' : message,
      error:
        isProduction && statusCode >= 500 ? 'Internal Server Error' : error,
      timestamp: new Date().toISOString(),
      path: request.url,
    }

    if (statusCode >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${statusCode}`,
        exception instanceof Error ? exception.stack : String(exception)
      )
    } else if (statusCode >= 400) {
      this.logger.warn(
        `${request.method} ${request.url} - ${statusCode}: ${JSON.stringify(message)}`
      )
    }

    response.status(statusCode).json(errorResponse)
  }
}
