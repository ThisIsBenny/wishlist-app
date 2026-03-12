# Implementation Plan: Deployment and Release Workflow

**Branch**: `003-deploy-release-workflow` | **Date**: 2026-03-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-deploy-release-workflow/spec.md`

## Summary

Implement a new GitHub Actions-based CI/CD workflow that:

1. Runs lint, typecheck, and unit tests on every commit (main + feature branches)
2. Runs a build-test job that builds the Docker image and verifies it starts (without pushing) on every commit
3. Builds and pushes **multi-platform Docker images (amd64, arm64)** to GitHub Container Registry (ghcr.io) only when a GitHub Release is published
4. Supports SemVer versioning including prereleases (beta, rc)
5. Includes comprehensive workflow documentation

## Technical Context

**Language/Version**: YAML (GitHub Actions syntax)  
**Primary Dependencies**: GitHub Actions, Docker Buildx, GitHub Container Registry (ghcr.io)  
**Storage**: N/A  
**Testing**: Workflow syntax validation, manual trigger testing  
**Target Platform**: GitHub Actions, Linux containers (amd64, arm64)  
**Project Type**: CI/CD Infrastructure  
**Performance Goals**: Release workflow completes in under 15 minutes  
**Constraints**: Multi-platform Docker builds, GitHub release-based triggers  
**Scale**: Single workflow file with multiple jobs

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Gate                   | Status | Notes                                                                     |
| ---------------------- | ------ | ------------------------------------------------------------------------- |
| Test-First Development | N/A    | CI/CD workflows are infrastructure; testing via manual trigger validation |
| Strict TypeScript      | N/A    | YAML files - not applicable                                               |
| Component Composition  | N/A    | Not a Vue/frontend feature                                                |
| API-First Design       | N/A    | Internal CI/CD workflows                                                  |
| i18n First             | N/A    | Not user-facing                                                           |

**Result**: PASS - Constitution principles are designed for application code; CI/CD workflows are infrastructure and exempt from standard gates.

## Project Structure

### Documentation (this feature)

```text
specs/003-deploy-release-workflow/
├── plan.md              # This file
├── research.md           # Phase 0 output
├── data-model.md         # Phase 1 output (workflow entity definitions)
├── quickstart.md         # Phase 1 output (how to use)
├── contracts/            # Phase 1 output (if needed)
└── tasks.md              # Phase 2 output (not created by /speckit.plan)
```

### Source Code (repository root)

```text
.github/workflows/
├── ci.yml               # Existing CI workflow (lint, test)
├── validation.yml        # Existing validation workflow
├── ci-pre-release.yml    # Existing pre-release workflow
└── release.yml           # NEW - Release workflow for ghcr.io
```

**Structure Decision**: Adding new GitHub Actions workflow file `.github/workflows/release.yml`. Existing workflows will be consolidated/modified as needed.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| N/A       | N/A        | N/A                                  |

---

## Phase 0: Research

_See research.md for detailed findings_

### Key Decisions

| Decision                   | Rationale                                         | Alternatives Considered      |
| -------------------------- | ------------------------------------------------- | ---------------------------- |
| GitHub Release trigger     | User preference - easier than tag push            | Tag push, branch push        |
| ghcr.io registry           | User requirement - move from DockerHub            | DockerHub, ECR, self-hosted  |
| Multi-platform builds      | Support ARM deployments (M1/M2 Macs, ARM servers) | Single platform (amd64 only) |
| Build-test on every commit | Catch build issues early without pushing images   | Only on release              |

---

## Phase 1: Design

### Workflow Architecture

#### CI Workflow (for commits)

```yaml
# Triggers: push to main/feature branches
jobs:
  lint:
    runs: npm run lint, npm run typecheck
  test:
    runs: npm run test:unit:ci
  build-test:
    runs: docker build, docker run --rm (verify start)
    needs: [lint, test]
```

#### Release Workflow (for releases)

```yaml
# Triggers: release published
jobs:
  lint-test:
    runs: npm run lint, npm run typecheck, npm run test:unit:ci
  docker:
    builds for amd64, arm64
    pushes to ghcr.io
    tags: version, latest (if stable)
    needs: lint-test
```

### Data Flow

1. **Version Extraction**: Read from `package.json` → `version` field
2. **Release Detection**: GitHub event `release` with `action: published`
3. **Prerelease Check**: If version contains `-` (e.g., `-beta.1`), don't tag as `latest`
4. **Docker Tags**:
   - Stable: `v1.2.0`, `1.2.0`, `latest`
   - Prerelease: `v1.0.0-beta.1`, `v1.0.0-beta.1`

### Multi-Architecture Build Design

```
docker/setup-qemu-action@v3     → Enable ARM emulation
docker/setup-buildx-action@v3   → Enable multi-platform builds
docker/build-push-action@v5
  platforms: linux/amd64,linux/arm64
  push: true
  tags: ghcr.io/owner/repo:tag
```

- **QEMU**: Provides emulation for building ARM images on x86 runners
- **Buildx**: Creates manifest lists pointing to both architectures
- **Both architectures built in parallel** for faster completion
- **Result**: Single tag works for both amd64 and arm64 systems

---

## Phase 2: Planning

### Tasks Overview

1. Create `.github/workflows/release.yml` - Release workflow
2. Modify existing CI workflows to add build-test job
3. Update GitHub Actions to use ghcr.io instead of DockerHub
4. Add version handling for SemVer prereleases
5. Test workflows with dry-run / manual dispatch

### Key Entities

- **GitHub Release Event**: `release` with `action: published`
- **Version String**: From `package.json` `version` field
- **Docker Image**: `ghcr.io/OWNER/REPO:TAG`
- **Workflow Jobs**: lint, test, build-test, docker-build-push

---

## Next Steps

After `/speckit.plan`:

1. Run `/speckit.tasks` to generate implementation tasks
2. Implement workflow files
3. Test with manual workflow dispatch
4. Verify all acceptance scenarios from spec.md

**Generated Artifacts**:

- `/specs/003-deploy-release-workflow/plan.md` (this file)
- `/specs/003-deploy-release-workflow/research.md` (Phase 0)
- `/specs/003-deploy-release-workflow/data-model.md` (Phase 1)
- `/specs/003-deploy-release-workflow/quickstart.md` (Phase 1)
