# Data Model: Deployment and Release Workflow

**Feature**: CI/CD Workflow Entities  
**Date**: 2026-03-12

## Entities

### Release Event

| Field              | Type    | Description                        |
| ------------------ | ------- | ---------------------------------- |
| action             | string  | Trigger action (e.g., "published") |
| release.tag_name   | string  | Version tag (e.g., "v1.2.0")       |
| release.name       | string  | Release title                      |
| release.body       | string  | Release notes/changelog            |
| release.prerelease | boolean | Whether release is a prerelease    |
| release.html_url   | string  | URL to release page                |

### Docker Image

| Field      | Type     | Description                                                 |
| ---------- | -------- | ----------------------------------------------------------- |
| registry   | string   | Container registry (ghcr.io)                                |
| owner      | string   | Repository owner                                            |
| repository | string   | Repository name                                             |
| version    | string   | Full version (e.g., "1.2.0")                                |
| tags       | string[] | Image tags to apply                                         |
| platforms  | string[] | Target architectures (e.g., ["linux/amd64", "linux/arm64"]) |

### Multi-Architecture Image

| Field         | Type           | Description                                       |
| ------------- | -------------- | ------------------------------------------------- |
| manifest      | object         | Image manifest referencing multiple architectures |
| architectures | Architecture[] | List of built architectures                       |
| digest        | string         | Unique image digest                               |

### Architecture

| Field        | Type   | Description                               |
| ------------ | ------ | ----------------------------------------- |
| os           | string | Operating system (e.g., "linux")          |
| architecture | string | CPU architecture (e.g., "amd64", "arm64") |
| variant      | string | Variant (e.g., "v8" for ARM)              |

### Workflow Configuration

| Field   | Type   | Description                    |
| ------- | ------ | ------------------------------ |
| trigger | object | Workflow trigger conditions    |
| jobs    | object | Workflow jobs and dependencies |
| env     | object | Environment variables          |

## State Transitions

### Release Workflow States

```
draft → published → (workflow triggered)
                          ↓
                    lint-test passes
                          ↓
                    docker build & push
                          ↓
                    complete / failed
```

---

## Validation Rules

1. Version MUST be valid SemVer format (major.minor.patch or major.minor.patch-prerelease)
2. Docker image tags MUST follow registry naming conventions
3. Workflow jobs MUST have dependency ordering (lint-test before docker)
4. Prerelease versions MUST NOT be tagged as `latest`
5. Multi-arch images MUST include both amd64 and arm64 architectures

---

## Relationships

- **Release Event** triggers → **Workflow**
- **Workflow** builds → **Docker Image**
- **Docker Image** contains → **Multi-Architecture Image**
- **Multi-Architecture Image** references → **Architecture**
- **Docker Image** published to → **ghcr.io Registry**
