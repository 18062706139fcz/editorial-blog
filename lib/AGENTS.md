# Library Instructions

These rules apply to shared helpers under `lib/`.

## Baseline Files

- `auth.ts`: password verification, session token creation, and cookie-based
  admin authentication.
- `db.ts`: shared Prisma client singleton.
- `features/hidden-rooms.ts`: central configuration for `/lost`, `/night`, and
  `/desk`.
- `features/living-site.ts`: homepage/presence/quote/easter-egg helpers.
- `features/marginalia.ts`: public short-note artifact types, sample data, and
  filtering helpers.
- `features/thoughts.ts`: `Thought` normalization and record-to-artifact
  mapping.
- `utils/format.ts`: date, relative time, word count, and reading time helpers.
- `utils/route-transition.ts`: route transition helpers.

## Auth

- Keep password checks in `verifyPassword()` and session checks in
  `isAuthenticated()`.
- Use timing-safe comparisons for secrets and session tokens.
- `AUTH_SECRET` and `ADMIN_PASSWORD` must remain server-only.
- Do not import `lib/auth.ts` into client components.

## Database

- Reuse the singleton `prisma` export from `lib/db.ts`.
- Do not create additional PrismaClient instances in application code. The seed
  script may create its own process-local client.
- Keep database helper changes compatible with SQLite unless the task explicitly
  changes the database provider.

## Formatting

- Keep formatting helpers pure and deterministic for a given input except for
  functions that intentionally compare against `Date.now()`.
- Preserve mixed-language behavior where it exists, such as Chinese relative
  time labels and word-count suffixes.
- Add focused `node:test` coverage when changing word counting, reading time, or
  date formatting logic.

## Feature Helpers

- Keep hidden-room content centralized in `features/hidden-rooms.ts`; pages and
  components should call `getHiddenRoom()` instead of duplicating room copy.
- Keep `Thought` validation and list parsing inside `features/thoughts.ts`.
- Preserve public fallback sample artifacts in `features/marginalia.ts` so
  `/thinking` still works when the database has no thought rows.
