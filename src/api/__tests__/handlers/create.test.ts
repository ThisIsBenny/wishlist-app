import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createList, createItem } from '../../routes/wishlist/create'

const mockWishlist = {
  id: 'test-id-1',
  title: 'Test Wishlist',
  description: 'Test Description',
  imageSrc: 'https://example.com/image.jpg',
  slugUrlText: 'test-wishlist',
  public: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

const mockWishlistItem = {
  id: 1,
  wishlistId: 'test-id-1',
  title: 'Test Item',
  link: 'https://example.com/item',
  imageSrc: 'https://example.com/item.jpg',
  price: 99.99,
  bought: false,
}

vi.mock('../../models', () => ({
  wishlist: {
    create: vi.fn(),
    createItem: vi.fn(),
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
  WishlistCreateInput: {},
}))

import { wishlist } from '../../models'

describe('handlers: wishlist create', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createList', () => {
    it('creates a new wishlist and returns 201', async () => {
      const mockRequest = {
        body: {
          title: 'New Wishlist',
          description: 'New Description',
          slugUrlText: 'new-wishlist',
          public: true,
        },
        log: { debug: vi.fn() },
      } as any
      const mockReply = {
        code: vi.fn().mockReturnThis(),
        send: vi.fn().mockReturnValue(mockWishlist),
      } as any
      ;(wishlist.create as any).mockResolvedValue(mockWishlist)

      await (createList.handler as any)(mockRequest, mockReply)

      expect(wishlist.create).toHaveBeenCalledWith({
        title: 'New Wishlist',
        description: 'New Description',
        slugUrlText: 'new-wishlist',
        public: true,
      })
      expect(mockReply.code).toHaveBeenCalledWith(201)
      expect(mockReply.send).toHaveBeenCalledWith(mockWishlist)
    })
  })

  describe('createItem', () => {
    it('creates a new item and returns 201', async () => {
      const mockRequest = {
        params: { wishlistId: 'test-id-1' },
        body: {
          title: 'New Item',
          link: 'https://example.com/item',
          bought: false,
        },
        log: { debug: vi.fn() },
      } as any
      const mockReply = {
        code: vi.fn().mockReturnThis(),
        send: vi.fn().mockReturnValue(mockWishlistItem),
      } as any
      ;(wishlist.createItem as any).mockResolvedValue(mockWishlistItem)

      await (createItem.handler as any)(mockRequest, mockReply)

      expect(wishlist.createItem).toHaveBeenCalledWith('test-id-1', {
        title: 'New Item',
        link: 'https://example.com/item',
        bought: false,
      })
      expect(mockReply.code).toHaveBeenCalledWith(201)
      expect(mockReply.send).toHaveBeenCalledWith(mockWishlistItem)
    })
  })
})
