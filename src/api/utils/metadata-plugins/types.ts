export interface MetadataResult {
  title: string
  description: string
  imageSrc: string
}

export interface MetadataPlugin {
  readonly name: string
  readonly domains: string[]
  isApplicable(url: string): boolean
  extract(html: string, url: string): MetadataResult
}

export interface PipelineContext {
  url: string
  html: string
}

export interface PluginRegistry {
  domainSpecific: MetadataPlugin[]
  generic: MetadataPlugin[]
}

export interface FetchOptions {
  timeout?: number
}

export interface FetchResult {
  html: string
  error?: string
}
