import { describe, it, expect } from 'vitest'
import { amazonPlugin } from '../plugins/amazon.plugin'

describe('AmazonPlugin', () => {
  describe('isApplicable', () => {
    it('should return true for amazon.de URLs', () => {
      expect(
        amazonPlugin.isApplicable('https://www.amazon.de/dp/B0DBTTC2CH')
      ).toBe(true)
      expect(amazonPlugin.isApplicable('https://amazon.de/product/123')).toBe(
        true
      )
      expect(
        amazonPlugin.isApplicable('https://www.amazon.de/gp/product/B0DBTTC2CH')
      ).toBe(true)
    })

    it('should return true for amazon.com URLs', () => {
      expect(
        amazonPlugin.isApplicable('https://www.amazon.com/dp/B0DBTTC2CH')
      ).toBe(true)
      expect(amazonPlugin.isApplicable('https://amazon.com/product/123')).toBe(
        true
      )
    })

    it('should return false for non-Amazon URLs', () => {
      expect(amazonPlugin.isApplicable('https://example.com/product')).toBe(
        false
      )
      expect(amazonPlugin.isApplicable('https://google.com')).toBe(false)
    })

    it('should be case insensitive', () => {
      expect(amazonPlugin.isApplicable('https://WWW.AMAZON.DE/product')).toBe(
        true
      )
      expect(amazonPlugin.isApplicable('https://AMAZON.COM/product')).toBe(true)
    })
  })

  describe('extract', () => {
    it('should extract product title from Amazon HTML', () => {
      const html = `
        <html>
          <body>
            <span id="productTitle">Test Product Title</span>
            <img id="landingImage" src="https://example.com/image.jpg" />
          </body>
        </html>
      `

      const result = amazonPlugin.extract(
        html,
        'https://www.amazon.de/dp/B0DBTTC2CH'
      )

      expect(result.title).toBe('Test Product Title')
      expect(result.description).toBe('Test Product Title')
      expect(result.imageSrc).toBe('https://example.com/image.jpg')
    })

    it('should return empty strings when elements not found', () => {
      const html = '<html><body><p>No product here</p></body></html>'

      const result = amazonPlugin.extract(
        html,
        'https://www.amazon.de/dp/B0DBTTC2CH'
      )

      expect(result.title).toBe('')
      expect(result.description).toBe('')
      expect(result.imageSrc).toBe('')
    })

    it('should handle whitespace in title', () => {
      const html = `
        <html>
          <body>
            <span id="productTitle">  Test Product   </span>
            <img id="landingImage" src="  https://example.com/image.jpg  " />
          </body>
        </html>
      `

      const result = amazonPlugin.extract(
        html,
        'https://www.amazon.de/dp/B0DBTTC2CH'
      )

      expect(result.title).toBe('Test Product')
      expect(result.imageSrc).toBe('https://example.com/image.jpg')
    })
  })

  describe('name and domains', () => {
    it('should have correct name', () => {
      expect(amazonPlugin.name).toBe('amazon')
    })

    it('should have Amazon domains defined', () => {
      expect(amazonPlugin.domains).toContain('amazon.de')
      expect(amazonPlugin.domains).toContain('amazon.com')
    })
  })
})
