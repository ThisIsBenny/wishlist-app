import cheerio from 'cheerio'
import { MetadataPlugin, MetadataResult } from '../types'

export const amazonPlugin: MetadataPlugin = {
  name: 'amazon',
  domains: [
    'amazon.de',
    'amazon.com',
    'amazon.co.uk',
    'amazon.fr',
    'amazon.it',
    'amazon.es',
  ],

  isApplicable(url: string): boolean {
    return url.toLowerCase().includes('amazon.')
  },

  extract(html: string /* _url */): MetadataResult {
    const $ = cheerio.load(html)
    const result: MetadataResult = {
      title: '',
      description: '',
      imageSrc: '',
    }

    result.title = $('#productTitle').text().trim() || ''
    result.description = result.title
    result.imageSrc = ($('#landingImage').attr('src') || '').trim()

    return result
  },
}

export default amazonPlugin
