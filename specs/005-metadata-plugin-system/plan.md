# Implementation Plan: Metadata Extraction Plugin System

**Branch**: `005-metadata-plugin-system` | **Date**: 2026-03-15 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-metadata-plugin-system/spec.md`

## Summary

Build a plugin system for URL metadata extraction in the NestJS backend. Multiple plugins can handle specific domains via an `isApplicable(url)` check. The system auto-discovers plugins at startup and executes them in a pipeline (domain-specific → generic → Open Graph fallback). The existing Amazon.de extraction logic is converted to a plugin, and new plugins can be added without modifying core code.

## Technical Context

**Language/Version**: TypeScript 5.7  
**Primary Dependencies**: open-graph-scraper, axios, cheerio, NestJS (existing)  
**Storage**: N/A  
**Testing**: Vitest (unit tests), NestJS Testing  
**Target Platform**: Linux server (NestJS backend)  
**Project Type**: NestJS service (backend API utility)  
**Performance Goals**: 30 seconds timeout per extraction  
**Constraints**: None  
**Scale/Scope**: Single backend service feature

## Constitution Check

| Gate                       | Status | Notes                                  |
| -------------------------- | ------ | -------------------------------------- |
| I. Test-First Development  | PASS   | Must write tests before implementation |
| II. Strict TypeScript      | PASS   | Explicit types, no implicit any        |
| III. Component Composition | N/A    | Backend service (not Vue)              |
| IV. API-First Design       | N/A    | Internal utility service               |
| V. Internationalization    | N/A    | No user-facing strings                 |

**GATE: Pass** - All applicable constitutional requirements met.

## Project Structure

### Documentation (this feature)

```text
specs/005-metadata-plugin-system/
├── plan.md              # This file
├── research.md          # Phase 0 output (N/A - no unknowns)
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # N/A - internal service
├── tasks.md             # Phase 2 output (/speckit.tasks)
└── checklists/
    └── requirements.md  # Specification quality
```

### Source Code (repository root)

```text
src/api/utils/
├── utils.service.ts          # Existing - uses plugin system
├── metadata-plugins/
│   ├── index.ts              # Plugin registry & pipeline runner
│   ├── base.plugin.ts        # Base plugin class (optional)
│   ├── fetch.ts              # HTML fetcher using undici
│   ├── types.ts              # TypeScript interfaces
│   ├── plugins/
│   │   ├── amazon.plugin.ts  # Domain-specific: Amazon
│   │   ├── shopify.plugin.ts # Generic: Shopify-based stores
│   │   ├── lego.plugin.ts    # Domain-specific: LEGO
│   │   ├── smyths.plugin.ts  # Domain-specific: Smyths Toys
│   │   └── opengraph.plugin.ts # Generic fallback
│   └── __tests__/            # Unit & integration tests
```

**Structure Decision**: Plugins live in `src/api/utils/metadata-plugins/` directory. Single backend service modification - no frontend or additional projects needed.

## Phase 0: Research

No research needed - all technical details are known:

- Existing code in `utils.service.ts` provides the pattern to follow
- Dependencies (open-graph-scraper, axios, cheerio) already in use
- Plugin pattern is straightforward implementation pattern

## Phase 1: Design & Contracts

### Data Model

**MetadataResult** (existing, to be reused):

```typescript
interface MetadataResult {
  title: string
  description: string
  imageSrc: string
}
```

**Plugin Interface**:

```typescript
interface MetadataPlugin {
  readonly name: string
  readonly domains: string[] // For documentation/discovery
  isApplicable(url: string): boolean
  extract(html: string, url: string): MetadataResult
}
```

**Pipeline Context** (shared between plugins):

```typescript
interface PipelineContext {
  url: string
  html: string
}
```

### Contracts

No external contracts - this is an internal utility service used by the wishlist API.

### Quickstart

1. Add new plugin to `src/api/utils/metadata-plugins/plugins/`
2. Export default plugin instance implementing `MetadataPlugin` interface
3. Plugin auto-discovered at next startup
4. Pipeline runs domain-specific → generic → fallback

## Complexity Tracking

| Violation | Why Needed                 | Simpler Alternative Rejected Because |
| --------- | -------------------------- | ------------------------------------ |
| None      | Feature is straightforward | -                                    |

## Next Steps

Proceed to `/speckit.tasks` to create task breakdown for implementation.
