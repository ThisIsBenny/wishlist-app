import { describe, it, expect } from 'vitest'
import { shopifyPlugin } from '../plugins/shopify.plugin'

describe('ShopifyPlugin', () => {
  describe('isApplicable', () => {
    it('should return true for myshopify.com URLs', () => {
      expect(
        shopifyPlugin.isApplicable('https://store.myshopify.com/products/test')
      ).toBe(true)
      expect(
        shopifyPlugin.isApplicable('https://store.myshopify.com/products/123')
      ).toBe(true)
    })

    it('should return false for non-Shopify URLs', () => {
      expect(shopifyPlugin.isApplicable('https://example.com/product')).toBe(
        false
      )
      expect(shopifyPlugin.isApplicable('https://amazon.de/product')).toBe(
        false
      )
    })

    it('should be case insensitive', () => {
      expect(
        shopifyPlugin.isApplicable('https://STORE.MYSHOPIFY.COM/products')
      ).toBe(true)
    })
  })

  describe('extract', () => {
    it('should extract metadata from Open Graph tags', () => {
      const html = `
        <html>
          <head>
            <meta property="og:title" content="Shopify Product Title" />
            <meta property="og:description" content="Product description" />
            <meta property="og:image" content="https://example.com/image.jpg" />
          </head>
        </html>
      `

      const result = shopifyPlugin.extract(
        html,
        'https://store.myshopify.com/products/test'
      )

      expect(result.title).toBe('Shopify Product Title')
      expect(result.description).toBe('Product description')
      expect(result.imageSrc).toBe('https://example.com/image.jpg')
    })

    it('should fall back to meta name tags', () => {
      const html = `
        <html>
          <head>
            <meta name="title" content="Fallback Title" />
            <meta name="description" content="Fallback description" />
          </head>
        </html>
      `

      const result = shopifyPlugin.extract(
        html,
        'https://store.myshopify.com/products/test'
      )

      expect(result.title).toBe('Fallback Title')
      expect(result.description).toBe('Fallback description')
    })

    it('should fall back to h1 if no og title', () => {
      const html = `
        <html>
          <head>
            <title>Page Title</title>
          </head>
          <body>
            <h1>Product H1 Title</h1>
          </body>
        </html>
      `

      const result = shopifyPlugin.extract(
        html,
        'https://store.myshopify.com/products/test'
      )

      expect(result.title).toBe('Product H1 Title')
    })

    it('should return empty strings when no metadata found', () => {
      const html = '<html><body><p>No metadata here</p></body></html>'

      const result = shopifyPlugin.extract(
        html,
        'https://store.myshopify.com/products/test'
      )

      expect(result.title).toBe('')
      expect(result.description).toBe('')
      expect(result.imageSrc).toBe('')
    })

    it('should handle twitter meta as fallback', () => {
      const html = `
        <html>
          <head>
            <meta name="twitter:image" content="https://example.com/twitter-image.jpg" />
          </head>
        </html>
      `

      const result = shopifyPlugin.extract(
        html,
        'https://store.myshopify.com/products/test'
      )

      expect(result.imageSrc).toBe('https://example.com/twitter-image.jpg')
    })
  })

  describe('name and domains', () => {
    it('should have correct name', () => {
      expect(shopifyPlugin.name).toBe('shopify')
    })

    it('should have Shopify domains defined', () => {
      expect(shopifyPlugin.domains).toContain('myshopify.com')
    })
  })
})
