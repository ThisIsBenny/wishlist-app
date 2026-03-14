import { describe, it, expect } from 'vitest'

describe('Migrations', () => {
  it('should export migration module', async () => {
    const { MigrationModule } = await import('../migration.module')
    expect(MigrationModule).toBeDefined()
  })

  it('should export migration service', async () => {
    const { MigrationService } = await import('../migration.service')
    expect(MigrationService).toBeDefined()
  })

  it('should export PrismaToDrizzleMigration', async () => {
    const { PrismaToDrizzleMigration } =
      await import('../migrations/001-prisma-to-drizzle')
    expect(PrismaToDrizzleMigration).toBeDefined()
    expect(PrismaToDrizzleMigration.name).toBe('PrismaToDrizzleMigration')
  })
})
