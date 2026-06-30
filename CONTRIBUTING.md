# Contributing

This is a private personal project, but changes should still leave a clear
trail for future agents and reviewers.

## Local Setup

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

`npm install` configures the repository git hooks through `npm run hooks:install`
unless it is running in CI. If hooks were skipped, run:

```bash
npm run hooks:install
```

## Before Committing

Run the focused checks for the area you changed. For broad changes, run:

```bash
npm run lint
npm test
npm run check:docs
npm run build
```

CI runs on Node.js 22. It installs dependencies with
`npm ci --ignore-scripts` and then runs `npm run db:generate` explicitly. Local
`npm install` still runs the normal project lifecycle so git hooks are
configured for day-to-day work. When updating dependencies, keep
`package-lock.json` installable on public GitHub runners; do not commit lockfile
entries that require a private registry host.

The pre-commit hook runs:

```bash
npm run check:docs -- --staged
```

If a commit changes source, config, workflow, scripts, Prisma, or package files,
it should also update relevant documentation such as `README.md`, `AGENTS.md`,
`CLAUDE.md`, `CONTRIBUTING.md`, nested `AGENTS.md`, or files under `docs/`.

## Pull Requests

- Keep PRs scoped to one behavior or workflow change.
- Fill in the PR template with summary, validation, documentation, risk, and
  rollback notes.
- If documentation was not updated, explain why in the template.
- Do not expose admin or hidden-room routes through public navigation unless the
  PR explicitly intends that change.
