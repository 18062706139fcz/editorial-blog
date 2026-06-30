# Desk Route Instructions

These rules apply to the baseline hidden `/desk` route.

## Purpose

- `/desk` is a quiet hidden room, not a public navigation destination.
- The baseline implementation renders a static desk/work-surface experience
  through `components/features/desk/DeskRoom`.
- Copy and room metadata come from `getHiddenRoom("desk")` in
  `@/lib/features/hidden-rooms`.

## Visibility

- Keep `robots: { index: false, follow: false }` on `app/desk/page.tsx`.
- Do not add `/desk` links to `components/layout/Nav` or
  `components/layout/Footer` unless explicitly asked.
- Keep hidden-room tests updated if the route's visibility contract changes.

## UI

- Preserve the warm desk palette and object-surface metaphor unless the task is
  explicitly a redesign.
- Keep static desk objects local to the desk component unless they become shared
  room configuration.
- The baseline `/desk` route does not execute commands, call agent APIs, read
  local files, or persist sessions.

## Changes

- If `/desk` becomes interactive, add validation boundaries and tests before
  wiring external services or model-generated UI.
- Do not render model-provided HTML, CSS, or scripts without an explicit
  sanitization and threat-modeling pass.
