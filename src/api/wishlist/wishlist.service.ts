import { Injectable, NotFoundException } from '@nestjs/common'
import { WishlistRepository } from './wishlist.repository'
import type {
  Wishlist,
  WishlistCreateInput,
  WishlistUpdateInput,
  WishlistItem,
} from '@/types'

@Injectable()
export class WishlistService {
  constructor(private readonly wishlistRepository: WishlistRepository) {}

  async getAll(isAuthenticated: boolean): Promise<Wishlist[]> {
    return await this.wishlistRepository.findAll(!isAuthenticated)
  }

  async getBySlugUrlText(slugText: string, includeItems = true) {
    const result = await this.wishlistRepository.findBySlugUrlText(slugText)

    if (!result || !result.id) {
      throw new NotFoundException('Wishlist not found')
    }

    if (includeItems) {
      const wishlistItems = await this.wishlistRepository.findItemsByWishlistId(
        result.id
      )
      return { ...result, items: wishlistItems }
    }
    return result
  }

  async getById(id: string) {
    const result = await this.wishlistRepository.findById(id)

    if (!result) {
      throw new NotFoundException('Wishlist not found')
    }

    return result
  }

  async create(payload: WishlistCreateInput): Promise<Wishlist> {
    return await this.wishlistRepository.create(payload)
  }

  async update(id: string, payload: WishlistUpdateInput): Promise<Wishlist> {
    const result = await this.wishlistRepository.update(id, payload)
    if (!result) {
      throw new NotFoundException('Wishlist not found')
    }
    return result
  }

  async delete(id: string): Promise<void> {
    await this.wishlistRepository.delete(id)
  }

  async createItem(
    wishlistId: string,
    payload: WishlistItem
  ): Promise<WishlistItem> {
    return await this.wishlistRepository.createItem(wishlistId, payload)
  }

  async updateItem(
    itemId: number,
    payload: Partial<WishlistItem>
  ): Promise<WishlistItem> {
    const result = await this.wishlistRepository.updateItem(itemId, payload)
    if (!result) {
      throw new NotFoundException('Item not found')
    }
    return result
  }

  async deleteItem(itemId: number): Promise<void> {
    await this.wishlistRepository.deleteItem(itemId)
  }
}
