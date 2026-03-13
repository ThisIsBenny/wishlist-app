import { WishlistService } from '../wishlist.service'
import { WishlistRepository } from '../wishlist.repository'
import { describe, it, expect, vi } from 'vitest'

const mockWishlist = {
  id: 'test-1',
  title: 'Test Wishlist',
  slugUrlText: 'test-wishlist',
  public: true,
  description: 'Test description',
  imageSrc: '',
  items: [],
}

describe('WishlistService', () => {
  const createMockRepo = (overrides = {}) => ({
    findAll: vi.fn().mockResolvedValue([mockWishlist]),
    findBySlugUrlText: vi.fn().mockResolvedValue(mockWishlist),
    findItemsByWishlistId: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue(mockWishlist),
    update: vi.fn().mockResolvedValue(mockWishlist),
    delete: vi.fn().mockResolvedValue(mockWishlist),
    createItem: vi.fn().mockResolvedValue({ id: 1 }),
    updateItem: vi.fn().mockResolvedValue({ id: 1 }),
    deleteItem: vi.fn().mockResolvedValue({ id: 1 }),
    ...overrides,
  })

  it('should return public wishlists for unauthenticated user', async () => {
    const mockRepo = createMockRepo()
    const service = new WishlistService(
      mockRepo as unknown as WishlistRepository
    )
    const result = await service.getAll(false)
    expect(result).toEqual([mockWishlist])
  })

  it('should return all wishlists for authenticated user', async () => {
    const mockRepo = createMockRepo()
    const service = new WishlistService(
      mockRepo as unknown as WishlistRepository
    )
    const result = await service.getAll(true)
    expect(result).toEqual([mockWishlist])
  })

  it('should return wishlist by slug', async () => {
    const mockRepo = createMockRepo()
    const service = new WishlistService(
      mockRepo as unknown as WishlistRepository
    )
    const result = await service.getBySlugUrlText('test-wishlist', true)
    expect(result).toBeDefined()
  })

  it('should throw NotFoundException when wishlist not found', async () => {
    const mockRepo = createMockRepo({
      findBySlugUrlText: vi.fn().mockResolvedValue(null),
    })
    const service = new WishlistService(
      mockRepo as unknown as WishlistRepository
    )
    await expect(service.getBySlugUrlText('invalid')).rejects.toThrow(
      'Wishlist not found'
    )
  })

  it('should create a wishlist', async () => {
    const mockRepo = createMockRepo()
    const service = new WishlistService(
      mockRepo as unknown as WishlistRepository
    )
    const result = await service.create({
      title: 'Test',
      slugUrlText: 'test',
      public: true,
      description: '',
      imageSrc: '',
    })
    expect(result).toEqual(mockWishlist)
  })

  it('should throw NotFoundException when updating non-existent wishlist', async () => {
    const mockRepo = createMockRepo({
      update: vi.fn().mockResolvedValue(null),
    })
    const service = new WishlistService(
      mockRepo as unknown as WishlistRepository
    )
    await expect(service.update('invalid', {})).rejects.toThrow(
      'Wishlist not found'
    )
  })

  it('should delete a wishlist', async () => {
    const mockRepo = createMockRepo()
    const service = new WishlistService(
      mockRepo as unknown as WishlistRepository
    )
    await service.delete('test-1')
    expect(mockRepo.delete).toHaveBeenCalledWith('test-1')
  })

  it('should create an item', async () => {
    const mockRepo = createMockRepo()
    const service = new WishlistService(
      mockRepo as unknown as WishlistRepository
    )
    const newItem = {
      id: 1,
      title: 'Item',
      url: '',
      imageSrc: '',
      description: '',
      bought: false,
      wishlistId: 'test-1',
    }
    const result = await service.createItem('test-1', newItem)
    expect(result).toBeDefined()
  })

  it('should throw NotFoundException when item not found', async () => {
    const mockRepo = createMockRepo({
      updateItem: vi.fn().mockResolvedValue(null),
    })
    const service = new WishlistService(
      mockRepo as unknown as WishlistRepository
    )
    await expect(service.updateItem(999, {})).rejects.toThrow('Item not found')
  })

  it('should delete an item', async () => {
    const mockRepo = createMockRepo()
    const service = new WishlistService(
      mockRepo as unknown as WishlistRepository
    )
    await service.deleteItem(1)
    expect(mockRepo.deleteItem).toHaveBeenCalledWith(1)
  })
})
