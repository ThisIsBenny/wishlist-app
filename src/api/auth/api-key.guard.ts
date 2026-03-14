import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { Reflector } from '@nestjs/core'

declare module 'express' {
  interface Request {
    isAuthenticated?: boolean
  }
}

export const API_KEY_OPTIONAL = 'apiKeyOptional'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()

    // Unterstütze nur Authorization: API-Key Header
    const authHeader = request.headers['authorization']
    const apiKey = authHeader?.startsWith('API-Key ')
      ? authHeader.slice(8) // "API-Key " entfernen
      : null

    const validApiKey = this.configService.get<string>('API_KEY')
    const isOptional = this.reflector.get<boolean>(
      API_KEY_OPTIONAL,
      context.getHandler()
    )

    if (!apiKey) {
      if (isOptional) {
        request.isAuthenticated = false
        return true
      }
      throw new UnauthorizedException('Invalid or missing API key')
    }

    if (apiKey !== validApiKey) {
      throw new UnauthorizedException('Invalid or missing API key')
    }

    request.isAuthenticated = true
    return true
  }
}

export const OptionalApiKey = () => SetMetadata(API_KEY_OPTIONAL, true)
