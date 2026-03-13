import { z } from 'zod'

const appConfigSchema = z.object({
  DATABASE_URL: z.string().default('file:./data/data.db'),
  API_KEY: z.string().default('TOP_SECRET'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
})

export default () => {
  const config = {
    DATABASE_URL: process.env.DATABASE_URL || 'file:./data/data.db',
    API_KEY: process.env.API_KEY || 'TOP_SECRET',
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
  }

  const result = appConfigSchema.safeParse(config)
  if (!result.success) {
    throw new Error(
      `Invalid environment configuration: ${result.error.flatten().fieldErrors}`
    )
  }

  return result.data
}
