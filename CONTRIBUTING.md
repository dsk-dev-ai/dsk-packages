# Contributing

Thank you for your interest in contributing to dsk-packages.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/<your-username>/dsk-packages.git`
3. Install dependencies: `pnpm install`
4. Create a branch: `git checkout -b feature/my-feature`

## Development Commands

| Command             | Description                         |
| ------------------- | ----------------------------------- |
| `pnpm build`        | Build all packages via TurboRepo    |
| `pnpm dev`          | Watch mode for development          |
| `pnpm lint`         | Run ESLint across all packages      |
| `pnpm test`         | Run all tests via Vitest            |
| `pnpm format`       | Check code formatting with Prettier |
| `pnpm format:fix`   | Format all files with Prettier      |
| `pnpm tsc --noEmit` | Type-check all packages             |

## Adding a Changeset

Run `pnpm changeset` and follow the prompts. Select the packages your change affects and the type of version bump (major, minor, patch). Commit the generated file alongside your changes.

## Pull Request Process

1. Ensure all CI checks pass (type-check, lint, build, test)
2. Add a changeset if your change affects package consumers
3. Update documentation if your change introduces new behavior
4. Request review from a maintainer
5. Keep pull requests focused on a single concern

## Coding Standards

- All code is written in TypeScript with strict mode enabled
- Formatting is enforced by Prettier and linting by ESLint
- Every public API must have corresponding tests
- Use named exports over default exports
- Follow the conventions in [docs/coding-standards.md](docs/coding-standards.md)

## Code of Conduct

All contributors are expected to adhere to the [Code of Conduct](CODE_OF_CONDUCT.md).
