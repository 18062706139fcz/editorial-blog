# Admin Route Instructions

These rules apply to the private authoring UI under `app/admin/`.

## Purpose

- Admin routes provide a lightweight private authoring workflow for posts and
  short notes (`Thought` records).
- They are intentionally colocated in the same Next.js app as the public site.
- They are not a public CMS surface and should not be linked from public nav or
  footer components.

## Access Control

- Every admin page that displays or edits private data must check
  `isAuthenticated()` from `@/lib/auth`.
- Redirect unauthenticated users to `/admin/login`.
- Redirect already-authenticated users away from `/admin/login` to `/admin`.
- Keep `export const dynamic = "force-dynamic"` on pages that depend on cookies
  or live database state.

## Privacy

- Preserve the admin layout `robots` metadata:
  `index: false`, `follow: false`, and `nocache: true`.
- Preserve middleware coverage for `/admin`, `/admin/:path*`, `/api/posts`,
  `/api/posts/:path*`, and `/api/auth/:path*`.
- Do not add screenshots, sitemap links, public nav links, or README marketing
  copy that expose the admin path unless explicitly requested.

## Editing Flow

- Use `PostEditor` for creating and editing posts.
- Use `ThoughtEditor` for creating and editing short notes.
- Keep client-side validation aligned with server-side validation in
  `app/api/posts` and `app/api/thoughts`.
- Slugs are editable only on creation in the baseline UI; avoid changing that
  behavior without updating route handling and tests.
- After successful create/update/delete actions, refresh or navigate so the admin
  list reflects current database state.

## Copy

- The baseline admin UI mixes English headings with Chinese field labels. Match
  nearby copy rather than normalizing the whole area in a small change.
