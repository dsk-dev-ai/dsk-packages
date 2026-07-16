# Getting Started

## Prerequisites

- **Node.js** >= 24
- **pnpm** >= 10

## Installation

```bash
git clone https://github.com/darshankachare/dsk-packages.git
cd dsk-packages
pnpm install
```

## Verify Setup

Run the following commands to verify that everything is configured correctly:

```bash
# Type-check the entire monorepo
pnpm tsc --noEmit

# Lint all packages
pnpm lint

# Build all packages
pnpm build

# Run all tests
pnpm test
```

## Development Workflow

See [CONTRIBUTING.md](../CONTRIBUTING.md) for the complete development workflow, including how to create changesets and submit pull requests.
