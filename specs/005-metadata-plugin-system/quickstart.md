# Quickstart: Metadata Extraction Plugin System

## Overview

The metadata extraction system uses a plugin pipeline to extract product information (title, description, image) from URLs. Plugins are automatically discovered and executed in order until one returns valid metadata.

## Architecture

```
URL → Fetch HTML (undici) → Amazon → Shopify → LEGO → Smyths → OpenGraph → Result
```

HTML is fetched once using undici (fast Node.js HTTP client). Each plugin runs in order until one returns a title.

## Built-in Plugins

| Plugin    | Handles               | Status |
| --------- | --------------------- | ------ |
| Amazon    | amazon.de, amazon.com | ✅     |
| Shopify   | myshopify.com         | ✅     |
| LEGO      | lego.com              | ✅     |
| Smyths    | smythstoys.com        | ✅     |
| OpenGraph | All other URLs        | ✅     |

## Adding a New Plugin

### Step 1: Create Plugin File

Create `src/api/utils/metadata-plugins/plugins/my-site.plugin.ts`:

```typescript
import cheerio from 'cheerio'
import { MetadataPlugin, MetadataResult } from '../types'

export const mySitePlugin: MetadataPlugin = {
  name: 'my-site',
  domains: ['mysite.com', 'www.mysite.com'],

  isApplicable(url: string): boolean {
    return url.includes('mysite.com')
  },

  extract(html: string, _url: string): MetadataResult {
    const $ = cheerio.load(html)
    return {
      title: $('meta[property="og:title"]').attr('content') || '',
      description: $('meta[property="og:description"]').attr('content') || '',
      imageSrc: $('meta[property="og:image"]').attr('content') || '',
    }
  },
}

export default mySitePlugin
```

### Step 2: Register in Pipeline

Open `src/api/utils/metadata-plugins/index.ts` and add your plugin to the array:

```typescript
const plugins: MetadataPlugin[] = [
  amazonPlugin,
  shopifyPlugin,
  legoPlugin,
  smythsPlugin,
  mySitePlugin, // Add here
  openGraphPlugin,
]
```

### Step 3: Test

```bash
npm run test:unit
```

## Creating a New Plugin

### Step 1: Create Plugin File

Create `src/api/utils/metadata-plugins/plugins/my-site.plugin.ts`:

```typescript
import { MetadataPlugin, MetadataResult } from '../types'

export const mySitePlugin: MetadataPlugin = {
  name: 'my-site',
  domains: ['mysite.com', 'www.mysite.com'],

  isApplicable(url: string): boolean {
    return url.includes('mysite.com')
  },

  extract(html: string, url: string): MetadataResult {
    // Parse HTML and extract metadata
    // Use cheerio: const $ = cheerio.load(html)
    return {
      title: extractedTitle,
      description: extractedDescription,
      imageSrc: extractedImage,
    }
  },
}

export default mySitePlugin
```

### Step 3: Testing

```bash
# Run unit tests
npm run test:unit
```

## Plugin Interface

| Method               | Description                              |
| -------------------- | ---------------------------------------- |
| `name`               | Unique plugin identifier                 |
| `domains`            | List of domains (for docs)               |
| `isApplicable(url)`  | Returns true if plugin should handle URL |
| `extract(html, url)` | Extracts metadata from HTML              |

## Error Handling

- If a plugin throws an error, it returns empty metadata and pipeline continues
- If fetch fails, returns empty metadata
- User always gets a response (never crashes)

## Testing New Domains

Before creating a domain-specific plugin:

1. Test if OpenGraph provides sufficient data
2. Only create a plugin if OG fails or provides poor data
3. Consider generic plugins (Shopify, WooCommerce) first
