# Desk A2UI Toy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a hidden `/desk` A2UI toy workbench with a Claude Code-like shell, local commands, a static lab route, and a server-only DeepSeek API proxy.

**Architecture:** Keep `/desk` as a hidden room mounted by `app/desk/page.tsx`, but replace the old desk-object layout with focused client components under `components/features/desk`. Put schema validation, local command handling, and prompt construction under `lib/features/desk`, and keep DeepSeek access inside `app/api/desk/agent/route.ts`.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, `node:test` with `tsx`.

---

## File Structure

- Create `lib/features/desk/types.ts`: shared request, response, block, and A2UI TypeScript types.
- Create `lib/features/desk/a2ui.ts`: whitelist validation and normalization for A2UI payloads.
- Create `lib/features/desk/commands.ts`: local command parsing for `help`, `clear`, `show examples`, and `show lab`.
- Create `lib/features/desk/prompt.ts`: system prompt and DeepSeek message construction.
- Create `components/features/desk/DeskShell.tsx`: client-side state, command dispatch, API calls, and layout.
- Create `components/features/desk/DeskSessionBar.tsx`: top session/status strip.
- Create `components/features/desk/TerminalTranscript.tsx`: transcript block rendering.
- Create `components/features/desk/DeskComposer.tsx`: input form.
- Create `components/features/desk/A2UIRenderer.tsx`: schema component dispatcher.
- Create `components/features/desk/a2ui/*.tsx`: concrete A2UI components.
- Modify `components/features/desk/DeskRoom.tsx`: server wrapper around `DeskShell`.
- Modify `components/layout/RouteTheme.tsx` and `components/layout/Nav.tsx`: add hidden desk dark chrome without touching homepage.
- Create `app/desk/lab/page.tsx`: hidden static A2UI lab route.
- Create `app/api/desk/agent/route.ts`: server-only DeepSeek proxy.
- Modify `tests/hidden-rooms.test.ts`: verify hidden routing and desk theme.
- Create `tests/desk-a2ui.test.ts`: validate schema and local commands.

## Task 1: RED Tests for Desk A2UI Core

**Files:**
- Create: `tests/desk-a2ui.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeDeskA2UI,
  normalizeDeskAgentResponse,
} from "../lib/features/desk/a2ui";
import { resolveDeskCommand } from "../lib/features/desk/commands";

test("normalizeDeskA2UI accepts note payloads and preserves safe tags", () => {
  const result = normalizeDeskA2UI({
    type: "note",
    title: "判断",
    body: "先让想法有形状。",
    tags: ["A2UI", "desk"],
  });

  assert.deepEqual(result, {
    type: "note",
    title: "判断",
    body: "先让想法有形状。",
    tags: ["A2UI", "desk"],
  });
});

test("normalizeDeskA2UI rejects unknown component types", () => {
  assert.equal(normalizeDeskA2UI({ type: "iframe", src: "https://example.com" }), null);
});

test("normalizeDeskA2UI limits artifact lists and removes unsafe links", () => {
  const result = normalizeDeskA2UI({
    type: "artifactList",
    title: "对象",
    items: Array.from({ length: 8 }).map((_, index) => ({
      label: `item-${index}`,
      title: `标题 ${index}`,
      body: "正文",
      href: index === 0 ? "javascript:alert(1)" : `/thinking?item=${index}`,
    })),
  });

  assert.equal(result?.type, "artifactList");
  if (result?.type !== "artifactList") throw new Error("expected artifactList");
  assert.equal(result.items.length, 6);
  assert.equal(result.items[0].href, undefined);
  assert.equal(result.items[1].href, "/thinking?item=1");
});

test("normalizeDeskAgentResponse keeps message when ui is invalid", () => {
  const result = normalizeDeskAgentResponse({
    message: "可以先看文本。",
    ui: { type: "script", body: "<script />" },
  });

  assert.deepEqual(result, { message: "可以先看文本。" });
});

test("resolveDeskCommand handles local commands without remote calls", () => {
  const help = resolveDeskCommand("help");
  assert.equal(help?.kind, "blocks");
  assert.equal(help?.blocks.some((block) => block.kind === "ui"), true);

  const clear = resolveDeskCommand("clear");
  assert.deepEqual(clear, { kind: "clear" });

  assert.equal(resolveDeskCommand("what should I write?"), null);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `./node_modules/.bin/tsx --test tests/desk-a2ui.test.ts`

Expected: FAIL because `../lib/features/desk/a2ui` and `commands` do not exist.

## Task 2: Implement Desk A2UI Core

**Files:**
- Create: `lib/features/desk/types.ts`
- Create: `lib/features/desk/a2ui.ts`
- Create: `lib/features/desk/commands.ts`
- Create: `lib/features/desk/prompt.ts`

- [ ] **Step 1: Implement shared types, schema validation, commands, and prompt helpers.**
- [ ] **Step 2: Run `./node_modules/.bin/tsx --test tests/desk-a2ui.test.ts`.**
- [ ] **Step 3: Keep changes minimal until tests pass.**

## Task 3: RED Tests for Hidden Desk Route Integration

**Files:**
- Modify: `tests/hidden-rooms.test.ts`

- [ ] **Step 1: Add tests that assert `/desk/lab` exists, `/desk` uses `DeskShell`, route theme recognizes desk routes, nav uses desk dark chrome, and client code does not expose `DEEPSEEK_API_KEY`.**
- [ ] **Step 2: Run `./node_modules/.bin/tsx --test tests/hidden-rooms.test.ts`.**
- [ ] **Step 3: Confirm failures point to missing route/components/theme behavior.**

## Task 4: Implement Desk UI Shell and Lab

**Files:**
- Modify: `components/features/desk/DeskRoom.tsx`
- Create: `components/features/desk/DeskShell.tsx`
- Create: `components/features/desk/DeskSessionBar.tsx`
- Create: `components/features/desk/TerminalTranscript.tsx`
- Create: `components/features/desk/DeskComposer.tsx`
- Create: `components/features/desk/A2UIRenderer.tsx`
- Create: `components/features/desk/a2ui/NoteCard.tsx`
- Create: `components/features/desk/a2ui/ArtifactList.tsx`
- Create: `components/features/desk/a2ui/DecisionMatrix.tsx`
- Create: `components/features/desk/a2ui/CommandHints.tsx`
- Create: `app/desk/lab/page.tsx`
- Modify: `components/layout/RouteTheme.tsx`
- Modify: `components/layout/Nav.tsx`

- [ ] **Step 1: Build the static shell with local commands and lab samples.**
- [ ] **Step 2: Run `./node_modules/.bin/tsx --test tests/hidden-rooms.test.ts`.**
- [ ] **Step 3: Fix only what the tests require, then review layout manually.**

## Task 5: RED Tests for DeepSeek API Proxy

**Files:**
- Modify: `tests/hidden-rooms.test.ts`

- [ ] **Step 1: Add source tests for `app/api/desk/agent/route.ts`: server route exists, reads `process.env.DEEPSEEK_API_KEY`, calls `https://api.deepseek.com/chat/completions`, imports prompt and schema helpers, and does not appear in client components.**
- [ ] **Step 2: Run `./node_modules/.bin/tsx --test tests/hidden-rooms.test.ts`.**
- [ ] **Step 3: Confirm failure points to missing route.**

## Task 6: Implement DeepSeek API Proxy and Frontend Call

**Files:**
- Create: `app/api/desk/agent/route.ts`
- Modify: `components/features/desk/DeskShell.tsx`

- [ ] **Step 1: Implement POST validation, env check, DeepSeek request, JSON parsing, and normalized response.**
- [ ] **Step 2: Add frontend API call for non-command input.**
- [ ] **Step 3: Run all desk-related tests.**

## Task 7: Verification

**Files:**
- No new files.

- [ ] **Step 1: Run `./node_modules/.bin/tsx --test tests/desk-a2ui.test.ts tests/hidden-rooms.test.ts`.**
- [ ] **Step 2: Run `npm run build`.**
- [ ] **Step 3: Check `git diff` for unrelated homepage or navigation exposure changes.**
