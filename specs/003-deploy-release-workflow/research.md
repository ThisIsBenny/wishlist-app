# Research: Deployment and Release Workflow

**Feature**: GitHub Actions-based CI/CD for releases and Docker builds  
**Date**: 2026-03-12

## Research Tasks

### RT-001: GitHub Release Trigger

**Question**: How to trigger workflow on GitHub Release published?

**Findings**:

- GitHub Actions supports `release` event with `action: published`
- Works with releases created via UI or `gh release create`
- Event payload includes `release.tag_name` and `release.prerelease` boolean

**Decision**: Use `on: release: types: [published]` trigger

---

### RT-002: GitHub Container Registry (ghcr.io)

**Question**: How to authenticate and push to ghcr.io?

**Findings**:

- Use `docker/login-action@v3` with `registry: ghcr.io`
- Token: `github.actor` with `GITHUB_TOKEN` secret
- Image naming: `ghcr.io/OWNER/REPOSITORY:TAG`
- Visibility: Set to private or public in repo settings

**Decision**: Use `docker/login-action@v3` with `registry: ghcr.io`

---

### RT-003: Multi-Platform Docker Builds

**Question**: How to build for amd64 and arm64 in GitHub Actions?

**Findings**:

- Use `docker/setup-buildx-action` to enable multi-platform
- Use `docker/build-push-action` with `platforms: linux/amd64,linux/arm64`
- Requires QEMU for emulation: `docker/setup-qemu-action`

**Decision**: Use QEMU + buildx for multi-platform builds

---

### RT-004: SemVer Prerelease Handling

**Question**: How to detect prerelease versions in workflow?

**Findings**:

- Extract version from `package.json` using `jq` or Node.js
- Check if version contains `-` (e.g., `1.0.0-beta.1`)
- GitHub release object has `prerelease` boolean field

**Decision**: Use GitHub release's `prerelease` property to determine if `latest` tag should be applied

---

### RT-005: Build Test Without Push

**Question**: How to verify Docker image builds and starts without pushing?

**Findings**:

- Build image with `docker build`
- Run container with `docker run --rm -- detach` or short timeout
- Use health check or simple startup command verification
- Do NOT use `push: true` for build-test job

**Decision**: Run `docker build` + `docker run --rm` as separate build-test job

---

## Summary

All research tasks completed. No NEEDS CLARIFICATION markers remaining.

| Research Task            | Decision                                                |
| ------------------------ | ------------------------------------------------------- |
| RT-001: Release trigger  | `on: release: types: [published]`                       |
| RT-002: ghcr.io auth     | `docker/login-action@v3` with `registry: ghcr.io`       |
| RT-003: Multi-platform   | QEMU + buildx with `platforms: linux/amd64,linux/arm64` |
| RT-004: Prerelease check | Use release object's `prerelease` boolean               |
| RT-005: Build-test       | `docker build` + `docker run --rm` (no push)            |
