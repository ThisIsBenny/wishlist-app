# Data Model: Metadata Extraction Plugin System

## Core Types

### MetadataResult

The output type returned by all extraction plugins.

```typescript
interface MetadataResult {
  title: string
  description: string
  imageSrc: string
}
```

**Validation**: All fields are strings - empty string is valid (represents missing data).

---

### MetadataPlugin

The interface that all plugins must implement.

```typescript
interface MetadataPlugin {
  readonly name: string
  readonly domains: string[]
  isApplicable(url: string): boolean
  extract(html: string, url: string): MetadataResult
}
```

**Fields**:

- `name`: Unique identifier for the plugin (e.g., "amazon", "opengraph")
- `domains`: List of domains this plugin handles (for documentation)
- `isApplicable(url)`: Returns true if this plugin should handle the URL
- `extract(html, url)`: Extracts metadata from pre-fetched HTML

---

### PipelineContext

The shared context passed to all plugins in the pipeline.

```typescript
interface PipelineContext {
  url: string
  html: string
}
```

**Fields**:

- `url`: Original URL being processed
- `html`: Pre-fetched HTML content (fetched once at pipeline start)

---

### PluginRegistry

Internal type for managing discovered plugins.

```typescript
interface PluginRegistry {
  domainSpecific: MetadataPlugin[]
  generic: MetadataPlugin[]
}
```

---

## Relationships

```
PipelineRunner
  ├─> PluginRegistry (holds discovered plugins)
  │    ├─> domainSpecific: MetadataPlugin[]
  │    └─> generic: MetadataPlugin[]
  │
  └─> PipelineContext (shared, fetched once)
       ├─> url
       └─> html

Each MetadataPlugin:
  ├─> isApplicable(url) → boolean
  └─> extract(html, url) → MetadataResult
```

## State Transitions

**Pipeline Execution State Machine**:

```
IDLE → FETCHING_HTML → RUNNING_PLUGINS → COMPLETE
                ↓
              ERROR → COMPLETE (empty)
```

1. **IDLE**: Waiting for new extraction request
2. **FETCHING_HTML**: Fetching HTML from URL (30s timeout)
3. **RUNNING_PLUGINS**: Iterating through plugin pipeline
4. **COMPLETE**: Returned MetadataResult (with data or empty)
5. **ERROR**: Fetch or plugin failed, return empty result

## Validation Rules

- **URL**: Must be non-empty string
- **MetadataResult**: All fields are optional (empty string = missing)
- **Plugin name**: Must be unique across all plugins
- **Plugin isApplicable**: Must not throw - return boolean
- **Plugin extract**: Must not throw - return MetadataResult

## Extensibility

New plugins can be added by:

1. Creating a file in `src/api/utils/metadata-plugins/plugins/`
2. Implementing `MetadataPlugin` interface
3. Exporting default instance
4. Auto-discovery loads it at startup
