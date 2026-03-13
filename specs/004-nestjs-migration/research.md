# Research: NestJS Migration

**Feature**: Migrate from Fastify to NestJS  
**Date**: 2026-03-13

## Decisions Made

### NestJS Version

- **Decision**: Use NestJS 11.x (latest stable as of 2026-03-13)
- **Rationale**: Project requirement specifies newest NestJS version
- **Alternatives**: 10.x (previous stable) - rejected for version requirement

### NestJS Express vs Fastify Adapter

- **Decision**: Use `@nestjs/platform-express` with Express adapter
- **Rationale**: Standard NestJS approach, best ecosystem support, simpler middleware integration
- **Alternatives**: `@nestjs/platform-fastify` - rejected for full NestJS migration (not a hybrid approach)

### Testing Strategy

- **Decision**: Migrate Fastify-specific handler tests to NestJS controller/service tests using `@nestjs/testing`
- **Rationale**: Follow NestJS best practices; `TestBed` provides proper dependency injection testing
- **Alternatives**: Keep Fastify test setup with NestJS - rejected, not idiomatic

### Static File Serving

- **Decision**: Use NestJS built-in ServeStaticModule
- **Rationale**: Native NestJS approach, equivalent to FastifyStatic
- **Alternatives**: Express static middleware - ServeStaticModule is NestJS-native

### Authentication Guard

- **Decision**: Create NestJS Guard for API key authentication
- **Rationale**: Aligns with NestJS best practices (Guards for authorization)
- **Alternatives**: Middleware-based - Guards are more appropriate for route protection

### CORS Configuration

- **Decision**: Use NestJS CORS module configuration
- **Rationale**: Native NestJS CORS support via `@nestjs/common`
- **Alternatives**: Custom CORS middleware - unnecessary, native support sufficient

### Validation

- **Decision**: Use class-validator with DTOs (Data Transfer Objects)
- **Rationale**: NestJS standard for request validation, integrates with validation pipes
- **Alternatives**: Manual validation - rejected for type safety and NestJS conventions

---

_End of research_
