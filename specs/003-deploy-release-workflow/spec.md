# Feature Specification: Deployment and Release Workflow

**Feature Branch**: `003-deploy-release-workflow`  
**Created**: 2026-03-12  
**Status**: Draft  
**Input**: User description: "new Deployment and Release workflow"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - CI Pipeline for Every Commit (Priority: P1)

A maintainer wants every code change to go through automated quality checks including linting, testing, and a build test that verifies the Docker image can be built and started.

**Why this priority**: Ensures code quality and catch build issues early before release.

**Independent Test**: Can be tested by pushing any commit and verifying lint, tests, and build-test jobs all pass.

**Acceptance Scenarios**:

1. **Given** a developer pushes a commit to a feature branch, **When** the workflow triggers, **Then** it runs lint and unit tests.
2. **Given** a developer pushes a commit, **When** the workflow runs, **Then** it builds the Docker image and verifies it can start successfully (without pushing to registry).
3. **Given** any of these jobs fail, **When** they fail, **Then** the commit is marked as failing in GitHub.

---

### User Story 2 - Automated Production Release (Priority: P1)

A maintainer wants to create and publish a new production release with version bump, Docker images to ghcr.io, using GitHub Releases.

**Why this priority**: The core of the feature - enables the team to ship software reliably and consistently.

**Independent Test**: Can be tested by creating a GitHub Release (via UI or `gh release create`) and verifying Docker images are pushed to ghcr.io.

**Acceptance Scenarios**:

1. **Given** maintainer creates a new GitHub Release with version (e.g., "1.2.0"), **When** the release is published, **Then** the workflow runs lint, tests, builds Docker images for all platforms (amd64, arm64), and pushes to ghcr.io.
2. **Given** maintainer creates a prerelease (e.g., "1.0.0-beta.1"), **When** published, **Then** the workflow builds and pushes the image with the full prerelease tag (e.g., ghcr.io/thisisbenny/wishlist-app:1.0.0-beta.1).
3. **Given** the release workflow fails, **When** the failure occurs, **Then** the maintainer receives a GitHub Actions failure notification.

---

### User Story 3 - Version Management (Priority: P2)

A maintainer wants clear, consistent versioning that follows Semantic Versioning (SemVer) conventions.

**Why this priority**: Ensures predictable release versioning and prevents version confusion.

**Independent Test**: Can be tested by checking that version numbers follow SemVer format (major.minor.patch).

**Acceptance Scenarios**:

1. **Given** a new release, **When** the version is determined from package.json, **Then** the version follows SemVer format.
2. **Given** a stable release (no prerelease suffix), **When** published, **Then** the image is tagged as both version and `latest`.
3. **Given** the workflow extracts version, **When** parsing version, **Then** it handles prerelease versions correctly and does NOT tag them as `latest`.

---

### User Story 4 - Multi-Platform Docker Images (Priority: P2)

A maintainer wants Docker images built for multiple architectures to support both x64 and ARM deployments.

**Why this priority**: Enables deployment on various infrastructure including Apple Silicon (M1/M2) Macs and ARM servers.

**Independent Test**: Can be tested by verifying both linux/amd64 and linux/arm64 images are pushed to the registry.

**Acceptance Scenarios**:

1. **Given** a release trigger, **When** building Docker images, **Then** images are built for linux/amd64 and linux/arm64 platforms.
2. **Given** multi-platform build, **When** complete, **Then** all platform images are available in ghcr.io with the same tag.

---

### Edge Cases

- What happens when version in package.json is invalid or missing?
- How does system handle rate limiting from Docker registry?
- What happens when Docker build fails partway through?
- How are secrets managed for Docker registry authentication?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST trigger release workflow when a new GitHub Release is published (via UI or `gh release create`).
- **FR-002**: System MUST run lint, typecheck, and unit tests as part of every commit workflow (main and feature branches).
- **FR-003**: System MUST run a build test job that builds the Docker image and verifies it can start successfully (without pushing) on every commit.
- **FR-004**: System MUST build and push Docker images to GitHub Container Registry (ghcr.io) for all supported platforms (amd64, arm64) ONLY when triggered by a GitHub Release.
- **FR-005**: System MUST extract version from package.json and use it for Docker image tags and GitHub release.
- **FR-006**: System MUST handle SemVer prerelease versions (e.g., 1.0.0-beta.1, 1.0.0-rc.1) correctly, tagging images with the full version string.
- **FR-007**: System MUST tag the latest stable release as `latest` in addition to the version tag.
- **FR-008**: System MUST fail the workflow if any step (lint, test, build test, push) fails, preventing partial releases.

### Key Entities _(include if data)_

- **Release Version**: Semantic version string from package.json (e.g., "1.2.0", "1.0.0-beta.1")
- **Docker Image**: Container image in ghcr.io with version tags (e.g., ghcr.io/thisisbenny/wishlist-app:1.2.0, ghcr.io/thisisbenny/wishlist-app:latest)
- **GitHub Release**: GitHub release object with tag, title, body (changelog), and assets

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Maintainers can trigger a complete release by creating a GitHub Release, reducing manual steps to zero.
- **SC-002**: Release workflow completes in under 15 minutes from tag push to Docker image availability.
- **SC-003**: 100% of production releases include successful lint, typecheck, and test passes before Docker images are built.
- **SC-004**: Docker images are available for both linux/amd64 and linux/arm64 architectures within 10 minutes of workflow start.

## Clarifications

### Session 2026-03-12

- Q: Release trigger → A: GitHub Release (kann auch über `gh release create` getriggert werden)
- Q: Build-Test → A: Bei jedem Commit (main, feature branches)

## Assumptions

- GitHub Container Registry (ghcr.io) credentials are configured in repository settings
- Repository already has a Dockerfile that produces a working production image
- Semantic Versioning is used in package.json
- GitHub Actions workflow files will be placed in .github/workflows/ directory
- Multi-platform Docker builds require QEMU and docker/setup-buildx-action
