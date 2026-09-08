import { Inject, Injectable } from '@nestjs/common'
import { and, asc, eq, inArray } from 'drizzle-orm'
import { DB_TOKEN, type DbInstance } from '../database.module'
import { items, wishlists } from '@/db/schema'
import type {
  Wishlist,
  WishlistCreateInput,
  WishlistItem,
  WishlistUpdateInput,
} from '@/types'
import type {
  NewWishlist,
  Wishlist as WishlistSchema,
} from '@/db/schema/wishlists'
import type { Item, NewItem } from '@/db/schema/items'
import {
  WishlistItemSchema as WishlistItemZodSchema,
  WishlistSchema as WishlistZodSchema,
} from './dto/wishlist.dto'

const mapWishlist = (w: WishlistSchema) => WishlistZodSchema.parse(w)
const mapItem = (i: Item) => WishlistItemZodSchema.parse(i)

@Injectable()
export class WishlistRepository {
  constructor(@Inject(DB_TOKEN) private readonly db: DbInstance) {}

  async findAll(publicOnly: boolean): Promise<Wishlist[]> {
    const results: WishlistSchema[] = publicOnly
      ? await this.db.select().from(wishlists).where(eq(wishlists.public, true))
      : await this.db.select().from(wishlists)
    return results.map(mapWishlist)
  }

  async findBySlugUrlText(slugText: string): Promise<Wishlist | undefined> {
    const result = await this.db
      .select()
      .from(wishlists)
      .where(eq(wishlists.slugUrlText, slugText))
      .get()
    if (!result) return undefined
    return mapWishlist(result)
  }

  async findById(id: string): Promise<Wishlist | undefined> {
    const result = await this.db
      .select()
      .from(wishlists)
      .where(eq(wishlists.id, id))
      .get()
    if (!result) return undefined
    return mapWishlist(result)
  }

  async findItemsByWishlistId(wishlistId: string): Promise<WishlistItem[]> {
    const results = await this.db
      .select()
      .from(items)
      .where(eq(items.wishlistId, wishlistId))
      .orderBy(asc(items.id))
    return results.map(mapItem)
  }

  async create(data: WishlistCreateInput, userId: string): Promise<Wishlist> {
    const now = new Date().toISOString()
    const result = await this.db
      .insert(wishlists)
      .values({
        ...data,
        userId,
        createdAt: now,
        updatedAt: now,
      } as NewWishlist)
      .returning()
      .get()
    return mapWishlist(result)
  }

  async update(
    id: string,
    data: WishlistUpdateInput,
    userId: string
  ): Promise<Wishlist | undefined> {
    const now = new Date().toISOString()
    const result = await this.db
      .update(wishlists)
      .set({ ...data, updatedAt: now })
      .where(and(eq(wishlists.id, id), eq(wishlists.userId, userId)))
      .returning()
      .get()
    if (!result) return undefined
    return mapWishlist(result)
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await this.db
      .delete(wishlists)
      .where(and(eq(wishlists.id, id), eq(wishlists.userId, userId)))
      .returning()
      .get()
    return !!result
  }

  async createItem(
    wishlistId: string,
    data: WishlistItem
  ): Promise<WishlistItem> {
    const now = new Date().toISOString()
    const result = await this.db
      .insert(items)
      .values({
        ...data,
        wishlistId,
        createdAt: now,
        updatedAt: now,
      } as NewItem)
      .returning()
      .get()
    return mapItem(result)
  }

  async findItemById(itemId: number): Promise<WishlistItem | undefined> {
    const result = await this.db
      .select()
      .from(items)
      .where(eq(items.id, itemId))
      .get()
    if (!result) return undefined
    return mapItem(result)
  }

  async updateItem(
    itemId: number,
    data: Partial<WishlistItem>
  ): Promise<WishlistItem | undefined> {
    const now = new Date().toISOString()
    const result = await this.db
      .update(items)
      .set({ ...data, updatedAt: now } as Partial<NewItem>)
      .where(eq(items.id, itemId))
      .returning()
      .get()
    if (!result) return undefined
    return mapItem(result)
  }

  async deleteItem(itemId: number, userId: string): Promise<boolean> {
    const result = await this.db
      .delete(items)
      .where(
        and(
          eq(items.id, itemId),
          inArray(
            items.wishlistId,
            this.db
              .select({ id: wishlists.id })
              .from(wishlists)
              .where(eq(wishlists.userId, userId))
          )
        )
      )
      .returning()
      .get()
    return !!result
  }
}
