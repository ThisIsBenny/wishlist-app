# Tasks: Deployment and Release Workflow

**Feature**: Deployment and Release Workflow  
**Branch**: `003-deploy-release-workflow`  
**Generated**: 2026-03-12

## Overview

This feature adds automated CI/CD workflows with:

- CI: Lint, tests, and build-test on every commit
- Release: Multi-platform Docker builds pushed to ghcr.io on GitHub Release
- Version: SemVer with prerelease support and latest tag

## Task Summary

| Phase     | Description                      | Tasks  |
| --------- | -------------------------------- | ------ |
| Phase 1   | Setup & Configuration            | 4      |
| Phase 2   | User Story 1: CI Pipeline        | 5      |
| Phase 3   | User Story 2-4: Release Workflow | 9      |
| Phase 4   | Polish & Testing                 | 3      |
| **Total** |                                  | **21** |

---

## Phase 1: Setup & Configuration

Setup tasks for GitHub Actions and container registry configuration.

- [ ] T001 Configure GitHub Container Registry (ghcr.io) visibility in repository settings
- [x] T002 Create .github/workflows/release.yml with basic structure (on: release trigger)
- [x] T003 Update existing .github/workflows/ci.yml to add build-test job
- [x] T004 Verify existing workflow files are syntactically valid

---

## Phase 2: User Story 1 - CI Pipeline for Every Commit

**Goal**: Every commit runs lint, tests, and a build-test that verifies Docker can build and start (without pushing)

**Independent Test**: Push a commit and verify lint, test, and build-test jobs all pass

### Implementation Tasks

- [x] T005 [US1] Add lint job to .github/workflows/ci.yml (runs npm run lint and npm run typecheck)
- [x] T006 [US1] Add test job to .github/workflows/ci.yml (runs npm run test:unit:ci)
- [x] T007 [P] [US1] Add build-test job to .github/workflows/ci.yml (docker build, docker run --rm -- detach to verify start)
- [x] T008 [US1] Configure build-test job to depend on [lint, test] jobs (needs: [lint, test])
- [ ] T009 [US1] Test CI workflow by pushing a commit to verify all jobs run successfully

---

## Phase 3: User Story 2, 3, 4 - Release Workflow

**Goal**: Build and push multi-platform Docker images to ghcr.io when GitHub Release is published

**Independent Test**: Create a GitHub Release and verify Docker images are pushed to ghcr.io with correct tags

### Implementation Tasks

- [x] T010 [P] [US2] Add lint-test job to .github/workflows/release.yml
- [x] T011 [P] [US3] Extract version from package.json using GitHub script (jq or Node.js)
- [x] T012 [US3] Implement prerelease detection (check if version contains "-")
- [x] T013 [US4] Add docker/setup-qemu-action for ARM emulation
- [x] T014 [US4] Add docker/setup-buildx-action for multi-platform builds
- [x] T015 [US4] Add docker/build-push-action with platforms: linux/amd64,linux/arm64
- [x] T016 [US4] Configure docker/login-action with registry: ghcr.io

### Tagging Strategy Tasks

- [x] T017 [US3] Generate Docker image tags: version (e.g., 1.2.0), v-version (e.g., v1.2.0), latest (if stable, NOT prerelease)
- [x] T018 [P] [US3] Add logic to NOT tag prerelease versions as "latest"
- [x] T018b [P] [US3] Add error handling for invalid or missing version in package.json (fail workflow with clear message)

---

## Phase 4: Polish & Testing

Final testing and documentation updates.

- [ ] T019 Test release workflow by creating a test release (dry-run or test version like 0.0.1-test)
- [ ] T020 Verify multi-platform images in ghcr.io (check both amd64 and arm64 available)
- [x] T021 Update AGENTS.md with new workflow documentation

---

## Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (US1 - CI Pipeline)
    ↓
Phase 3 (US2-4 - Release Workflow)  ← Can start after Phase 1, independent of US1 completion
    ↓
Phase 4 (Polish)
```

---

## Parallel Execution Opportunities

### Independent Tasks (can run in parallel)

- T002, T003, T004 (Phase 1 setup - different files)
- T010, T011, T012 (Phase 3 - different job configurations)
- T013, T014 (Phase 3 - setup actions, independent)
- T017, T018 (Phase 3 - tagging logic, independent)

### Dependent Task Chains

1. **CI Pipeline**: T005 → T006 → T007 → T008 → T009
2. **Release Workflow**: T010 → T011/T012 → T013-T016 → T017/T018 → T019

---

## Implementation Strategy

### MVP Scope (User Story 1 - CI Pipeline)

The CI pipeline (Phase 2) alone provides value by ensuring every commit can build a working Docker image. This can be delivered first.

### Incremental Delivery

1. **Iteration 1**: Phase 1 + Phase 2 (CI pipeline working)
2. **Iteration 2**: Phase 3 core (lint-test + docker build)
3. **Iteration 3**: Phase 3 full (multi-platform, tagging, prerelease handling)
4. **Iteration 4**: Phase 4 (testing, polish)

---

## File Targets

| Task  | File                          | Description                       |
| ----- | ----------------------------- | --------------------------------- |
| T002  | .github/workflows/release.yml | New release workflow file         |
| T003  | .github/workflows/ci.yml      | Add build-test job                |
| T005  | .github/workflows/ci.yml      | Add/modify lint job               |
| T006  | .github/workflows/ci.yml      | Add/modify test job               |
| T007  | .github/workflows/ci.yml      | Add build-test job                |
| T008  | .github/workflows/ci.yml      | Configure job dependencies        |
| T010  | .github/workflows/release.yml | lint-test job                     |
| T011  | .github/workflows/release.yml | Version extraction                |
| T012  | .github/workflows/release.yml | Prerelease detection              |
| T013  | .github/workflows/release.yml | QEMU setup                        |
| T014  | .github/workflows/release.yml | Buildx setup                      |
| T015  | .github/workflows/release.yml | Docker build-push                 |
| T016  | .github/workflows/release.yml | ghcr.io login                     |
| T017  | .github/workflows/release.yml | Tag generation                    |
| T018  | .github/workflows/release.yml | Latest tag logic                  |
| T018b | .github/workflows/release.yml | Version validation/error handling |
| T019  | .github/workflows/release.yml | Release testing                   |
| T020  | ghcr.io                       | Verify multi-arch images          |
| T021  | AGENTS.md                     | Documentation update              |

---

## Verification Checklist

- [ ] All tasks have valid Task IDs (T001-T021)
- [ ] All US story tasks have [US#] label
- [ ] All parallel tasks marked with [P]
- [ ] All file paths are absolute or clear relative paths
- [ ] Each user story has independently testable criteria
- [ ] Phase dependencies are correctly ordered
