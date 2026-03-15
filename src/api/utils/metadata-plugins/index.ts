import { MetadataPlugin, MetadataResult, PipelineContext } from './types'
import { fetchHtml } from './fetch'

import { amazonPlugin } from './plugins/amazon.plugin'
import { shopifyPlugin } from './plugins/shopify.plugin'
import { legoPlugin } from './plugins/lego.plugin'
import { smythsPlugin } from './plugins/smyths.plugin'
import { openGraphPlugin } from './plugins/opengraph.plugin'

const plugins: MetadataPlugin[] = [
  amazonPlugin,
  shopifyPlugin,
  legoPlugin,
  smythsPlugin,
  openGraphPlugin,
]

export function getPlugins(): MetadataPlugin[] {
  return [...plugins]
}

export function clearPlugins(): void {
  plugins.length = 0
}

export function registerPlugin(plugin: MetadataPlugin): void {
  plugins.push(plugin)
}

export async function runPipeline(
  url: string,
  timeout = 30000
): Promise<MetadataResult> {
  const emptyResult: MetadataResult = {
    title: '',
    description: '',
    imageSrc: '',
  }

  if (!url) {
    return emptyResult
  }

  const fetchResult = await fetchHtml(url, { timeout })
  if (fetchResult.error || !fetchResult.html) {
    return emptyResult
  }

  const context: PipelineContext = {
    url,
    html: fetchResult.html,
  }

  return executePlugins(context)
}

async function executePlugins(
  context: PipelineContext
): Promise<MetadataResult> {
  for (const plugin of plugins) {
    if (plugin.isApplicable(context.url)) {
      try {
        const result = plugin.extract(context.html, context.url)
        if (result.title) {
          return result
        }
      } catch {
        continue
      }
    }
  }

  return {
    title: '',
    description: '',
    imageSrc: '',
  }
}

export function getPluginCount(): number {
  return plugins.length
}
