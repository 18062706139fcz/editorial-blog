# Test Instructions

These rules apply to `tests/`.

## Framework

- Tests use Node's built-in `node:test` module with `node:assert/strict`.
- Run a focused test file with:

```bash
./node_modules/.bin/tsx --test tests/<file>.test.ts
```

- Run all baseline tests with `npm test`.

## Baseline Coverage

- `tests/middleware.test.ts` verifies that private/admin surfaces remain
  available and receive the `X-Robots-Tag` noindex header.
- `tests/hidden-rooms.test.ts` uses source assertions to protect hidden routes,
  noindex metadata, night radio behavior, and public navigation boundaries.
- `tests/living-site.test.ts`, `tests/home-experience.test.ts`,
  `tests/marginalia.test.ts`, and `tests/route-transition.test.ts` cover shared
  helper behavior and source-level page constraints.
- Add tests near these styles when changing middleware, auth-related route
  behavior, formatting helpers, hidden-room exposure, route themes, or
  source-level privacy guarantees.

## Test Style

- Keep tests small and behavior-oriented.
- Use direct imports for pure helpers and middleware.
- For source-structure invariants, reading files with `readFileSync` is an
  established pattern in this repo. Keep assertions tied to meaningful behavior,
  not incidental formatting.
- When changing a protected behavior, first make the expected behavior explicit
  in a test, then update implementation.

## Verification

- For docs-only changes, inspecting the changed Markdown is usually sufficient.
- For API, auth, middleware, Prisma, or route changes, run focused tests and then
  `npm run ci` when practical.
