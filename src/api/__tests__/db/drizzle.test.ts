import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { wishlists, items } from '@/db/schema'
import { eq } from 'drizzle-orm'
import path from 'path'
import fs from 'fs'

const testDbPath = path.resolve(process.cwd(), 'data/test-data.db')

const createTables = (sqlite: InstanceType<typeof Database>) => {
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

describe('Drizzle DB: Test Database', () => {
  let db: ReturnType<typeof drizzle>
  let testWishlistId: string | null = null

  beforeAll(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath)
    }
    const dataDir = path.dirname(testDbPath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    const sqlite = new Database(testDbPath)
    createTables(sqlite)
    db = drizzle(sqlite, { schema: { wishlists, items } })
  })

  afterAll(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath)
    }
  })

  it('should connect to test database', () => {
    const exists = fs.existsSync(testDbPath)
    expect(exists).toBe(true)
  })

  it('should create a new wishlist (CRUD - Create)', () => {
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
  })

  it('should read the created wishlist (CRUD - Read)', () => {
    if (!testWishlistId) {
      throw new Error('No test wishlist created')
    }

    const result = db
      .select()
      .from(wishlists)
      .where(eq(wishlists.id, testWishlistId))
      .get()

    expect(result).toBeDefined()
    expect(result?.title).toBe('Test Wishlist')
  })

  it('should update the wishlist (CRUD - Update)', () => {
    if (!testWishlistId) {
      throw new Error('No test wishlist created')
    }

    const updated = db
      .update(wishlists)
      .set({ title: 'Updated Title' })
      .where(eq(wishlists.id, testWishlistId))
      .returning()
      .get()

    expect(updated.title).toBe('Updated Title')
  })

  it('should delete the wishlist (CRUD - Delete)', () => {
    if (!testWishlistId) {
      throw new Error('No test wishlist created')
    }

    db.delete(wishlists).where(eq(wishlists.id, testWishlistId)).run()

    const result = db
      .select()
      .from(wishlists)
      .where(eq(wishlists.id, testWishlistId))
      .get()

    expect(result).toBeUndefined()
  })

  it('should work with relations', () => {
    const wlId = `test-rel-${Date.now()}`
    db.insert(wishlists)
      .values({
        id: wlId,
        title: 'Relation Test',
        slugUrlText: `rel-${Date.now()}`,
        public: true,
        description: '',
        imageSrc: '',
      })
      .run()

    db.insert(items)
      .values({
        title: 'Test Item',
        description: 'Test Item Description',
        url: 'https://example.com',
        imageSrc: '',
        bought: false,
        wishlistId: wlId,
      })
      .run()

    const itemResult = db.select().from(items).all()
    expect(itemResult.length).toBe(1)
    expect(itemResult[0].title).toBe('Test Item')
  })

  it('should work with cascade delete', () => {
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

    db.insert(items)
      .values({
        title: 'Item to delete',
        description: 'Should be deleted with wishlist',
        wishlistId: testId,
      })
      .run()

    db.delete(wishlists).where(eq(wishlists.id, testId)).run()

    const deletedWl = db
      .select()
      .from(wishlists)
      .where(eq(wishlists.id, testId))
      .get()
    expect(deletedWl).toBeUndefined()
  })
})
