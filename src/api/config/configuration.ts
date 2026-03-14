import { z } from 'zod'

const appConfigSchema = z.object({
  DATABASE_URL: z.string().default('file:./data/data.db'),
  API_KEY: z.string().min(1),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
})

export const appConfig = appConfigSchema.parse
export type AppConfig = z.infer<typeof appConfigSchema>

export default () => {
  const config = {
    DATABASE_URL: process.env.DATABASE_URL,
    API_KEY: process.env.API_KEY,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
  }

  const result = appConfigSchema.safeParse(config)
  if (!result.success) {
    throw new Error(
      `Invalid environment configuration: ${result.error.flatten().fieldErrors}`
    )
  }

  return result.data
}
