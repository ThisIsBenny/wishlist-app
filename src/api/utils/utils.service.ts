import { Injectable } from '@nestjs/common'
import { runPipeline } from './metadata-plugins'

export interface MetadataResult {
  title: string
  description: string
  imageSrc: string
}

@Injectable()
export class UtilsService {
  async fetchMetadata(url: string): Promise<MetadataResult> {
    if (!url) {
      return {
        title: '',
        description: '',
        imageSrc: '',
      }
    }

    try {
      const result = await runPipeline(url)
      return result
    } catch {
      return {
        title: '',
        description: '',
        imageSrc: '',
      }
    }
  }
}
