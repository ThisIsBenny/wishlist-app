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
export const DB_RAW_TOKEN = 'DB_RAW'
export const DB_SCHEMA_TOKEN = 'DB_SCHEMA'
export type DbInstance = BetterSQLite3Database<typeof schema>
export type RawDatabase = Database.Database

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
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  return new Database(dbPath)
}

@Global()
@Module({
  providers: [
    {
      provide: DB_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig>): DbInstance => {
        const isTest = configService.get('NODE_ENV') === 'test'
        const sqlite = createDatabase(configService)
        const db = drizzle(sqlite, { schema })

        migrate(db, {
          migrationsFolder: './drizzle',
        })

        return db
      },
    },
    {
      provide: DB_RAW_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig>): RawDatabase => {
        return createDatabase(configService)
      },
    },
    {
      provide: DB_SCHEMA_TOKEN,
      useValue: schema,
    },
  ],
  exports: [DB_TOKEN, DB_RAW_TOKEN, DB_SCHEMA_TOKEN],
})
export class DatabaseModule {}
