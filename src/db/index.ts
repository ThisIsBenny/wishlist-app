import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import path from 'path'

const dbUrl = process.env.DATABASE_URL || 'file:./data/data.db'
let dbPath = dbUrl.replace('file:', '')
if (!path.isAbsolute(dbPath)) {
  dbPath = path.resolve(process.cwd(), dbPath)
}
const sqlite = new Database(dbPath)

export const db = drizzle(sqlite, { schema })

export type Db = typeof db
