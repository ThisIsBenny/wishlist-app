import {
  WishlistSchema,
  WishlistItemSchema,
  CreateWishlistSchema,
  UpdateWishlistSchema,
  CreateWishlistItemSchema,
  UpdateWishlistItemSchema,
} from '../dto/wishlist.dto'
import { describe, it, expect } from 'vitest'

describe('Wishlist DTOs', () => {
  describe('WishlistSchema', () => {
    it('should parse valid wishlist data', () => {
      const validWishlist = {
        id: 'test-123',
        title: 'My Wishlist',
        slugUrlText: 'my-wishlist',
        public: true,
        description: 'A description',
        imageSrc: 'https://example.com/img.jpg',
        items: [],
      }

      const result = WishlistSchema.safeParse(validWishlist)
      expect(result.success).toBe(true)
    })

    it('should apply default values for optional fields', () => {
      const minimalWishlist = {
        id: 'test-123',
        title: 'My Wishlist',
        slugUrlText: 'my-wishlist',
        public: true,
      }

      const result = WishlistSchema.safeParse(minimalWishlist)

      if (result.success) {
        expect(result.data.description).toBe('')
        expect(result.data.imageSrc).toBe('')
        expect(result.data.items).toEqual([])
      }
    })

    it('should reject invalid data types', () => {
      const invalidWishlist = {
        id: 123,
        title: 42,
        slugUrlText: 'test',
        public: 'yes',
      }

      const result = WishlistSchema.safeParse(invalidWishlist)
      expect(result.success).toBe(false)
    })
  })

  describe('WishlistItemSchema', () => {
    it('should parse valid wishlist item', () => {
      const validItem = {
        id: 1,
        title: 'Test Item',
        description: 'A description',
        imageSrc: 'https://example.com/img.jpg',
        url: 'https://example.com',
        bought: true,
        wishlistId: 'test-123',
      }

      const result = WishlistItemSchema.safeParse(validItem)
      expect(result.success).toBe(true)
    })

    it('should apply default values for optional fields', () => {
      const minimalItem = {
        id: 1,
        title: 'Test Item',
        bought: false,
        wishlistId: 'test-123',
      }

      const result = WishlistItemSchema.safeParse(minimalItem)

      if (result.success) {
        expect(result.data.description).toBe('')
        expect(result.data.imageSrc).toBe('')
        expect(result.data.url).toBe('')
      }
    })

    it('should reject invalid bought field type', () => {
      const invalidItem = {
        id: 1,
        title: 'Test',
        bought: 'yes',
        wishlistId: 'test-123',
      }

      const result = WishlistItemSchema.safeParse(invalidItem)
      expect(result.success).toBe(false)
    })
  })

  describe('CreateWishlistSchema', () => {
    it('should parse valid create input', () => {
      const validInput = {
        title: 'New Wishlist',
        slugUrlText: 'new-wishlist',
        public: true,
        description: 'Description',
        imageSrc: 'https://example.com/img.jpg',
      }

      const result = CreateWishlistSchema.safeParse(validInput)
      expect(result.success).toBe(true)
    })

    it('should reject input with id', () => {
      const inputWithId = {
        id: 'test-123',
        title: 'Wishlist',
        slugUrlText: 'test',
        public: true,
      }

      const result = CreateWishlistSchema.safeParse(inputWithId)
      expect(result.success).toBe(false)
    })

    it('should reject input with items', () => {
      const inputWithItems = {
        title: 'Wishlist',
        slugUrlText: 'test',
        public: true,
        items: [{ id: 1, title: 'Item' }],
      }

      const result = CreateWishlistSchema.safeParse(inputWithItems)
      expect(result.success).toBe(false)
    })

    it('should reject missing required fields', () => {
      const missingFields = {
        title: 'Wishlist',
      }

      const result = CreateWishlistSchema.safeParse(missingFields)
      expect(result.success).toBe(false)
    })

    it('should reject empty title', () => {
      const emptyTitle = {
        title: '',
        slugUrlText: 'test',
        public: true,
      }

      const result = CreateWishlistSchema.safeParse(emptyTitle)
      expect(result.success).toBe(false)
    })

    it('should reject empty slugUrlText', () => {
      const emptySlug = {
        title: 'Test',
        slugUrlText: '',
        public: true,
      }

      const result = CreateWishlistSchema.safeParse(emptySlug)
      expect(result.success).toBe(false)
    })
  })

  describe('UpdateWishlistSchema', () => {
    it('should parse full wishlist update (PUT)', () => {
      const fullInput = {
        title: 'Updated Title',
        slugUrlText: 'updated-slug',
        public: false,
        description: 'New description',
        imageSrc: 'https://new-image.com/img.jpg',
      }

      const result = UpdateWishlistSchema.safeParse(fullInput)
      expect(result.success).toBe(true)
    })

    it('should reject partial update (use PATCH for partial)', () => {
      const partialInput = {
        title: 'Updated Title',
      }

      const result = UpdateWishlistSchema.safeParse(partialInput)
      expect(result.success).toBe(false)
    })

    it('should reject empty object', () => {
      const emptyInput = {}

      const result = UpdateWishlistSchema.safeParse(emptyInput)
      expect(result.success).toBe(false)
    })

    it('should not allow setting id', () => {
      const withId = {
        id: 'new-id',
        title: 'Updated',
        slugUrlText: 'updated',
        public: true,
      }

      const result = UpdateWishlistSchema.safeParse(withId)
      expect(result.success).toBe(false)
    })

    it('should not allow setting items (not in CreateWishlistSchema)', () => {
      const withItems = {
        title: 'Updated',
        slugUrlText: 'updated',
        public: true,
        items: [{ id: 1, title: 'Item' }],
      }

      const result = UpdateWishlistSchema.safeParse(withItems)
      expect(result.success).toBe(false)
    })
  })

  describe('CreateWishlistItemSchema', () => {
    it('should parse valid item create input', () => {
      const validInput = {
        title: 'New Item',
        description: 'Description',
        imageSrc: 'https://example.com/img.jpg',
        url: 'https://example.com',
        bought: false,
      }

      const result = CreateWishlistItemSchema.safeParse(validInput)
      expect(result.success).toBe(true)
    })

    it('should apply default values for optional fields', () => {
      const minimalInput = {
        title: 'Minimal Item',
        bought: false,
      }

      const result = CreateWishlistItemSchema.safeParse(minimalInput)

      if (result.success) {
        expect(result.data.description).toBe('')
        expect(result.data.imageSrc).toBe('')
        expect(result.data.url).toBe('')
      }
    })

    it('should reject input with id', () => {
      const inputWithId = {
        id: 1,
        title: 'Item',
        bought: false,
      }

      const result = CreateWishlistItemSchema.safeParse(inputWithId)
      expect(result.success).toBe(false)
    })

    it('should reject input with wishlistId', () => {
      const inputWithWishlistId = {
        title: 'Item',
        wishlistId: 'test-123',
        bought: false,
      }

      const result = CreateWishlistItemSchema.safeParse(inputWithWishlistId)
      expect(result.success).toBe(false)
    })

    it('should reject missing title', () => {
      const missingTitle = {
        description: 'No title',
        bought: false,
      }

      const result = CreateWishlistItemSchema.safeParse(missingTitle)
      expect(result.success).toBe(false)
    })

    it('should reject empty title', () => {
      const emptyTitle = {
        title: '',
        bought: false,
      }

      const result = CreateWishlistItemSchema.safeParse(emptyTitle)
      expect(result.success).toBe(false)
    })
  })

  describe('UpdateWishlistItemSchema', () => {
    it('should parse full item update (PUT)', () => {
      const fullInput = {
        title: 'Updated',
        description: 'New description',
        imageSrc: 'https://new.com/img.jpg',
        url: 'https://new.com',
        bought: true,
      }

      const result = UpdateWishlistItemSchema.safeParse(fullInput)
      expect(result.success).toBe(true)
    })

    it('should reject partial item update (use PATCH for partial)', () => {
      const partialInput = {
        bought: true,
      }

      const result = UpdateWishlistItemSchema.safeParse(partialInput)
      expect(result.success).toBe(false)
    })

    it('should reject empty object', () => {
      const emptyInput = {}

      const result = UpdateWishlistItemSchema.safeParse(emptyInput)
      expect(result.success).toBe(false)
    })

    it('should allow updating all fields', () => {
      const fullUpdate = {
        title: 'Updated',
        description: 'New description',
        imageSrc: 'https://new.com/img.jpg',
        url: 'https://new.com',
        bought: true,
      }

      const result = UpdateWishlistItemSchema.safeParse(fullUpdate)
      expect(result.success).toBe(true)
    })

    it('should allow setting id (but it will be ignored)', () => {
      const withId = {
        title: 'Test Item',
        id: 999,
      }

      const result = UpdateWishlistItemSchema.safeParse(withId)
      expect(result.success).toBe(true)
    })

    it('should allow setting wishlistId (but it will be ignored)', () => {
      const withWishlistId = {
        title: 'Test Item',
        wishlistId: 'new-wishlist',
      }

      const result = UpdateWishlistItemSchema.safeParse(withWishlistId)
      expect(result.success).toBe(true)
    })

    it('should reject unknown fields', () => {
      const withUnknown = {
        title: 'test',
        unknownField: 'value',
      }

      const result = UpdateWishlistItemSchema.safeParse(withUnknown)
      expect(result.success).toBe(false)
    })
  })
})
