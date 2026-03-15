import { describe, it, expect, beforeEach } from 'vitest'
import {
  registerPlugin,
  getPlugins,
  clearPlugins,
  getPluginCount,
} from '../index'
import { MetadataPlugin, MetadataResult } from '../types'

const mockPlugin: MetadataPlugin = {
  name: 'test-plugin',
  domains: ['test.com'],
  isApplicable(url: string): boolean {
    return url.includes('test.com')
  },
  extract(): MetadataResult {
    return { title: 'Test', description: 'Test desc', imageSrc: 'test.jpg' }
  },
}

describe('PluginRegistry', () => {
  beforeEach(() => {
    clearPlugins()
  })

  describe('registerPlugin', () => {
    it('should register plugins', () => {
      registerPlugin(mockPlugin)
      const plugins = getPlugins()

      expect(plugins).toHaveLength(1)
      expect(plugins[0].name).toBe('test-plugin')
    })

    it('should register multiple plugins', () => {
      const genericPlugin: MetadataPlugin = {
        name: 'generic',
        domains: [],
        isApplicable: () => true,
        extract: () => ({ title: 'Gen', description: '', imageSrc: '' }),
      }

      registerPlugin(mockPlugin)
      registerPlugin(genericPlugin)
      const plugins = getPlugins()

      expect(plugins).toHaveLength(2)
    })
  })

  describe('getPlugins', () => {
    it('should return empty array when no plugins registered', () => {
      const plugins = getPlugins()
      expect(plugins).toEqual([])
    })

    it('should return copy of plugins array', () => {
      registerPlugin(mockPlugin)
      const plugins = getPlugins()

      plugins.push({
        name: 'another',
        domains: [],
        isApplicable: () => false,
        extract: () => ({ title: '', description: '', imageSrc: '' }),
      })

      const plugins2 = getPlugins()
      expect(plugins2).toHaveLength(1)
    })
  })

  describe('clearPlugins', () => {
    it('should remove all registered plugins', () => {
      registerPlugin(mockPlugin)
      clearPlugins()

      const plugins = getPlugins()
      expect(plugins).toHaveLength(0)
    })
  })

  describe('getPluginCount', () => {
    it('should return 0 when no plugins', () => {
      expect(getPluginCount()).toBe(0)
    })

    it('should return correct count', () => {
      const genericPlugin: MetadataPlugin = {
        name: 'generic',
        domains: [],
        isApplicable: () => true,
        extract: () => ({ title: 'Gen', description: '', imageSrc: '' }),
      }

      registerPlugin(mockPlugin)
      registerPlugin(genericPlugin)

      expect(getPluginCount()).toBe(2)
    })
  })
})
