# Architecture

## Monorepo Structure

```
dsk-packages/
├── .github/             # CI/CD workflows, issue and PR templates
├── .vscode/             # Editor settings and recommended extensions
├── docs/                # Documentation
├── examples/            # Usage examples for packages
├── packages/            # Published npm packages
├── scripts/             # Build and utility scripts
├── .npmrc               # pnpm configuration
├── .prettierrc          # Prettier formatting rules
├── eslint.config.mjs    # ESLint flat configuration
├── package.json         # Root workspace manifest
├── pnpm-workspace.yaml  # pnpm workspace definition
├── tsconfig.base.json   # Shared TypeScript configuration
├── tsconfig.json        # Root TypeScript configuration
├── turbo.json           # TurboRepo task orchestration
└── vitest.workspace.ts  # Vitest workspace configuration
```

## Tooling

| Tool       | Purpose                                             |
| ---------- | --------------------------------------------------- |
| pnpm       | Package manager with workspace protocol support     |
| TurboRepo  | Task orchestration, caching, and parallel execution |
| TypeScript | Type-safe language with strict mode enabled         |
| ESLint     | Static analysis with flat configuration             |
| Prettier   | Consistent code formatting                          |
| Vitest     | Unit and integration test runner                    |
| Changesets | Version management and changelog generation         |

## Design Decisions

### pnpm Workspaces

All packages live in `packages/*`. Each package is self-contained with its own `package.json`, TypeScript configuration, and tests. The workspace protocol (`workspace:`) is used for inter-package dependencies.

### Shared TypeScript Configuration

`tsconfig.base.json` provides strict defaults that every package extends. This ensures consistent type-checking behavior across the monorepo. Individual packages can override specific settings as needed.

### ESLint Flat Config

A single root `eslint.config.mjs` applies to all packages. This approach was chosen over per-package configurations to ensure consistent linting rules across the entire codebase.

### TurboRepo Pipeline

The `build` task runs with topological dependency ordering, ensuring that dependencies are built before dependents. The `lint`, `test`, and `typecheck` tasks run independently per package but can be cached for efficiency.

### Versioning with Changesets

Every consumer-facing change requires a changeset. The Release workflow automatically creates version pull requests and publishes packages when merged.
