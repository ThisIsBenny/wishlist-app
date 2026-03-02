import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  updateList,
  updateItem,
  itemBought,
} from '../../routes/wishlist/update'

const mockWishlist = {
  id: 'test-id-1',
  title: 'Updated Wishlist',
  description: 'Updated Description',
  imageSrc: 'https://example.com/image.jpg',
  slugUrlText: 'updated-wishlist',
  public: false,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

const mockWishlistItem = {
  id: 1,
  wishlistId: 'test-id-1',
  title: 'Updated Item',
  link: 'https://example.com/item',
  imageSrc: 'https://example.com/item.jpg',
  price: 99.99,
  bought: true,
}

vi.mock('../../models', () => ({
  wishlist: {
    update: vi.fn(),
    updateItem: vi.fn(),
  },
}))

vi.mock('../../config/schemas', () => ({
  wishlistRequestSchema: { type: 'object' },
  wishlistResponseSchema: { type: 'object' },
  wishlistItemRequestSchema: { type: 'object' },
  wishlistItemResponseSchema: { type: 'object' },
}))

vi.mock('@/types', () => ({
  Wishlist: {},
  WishlistItem: {},
  WishlistUpdateInput: {},
  Prisma: {
    ItemUpdateInput: {},
  },
}))

import { wishlist } from '../../models'

describe('handlers: wishlist update', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('updateList', () => {
    it('updates a wishlist and returns 201', async () => {
      const mockRequest = {
        params: { wishlistId: 'test-id-1' },
        body: {
          title: 'Updated Wishlist',
          description: 'Updated Description',
          slugUrlText: 'updated-wishlist',
          public: false,
        },
        log: { debug: vi.fn() },
      } as any
      const mockReply = {
        code: vi.fn().mockReturnThis(),
        send: vi.fn().mockReturnValue(mockWishlist),
      } as any
      ;(wishlist.update as any).mockResolvedValue(mockWishlist)

      await (updateList.handler as any)(mockRequest, mockReply)

      expect(wishlist.update).toHaveBeenCalledWith('test-id-1', {
        title: 'Updated Wishlist',
        description: 'Updated Description',
        slugUrlText: 'updated-wishlist',
        public: false,
      })
      expect(mockReply.code).toHaveBeenCalledWith(201)
      expect(mockReply.send).toHaveBeenCalledWith(mockWishlist)
    })
  })

  describe('updateItem', () => {
    it('updates an item and returns 200', async () => {
      const mockRequest = {
        params: { wishlistId: 'test-id-1', itemId: 1 },
        body: {
          title: 'Updated Item',
          bought: true,
        },
        log: { debug: vi.fn() },
      } as any
      const mockReply = {
        send: vi.fn().mockReturnValue(mockWishlistItem),
      } as any
      ;(wishlist.updateItem as any).mockResolvedValue(mockWishlistItem)

      await (updateItem.handler as any)(mockRequest, mockReply)

      expect(wishlist.updateItem).toHaveBeenCalledWith(1, {
        title: 'Updated Item',
        bought: true,
      })
      expect(mockReply.send).toHaveBeenCalledWith(mockWishlistItem)
    })
  })

  describe('itemBought', () => {
    it('marks item as bought and returns 200', async () => {
      const mockRequest = {
        params: { wishlistId: 'test-id-1', itemId: 1 },
      } as any
      const mockReply = {
        send: vi.fn().mockReturnValue(mockWishlistItem),
      } as any
      ;(wishlist.updateItem as any).mockResolvedValue(mockWishlistItem)

      await (itemBought.handler as any)(mockRequest, mockReply)

      expect(wishlist.updateItem).toHaveBeenCalledWith(1, { bought: true })
      expect(mockReply.send).toHaveBeenCalledWith(mockWishlistItem)
    })
  })
})
