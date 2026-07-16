# dsk-packages

[![CI](https://github.com/dsk-dev-ai/dsk-packages/actions/workflows/ci.yml/badge.svg)](https://github.com/dsk-dev-ai/dsk-packages/actions/workflows/ci.yml)
[![Release](https://github.com/dsk-dev-ai/dsk-packages/actions/workflows/release.yml/badge.svg)](https://github.com/dsk-dev-ai/dsk-packages/actions/workflows/release.yml)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![pnpm](https://img.shields.io/badge/pnpm-workspace-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)

> **Production-grade TypeScript libraries, developer utilities, and open-source tools.**

---

## Vision

**dsk-packages** is an open-source ecosystem of modern TypeScript libraries designed to help developers build reliable software faster.

The goal of this repository is to provide lightweight, dependency-conscious, production-ready packages with an excellent developer experience.

Every package is built around five core principles:

- 🔒 Type Safety
- ⚡ Performance
- 📦 Minimal Dependencies
- 📖 Excellent Documentation
- 🧪 Comprehensive Testing

This repository follows the same engineering practices used by large open-source ecosystems while remaining approachable for individual developers.

---

# Current Status

🚧 **Active Development**

Current Progress

- ✅ Monorepo Foundation
- ✅ Repository Infrastructure
- 🚧 Logger Package
- ⏳ First npm Release
- ⏳ Documentation Website

---

# Repository Architecture

This repository is built using a modern TypeScript toolchain.

| Layer | Technology |
|-------|------------|
| Package Manager | pnpm Workspaces |
| Monorepo | TurboRepo |
| Language | TypeScript (Strict Mode) |
| Linting | ESLint Flat Config |
| Formatting | Prettier |
| Testing | Vitest |
| Versioning | Changesets |
| CI/CD | GitHub Actions |

---

# Repository Structure

```text
dsk-packages/
│
├── .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── docs/
│
├── examples/
│
├── packages/
│   └── ...
│
├── scripts/
│
├── .changeset/
├── .vscode/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── eslint.config.mjs
└── README.md
```

---

# Planned Package Ecosystem

Packages will be published under the npm scope:

```
@darshankachare/*
```

Initial roadmap includes:

| Package | Status |
|----------|--------|
| @darshankachare/logger | 🚧 In Development |
| @darshankachare/config | Planned |
| @darshankachare/env | Planned |
| @darshankachare/cache | Planned |
| @darshankachare/http | Planned |
| @darshankachare/events | Planned |
| @darshankachare/queue | Planned |
| @darshankachare/retry | Planned |
| @darshankachare/cli | Planned |
| @darshankachare/validation | Planned |
| ... | More Coming |

The long-term vision is to grow this repository into a comprehensive ecosystem of developer-focused libraries.

---

# Getting Started

Clone the repository:

```bash
git clone https://github.com/dsk-dev-ai/dsk-packages.git

cd dsk-packages
```

Install dependencies:

```bash
pnpm install
```

---

# Development

Build everything:

```bash
pnpm build
```

Run tests:

```bash
pnpm test
```

Run linter:

```bash
pnpm lint
```

Run type checking:

```bash
pnpm typecheck
```

Format code:

```bash
pnpm format
```

---

# Development Workflow

Every feature follows the same Git workflow.

```
main
 │
 ├── feature/logger
 │
 ├── feature/cache
 │
 ├── feature/http
 │
 └── feature/...
```

Each feature branch contains one focused change.

Every pull request must:

- pass CI
- include tests (where applicable)
- follow Conventional Commits
- include a Changeset (for publishable changes)

---

# Release Workflow

Publishing is fully automated using **Changesets**.

```
Feature Branch
      │
      ▼
Pull Request
      │
      ▼
Merge into main
      │
      ▼
Version Packages PR
      │
      ▼
npm Publish
```

Each package follows Semantic Versioning.

---

# Package Philosophy

Every package in this repository should be:

- Small
- Fast
- Tree-shakeable
- Fully Typed
- Production Ready
- Well Documented
- Well Tested
- Easy to Maintain

The repository values long-term maintainability over unnecessary complexity.

---

# Quality Standards

Every published package should provide:

- Strict TypeScript support
- 100% public API documentation
- Unit tests
- Consistent formatting
- ESLint compliance
- Semantic versioning
- CI validation

---

# Contributing

Contributions are welcome.

Before contributing please read:

- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [SECURITY.md](SECURITY.md)

Development workflow:

1. Fork repository
2. Create a feature branch
3. Make changes
4. Run tests
5. Submit Pull Request

---

# Documentation

Additional documentation is available in the `docs/` directory.

Topics include:

- Architecture
- Coding Standards
- Publishing
- Release Process
- Getting Started

---

# Roadmap

See:

```
ROADMAP.md
```

for the complete development roadmap.

---

# Security

If you discover a security vulnerability, please report it privately instead of opening a public issue.

Contact:

**darshan.kachare.dev@gmail.com**

Please see:

```
SECURITY.md
```

for responsible disclosure guidelines.

---

# Support

If you need help:

- Open a GitHub Issue
- Start a GitHub Discussion (when enabled)
- Read the documentation

---

# License

Licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for details.

---

## Author

**Darshan Kachare**

Software Engineer • Open Source Contributor • Founder of NextGenAI Labs

GitHub:
https://github.com/dsk-dev-ai

Building reliable developer tools, TypeScript libraries, AI systems, and open-source software.

---

**Build. Learn. Share. Improve.**
