import { UtilsService } from '../utils.service'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}))

vi.mock('cheerio', () => ({
  default: {
    load: vi.fn().mockReturnValue(() => {
      return vi.fn().mockReturnValue('  Test Product  ')
    }),
  },
}))

vi.mock('open-graph-scraper', () => ({
  default: vi.fn(),
}))

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

    it('should handle failed og scraper result', async () => {
      const ogs = (await import('open-graph-scraper')).default
      vi.mocked(ogs).mockResolvedValueOnce({
        result: {
          success: false,
        },
      } as any)

      const result = await service.fetchMetadata('https://example.com/page')

      expect(result).toEqual({
        title: '',
        description: '',
        imageSrc: '',
      })
    })
  })
})
