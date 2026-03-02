import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fetchMetaData } from '../../routes/utils/fetchmetadata'

vi.mock('open-graph-scraper', () => ({
  default: vi.fn().mockResolvedValue({
    result: {
      success: true,
      ogTitle: 'Test Title',
      ogDescription: 'Test Description',
      ogImage: { url: 'https://example.com/image.jpg' },
    },
  }),
}))

vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: '<html></html>' }),
  },
}))

vi.mock('cheerio', () => {
  const loadFn = vi.fn(() => ({
    text: () => 'Amazon Product Title',
    attr: () => 'https://amazon.com/image.jpg',
  }))
  return { default: { load: loadFn } }
})

describe('handlers: utils fetchmetadata', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchMetaData', () => {
    it('fetches metadata from non-Amazon URL using OGS', async () => {
      const mockRequest = {
        query: { url: 'https://example.com/page' },
        log: { debug: vi.fn() },
      } as any
      const mockReply = {
        send: vi.fn(),
      } as any

      await (fetchMetaData.handler as any)(mockRequest, mockReply)

      expect(mockReply.send).toHaveBeenCalledWith({
        title: 'Test Title',
        description: 'Test Description',
        imageSrc: 'https://example.com/image.jpg',
      })
    })

    it('returns empty metadata when OGS fails', async () => {
      const ogs = await import('open-graph-scraper')
      ;(ogs.default as any).mockResolvedValueOnce({
        result: { success: false },
      })

      const mockRequest = {
        query: { url: 'https://example.com/page' },
        log: { debug: vi.fn() },
      } as any
      const mockReply = {
        send: vi.fn(),
      } as any

      await (fetchMetaData.handler as any)(mockRequest, mockReply)

      expect(mockReply.send).toHaveBeenCalledWith({
        title: '',
        description: '',
        imageSrc: '',
      })
    })
  })
})
