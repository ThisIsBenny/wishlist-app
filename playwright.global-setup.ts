import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { wishlists } from './src/db/schema'
import { eq } from 'drizzle-orm'

export default async function globalSetup() {
  const sqlite = new Database('data/data.db')
  const db = drizzle(sqlite)

  const existing = await db
    .select()
    .from(wishlists)
    .where(eq(wishlists.slugUrlText, 'test'))
    .get()
  if (!existing) {
    await db
      .insert(wishlists)
      .values({
        title: 'Test Wishlist',
        slugUrlText: 'test',
        public: true,
      })
      .run()
  }

  sqlite.close()
}
