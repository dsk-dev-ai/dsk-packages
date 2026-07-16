# dsk-packages

[![CI](https://github.com/darshankachare/dsk-packages/actions/workflows/ci.yml/badge.svg)](https://github.com/darshankachare/dsk-packages/actions/workflows/ci.yml)
[![Release](https://github.com/darshankachare/dsk-packages/actions/workflows/release.yml/badge.svg)](https://github.com/darshankachare/dsk-packages/actions/workflows/release.yml)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![pnpm](https://img.shields.io/badge/pnpm-workspace-F69220?logo=pnpm)](https://pnpm.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org)

A collection of high-quality TypeScript packages, developer utilities, and open-source tools.

## Vision

dsk-packages provides well-tested, well-documented, and well-maintained TypeScript packages that solve common development problems. Each package is designed with type safety, performance, and developer experience as first-class concerns.

## Repository Architecture

This monorepo is built on a modern toolchain optimized for TypeScript development:

| Layer              | Technology               |
| ------------------ | ------------------------ |
| Package Manager    | pnpm workspaces          |
| Task Orchestration | TurboRepo                |
| Language           | TypeScript (strict mode) |
| Linting            | ESLint with flat config  |
| Formatting         | Prettier                 |
| Testing            | Vitest                   |
| Versioning         | Changesets               |

## Folder Structure

```
dsk-packages/
├── .github/             # CI/CD workflows, issue and PR templates
├── .vscode/             # Editor settings and recommended extensions
├── docs/                # Documentation
├── examples/            # Usage examples
├── packages/            # Published npm packages
├── scripts/             # Build and utility scripts
├── .npmrc               # pnpm configuration
├── turbo.json           # TurboRepo pipeline
├── tsconfig.base.json   # Shared TypeScript base config
├── eslint.config.mjs    # ESLint flat config
├── vitest.workspace.ts  # Vitest workspace config
└── package.json         # Root workspace manifest
```

## Packages

Packages live in the `packages/` directory. Each package is independently versioned, tested, and published to npm under the `@darshankachare` scope.

## Development Workflow

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run all tests
pnpm test

# Lint all packages
pnpm lint

# Type-check all packages
pnpm tsc --noEmit

# Format code
pnpm format:fix
```

## Release Workflow

1. Contributors create changesets with `pnpm changeset`
2. Changesets are committed alongside code changes in pull requests
3. Merging to `main` triggers the Release workflow
4. The workflow creates or updates a "Version Packages" pull request
5. Merging the Version Packages PR publishes updated packages to npm

See [docs/publishing.md](docs/publishing.md) and [docs/release-process.md](docs/release-process.md) for details.

## Package Philosophy

- **Type safety first** — Every package uses strict TypeScript with full type declarations
- **Minimal dependencies** — Packages depend on as few external libraries as possible
- **Tested** — Every public API is covered by unit tests
- **Documented** — Every package includes its own README with usage examples
- **Semver** — All packages follow semantic versioning via Changesets

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the development workflow.

Please review [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before participating.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the project's development plan.

## Security

Report security vulnerabilities to **darshankachare@email.com**. See [SECURITY.md](SECURITY.md) for the disclosure process.

## License

[MIT](LICENSE)
