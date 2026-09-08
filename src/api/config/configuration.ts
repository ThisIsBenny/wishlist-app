import { z } from 'zod'

const oidcProviderSchema = z.object({
  name: z.string().min(1),
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
  issuerUrl: z.string().url(),
})

const appConfigSchema = z.object({
  DATABASE_URL: z.string().default('file:./data/data.db'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().min(32),
  AUTH_EMAIL_LOGIN_ENABLED: z
    .string()
    .default('true')
    .transform((val) => val === 'true'),
  AUTH_EMAIL_REGISTER_ENABLED: z
    .string()
    .default('true')
    .transform((val) => val === 'true'),
  OIDC_PROVIDERS: z.record(z.string(), oidcProviderSchema).default({}),
  // Public base URL of the deployment (e.g. https://wishlist.example.com).
  // Required in production for OIDC redirect_uris; optional in dev.
  PUBLIC_URL: z.string().url().optional(),
})

export type AppConfig = z.infer<typeof appConfigSchema>

function parseOidcProviders(): Record<
  string,
  z.infer<typeof oidcProviderSchema>
> {
  const providers: Record<string, z.infer<typeof oidcProviderSchema>> = {}
  const suffixPattern = /^OIDC_(\w+)_(NAME|CLIENT_ID|CLIENT_SECRET|ISSUER_URL)$/

  for (const [key, value] of Object.entries(process.env)) {
    const match = key.match(suffixPattern)
    if (match && value) {
      const id = match[1]
      const field = match[2]
      if (!providers[id]) {
        providers[id] = {
          name: '',
          clientId: '',
          clientSecret: '',
          issuerUrl: '',
        }
      }
      if (field === 'NAME') providers[id].name = value
      else if (field === 'CLIENT_ID') providers[id].clientId = value
      else if (field === 'CLIENT_SECRET') providers[id].clientSecret = value
      else if (field === 'ISSUER_URL') providers[id].issuerUrl = value
    }
  }

  return providers
}

export default () => {
  const config = {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    AUTH_EMAIL_LOGIN_ENABLED: process.env.AUTH_EMAIL_LOGIN_ENABLED,
    AUTH_EMAIL_REGISTER_ENABLED: process.env.AUTH_EMAIL_REGISTER_ENABLED,
    OIDC_PROVIDERS: parseOidcProviders(),
    PUBLIC_URL: process.env.PUBLIC_URL,
  }

  const result = appConfigSchema.safeParse(config)
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    throw new Error(
      `Invalid environment configuration: ${JSON.stringify(errors)}`
    )
  }

  return result.data
}
