import cheerio from 'cheerio'
import { MetadataPlugin, MetadataResult } from '../types'

export const shopifyPlugin: MetadataPlugin = {
  name: 'shopify',
  domains: ['myshopify.com'],
  isApplicable(url: string): boolean {
    return url.toLowerCase().includes('myshopify.com')
  },

  extract(html: string /* _url */): MetadataResult {
    const $ = cheerio.load(html)
    const result: MetadataResult = {
      title: '',
      description: '',
      imageSrc: '',
    }

    result.title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="title"]').attr('content') ||
      $('h1').first().text().trim() ||
      ''

    result.description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      ''

    result.imageSrc =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      ''

    return result
  },
}

export default shopifyPlugin
