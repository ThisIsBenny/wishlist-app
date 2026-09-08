import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  authorizationCodeGrant,
  buildAuthorizationUrl,
  calculatePKCECodeChallenge,
  discovery,
  randomNonce,
  randomPKCECodeVerifier,
  randomState,
  type Configuration,
} from 'openid-client'
import type { AppConfig } from '../config/configuration'

interface OidcProviderConfig {
  name: string
  clientId: string
  clientSecret: string
  issuerUrl: string
}

interface PendingAuth {
  nonce: string
  codeVerifier: string
  expiresAt: number
}

interface OidcProvider {
  id: string
  name: string
  config: Configuration
  redirectUri: string
}

const STATE_TTL_MS = 10 * 60 * 1000

@Injectable()
export class OidcService implements OnModuleInit {
  private readonly logger = new Logger(OidcService.name)
  private providers: Map<string, OidcProvider> = new Map()
  private pendingAuths: Map<string, PendingAuth> = new Map()

  constructor(private readonly configService: ConfigService<AppConfig>) {}

  async onModuleInit(): Promise<void> {
    await this.discoverProviders()
  }

  private async discoverProviders(): Promise<void> {
    const oidcProviders: Record<string, OidcProviderConfig> =
      (this.configService.get('OIDC_PROVIDERS') as Record<
        string,
        OidcProviderConfig
      >) || {}

    for (const [id, providerConfig] of Object.entries(oidcProviders)) {
      try {
        const redirectUri = this.getCallbackUrl(id)
        // openid-client v6: functional API. Discovery fetches the issuer's
        // well-known configuration once and caches it in the Configuration.
        const config = await discovery(
          new URL(providerConfig.issuerUrl),
          providerConfig.clientId,
          {
            client_secret: providerConfig.clientSecret,
            redirect_uris: [redirectUri],
            response_types: ['code'],
          },
          undefined,
          // 10s for discovery AND all subsequent requests via this config.
          { timeout: 10 }
        )

        this.providers.set(id, {
          config,
          id,
          name: providerConfig.name,
          redirectUri,
        })

        this.logger.log(`Discovered OIDC provider: ${providerConfig.name}`)
      } catch (err) {
        this.logger.error(
          `Failed to discover OIDC provider ${providerConfig.name}: ${err}`
        )
      }
    }
  }

  async getAuthorizationUrl(providerId: string): Promise<string> {
    const provider = this.providers.get(providerId)
    if (!provider) {
      throw new NotFoundException(`Unknown OIDC provider: ${providerId}`)
    }

    this.sweepExpiredPendingAuths()

    const state = randomState()
    const nonce = randomNonce()
    // PKCE protects the authorization code even for confidential clients
    // (OAuth 2.1 / BCP recommendation).
    const codeVerifier = randomPKCECodeVerifier()
    const codeChallenge = await calculatePKCECodeChallenge(codeVerifier)

    this.pendingAuths.set(state, {
      nonce,
      codeVerifier,
      expiresAt: Date.now() + STATE_TTL_MS,
    })

    const redirectUrl = buildAuthorizationUrl(provider.config, {
      scope: 'openid profile email',
      state,
      nonce,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      redirect_uri: provider.redirectUri,
    })

    return redirectUrl.href
  }

  async handleCallback(
    providerId: string,
    callbackUrl: URL
  ): Promise<{
    sub: string
    email: string
    issuer: string
    emailVerified: boolean
  }> {
    const provider = this.providers.get(providerId)
    if (!provider) {
      throw new NotFoundException(`Unknown OIDC provider: ${providerId}`)
    }

    const state = callbackUrl.searchParams.get('state')
    if (!state) {
      throw new BadRequestException('invalid_state')
    }

    const pending = this.pendingAuths.get(state)
    if (!pending) {
      throw new BadRequestException('invalid_state')
    }
    // Consume the state exactly once (replay protection) and enforce the TTL.
    this.pendingAuths.delete(state)
    if (Date.now() > pending.expiresAt) {
      throw new BadRequestException('invalid_state')
    }

    const tokens = await authorizationCodeGrant(provider.config, callbackUrl, {
      expectedState: state,
      expectedNonce: pending.nonce,
      pkceCodeVerifier: pending.codeVerifier,
    })

    const claims = tokens.claims()
    if (!claims) {
      throw new BadRequestException('OIDC provider did not return an id_token')
    }

    return {
      sub: claims.sub,
      email:
        typeof claims.email === 'string'
          ? claims.email
          : `${claims.sub}@oidc.local`,
      issuer: claims.iss,
      emailVerified: claims.email_verified === true,
    }
  }

  getProviderInfo(): Array<{ id: string; name: string }> {
    const providers: Array<{ id: string; name: string }> = []
    this.providers.forEach((provider) => {
      providers.push({ id: provider.id, name: provider.name })
    })
    return providers.sort((a, b) => a.name.localeCompare(b.name))
  }

  private sweepExpiredPendingAuths(): void {
    const now = Date.now()
    for (const [state, pending] of this.pendingAuths) {
      if (now > pending.expiresAt) {
        this.pendingAuths.delete(state)
      }
    }
  }

  /**
   * The registered redirect_uri for a provider. Used by the controller to
   * reconstruct the incoming callback URL for openid-client v6, which
   * derives the token-exchange redirect_uri from it (exact-match).
   */
  getCallbackUrlFor(providerId: string): string {
    // Validate that the provider exists before handing out its callback URL.
    if (!this.providers.has(providerId)) {
      throw new NotFoundException(`Unknown OIDC provider: ${providerId}`)
    }
    return this.getCallbackUrl(providerId)
  }

  private getCallbackUrl(providerId: string): string {
    const publicUrl = this.configService.get('PUBLIC_URL')
    if (publicUrl) {
      return `${publicUrl}/api/auth/oidc/${providerId}/callback`
    }
    const port = this.configService.get('PORT') || 5000
    return `http://localhost:${port}/api/auth/oidc/${providerId}/callback`
  }
}
