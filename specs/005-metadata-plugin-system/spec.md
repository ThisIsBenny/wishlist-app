# Feature Specification: Metadata Extraction Plugin System

**Feature Branch**: `005-metadata-plugin-system`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: User description: "build a plugin system for URL metadata extraction where multiple plugins can handle specific domains. plugins will expose a list of domains they can handle. if no plugin matches, fall back to open-graph-scraper"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Domain-Specific Metadata Extraction (Priority: P1)

A user provides a URL from a popular e-commerce site (e.g., Amazon, LEGO, Smyths Toys) when creating a wishlist item. The system should automatically extract the product title, description, and image using specialized extraction logic optimized for that domain.

**Why this priority**: This is the core functionality that improves metadata extraction quality for high-traffic sites where generic Open Graph scraping often fails.

**Independent Test**: Can be fully tested by providing URLs from supported domains and verifying accurate metadata extraction.

**Acceptance Scenarios**:

1. **Given** a valid Amazon.de product URL, **When** metadata extraction is requested, **Then** the Amazon plugin's extraction logic runs and returns product title, description, and image.
2. **Given** a URL from a domain with a registered plugin, **When** metadata extraction is requested, **Then** the plugin's extraction logic is applied.
3. **Given** a URL where the domain-specific plugin's `isApplicable()` returns false, **When** metadata extraction is requested, **Then** the plugin skips and next plugin in pipeline runs.
4. **Given** a URL from an unsupported domain, **When** no domain-specific plugin matches, **Then** generic Open Graph scraper is used as fallback.

---

### User Story 2 - Plugin Registration and Discovery (Priority: P2)

The system should automatically discover and register all available metadata extraction plugins at startup, making them available for URL matching without manual configuration.

**Why this priority**: Ensures the plugin system is maintainable and extensible - new plugins can be added without modifying core extraction logic.

**Independent Test**: Can be tested by adding a new plugin file and verifying it's automatically available for extraction.

**Acceptance Scenarios**:

1. **Given** multiple plugins are installed, **When** a URL is processed, **Then** the system matches against all plugin domain lists.
2. **Given** a new plugin is added to the plugins directory, **When** the application starts, **Then** the plugin is automatically registered and available.

---

### User Story 3 - Fallback to Default Extractor (Priority: P3)

When no domain-specific plugin matches the provided URL, the system should gracefully fall back to the default Open Graph scraper to ensure users always receive metadata.

**Why this priority**: Ensures backward compatibility and prevents extraction failures for unknown domains.

**Independent Test**: Can be tested with URLs from random websites not covered by any plugin.

**Acceptance Scenarios**:

1. **Given** a URL from an unrecognized domain, **When** no plugin matches, **Then** Open Graph scraper is used as the default.
2. **Given** a URL that causes the default scraper to fail, **When** extraction is attempted, **Then** the system returns empty metadata rather than throwing an error.

---

### Edge Cases

- What happens when a plugin throws an error during extraction? → Returns empty metadata, continues to next plugin
- How does the system handle malformed URLs? → Returns empty metadata
- What happens when multiple plugins claim to handle the same domain? → First matching plugin in pipeline wins
- How does the system behave when the default Open Graph scraper fails? → Returns empty metadata (no crash)

### Non-Functional Requirements

- **NFR-001**: Extraction timeout: 30 seconds total (fetch + parse)
- **NFR-002**: Rate limiting: Not required - usage pattern (2-3 items per domain) doesn't trigger rate limits

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a plugin interface that defines the contract for all metadata extraction plugins.
- **FR-002**: Each plugin MUST declare a list of domains it can handle.
- **FR-003**: System MUST automatically discover and load all available plugins at startup.
- **FR-004**: System MUST match incoming URLs against plugin domain lists to select the appropriate extractor.
- **FR-005**: System MUST fall back to Open Graph scraping when no plugin matches the given URL.
- **FR-006**: The current Amazon.de extraction logic MUST be converted to a plugin.
- **FR-007**: System MUST handle extraction failures gracefully by returning empty metadata instead of throwing errors.
- **FR-008**: Plugins MUST provide an `isApplicable(url)` method to determine if they can handle a given URL.
- **FR-009**: System MUST execute plugins in a pipeline - domain-specific plugins first, then generic plugins.
- **FR-010**: The pipeline MUST stop executing once any extractor returns valid metadata (title present).
- **FR-011**: The system MUST provide a shared HTML context (URL + fetched HTML) to all plugins to avoid redundant fetches.
- **FR-012**: System MUST provide a generic Open Graph plugin as the final fallback in the pipeline.
- **FR-013**: System MUST create a domain-specific plugin for Amazon.de (existing logic).
- **FR-014**: System MUST create a generic Shopify plugin since multiple tested sites use Shopify.
- **FR-015**: System MUST create a domain-specific plugin for LEGO.
- **FR-016**: System MUST create a domain-specific plugin for Smyths Toys.

## Test Results from Sample URLs

The following URLs were tested with the complete plugin pipeline:

| URL                | Plugin Used   | Result               |
| ------------------ | ------------- | -------------------- |
| nomadgoods.com     | OpenGraph     | ✅                   |
| everythingsmart.io | OpenGraph     | ✅                   |
| berrybase.de       | OpenGraph     | ✅                   |
| ablecarry.com      | OpenGraph     | ✅                   |
| mukama.com         | OpenGraph     | ✅                   |
| babykochs.de       | OpenGraph     | ✅                   |
| baby-walz.de       | OpenGraph     | ✅                   |
| mueller.de         | OpenGraph     | ✅                   |
| amazon.de          | Amazon Plugin | ✅                   |
| lego.com           | LEGO Plugin   | ✅                   |
| idealo.de          | -             | ⏭️ 503 Server Error  |
| smythstoys.com     | -             | ⏭️ Incapsula Blocked |

**Summary**: 10 of 12 URLs work. 2 are blocked by external services (not implementation issues).

### Implementation Status

- Amazon Plugin: ✅ Implemented
- Shopify Plugin: ✅ Implemented
- LEGO Plugin: ✅ Implemented
- Smyths Plugin: ✅ Implemented
- OpenGraph Fallback: ✅ Implemented

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can extract metadata from Amazon.de URLs with improved accuracy compared to generic scraping.
- **SC-002**: New domain-specific extractors can be added by creating a plugin without modifying core extraction code.
- **SC-003**: All URL extractions complete within 30 seconds (including fetch + parse time).
- **SC-004**: System maintains 100% uptime during extraction - failures return empty metadata rather than crashing.

## Clarifications

### Session 2026-03-15

- Q: How should the system handle external sites that rate-limit or block scraping requests? → A: No special handling needed - users typically add only 2-3 items from same domain in short timeframe.
- Q: If extraction returns partial data (e.g., only title but no image), should the pipeline continue to the next plugin? → A: Title required only - once title is present, pipeline stops (valid metadata achieved).
- Q: What should be the timeout for metadata extraction? → A: 30 seconds total (fetch + parse).

## Architecture Notes

### Plugin Pipeline

The extraction system works as a simple ordered pipeline:

```
URL → Fetch HTML → Amazon → Shopify → LEGO → Smyths → OpenGraph → Result
```

Each plugin runs in order. Once a plugin returns a title, the pipeline stops. OpenGraph is always the last fallback.

**Plugin Order** (can be adjusted in code):

1. Amazon (domain-specific)
2. Shopify (generic for Shopify-based stores)
3. LEGO (domain-specific)
4. Smyths (domain-specific)
5. OpenGraph (fallback - works for most sites)

### Plugin Interface

Each plugin provides:

- `isApplicable(url: string): boolean` - checks if the plugin should handle this URL
- `extract(html: string, url: string): MetadataResult` - extracts metadata from fetched HTML

### Shared HTML Context

To avoid redundant HTTP requests, all plugins receive:

- The original URL
- Pre-fetched HTML content (fetched once at the start of the pipeline)

### Plugin Discovery

- Plugins are auto-discovered at startup from a designated plugins directory
- No manual registration required

### Testing New Domains

Before creating a new domain-specific plugin, first verify that Open Graph doesn't provide sufficient data.
