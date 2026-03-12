import { db } from '@/db'
import { wishlists, items } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import type {
  Wishlist,
  WishlistItem,
  WishlistCreateInput,
  WishlistUpdateInput,
} from '@/types'

interface WishlistWhereInput {
  public?: boolean
}

export default {
  getAll: async (where?: WishlistWhereInput): Promise<Wishlist[]> => {
    const query = db.select().from(wishlists)
    if (where?.public !== undefined) {
      return (await query.where(
        eq(wishlists.public, where.public)
      )) as Wishlist[]
    }
    return (await query) as Wishlist[]
  },
  getBySlugUrlText: async (value: string, includeItems = false) => {
    const result = await db
      .select()
      .from(wishlists)
      .where(eq(wishlists.slugUrlText, value))
      .get()

    if (result && includeItems) {
      const wishlistItems = await db
        .select()
        .from(items)
        .where(eq(items.wishlistId, result.id))
        .orderBy(asc(items.id))
      return { ...result, items: wishlistItems }
    }
    return result
  },
  create: async (payload: WishlistCreateInput) => {
    return await db
      .insert(wishlists)
      .values(payload as any)
      .returning()
      .get()
  },
  update: async (id: string, payload: WishlistUpdateInput) => {
    return await db
      .update(wishlists)
      .set(payload)
      .where(eq(wishlists.id, id))
      .returning()
      .get()
  },
  delete: async (id: string) => {
    return await db
      .delete(wishlists)
      .where(eq(wishlists.id, id))
      .returning()
      .get()
  },
  createItem: async (wishlistId: string, payload: WishlistItem) => {
    const result = await db
      .insert(items)
      .values({ ...payload, wishlistId })
      .returning()
      .get()
    return result
  },
  updateItem: async (itemId: number, payload: Partial<WishlistItem>) => {
    return await db
      .update(items)
      .set(payload)
      .where(eq(items.id, itemId))
      .returning()
      .get()
  },
  deleteItem: async (itemId: number) => {
    return await db.delete(items).where(eq(items.id, itemId)).returning().get()
  },
}
