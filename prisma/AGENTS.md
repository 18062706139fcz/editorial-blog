# Prisma Instructions

These rules apply to `prisma/`.

## Schema

- The baseline database provider is SQLite.
- Models are `Post`, `Thought`, and `ContactMessage`.
- Keep model changes reflected in admin forms, API route handlers, seed data,
  and README setup notes.
- Run `npm run db:push` after schema changes in local development.
- `npm run build` already runs `prisma generate`.

## Post Model

- `slug` is unique and generated server-side when omitted.
- `published` defaults to true; public pages should filter unpublished posts.
- `featured` controls homepage feature placement.
- `coverImage` is nullable.

## Thought Model

- `kind`, `tone`, and `size` are normalized by `lib/features/thoughts.ts`.
- `items` and `tags` are stored as JSON strings in SQLite. Use existing helper
  functions to parse and serialize them.
- `published` controls public visibility on `/thinking`.
- `featured` and `pinned` support curated short-note presentation.
- Keep indexes for public and featured queries unless query patterns change.

## ContactMessage Model

- `name` and `email` are required.
- `company`, `phone`, and `message` are optional.
- Contact submissions come from the public contact API, so validate input before
  writing rows.

## Seed Data

- `seed.ts` is demo content for local development.
- Keep seed posts realistic enough to exercise homepage, featured, archive, and
  Markdown rendering states.
- Avoid putting real private contact data, passwords, or secrets in seed data.
