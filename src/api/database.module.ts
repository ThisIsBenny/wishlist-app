import { Module, Global } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import Database from 'better-sqlite3'
import * as schema from '@/db/schema'
import type { AppConfig } from './config/configuration'
import path from 'path'
import fs from 'fs'

export const DB_TOKEN = 'DB'
export const DB_SCHEMA_TOKEN = 'DB_SCHEMA'
export type DbInstance = BetterSQLite3Database<typeof schema>

function createDatabase(
  configService: ConfigService<AppConfig>
): Database.Database {
  const isTest = configService.get<string>('NODE_ENV') === 'test'

  if (isTest) {
    return new Database(':memory:')
  }

  const dbUrl = configService.get('DATABASE_URL')
  let dbPath = dbUrl.replace('file:', '')
  if (!path.isAbsolute(dbPath)) {
    dbPath = path.resolve(process.cwd(), dbPath)
  }

  const dbDir = path.dirname(dbPath)
  console.log(`[DEBUG] Database directory: ${dbDir}`)
  console.log(`[DEBUG] Database file: ${dbPath}`)
  console.log(`[DEBUG] Database file exists: ${fs.existsSync(dbPath)}`)
  if (fs.existsSync(dbPath)) {
    const stats = fs.statSync(dbPath)
    console.log(`[DEBUG] Database file size BEFORE open: ${stats.size} bytes`)
  }

  if (!fs.existsSync(dbDir)) {
    console.log(`[DEBUG] Creating database directory: ${dbDir}`)
    fs.mkdirSync(dbDir, { recursive: true })
  }

  const sqlite = new Database(dbPath)
  const stats = fs.statSync(dbPath)
  console.log(`[DEBUG] Database file size AFTER open: ${stats.size} bytes`)

  return sqlite
}

@Global()
@Module({
  providers: [
    {
      provide: DB_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig>): DbInstance => {
        console.log('[DEBUG] Creating database...')
        const sqlite = createDatabase(configService)
        console.log('[DEBUG] Initializing Drizzle...')
        const db = drizzle(sqlite, { schema })

        console.log('[DEBUG] Running migrations...')
        migrate(db, {
          migrationsFolder: './drizzle',
        })
        console.log('[DEBUG] Migrations complete')

        const dbPath = configService.get('DATABASE_URL').replace('file:', '')
        const dbPathResolved = path.resolve(process.cwd(), dbPath)
        const stats = fs.statSync(dbPathResolved)
        console.log(
          `[DEBUG] Database file size AFTER migrate: ${stats.size} bytes`
        )

        return db
      },
    },
    {
      provide: DB_SCHEMA_TOKEN,
      useValue: schema,
    },
  ],
  exports: [DB_TOKEN, DB_SCHEMA_TOKEN],
})
export class DatabaseModule {}
