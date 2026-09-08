import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export interface JwtUser {
  sub: string
  jti: string
}

declare module 'express' {
  interface Request {
    user?: JwtUser
  }
}

export const CurrentUser = createParamDecorator(
  (data: keyof JwtUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>()
    const user = request.user
    if (!user) return undefined
    return data ? user[data] : user
  }
)
