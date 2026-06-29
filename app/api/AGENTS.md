# API Route Instructions

These rules apply to `app/api/` route handlers.

## Route Shape

- Use App Router route handlers with named exports such as `GET`, `POST`, `PUT`,
  and `DELETE`.
- Return responses with `NextResponse.json`.
- Parse JSON bodies defensively with `await request.json().catch(...)`.
- Keep response shapes small and predictable: `{ ok: true }`, `{ error:
  string }`, or domain objects such as `{ post }` and `{ thought }`.

## Authentication

- Admin write APIs for posts and thoughts must call `isAuthenticated()` from
  `@/lib/auth` before mutating private data.
- Return HTTP 401 with `{ error: "Unauthorized" }` for unauthenticated admin
  write requests.
- Public APIs such as contact submission and presence must not expose admin
  session state.

## Data Access

- Use the shared Prisma client from `@/lib/db`.
- Convert incoming values to strings, booleans, or nullable values before passing
  them into Prisma.
- Keep slug generation and uniqueness checks server-side.
- Use `normalizeThoughtInput()` from `@/lib/features/thoughts` for thought
  writes instead of duplicating parsing rules in route handlers.
- Treat malformed request bodies as validation errors, not uncaught exceptions.

## Privacy And Security

- Never expose `ADMIN_PASSWORD`, `AUTH_SECRET`, database URLs, or other secrets
  in JSON responses or client-readable code.
- Keep the middleware matcher updated when adding private authoring APIs that
  should receive `X-Robots-Tag`.
- Contact submissions may be public, but should validate required fields before
  writing to the database.
- Music routes proxy only the approved NetEase/Chen Li tracks. Preserve
  allowlists when changing those routes.

## Runtime Behavior

- The baseline presence route uses in-memory state. Do not rely on that state for
  durable analytics or cross-process correctness.
- Music proxy routes depend on third-party NetEase endpoints and should fail
  with small JSON errors rather than leaking upstream details.
- Prefer simple synchronous validation and clear status codes over hidden
  side effects.
