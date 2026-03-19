import { request } from 'undici'
import { FetchOptions, FetchResult } from './types'
import { validateUrlForFetch } from './url-validator'

export async function fetchHtml(
  url: string,
  options: FetchOptions = {}
): Promise<FetchResult> {
  const { timeout = 60000 } = options

  let parsedUrl: URL
  try {
    parsedUrl = validateUrlForFetch(url)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid URL'
    return {
      html: '',
      error: message,
    }
  }

  try {
    const { statusCode, body } = await request(parsedUrl, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.5',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      headersTimeout: timeout,
      bodyTimeout: timeout,
    })

    if (statusCode >= 500) {
      return {
        html: '',
        error: `HTTP ${statusCode}`,
      }
    }

    const html = await body.text()

    return {
      html,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return {
      html: '',
      error: message,
    }
  }
}
