import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getAll, getBySlugUrl } from '../../routes/wishlist/read'

const mockWishlist = {
  id: 'test-id-1',
  title: 'Test Wishlist',
  description: 'Test Description',
  imageSrc: 'https://example.com/image.jpg',
  slugUrlText: 'test-wishlist',
  public: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  items: [],
}

vi.mock('../../models', () => ({
  wishlist: {
    getAll: vi.fn(),
    getBySlugUrlText: vi.fn(),
  },
}))

vi.mock('../../config/schemas', () => ({
  wishlistResponseSchema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'string' },
      imageSrc: { type: 'string' },
      slugUrlText: { type: 'string' },
      public: { type: 'boolean' },
    },
  },
}))

import { wishlist } from '../../models'

describe('handlers: wishlist read', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('returns public wishlists when not authenticated', async () => {
      const mockRequest = {
        isAuthenticated: false,
      } as any
      ;(wishlist.getAll as any).mockResolvedValue([mockWishlist])

      const result = await (getAll.handler as any)(mockRequest)

      expect(wishlist.getAll).toHaveBeenCalledWith({ public: true })
      expect(result).toEqual([mockWishlist])
    })

    it('returns all wishlists when authenticated', async () => {
      const mockRequest = {
        isAuthenticated: true,
      } as any
      ;(wishlist.getAll as any).mockResolvedValue([mockWishlist])

      const result = await (getAll.handler as any)(mockRequest)

      expect(wishlist.getAll).toHaveBeenCalledWith({})
      expect(result).toEqual([mockWishlist])
    })
  })

  describe('getBySlugUrl', () => {
    it('returns wishlist when found', async () => {
      const mockRequest = {
        params: { slugText: 'test-wishlist' },
      } as any
      const mockReply = {
        callNotFound: vi.fn().mockReturnValue(null),
      } as any
      ;(wishlist.getBySlugUrlText as any).mockResolvedValue(mockWishlist)

      const result = await (getBySlugUrl.handler as any)(mockRequest, mockReply)

      expect(wishlist.getBySlugUrlText).toHaveBeenCalledWith(
        'test-wishlist',
        true
      )
      expect(result).toEqual(mockWishlist)
      expect(mockReply.callNotFound).not.toHaveBeenCalled()
    })

    it('calls reply.callNotFound when wishlist not found', async () => {
      const mockRequest = {
        params: { slugText: 'non-existent' },
      } as any
      const mockReply = {
        callNotFound: vi.fn().mockReturnValue(null),
      } as any
      ;(wishlist.getBySlugUrlText as any).mockResolvedValue(null)

      const result = await (getBySlugUrl.handler as any)(mockRequest, mockReply)

      expect(wishlist.getBySlugUrlText).toHaveBeenCalledWith(
        'non-existent',
        true
      )
      expect(mockReply.callNotFound).toHaveBeenCalled()
    })
  })
})
