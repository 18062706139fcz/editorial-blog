# App Router Instructions

These rules apply to `app/`, including pages, layouts, route segments, metadata,
and API routes unless a closer `AGENTS.md` overrides them.

## Baseline Structure

- The project uses the Next.js 14 App Router.
- Root layout lives in `app/layout.tsx` and imports global chrome from
  `components/layout`: `Nav`, `Footer`, `RouteTheme`, `RouteTransition`, and
  `ReadingProgress`.
- Public pages include the homepage, post detail pages under `app/posts/[slug]`,
  the contact page, and `/thinking`.
- Private authoring pages live under `app/admin`.
- Hidden rooms live at `/lost`, `/night`, and `/desk`; they must remain
  noindex and absent from visible navigation.
- API routes live under `app/api`.
- Global CSS is split through `app/globals.css` and `app/styles/*`.

## Server And Client Boundaries

- Pages are server components by default. Add `"use client"` only when a file
  uses browser state, effects, event handlers, or router hooks.
- Keep database reads in server components or API handlers. Use the shared
  Prisma client from `@/lib/db`.
- Do not pass secret values, raw env vars, or admin-only data into client
  components.
- Prefer `export const dynamic = "force-dynamic"` for pages whose content should
  always reflect the database or request cookies.

## Metadata And Privacy

- Public pages should have clear metadata when they introduce a new route.
- Hidden room pages must declare `robots: { index: false, follow: false }`.
- Admin pages must remain excluded from indexing. Preserve the admin layout
  `robots` metadata and the middleware `X-Robots-Tag` behavior.
- Keep public navigation focused on reader-facing content. Do not link to
  `/admin`, `/lost`, `/night`, or `/desk` from public chrome unless explicitly
  asked.

## Data Flow

- Use Prisma queries directly in server pages when rendering public posts or
  admin lists.
- Public post and thought queries should filter by `published: true` unless the
  route is inside admin.
- Mutations belong in `app/api/**` route handlers rather than server component
  form actions unless a task explicitly changes that architecture.

## Copy And UI

- Match the language and voice already used in the file. Current public copy is
  mostly Simplified Chinese with some English product labels and route names.
- Preserve the editorial layout: warm paper colors, serif headings, restrained
  motion, and clear reading hierarchy.
