import cheerio from 'cheerio'
import { MetadataPlugin, MetadataResult } from '../types'

export const openGraphPlugin: MetadataPlugin = {
  name: 'opengraph',
  domains: [],
  isApplicable(/* _url */): boolean {
    return true
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
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text().trim() ||
      $('meta[name="title"]').attr('content') ||
      ''

    result.description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      ''

    result.imageSrc =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[property="og:image:url"]').attr('content') ||
      ''

    return result
  },
}

export default openGraphPlugin
