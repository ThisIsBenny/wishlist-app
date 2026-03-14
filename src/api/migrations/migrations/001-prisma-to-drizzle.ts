import { Logger } from '@nestjs/common'
import {
  DB_TOKEN,
  DB_RAW_TOKEN,
  type DbInstance,
  type RawDatabase,
} from '../../database.module'
import { Migration } from '../migration.interface'
import { items } from '@/db/schema'

interface PrismaItem {
  id: number
  title: string
  url: string
  imageSrc: string
  description: string
  bought: number
  wishlistId: string
}

export class PrismaToDrizzleMigration implements Migration {
  readonly name = 'prisma-to-drizzle'
  readonly version = 1
  private readonly logger = new Logger(PrismaToDrizzleMigration.name)

  constructor(
    private readonly db: DbInstance,
    private readonly rawDb: RawDatabase
  ) {}

  async up(): Promise<void> {
    this.logger.log('Starting Prisma to Drizzle migration...')

    const hasOldItems = this.hasOldItems()
    if (!hasOldItems) {
      this.logger.log('No old items found, skipping migration')
      return
    }

    const itemsMigrated = this.migrateItems()
    this.logger.log(`Migrated ${itemsMigrated} items`)

    this.cleanupPrismaTables()

    this.logger.log('Migration complete')
  }

  private hasOldItems(): boolean {
    try {
      const result = this.rawDb
        .prepare('SELECT COUNT(*) as count FROM "Item"')
        .get() as { count: number }
      return result.count > 0
    } catch {
      return false
    }
  }

  private migrateItems(): number {
    try {
      const oldItems = this.rawDb
        .prepare('SELECT * FROM "Item"')
        .all() as PrismaItem[]

      if (oldItems.length === 0) {
        return 0
      }

      for (const item of oldItems) {
        this.db
          .insert(items)
          .values({
            title: item.title,
            url: item.url,
            imageSrc: item.imageSrc,
            description: item.description,
            bought: item.bought === 1,
            wishlistId: item.wishlistId,
          })
          .run()
      }

      return oldItems.length
    } catch (e) {
      this.logger.error(`Error migrating items: ${e}`)
      return 0
    }
  }

  private cleanupPrismaTables(): void {
    try {
      this.rawDb.prepare('DROP TABLE IF EXISTS "Item"').run()
      this.rawDb.prepare('DROP TABLE IF EXISTS "_prisma_migrations"').run()
      this.logger.log('Cleaned up Prisma tables')
    } catch (e) {
      this.logger.warn(`Could not clean up Prisma tables: ${e}`)
    }
  }
}
