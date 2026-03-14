export default async function globalSetup() {
  const { drizzle } = await import('drizzle-orm/better-sqlite3')
  const Database = (await import('better-sqlite3')).default
  const { wishlists } = await import('./src/db/schema')
  const { eq } = await import('drizzle-orm')
  const { migrate } = await import('drizzle-orm/better-sqlite3/migrator')

  const sqlite = new Database(':memory:')
  const db = drizzle(sqlite)

  await migrate(db, { migrationsFolder: './drizzle' })

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
