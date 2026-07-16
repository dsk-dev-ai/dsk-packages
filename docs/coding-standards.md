# Coding Standards

## Language

- All code must be written in TypeScript
- Strict mode is enabled globally via `tsconfig.base.json`
- Avoid `any` type — use `unknown` when the type is not statically known
- Prefer `const` over `let` where the variable is not reassigned

## Style

- Formatting is enforced by Prettier — run `pnpm format` before committing
- Linting is enforced by ESLint — run `pnpm lint` before committing
- Use descriptive variable and function names
- Prefer named exports over default exports
- Use arrow functions for callbacks and closures
- Use `interface` over `type` for object shapes when possible

## Testing

- Write tests for all public functions, classes, and APIs
- Use Vitest as the test runner
- Name test files using the `*.test.ts` pattern
- Cover normal cases, edge cases, and error conditions
- Mock external dependencies to keep tests deterministic

## Package Conventions

- Source code lives in `src/` at the package root
- Tests live in `test/` at the package root
- Build output is written to `dist/` (git-ignored)
- Each package extends `../../tsconfig.base.json` in its own `tsconfig.json`

## Git Conventions

- Use conventional commit messages when possible
- Keep commits focused on a single logical change
- Write descriptive commit messages that explain the why, not just the what
- Rebase feature branches onto `main` before opening pull requests
