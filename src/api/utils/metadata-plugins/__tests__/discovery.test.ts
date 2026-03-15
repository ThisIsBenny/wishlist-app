import { describe, it, expect } from 'vitest'
import { registerPlugin, getPlugins, getPluginCount } from '../index'
import { MetadataPlugin, MetadataResult } from '../types'

const customPlugin: MetadataPlugin = {
  name: 'custom',
  domains: ['custom.com'],
  isApplicable(url: string): boolean {
    return url.includes('custom.com')
  },
  extract(): MetadataResult {
    return { title: 'Custom', description: '', imageSrc: '' }
  },
}

describe('Plugin Auto-Discovery', () => {
  describe('plugin registration', () => {
    it('should automatically register built-in plugins', () => {
      const count = getPluginCount()
      expect(count).toBeGreaterThan(0)
    })

    it('should have Amazon plugin', () => {
      const plugins = getPlugins()
      const amazon = plugins.find((p) => p.name === 'amazon')
      expect(amazon).toBeDefined()
      expect(amazon?.isApplicable('https://amazon.de/product')).toBe(true)
    })

    it('should have Shopify plugin', () => {
      const plugins = getPlugins()
      const shopify = plugins.find((p) => p.name === 'shopify')
      expect(shopify).toBeDefined()
      expect(
        shopify?.isApplicable('https://store.myshopify.com/products/test')
      ).toBe(true)
    })

    it('should have OpenGraph plugin', () => {
      const plugins = getPlugins()
      const og = plugins.find((p) => p.name === 'opengraph')
      expect(og).toBeDefined()
      expect(og?.isApplicable('https://any-domain.com')).toBe(true)
    })
  })

  describe('manual plugin addition', () => {
    it('should allow manual plugin registration', () => {
      const beforeCount = getPluginCount()
      registerPlugin(customPlugin)
      const afterCount = getPluginCount()

      expect(afterCount).toBe(beforeCount + 1)
      const plugins = getPlugins()
      expect(plugins.some((p) => p.name === 'custom')).toBe(true)
    })

    it('should persist manually added plugins across getPlugins calls', () => {
      registerPlugin(customPlugin)
      const plugins1 = getPlugins()
      const plugins2 = getPlugins()

      expect(plugins1.length).toBe(plugins2.length)
    })
  })

  describe('plugin order', () => {
    it('should have plugins in registration order', () => {
      const plugins = getPlugins()
      const names = plugins.map((p) => p.name)

      expect(names[0]).toBe('amazon')
    })
  })
})
