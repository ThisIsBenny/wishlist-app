import cheerio from 'cheerio'
import { MetadataPlugin, MetadataResult } from '../types'

export const legoPlugin: MetadataPlugin = {
  name: 'lego',
  domains: ['lego.com'],
  isApplicable(url: string): boolean {
    return url.toLowerCase().includes('lego.com')
  },

  extract(html: string, _url: string): MetadataResult {
    const $ = cheerio.load(html)
    const result: MetadataResult = {
      title: '',
      description: '',
      imageSrc: '',
    }

    result.title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('h1').first().text().trim() ||
      ''

    result.description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      ''

    result.imageSrc =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[property="og:image:url"]').attr('content') ||
      ''

    return result
  },
}

export default legoPlugin
