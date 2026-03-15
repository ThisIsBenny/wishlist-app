import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runPipeline } from '../index'
import * as fetchModule from '../fetch'

vi.mock('../fetch', () => ({
  fetchHtml: vi.fn(),
}))

const { fetchHtml } = vi.mocked(fetchModule)

describe('Pipeline Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('runPipeline', () => {
    it('should return empty result for empty URL', async () => {
      const result = await runPipeline('')

      expect(result).toEqual({
        title: '',
        description: '',
        imageSrc: '',
      })
    })

    it('should return empty result when fetch fails', async () => {
      vi.mocked(fetchHtml).mockResolvedValueOnce({
        html: '',
        error: 'Network error',
      })

      const result = await runPipeline('https://example.com')

      expect(result).toEqual({
        title: '',
        description: '',
        imageSrc: '',
      })
    })

    it('should use Amazon plugin for Amazon URLs', async () => {
      const amazonHtml = `
        <html>
          <body>
            <span id="productTitle">Amazon Product</span>
            <img id="landingImage" src="https://amazon.com/image.jpg" />
          </body>
        </html>
      `
      vi.mocked(fetchHtml).mockResolvedValueOnce({ html: amazonHtml })

      const result = await runPipeline('https://www.amazon.de/dp/B0DBTTC2CH')

      expect(result.title).toBe('Amazon Product')
      expect(result.imageSrc).toBe('https://amazon.com/image.jpg')
    })

    it('should use Shopify plugin for Shopify URLs', async () => {
      const shopifyHtml = `
        <html>
          <head>
            <meta property="og:title" content="Shopify Product" />
            <meta property="og:image" content="https://shopify.com/image.jpg" />
          </head>
        </html>
      `
      vi.mocked(fetchHtml).mockResolvedValueOnce({ html: shopifyHtml })

      const result = await runPipeline(
        'https://store.myshopify.com/products/test'
      )

      expect(result.title).toBe('Shopify Product')
    })

    it('should use OpenGraph for non-matching URLs', async () => {
      const ogHtml = `
        <html>
          <head>
            <meta property="og:title" content="OG Title" />
            <meta property="og:description" content="OG Description" />
            <meta property="og:image" content="https://example.com/image.jpg" />
          </head>
        </html>
      `
      vi.mocked(fetchHtml).mockResolvedValueOnce({ html: ogHtml })

      const result = await runPipeline('https://example.com/product')

      expect(result.title).toBe('OG Title')
      expect(result.description).toBe('OG Description')
      expect(result.imageSrc).toBe('https://example.com/image.jpg')
    })

    it('should stop at first plugin with title', async () => {
      const htmlWithMultipleMeta = `
        <html>
          <head>
            <meta property="og:title" content="OG Title" />
          </head>
          <body>
            <span id="productTitle">Amazon Product</span>
            <img id="landingImage" src="https://amazon.com/image.jpg" />
          </body>
        </html>
      `
      vi.mocked(fetchHtml).mockResolvedValueOnce({ html: htmlWithMultipleMeta })

      const result = await runPipeline('https://www.amazon.de/dp/B0DBTTC2CH')

      expect(result.title).toBe('Amazon Product')
    })

    it('should use custom timeout', async () => {
      vi.mocked(fetchHtml).mockResolvedValueOnce({
        html: '<html><body>test</body></html>',
      })

      await runPipeline('https://example.com', 5000)

      expect(fetchHtml).toHaveBeenCalledWith('https://example.com', {
        timeout: 5000,
      })
    })
  })
})
