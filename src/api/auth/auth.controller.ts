import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Redirect,
  Req,
  Res,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { OidcService } from './oidc.service'
import { JwtAuthGuard } from './jwt-auth.guard'
import { Public } from './public.decorator'
import { CurrentUser } from './current-user.decorator'
import type { JwtUser } from './current-user.decorator'
import { Throttle } from '@nestjs/throttler'
import { LoginDto, RegisterDto } from './dto/auth.dto'
import type { Request, Response } from 'express'

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor(
    private readonly authService: AuthService,
    private readonly oidcService: OidcService
  ) {}

  @Get('config')
  @Public()
  getConfig() {
    return {
      emailLoginEnabled: this.authService.isEmailLoginEnabled(),
      emailRegisterEnabled: this.authService.isEmailRegisterEnabled(),
      oidcProviders: this.oidcService.getProviderInfo(),
    }
  }

  @Post('register')
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) response: any
  ) {
    return await this.authService.register(dto, response)
  }

  @Post('login')
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: any
  ) {
    return await this.authService.login(dto, response)
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser('jti') jti: string,
    @Res({ passthrough: true }) response: any
  ) {
    await this.authService.logout(jti, response)
    return { message: 'Logged out successfully' }
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async me(@CurrentUser() user: JwtUser) {
    const found = await this.authService.findUserById(user.sub)
    return { user: found }
  }

  @Get('oidc/:providerId/login')
  @Public()
  @Redirect()
  async oidcLogin(@Param('providerId') providerId: string) {
    const url = await this.oidcService.getAuthorizationUrl(providerId)
    return { url, statusCode: 302 }
  }

  @Get('oidc/:providerId/callback')
  @Public()
  async oidcCallback(
    @Param('providerId') providerId: string,
    @Req() req: any,
    @Res({ passthrough: true }) response: any
  ) {
    try {
      // openid-client v6 expects the full incoming URL (host is ignored;
      // query parameters carry the authorization response).
      const callbackUrl = new URL(
        `${this.oidcService.getCallbackUrlFor(providerId)}${req.originalUrl.split('?')[1] ? '?' + req.originalUrl.split('?')[1] : ''}`,
        `http://${req.headers.host || 'localhost'}`
      )
      const { sub, email, issuer, emailVerified } =
        await this.oidcService.handleCallback(providerId, callbackUrl)
      await this.authService.oidcLogin(
        sub,
        email,
        issuer,
        emailVerified,
        response
      )
      response.redirect('/')
    } catch (err: any) {
      // User cancelled at the provider (error=access_denied in the query)
      // gets its own friendly code instead of provider_error.
      if (req.originalUrl.includes('error=access_denied')) {
        response.redirect('/login?error=access_denied')
      } else if (err instanceof BadRequestException) {
        response.redirect('/login?error=invalid_state')
      } else if (err instanceof NotFoundException) {
        response.redirect('/login?error=unknown_provider')
      } else {
        // Surface the real cause for production debugging instead of
        // silently swallowing it behind a generic redirect.
        this.logger.error(
          `OIDC callback failed for provider ${providerId}: ${err?.message ?? err}`,
          err?.stack
        )
        response.redirect('/login?error=provider_error')
      }
    }
  }
}
