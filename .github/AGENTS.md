# GitHub Workflow Instructions

These rules apply to `.github/`.

## CI

- Keep workflow files small and explicit.
- Use current stable major versions for official GitHub Actions.
- Use Node.js 22 for CI unless the application runtime requirement changes.
- The primary CI workflow should install with `npm ci --ignore-scripts`, then
  explicitly generate Prisma Client before running lint, tests, documentation
  checks, and build. This keeps dependency installation separate from lifecycle
  scripts such as local hook setup.
- Use `actions/setup-node` with npm caching for Node jobs.
- Keep `fetch-depth: 0` when jobs compare a PR branch against the base branch.
- Keep `package-lock.json` complete for optional platform packages and avoid
  committing private registry hosts; public GitHub runners must be able to
  install from the lockfile without local registry configuration.

## PR Template

- Keep the PR template short enough to fill in, but require summary,
  validation, documentation, risk, and rollback notes.
- Preserve a documentation section so reviewers can see whether README,
  `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, or other docs were considered.

## Documentation Checks

- CI runs `npm run check:docs`.
- Source, config, workflow, or script changes should include a relevant docs
  update unless the change is strictly internal and the PR explains why.
