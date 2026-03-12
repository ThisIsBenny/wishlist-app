# Quickstart: Deployment and Release Workflow

**Feature**: GitHub Actions CI/CD for releases  
**Date**: 2026-03-12

## Overview

This feature adds automated CI/CD workflows to:

1. Run lint, typecheck, and tests on every commit
2. Build and test Docker images on every commit (without pushing)
3. Build and push multi-platform Docker images to ghcr.io when a GitHub Release is published

## Architecture

### CI Pipeline (Every Commit)

Triggers on: push to `main` or feature branches

Jobs:

1. **lint** - Runs `npm run lint` and `npm run typecheck`
2. **test** - Runs `npm run test:unit:ci`
3. **build-test** - Builds Docker image and verifies it starts (no push)

### Release Workflow (On Release)

Triggers on: GitHub Release published

Jobs:

1. **lint-test** - Runs lint, typecheck, and unit tests
2. **docker** - Builds multi-platform images (amd64, arm64), pushes to ghcr.io

## Multi-Architecture Support

### Supported Platforms

| Platform    | Architecture | Use Cases                                           |
| ----------- | ------------ | --------------------------------------------------- |
| linux/amd64 | x86_64       | Standard servers, cloud VMs, older Macs             |
| linux/arm64 | ARM v8       | Apple Silicon (M1/M2/M3), ARM servers, Raspberry Pi |

### Build Process

The workflow uses Docker Buildx with QEMU emulation to build for both architectures:

```yaml
- uses: docker/setup-qemu-action@v3 # Enable ARM emulation
- uses: docker/setup-buildx-action@v3 # Enable multi-platform builds
- uses: docker/build-push-action@v5
  with:
    platforms: linux/amd64,linux/arm64 # Build for both
```

### Image Manifests

When pushing multi-platform images, GitHub creates a manifest that points to both architectures:

```
ghcr.io/thisisbenny/wishlist-app:1.2.0
├── linux/amd64 (x86_64)
└── linux/arm64 (ARM v8)
```

Pulling the image automatically selects the correct architecture for your system.

### Testing Multi-Arch Images Locally

```bash
# Pull for specific architecture
docker pull --platform linux/amd64 ghcr.io/thisisbenny/wishlist-app:1.2.0
docker pull --platform linux/arm64 ghcr.io/thisisbenny/wishlist-app:1.2.0

# Inspect manifest
docker manifest inspect ghcr.io/thisisbenny/wishlist-app:1.2.0
```

## Usage

### Trigger a Release

1. Update version in `package.json` (e.g., `1.2.0` or `1.0.0-beta.1`)
2. Create a release via GitHub UI or CLI:

```bash
# Using GitHub CLI
gh release create 1.2.0 --title "Version 1.2.0" --notes "Release notes here"
```

3. The workflow will:
   - Run lint/tests
   - Build Docker images for amd64 and arm64
   - Push to ghcr.io (e.g., `ghcr.io/thisisbenny/wishlist-app:1.2.0`)
   - If stable: also tag as `latest`

### Image Tags

| Release Type              | Tags Applied                    |
| ------------------------- | ------------------------------- |
| Stable (1.2.0)            | `1.2.0`, `v1.2.0`, `latest`     |
| Prerelease (1.0.0-beta.1) | `1.0.0-beta.1`, `v1.0.0-beta.1` |

### Manual Workflow Dispatch

You can manually trigger workflows from GitHub Actions tab:

- CI workflow: Test lint, tests, and build without releasing
- Release workflow: Re-run a failed release

## Configuration

### Required Setup

1. **Enable ghcr.io**:
   - Go to Repository Settings → Packages
   - Enable Container registry
   - Set visibility (public or private)

2. **No additional secrets needed**:
   - `GITHUB_TOKEN`: Automatically available
   - Authentication handled by `docker/login-action`

### Dockerfile Requirements

Ensure your Dockerfile supports multi-platform builds:

- Use base images available for both architectures (node:22-slim works)
- Avoid architecture-specific dependencies

## Troubleshooting

### Release workflow doesn't trigger

- Ensure release is **published** (not draft)
- Check workflow file is in `.github/workflows/`

### Docker build fails

- Check Dockerfile exists and is valid
- Verify Node.js version matches (22.x)
- Ensure QEMU is set up in workflow

### Image not pushed

- Verify ghcr.io credentials are configured
- Check if release is a prerelease (prereleases don't get `latest` tag)

### Multi-arch build fails

- Check `docker/setup-qemu-action` is included
- Some runners may not support emulation; use `ubuntu-latest` or `ubuntu-22.04`

---

## Next Steps

Run `/speckit.tasks` to generate implementation tasks for this feature.
