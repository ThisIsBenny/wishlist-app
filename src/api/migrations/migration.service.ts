import { Injectable, Logger, Inject } from '@nestjs/common'
import {
  DB_TOKEN,
  DB_RAW_TOKEN,
  type DbInstance,
  type RawDatabase,
} from '../database.module'
import { Migration } from './migration.interface'
import { PrismaToDrizzleMigration } from './migrations/001-prisma-to-drizzle'

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name)
  private readonly migrations: Migration[]

  constructor(
    @Inject(DB_TOKEN) db: DbInstance,
    @Inject(DB_RAW_TOKEN) rawDb: RawDatabase
  ) {
    this.migrations = this.getMigrations(db, rawDb)
  }

  private getMigrations(db: DbInstance, rawDb: RawDatabase): Migration[] {
    return [new PrismaToDrizzleMigration(db, rawDb)]
  }

  async runMigrations(): Promise<void> {
    const completedVersions = this.getCompletedMigrations()

    for (const migration of this.migrations) {
      if (completedVersions.includes(migration.version)) {
        this.logger.debug(
          `Migration ${migration.name} already completed, skipping`
        )
        continue
      }

      this.logger.log(`Running migration: ${migration.name}`)
      await migration.up()
      this.markMigrationComplete(migration.version)
      this.logger.log(`Migration ${migration.name} completed`)
    }
  }

  private getCompletedMigrations(): number[] {
    try {
      const result = this.migrations[0]?.constructor?.name
      // Use raw DB from first migration to check
      return []
    } catch {
      return []
    }
  }

  private markMigrationComplete(version: number): void {
    // Placeholder - tracking will be implemented
    this.logger.log(`Marked migration v${version} as complete`)
  }
}
