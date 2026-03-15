# Tasks: Metadata Extraction Plugin System

**Feature**: Metadata Extraction Plugin System  
**Branch**: `005-metadata-plugin-system`  
**Input**: Feature specification from `/specs/005-metadata-plugin-system/spec.md`

## Phase 1: Setup

- [x] T001 Create plugin directory structure `src/api/utils/metadata-plugins/`
- [x] T002 [P] Create types file `src/api/utils/metadata-plugins/types.ts` with MetadataPlugin, MetadataResult, PipelineContext interfaces
- [x] T003 Create base plugin interface `src/api/utils/metadata-plugins/base.plugin.ts`

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T004 Create plugin registry `src/api/utils/metadata-plugins/index.ts` with auto-discovery and pipeline runner
- [x] T005 [P] Implement HTML fetcher utility with 30s timeout in `src/api/utils/metadata-plugins/fetch.ts`
- [x] T006 Create empty plugin module to verify auto-discovery works

## Phase 3: User Story 1 - Domain-Specific Metadata Extraction (Priority: P1)

**Goal**: Extract metadata from domain-specific sites (Amazon) using custom plugins  
**Independent Test**: Provide Amazon URL → verify title/description/image returned  
**Story Dependencies**: None (can be implemented independently)

### Tests

- [x] T007 [US1] Write unit tests for Amazon plugin in `src/api/utils/metadata-plugins/__tests__/amazon.plugin.test.ts`
- [x] T008 [US1] Write unit tests for plugin registry in `src/api/utils/metadata-plugins/__tests__/registry.test.ts`
- [x] T009 [US1] Write unit tests for Shopify plugin in `src/api/utils/metadata-plugins/__tests__/shopify.plugin.test.ts`

### Implementation

- [x] T010 [P] [US1] Create Amazon plugin `src/api/utils/metadata-plugins/plugins/amazon.plugin.ts` (convert existing logic)
- [x] T011 [P] [US1] Create Shopify generic plugin `src/api/utils/metadata-plugins/plugins/shopify.plugin.ts` (runs if domain-specific didn't match, before OG)
- [x] T012 [US1] Create OpenGraph fallback plugin `src/api/utils/metadata-plugins/plugins/opengraph.plugin.ts`

## Phase 4: User Story 2 - Plugin Registration and Discovery (Priority: P2)

**Goal**: Auto-discover plugins at startup without manual registration  
**Independent Test**: Add new plugin file → verify it's available on next startup  
**Story Dependencies**: Phase 3 (T004-T006 must complete first)

### Tests

- [x] T013 [US2] Write unit tests for auto-discovery in `src/api/utils/metadata-plugins/__tests__/discovery.test.ts`

### Implementation

- [x] T014 [US2] Implement auto-discovery using NestJS module imports or glob pattern in `src/api/utils/metadata-plugins/index.ts`

## Phase 5: User Story 3 - Fallback to Default Extractor (Priority: P3)

**Goal**: Use Open Graph as fallback when no domain-specific plugin matches  
**Independent Test**: Provide unsupported domain URL → verify OG extraction works  
**Story Dependencies**: Phase 3 (T012 OpenGraph plugin must exist)

### Tests

- [x] T015 [US3] Write integration test for full pipeline in `src/api/utils/metadata-plugins/__tests__/pipeline.test.ts`
- [x] T016 [US3] Write API integration tests for UtilsService in `src/api/utils/__tests__/utils.service.test.ts`

### Implementation

- [x] T017 [US3] Wire plugin system into UtilsService `src/api/utils/utils.service.ts`

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T018 Run lint and typecheck: `npm run lint && npm run typecheck`
- [x] T019 Run all unit tests: `npm run test:unit`
- [x] T020 Run API tests: `npm run test:api`

## Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational)
    ↓
Phase 3 (US1) ← T013-T014 (depends on T004-T006)
    ↓
Phase 4 (US2)
    ↓
Phase 5 (US3)
    ↓
Phase 6 (Polish)
```

## Pipeline Order

```
URL → Fetch HTML → Domain-Specific Plugins (Amazon)
    → Generic Plugins (Shopify)
    → OpenGraph Fallback
    → Return result
```

Note: Shopify plugin runs BEFORE OpenGraph. If Shopify finds data, pipeline stops. If Shopify also fails, OpenGraph is last resort.

## Parallel Opportunities

- **Phase 2**: T002, T003, T005, T006 can run in parallel (different files, no dependencies)
- **Phase 3**: T010, T011, T012 can run in parallel (different plugin files)
- **Phase 3 Tests**: T007, T008, T009 can run in parallel with implementation

## Implementation Strategy

### MVP Scope (User Story 1)

The MVP is User Story 1 - Domain-Specific Metadata Extraction:

- T001-T006: Setup and foundational
- T007-T012: Amazon + Shopify + OpenGraph plugins + tests
- T017: Wire into UtilsService

This delivers the core value: users can extract metadata from Amazon URLs with improved accuracy, with Shopify as generic fallback before OpenGraph.

### Incremental Delivery

1. **Increment 1** (MVP): Core plugin system with Amazon + Shopify + OG fallback
2. **Increment 2**: Auto-discovery (US2)
3. **Increment 3**: Full pipeline integration (US3)

## Summary

| Metric               | Value |
| -------------------- | ----- |
| Total Tasks          | 20    |
| Setup Phase          | 3     |
| Foundational Phase   | 3     |
| User Story 1         | 9     |
| User Story 2         | 2     |
| User Story 3         | 4     |
| Polish Phase         | 3     |
| Parallelizable Tasks | 7     |
| Test Tasks           | 7     |

## Independent Test Criteria

- **US1**: Given Amazon URL → returns product title, description, image
- **US2**: Given new plugin in plugins/ directory → auto-discovered at startup
- **US3**: Given unsupported domain URL → returns OG metadata (or empty)
