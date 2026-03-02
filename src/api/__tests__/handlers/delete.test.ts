import { describe, it, expect, beforeEach, vi } from 'vitest'
import { deleteList, deleteItem } from '../../routes/wishlist/delete'

vi.mock('../../models', () => ({
  wishlist: {
    delete: vi.fn(),
    deleteItem: vi.fn(),
  },
}))

import { wishlist } from '../../models'

describe('handlers: wishlist delete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('deleteList', () => {
    it('deletes a wishlist and returns 204', async () => {
      const mockRequest = {
        params: { wishlistId: 'test-id-1' },
      } as any
      const mockReply = {
        code: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as any
      ;(wishlist.delete as any).mockResolvedValue(true)

      await (deleteList.handler as any)(mockRequest, mockReply)

      expect(wishlist.delete).toHaveBeenCalledWith('test-id-1')
      expect(mockReply.code).toHaveBeenCalledWith(204)
      expect(mockReply.send).toHaveBeenCalled()
    })
  })

  describe('deleteItem', () => {
    it('deletes an item and returns 204', async () => {
      const mockRequest = {
        params: { wishlistId: 'test-id-1', itemId: 1 },
      } as any
      const mockReply = {
        code: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as any
      ;(wishlist.deleteItem as any).mockResolvedValue(true)

      await (deleteItem.handler as any)(mockRequest, mockReply)

      expect(wishlist.deleteItem).toHaveBeenCalledWith(1)
      expect(mockReply.code).toHaveBeenCalledWith(204)
      expect(mockReply.send).toHaveBeenCalled()
    })
  })
})
