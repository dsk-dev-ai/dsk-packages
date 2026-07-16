# Publishing

Packages are published to npm via the automated Changesets release workflow.

## Automated Publishing

1. A contributor runs `pnpm changeset` to describe their changes
2. The generated changeset file is committed alongside the code changes
3. When the pull request merges to `main`, the Release workflow creates a "Version Packages" pull request
4. Merging the Version Packages PR publishes all updated packages to npm

## Environment Variables

The Release workflow requires the following secrets to be configured in the GitHub repository:

| Secret         | Purpose                                                                   |
| -------------- | ------------------------------------------------------------------------- |
| `NPM_TOKEN`    | npm access token with publish permissions for the `@darshankachare` scope |
| `GITHUB_TOKEN` | Automatically provided by GitHub Actions                                  |

## Prerequisites

- An npm token must be created with publish access to all packages under the `@darshankachare` scope
- The token must be added as the `NPM_TOKEN` secret in the GitHub repository settings

## Manual Publishing

In rare cases, manual publishing may be necessary:

```bash
pnpm build
pnpm changeset publish
```

This should only be done when the automated workflow is unavailable.
