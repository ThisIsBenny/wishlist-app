import { UtilsService } from '../utils.service'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../metadata-plugins', () => ({
  runPipeline: vi.fn(),
}))

import { runPipeline } from '../metadata-plugins'

vi.mocked(runPipeline)

describe('UtilsService', () => {
  let service: UtilsService

  beforeEach(() => {
    service = new UtilsService()
    vi.clearAllMocks()
  })

  describe('fetchMetadata', () => {
    it('should return empty response for empty URL', async () => {
      const result = await service.fetchMetadata('')

      expect(result).toEqual({
        title: '',
        description: '',
        imageSrc: '',
      })
      expect(runPipeline).not.toHaveBeenCalled()
    })

    it('should return empty response for undefined URL', async () => {
      const result = await service.fetchMetadata(undefined as unknown as string)

      expect(result).toEqual({
        title: '',
        description: '',
        imageSrc: '',
      })
    })

    it('should return empty response for null URL', async () => {
      const result = await service.fetchMetadata(null as unknown as string)

      expect(result).toEqual({
        title: '',
        description: '',
        imageSrc: '',
      })
    })

    it('should call runPipeline with URL', async () => {
      vi.mocked(runPipeline).mockResolvedValueOnce({
        title: 'Test Product',
        description: 'Test Description',
        imageSrc: 'https://example.com/image.jpg',
      })

      const result = await service.fetchMetadata('https://example.com/product')

      expect(runPipeline).toHaveBeenCalledWith('https://example.com/product')
      expect(result).toEqual({
        title: 'Test Product',
        description: 'Test Description',
        imageSrc: 'https://example.com/image.jpg',
      })
    })

    it('should return empty result when runPipeline throws', async () => {
      vi.mocked(runPipeline).mockRejectedValueOnce(new Error('Network error'))

      const result = await service.fetchMetadata('https://example.com/product')

      expect(result).toEqual({
        title: '',
        description: '',
        imageSrc: '',
      })
    })

    it('should handle runPipeline returning partial data', async () => {
      vi.mocked(runPipeline).mockResolvedValueOnce({
        title: 'Test Product',
        description: '',
        imageSrc: '',
      })

      const result = await service.fetchMetadata('https://example.com/product')

      expect(result).toEqual({
        title: 'Test Product',
        description: '',
        imageSrc: '',
      })
    })
  })
})
