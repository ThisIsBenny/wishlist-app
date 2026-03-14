import { Inject, Injectable } from '@nestjs/common'
import { eq, asc } from 'drizzle-orm'
import { DB_TOKEN, type DbInstance } from '../database.module'
import { wishlists, items } from '@/db/schema'
import type {
  Wishlist,
  WishlistCreateInput,
  WishlistUpdateInput,
  WishlistItem,
} from '@/types'
import type {
  NewWishlist,
  Wishlist as WishlistSchema,
} from '@/db/schema/wishlists'
import type { NewItem, Item } from '@/db/schema/items'
import {
  WishlistSchema as WishlistZodSchema,
  WishlistItemSchema as WishlistItemZodSchema,
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

  async create(data: WishlistCreateInput): Promise<Wishlist> {
    const result = await this.db
      .insert(wishlists)
      .values(data as unknown as NewWishlist)
      .returning()
      .get()
    return mapWishlist(result)
  }

  async update(
    id: string,
    data: WishlistUpdateInput
  ): Promise<Wishlist | undefined> {
    const result = await this.db
      .update(wishlists)
      .set(data)
      .where(eq(wishlists.id, id))
      .returning()
      .get()
    if (!result) return undefined
    return mapWishlist(result)
  }

  async delete(id: string): Promise<void> {
    await this.db
      .delete(wishlists)
      .where(eq(wishlists.id, id))
      .returning()
      .get()
  }

  async createItem(
    wishlistId: string,
    data: WishlistItem
  ): Promise<WishlistItem> {
    const result = await this.db
      .insert(items)
      .values({ ...data, wishlistId } as unknown as NewItem)
      .returning()
      .get()
    return mapItem(result)
  }

  async updateItem(
    itemId: number,
    data: Partial<WishlistItem>
  ): Promise<WishlistItem | undefined> {
    const result = await this.db
      .update(items)
      .set(data)
      .where(eq(items.id, itemId))
      .returning()
      .get()
    if (!result) return undefined
    return mapItem(result)
  }

  async deleteItem(itemId: number): Promise<void> {
    await this.db.delete(items).where(eq(items.id, itemId)).returning().get()
  }
}
