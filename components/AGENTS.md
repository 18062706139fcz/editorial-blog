# Component Instructions

These rules apply to `components/`.

## Structure

- `components/layout`: global chrome and route-level shell components.
- `components/shared`: reusable primitives such as `Markdown`, `Reveal`,
  `Logomark`, `RandomQuote`, and `SocialLinks`.
- `components/features/<domain>`: feature UI for admin, contact, desk, hidden
  rooms, home, night radio, posts, presence, and thoughts.
- Put new components in the closest existing domain folder. Create a new
  `features/<domain>` folder only when the feature has more than one
  component or a clear ownership boundary.

## Client Components

- Add `"use client"` only when a component needs state, effects, browser APIs,
  event handlers, or Next navigation hooks.
- Keep static presentational components as server-compatible components when
  possible.
- Do not access env vars or server-only data from client components.

## Styling

- Use Tailwind classes and the design tokens from `tailwind.config.ts`:
  `paper`, `paper-dim`, `ink`, `ink-soft`, `hairline`, `accent`, and
  `accent-soft`.
- Preserve the editorial visual language: serif display type, warm paper
  backgrounds, thin borders, modest animation, and readable content density.
- Avoid unrelated palette changes, heavy decorative effects, and large layout
  rewrites in focused component work.
- Keep responsive behavior explicit with existing `sm:` and `lg:` patterns.

## Content Components

- `Markdown` renders trusted post body Markdown through `react-markdown` and
  `remark-gfm`. Do not replace it with raw HTML rendering without a security
  review.
- `PostEditor` is the admin authoring client. Keep its form shape aligned with
  the `Post` model and `app/api/posts` handlers.
- `ThoughtEditor` is the admin short-note authoring client. Keep option lists
  and form utils aligned with `lib/features/thoughts`.
- `ContactForm` posts to `/api/contact`; keep validation messages aligned with
  the API response.
- Hidden-room components should stay unlinked from public navigation and should
  preserve noindex route metadata.
- Night radio components depend on real NetEase audio, lyric, and comment proxy
  APIs. Keep approved track IDs centralized and avoid synthetic audio fallbacks
  unless explicitly requested.

## Accessibility

- Preserve semantic links, buttons, labels, and `alt` text.
- Do not replace real text with decorative-only graphics.
- Keep interactive controls keyboard reachable.
