import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { IS_PUBLIC_KEY } from './public.decorator'
import { DB_TOKEN, type DbInstance } from '../database.module'
import { sessions } from '@/db/schema'
import { and, eq, gte } from 'drizzle-orm'
import type { JwtUser } from './current-user.decorator'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    @Inject(DB_TOKEN) private readonly db: DbInstance
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()
    const token = request.cookies?.access_token

    if (!token) {
      throw new UnauthorizedException('Not authenticated')
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtUser>(token)

      // Single lookup: the session must (a) belong to the token's subject,
      // (b) exist (not revoked), and (c) not be expired. ISO-8601 strings
      // compare correctly lexicographically.
      const session = await this.db
        .select({ userId: sessions.userId })
        .from(sessions)
        .where(
          and(
            eq(sessions.tokenJti, payload.jti),
            eq(sessions.userId, payload.sub),
            gte(sessions.expiresAt, new Date().toISOString())
          )
        )
        .get()

      if (!session) {
        throw new UnauthorizedException('Session has been invalidated')
      }

      request.user = payload
      return true
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err
      }
      throw new UnauthorizedException('Invalid or expired token')
    }
  }
}
