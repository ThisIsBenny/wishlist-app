import { Module, Global } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import Database from 'better-sqlite3'
import * as schema from '@/db/schema'
import path from 'path'
import fs from 'fs'

export const DB_TOKEN = 'DB'
export const DB_SCHEMA_TOKEN = 'DB_SCHEMA'
export type DbInstance = BetterSQLite3Database<typeof schema>

@Global()
@Module({
  providers: [
    {
      provide: DB_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): DbInstance => {
        const isTest = configService.get<string>('NODE_ENV') === 'test'
        let sqlite: Database.Database

        if (isTest) {
          sqlite = new Database(':memory:')
          migrate(drizzle(sqlite, { schema }), {
            migrationsFolder: './drizzle',
          })
        } else {
          const dbUrl =
            configService.get<string>('DATABASE_URL') ?? 'file:./data/data.db'
          let dbPath = dbUrl.replace('file:', '')
          if (!path.isAbsolute(dbPath)) {
            dbPath = path.resolve(process.cwd(), dbPath)
          }

          const dbDir = path.dirname(dbPath)
          if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true })
          }

          sqlite = new Database(dbPath)
          migrate(drizzle(sqlite, { schema }), {
            migrationsFolder: './drizzle',
          })
        }

        return drizzle(sqlite, { schema })
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
