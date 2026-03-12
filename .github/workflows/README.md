# GitHub Actions Workflows

## Overview

This project uses GitHub Actions for CI/CD with a reusable workflow pattern.

## Workflows

### CI Workflow (`ci.yml`)

Runs on pull requests to `main` branch.

```
lint ──┐
       ├──► docker (load + test)
typecheck ┘
test ──┘
```

**Jobs:**

- `lint` - Runs ESLint
- `typecheck` - Runs TypeScript type checking
- `test` - Runs Vitest unit tests
- `docker` - Builds multi-platform Docker image (amd64, arm64) and tests container

### Release Workflow (`release.yml`)

Runs when a GitHub Release is published.

```
lint ──┐
       ├──► docker (push + test)
typecheck ┘
test ──┘
```

**Jobs:**

- Same as CI, plus:
- `docker` - Builds and pushes Docker image to ghcr.io

## Reusable Workflow (`shared.yml`)

Central workflow containing all jobs, called by both CI and Release workflows.

### Inputs

| Input                | Type    | Default | Description                             |
| -------------------- | ------- | ------- | --------------------------------------- |
| `run_docker`         | boolean | false   | Whether to run Docker build             |
| `run_docker_publish` | boolean | false   | Whether to push Docker image to ghcr.io |
| `version`            | string  | ''      | Version tag for Docker image            |

### Docker Behavior

| Scenario | `push` | `load` | Cache     |
| -------- | ------ | ------ | --------- |
| CI       | false  | true   | no        |
| Release  | true   | false  | yes (GHA) |

## Docker Image Tags

When a release is published, images are pushed with:

- `ghcr.io/thisisbenny/wishlist-app:{version}`
- `ghcr.io/thisisbenny/wishlist-app:v{version}`
- `ghcr.io/thisisbenny/wishlist-app:latest`

## Running Releases

Use npm scripts to create releases:

```bash
npm run release:patch  # 1.0.0 → 1.0.1
npm run release:minor  # 1.0.0 → 1.1.0
npm run release:major  # 1.0.0 → 2.0.0
npm run release:pre    # Create beta prerelease
```

These scripts:

1. Bump version in package.json
2. Create git tag
3. Push tag (triggers Release workflow)
4. Create GitHub Release via gh CLI
