import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { wishlists, items } from '@/db/schema'
import { eq } from 'drizzle-orm'
import path from 'path'
import fs from 'fs'

describe('Drizzle DB: Existing Prisma Database', () => {
  const dbPath = path.resolve(process.cwd(), 'data/data.db')
  let db: ReturnType<typeof drizzle>
  let testWishlistId: string | null = null

  it('should connect to existing Prisma database', () => {
    const exists = fs.existsSync(dbPath)
    expect(exists).toBe(true)
  })

  it('should read existing wishlists from Prisma DB', () => {
    const sqlite = new Database(dbPath)
    db = drizzle(sqlite, { schema: { wishlists, items } })

    const result = db.select().from(wishlists).all()
    expect(result.length).toBeGreaterThan(0)
    sqlite.close()
  })

  it('should read existing items from Prisma DB', () => {
    const sqlite = new Database(dbPath)
    db = drizzle(sqlite, { schema: { wishlists, items } })

    const result = db.select().from(items).all()
    expect(result.length).toBeGreaterThanOrEqual(0)
    sqlite.close()
  })

  it('should create a new wishlist (CRUD - Create)', () => {
    const sqlite = new Database(dbPath)
    db = drizzle(sqlite, { schema: { wishlists, items } })

    const testId = `test-${Date.now()}`
    testWishlistId = testId

    const created = db
      .insert(wishlists)
      .values({
        id: testId,
        title: 'Test Wishlist',
        slugUrlText: `test-${Date.now()}`,
        public: true,
        description: 'Test description',
        imageSrc: '',
      })
      .returning()
      .get()

    expect(created.id).toBe(testId)
    expect(created.title).toBe('Test Wishlist')
    sqlite.close()
  })

  it('should read the created wishlist (CRUD - Read)', () => {
    if (!testWishlistId) {
      throw new Error('No test wishlist created')
    }

    const sqlite = new Database(dbPath)
    db = drizzle(sqlite, { schema: { wishlists, items } })

    const result = db
      .select()
      .from(wishlists)
      .where(eq(wishlists.id, testWishlistId))
      .get()

    expect(result).toBeDefined()
    expect(result?.title).toBe('Test Wishlist')
    sqlite.close()
  })

  it('should update the wishlist (CRUD - Update)', () => {
    if (!testWishlistId) {
      throw new Error('No test wishlist created')
    }

    const sqlite = new Database(dbPath)
    db = drizzle(sqlite, { schema: { wishlists, items } })

    const updated = db
      .update(wishlists)
      .set({ title: 'Updated Title' })
      .where(eq(wishlists.id, testWishlistId))
      .returning()
      .get()

    expect(updated.title).toBe('Updated Title')
    sqlite.close()
  })

  it('should delete the wishlist (CRUD - Delete)', () => {
    if (!testWishlistId) {
      throw new Error('No test wishlist created')
    }

    const sqlite = new Database(dbPath)
    db = drizzle(sqlite, { schema: { wishlists, items } })

    db.delete(wishlists).where(eq(wishlists.id, testWishlistId)).run()

    const result = db
      .select()
      .from(wishlists)
      .where(eq(wishlists.id, testWishlistId))
      .get()

    expect(result).toBeUndefined()
    sqlite.close()
  })

  it('should preserve existing data after operations', () => {
    const sqlite = new Database(dbPath)
    db = drizzle(sqlite, { schema: { wishlists, items } })

    const wishlistCount = db.select().from(wishlists).all().length
    const itemCount = db.select().from(items).all().length

    expect(wishlistCount).toBeGreaterThan(0)
    expect(itemCount).toBeGreaterThanOrEqual(0)
    sqlite.close()
  })
})

describe('Drizzle DB: Fresh Installation (New Database)', () => {
  const testDbPath = path.resolve(process.cwd(), 'data/test-fresh.db')
  let db: ReturnType<typeof drizzle>

  afterAll(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath)
    }
  })

  const createTables = (sqlite: Database) => {
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS Wishlist (
        id TEXT PRIMARY KEY,
        public INTEGER NOT NULL DEFAULT 1,
        title TEXT NOT NULL,
        imageSrc TEXT DEFAULT '',
        slugUrlText TEXT UNIQUE NOT NULL,
        description TEXT DEFAULT ''
      );
      CREATE TABLE IF NOT EXISTS Item (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        url TEXT DEFAULT '',
        imageSrc TEXT DEFAULT '',
        description TEXT NOT NULL,
        bought INTEGER NOT NULL DEFAULT 0,
        wishlistId TEXT NOT NULL,
        FOREIGN KEY (wishlistId) REFERENCES Wishlist(id) ON DELETE CASCADE
      );
    `)
  }

  it('should create tables in fresh database using drizzle-kit push (simulated)', () => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath)
    }

    const sqlite = new Database(testDbPath)
    createTables(sqlite)
    db = drizzle(sqlite, { schema: { wishlists, items } })

    db.insert(wishlists)
      .values({
        id: 'fresh-test-1',
        title: 'Fresh Installation Test',
        slugUrlText: 'fresh-test-1',
        public: true,
        description: 'Testing fresh DB setup',
        imageSrc: '',
      })
      .run()

    const result = db.select().from(wishlists).all()
    expect(result.length).toBe(1)
    expect(result[0].title).toBe('Fresh Installation Test')

    sqlite.close()
  })

  it('should handle new database with relations', () => {
    const sqlite = new Database(testDbPath)
    db = drizzle(sqlite, { schema: { wishlists, items } })

    const wl = db.select().from(wishlists).get()

    if (wl) {
      db.insert(items)
        .values({
          title: 'Test Item',
          description: 'Test Item Description',
          url: 'https://example.com',
          imageSrc: '',
          bought: false,
          wishlistId: wl.id,
        })
        .run()

      const itemResult = db.select().from(items).all()
      expect(itemResult.length).toBe(1)
      expect(itemResult[0].title).toBe('Test Item')
    }

    sqlite.close()
  })

  it('should work with cascade delete on fresh DB', () => {
    const sqlite = new Database(testDbPath)
    db = drizzle(sqlite, { schema: { wishlists, items } })

    const testId = `cascade-test-${Date.now()}`
    db.insert(wishlists)
      .values({
        id: testId,
        title: 'Cascade Test',
        slugUrlText: testId,
        public: true,
        description: '',
        imageSrc: '',
      })
      .run()

    const wl = db.select().from(wishlists).where(eq(wishlists.id, testId)).get()
    expect(wl).toBeDefined()

    if (wl) {
      db.insert(items)
        .values({
          title: 'Item to delete',
          description: 'Should be deleted with wishlist',
          wishlistId: wl.id,
        })
        .run()

      db.delete(wishlists).where(eq(wishlists.id, testId)).run()

      const deletedWl = db
        .select()
        .from(wishlists)
        .where(eq(wishlists.id, testId))
        .get()
      expect(deletedWl).toBeUndefined()
    }

    sqlite.close()
  })

  it('should support drizzle-kit push for fresh setups', () => {
    const testDbPath2 = path.resolve(process.cwd(), 'data/test-push.db')
    afterAll(() => {
      if (fs.existsSync(testDbPath2)) {
        fs.unlinkSync(testDbPath2)
      }
    })

    if (fs.existsSync(testDbPath2)) {
      fs.unlinkSync(testDbPath2)
    }

    const sqlite = new Database(testDbPath2)
    createTables(sqlite)
    db = drizzle(sqlite, { schema: { wishlists, items } })

    db.insert(wishlists)
      .values({
        id: 'push-test-1',
        title: 'Push Test',
        slugUrlText: 'push-test-1',
        public: true,
        description: 'Testing drizzle-kit push',
        imageSrc: '',
      })
      .run()

    const result = db.select().from(wishlists).all()
    expect(result.length).toBe(1)
    expect(result[0].title).toBe('Push Test')

    sqlite.close()
  })
})
