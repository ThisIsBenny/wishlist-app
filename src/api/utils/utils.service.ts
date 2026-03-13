import { Injectable } from '@nestjs/common'
import axios from 'axios'
import cheerio from 'cheerio'
import ogs from 'open-graph-scraper'

export interface MetadataResult {
  title: string
  description: string
  imageSrc: string
}

@Injectable()
export class UtilsService {
  async fetchMetadata(url: string): Promise<MetadataResult> {
    const response: MetadataResult = {
      title: '',
      description: '',
      imageSrc: '',
    }

    if (!url) {
      return response
    }

    if (url.includes('amazon.de')) {
      const { data } = await axios.get(url)
      const $ = cheerio.load(data)
      response.title = $('#productTitle').text().trim() || ''
      response.description = response.title
      response.imageSrc = ($('#landingImage').attr('src') || '').trim()
    } else {
      const { result } = await ogs({ url })
      if (result.success) {
        const ogImage = result.ogImage as unknown as
          | { url?: string }
          | undefined
        response.imageSrc = ogImage?.url || ''
        response.title = result.ogTitle || ''
        response.description = result.ogDescription || ''
      }
    }

    return response
  }
}
