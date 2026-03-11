---
description: 'Task list for upgrading to Node.js v22 LTS'
---

# Tasks: Upgrade to NodeJS v22 LTS

**Input**: Design documents from `/specs/001-nodejs-22-upgrade/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Note**: This is a configuration-only upgrade. No source code changes. User stories can be implemented in parallel as they update different configuration files independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Configuration Updates (All User Stories)

**Purpose**: Update all configuration files to use Node.js v22.22.1

All configuration updates can happen in parallel since they are independent files.

### Configuration Updates

- [x] T001 [P] [US1] Update .nvmrc to specify Node.js v22.22.1
- [x] T002 [P] [US1] Update package.json engines field to require Node.js >= 22.22.1
- [x] T003 [P] [US2] Update GitHub Actions workflow to use Node.js v22.22.1
- [x] T004 [P] [US3] Update Dockerfile to use node:22.22.1-slim base image

---

## Phase 2: Validation (User Story 4)

**Purpose**: Verify all tests pass with Node.js v22.22.1

- [x] T005 Install Node.js v22.22.1 via nvm and run `nvm use`
- [x] T006 [US4] Run npm install to reinstall dependencies with Node v22.22.1
- [x] T007 [US4] Run unit tests with npm run test:unit:ci
- [x] T008 [US4] Run E2E tests with npm run test:e2e

**Checkpoint**: All tests pass with Node.js v22.22.1

---

## Phase 3: Documentation Updates

**Purpose**: Update documentation to reflect Node.js 22 requirement

- [x] T009 [P] Update README.md with Node.js v22.22.1 requirement
- [x] T010 [P] Update DEVELOPER.md with Node.js v22.22.1 requirement
- [x] T011 [P] Update AGENTS.md Node.js version reference

---

## Phase 4: Polish & Verification

**Purpose**: Final verification and cleanup

- [x] T012 Verify .nvmrc contains Node.js v22.22.1
- [x] T013 Verify package.json engines field requires >= 22.22.1
- [x] T014 Verify CI workflow uses Node.js v22.22.1
- [x] T015 Verify Dockerfile uses node:22.22.1-slim
- [x] T016 Commit all changes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Configuration Updates (Phase 1)**: Can run in parallel - all files independent
- **Validation (Phase 2)**: Depends on Phase 1 completion - runs tests on updated config
- **Documentation (Phase 3)**: Can run in parallel with Phase 2
- **Polish (Phase 4)**: Depends on Phases 1-3 completion

### User Story Dependencies

- **User Story 1 (Developer Environment)**: T001, T002 - Blocks local development
- **User Story 2 (CI/CD)**: T003 - Blocks CI execution
- **User Story 3 (Docker)**: T004 - Blocks production deployment
- **User Story 4 (Dependency Compatibility)**: T005-T008 - Validates all above work

### Parallel Opportunities

- All Phase 1 tasks (T001-T004) can run in parallel
- All Phase 3 documentation tasks (T009-T011) can run in parallel
- Configuration updates can proceed before validation

---

## Implementation Strategy

### Recommended Order

1. **Start with configuration updates (Phase 1)** - T001-T004 in parallel
2. **Then validation (Phase 2)** - Install Node 22, run tests
3. **Documentation (Phase 3)** - Update docs
4. **Final verification (Phase 4)** - Confirm all changes

### MVP Scope

This upgrade has no traditional MVP - all configuration files must be updated together to ensure consistency. The "MVP" is the complete configuration update across all files.

### Incremental Delivery

1. Update configuration files (T001-T004)
2. Validate with tests (T005-T008)
3. Update documentation (T009-T011)
4. Final verification (T012-T016)

---

## Summary

- **Total Tasks**: 16
- **User Story 1 (Developer Environment)**: 2 tasks (T001, T002)
- **User Story 2 (CI/CD)**: 1 task (T003)
- **User Story 3 (Docker)**: 1 task (T004)
- **User Story 4 (Testing)**: 4 tasks (T005-T008)
- **Documentation**: 3 tasks (T009-T011)
- **Verification**: 5 tasks (T012-T016)
- **Parallel Opportunities**: 7 tasks marked [P]
- **Independent Test Criteria**: Each user story is independently verifiable
  - US1: `nvm use` activates Node v22.22.1, `node --version` shows v22.22.1
  - US2: CI workflow runs on Node v22.22.1, tests pass
  - US3: Docker container runs Node v22.22.1
  - US4: All unit and E2E tests pass
