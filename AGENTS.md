# Agent Instructions

This file gives repository-level guidance for AI coding agents working in this
project. Keep durable project rules here; use prompts for one-off task details.

## Project Overview

- This is `Ryker Editorial Blog`, a private personal editorial blog about AI
  engineering, prompting, agents, and software craft.
- The app is a Next.js 14 App Router project with React 18, TypeScript,
  Tailwind CSS, Prisma, and SQLite.
- These instructions describe the current `origin/main` baseline project shape.
  Update them when branch work is merged into that baseline.
- The public experience is a polished reading site. The same app also contains
  a private admin authoring area, a public short-notes area, and quiet hidden
  rooms.
- Product copy is intentionally mixed and now primarily Simplified Chinese, with
  some English technical labels, route labels, and bilingual README content.
  Match the surrounding file before adding text.

## Repository Map

- `app/`: App Router pages, layouts, and API routes.
- `components/`: UI components split into `layout`, `shared`, and
  `features/<domain>`.
- `lib/`: auth, database, feature-domain helpers, and utility functions.
- `prisma/`: Prisma schema and seed data.
- `public/`: static images and screenshots.
- `tests/`: lightweight `node:test` suites, including source-structure
  assertions for route and UI constraints.

## Nested Instructions

- Read the closest nested `AGENTS.md` before changing files in a subtree.
- `app/AGENTS.md`: App Router pages, layouts, metadata, and route behavior.
- `app/api/AGENTS.md`: route handlers, JSON responses, auth, and server-only
  data access.
- `app/admin/AGENTS.md`: private authoring UI and crawler/privacy constraints.
- `app/desk/AGENTS.md`: baseline hidden desk room behavior.
- `.github/AGENTS.md`: CI workflow and PR template maintenance.
- `components/AGENTS.md`: component style, client boundaries, and Tailwind
  conventions.
- `lib/AGENTS.md`: shared auth, database, and formatting helpers.
- `prisma/AGENTS.md`: schema and seed data.
- `tests/AGENTS.md`: `node:test` conventions and source-level assertions.

## Commands

- Install dependencies with `npm install`; this repo uses `package-lock.json`.
- Start local development with `npm run dev`.
- Build with `npm run build`; it runs `prisma generate` before `next build`.
- Run linting with `npm run lint`.
- Run all tests with `npm test`.
- Run documentation-change enforcement with `npm run check:docs`.
- Run the full local CI sequence with `npm run ci`.
- Install local git hooks with `npm run hooks:install`; `npm install` does this
  automatically outside CI.
- Push the local Prisma schema with `npm run db:push`.
- Generate Prisma Client with `npm run db:generate`.
- Seed demo data with `npm run db:seed`.
- Run focused tests with:

```bash
./node_modules/.bin/tsx --test tests/<file>.test.ts
```

Prefer focused tests first, then run `npm run ci` when changes affect routes,
API handlers, Prisma, shared UI behavior, workflow files, or process scripts.

## Environment And Data

- Local development expects `DATABASE_URL`, `ADMIN_PASSWORD`, and `AUTH_SECRET`
  in `.env`.
- Do not commit `.env`, SQLite database files, generated local data, or secret
  keys.
- Keep service credentials server-side only. In particular, API keys used by
  `/app/api/**` routes must not appear in client components.
- Use the existing Prisma client from `lib/db.ts` rather than creating a second
  database client.

## Implementation Guidelines

- Follow existing App Router patterns: route files stay under `app/`, reusable UI
  under `components/`, and pure feature logic under `lib/features`.
- Prefer the `@/` import alias used throughout the codebase.
- Keep UI changes consistent with the editorial style: restrained, text-forward,
  responsive, and readable. Avoid unrelated visual rewrites.
- Hidden and admin routes should opt out of indexing. Preserve `robots`
  metadata and `X-Robots-Tag` behavior where it already exists.
- Admin write APIs must require authentication through the existing auth helper.
- Keep public navigation minimal. Do not expose admin routes or hidden rooms
  through public nav or footer links unless explicitly asked.

## Testing Notes

- Tests use `node:test` and `node:assert/strict`.
- Add or update tests when changing shared helpers, middleware behavior,
  route behavior, auth/data flow, hidden-room exposure, route themes, or privacy
  constraints.
- For documentation-only changes, a source inspection is usually enough; do not
  run expensive build steps unless the docs affect commands or generated output.

## Documentation

- Keep `README.md` and `README.zh-CN.md` aligned when changing public setup,
  commands, features, or deployment notes.
- Source, config, workflow, script, package, or Prisma changes should update
  relevant docs. `npm run check:docs` enforces this in CI and in the local
  pre-commit hook.
- Keep this file concise. Put subtree-specific guidance in the nested
  `AGENTS.md` files listed above.
