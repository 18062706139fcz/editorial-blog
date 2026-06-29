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
  assert.equal(
    normalizeDeskA2UI({ type: "iframe", src: "https://example.com" }),
    null,
  );
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
  if (result?.type !== "artifactList") {
    throw new Error("expected artifactList");
  }
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
  assert.equal(
    help?.blocks.some((block) => block.kind === "ui"),
    true,
  );

  const clear = resolveDeskCommand("clear");
  assert.deepEqual(clear, { kind: "clear" });

  assert.equal(resolveDeskCommand("/help")?.kind, "blocks");

  assert.equal(resolveDeskCommand("what should I write?"), null);
});
