import { MetadataPlugin, MetadataResult } from './types'

export abstract class BasePlugin implements MetadataPlugin {
  abstract readonly name: string
  abstract readonly domains: string[]

  abstract isApplicable(url: string): boolean
  abstract extract(html: string, url: string): MetadataResult

  protected getDomain(url: string): string | null {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname
    } catch {
      return null
    }
  }

  protected urlContainsDomain(url: string, domain: string): boolean {
    return url.toLowerCase().includes(domain.toLowerCase())
  }
}
