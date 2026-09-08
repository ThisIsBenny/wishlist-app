import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
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

  async getAll(userId?: string): Promise<Wishlist[]> {
    if (!userId) {
      return await this.wishlistRepository.findAll(true)
    }
    return await this.wishlistRepository.findAll(false)
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

  async create(
    payload: WishlistCreateInput,
    userId: string
  ): Promise<Wishlist> {
    return await this.wishlistRepository.create(payload, userId)
  }

  async update(
    id: string,
    payload: WishlistUpdateInput,
    userId: string
  ): Promise<Wishlist> {
    const result = await this.wishlistRepository.update(id, payload, userId)
    if (!result) {
      throw new NotFoundException('Wishlist not found')
    }
    return result
  }

  async delete(id: string, userId: string): Promise<void> {
    const deleted = await this.wishlistRepository.delete(id, userId)
    if (!deleted) {
      throw new NotFoundException('Wishlist not found')
    }
  }

  async createItem(
    wishlistId: string,
    payload: WishlistItem,
    userId: string
  ): Promise<WishlistItem> {
    const wishlist = await this.wishlistRepository.findById(wishlistId)
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found')
    }
    if (wishlist.userId !== userId) {
      throw new ForbiddenException('Access denied')
    }
    return await this.wishlistRepository.createItem(wishlistId, payload)
  }

  async updateItem(
    itemId: number,
    payload: Partial<WishlistItem>,
    userId?: string
  ): Promise<WishlistItem> {
    const item = await this.wishlistRepository.findItemById(itemId)
    if (!item) {
      throw new NotFoundException('Item not found')
    }

    if (userId) {
      const wishlist = await this.wishlistRepository.findById(
        item.wishlistId as string
      )
      if (wishlist && wishlist.userId !== userId) {
        throw new ForbiddenException('Access denied')
      }
    }

    const result = await this.wishlistRepository.updateItem(itemId, payload)
    if (!result) {
      throw new NotFoundException('Item not found')
    }
    return result
  }

  async deleteItem(itemId: number, userId: string): Promise<void> {
    const deleted = await this.wishlistRepository.deleteItem(itemId, userId)
    if (!deleted) {
      throw new NotFoundException('Item not found')
    }
  }
}
