# Release Process

## Overview

dsk-packages uses Changesets to manage versions and publish packages to npm. The entire process is automated via GitHub Actions.

## Workflow

```
Development → Changeset → Pull Request → Merge to main → Version PR → Publish
```

### Step-by-Step

1. **Development** — Contributors make changes on feature branches
2. **Changeset** — Contributors run `pnpm changeset` and follow the prompts to describe their changes and select version bumps
3. **Pull Request** — Code changes and the changeset file are submitted for review as a pull request
4. **CI Check** — The CI workflow validates that linting, type-checking, building, and testing all pass
5. **Merge** — The pull request is merged to `main`
6. **Version PR** — The Release workflow creates or updates a "Version Packages" pull request with updated versions and changelogs
7. **Publish** — Merging the Version Packages PR publishes all updated packages to npm

## Versioning

All packages follow semantic versioning (semver):

| Bump  | When to use                               |
| ----- | ----------------------------------------- |
| Major | Breaking changes to the public API        |
| Minor | New features that are backward-compatible |
| Patch | Bug fixes that are backward-compatible    |

## Changeset Format

Run `pnpm changeset` to create a changeset. You will be prompted to:

1. Select the packages your change affects
2. Select the type of version bump for each package
3. Write a summary of the changes (becomes the changelog entry)

## Release Cadence

There is no fixed release schedule. Releases happen when meaningful changes are accumulated, reviewed, and merged to `main`. The process is designed to make releases frictionless so they can happen frequently.
