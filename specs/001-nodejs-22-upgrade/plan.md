# Implementation Plan: Upgrade to NodeJS v22 LTS

**Branch**: `001-nodejs-22-upgrade` | **Date**: 2026-03-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-nodejs-22-upgrade/spec.md`

## Summary

Upgrade the project runtime from Node.js v18.18.0 to Node.js v22 LTS. This involves updating configuration files (.nvmrc, package.json engines, CI workflows, Docker) and validating that all tests pass with the new runtime. No application code changes required.

## Technical Context

**Language/Version**: Node.js v22.22.1 (upgrading from v18.18.0)  
**Primary Dependencies**: npm packages (same as current, no changes)  
**Storage**: N/A (configuration-only change)  
**Testing**: Vitest (unit), Playwright (E2E) - same as current  
**Target Platform**: Linux server, Docker container  
**Project Type**: Full-stack web application (Vue 3 + Fastify)  
**Performance Goals**: N/A - runtime upgrade, no performance changes expected  
**Constraints**: Must maintain full backward compatibility; all existing tests must pass  
**Scale/Scope**: Configuration file updates across .nvmrc, package.json, GitHub Actions workflows, Dockerfile

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                     | Status | Notes                                                  |
| ----------------------------- | ------ | ------------------------------------------------------ |
| I. Test-First Development     | PASS   | Upgrade must pass all existing tests (unit + E2E)      |
| II. Strict TypeScript         | N/A    | No code changes, TypeScript version inherited from npm |
| III. Component Composition    | N/A    | No component changes                                   |
| IV. API-First Design          | N/A    | No API changes                                         |
| V. Internationalization First | N/A    | No i18n changes                                        |

**Gate Decision**: All applicable gates pass. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/001-nodejs-22-upgrade/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

This is a configuration-only change. No modifications to source code structure.

```text
# Files to be modified (configuration only)
.nvmrc                   # Update Node version
package.json             # Update engines field
.github/workflows/      # Update CI Node version
Dockerfile               # Update base image
README.md                # Update documentation
DEVELOPER.md            # Update documentation
```

**Structure Decision**: No source code changes. Configuration files only (.nvmrc, package.json, GitHub Actions, Dockerfile, docs).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No complexity violations. This is a straightforward version upgrade with no architectural changes.

---

# Phase 0: Research

This is a Node.js version upgrade. There are no NEEDS CLARIFICATION items - all technical details are known:

- Node.js 22.x is the current LTS release
- Project uses standard npm workflow
- CI/CD uses GitHub Actions
- Docker is used for deployment

## Research Findings

### Node.js 22 Upgrade Best Practices

- Use `nvm install 22` to install, `nvm use 22` to activate
- Update .nvmrc to specify exact version (e.g., `v22.22.1`)
- Update package.json engines field: `"node": ">=22.0.0"`
- Update GitHub Actions to use `actions/setup-node@v4` with `node-version: 22`
- Update Dockerfile to use `node:22-slim` or `node:22-alpine`
- Run full test suite to verify compatibility

**Decision**: Use Node.js 22.x LTS (latest stable within 22.x line)
**Rationale**: Provides latest features and security fixes while maintaining stability
**Alternatives considered**: Node.js 23 (unstable), staying on Node 18 (EOL in 2027)

---

# Phase 1: Design & Contracts

## Data Model

No data model changes. This is a configuration-only upgrade.

## Contracts

No external contracts. This is an internal infrastructure change.

## Quickstart

The quickstart.md in the repository root will need a note about Node 22 requirement. This is documented in FR-007.

---

## Phase 1 Complete

- research.md: Created (inlined above)
- data-model.md: N/A (configuration-only)
- contracts/: N/A (no external interfaces)
- quickstart.md: Updates to existing docs
- Agent context: To be updated

**Constitution Check Re-evaluation**: All gates still pass after design review.
