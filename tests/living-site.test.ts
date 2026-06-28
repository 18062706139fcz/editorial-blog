import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPresenceCopy,
  HITOKOTO_ENDPOINT,
  getVisibleStatusItems,
  normalizeHitokotoQuote,
  selectPostEasterEgg,
  type StatusItem,
} from "../lib/features/living-site";
import { readFileSync } from "node:fs";

test("getVisibleStatusItems still filters supplied items but exposes no manual homepage statuses by default", () => {
  const items: StatusItem[] = [
    { label: "今天在写", value: "语雀导入草案" },
    { label: "在听", value: "" },
    { label: "在读", value: "Designing Data-Intensive Applications" },
  ];

  assert.deepEqual(getVisibleStatusItems(items), [
    { label: "今天在写", value: "语雀导入草案" },
    { label: "在读", value: "Designing Data-Intensive Applications" },
  ]);
  assert.deepEqual(getVisibleStatusItems(), []);
});

test("hitokoto quote helpers keep the original random quote API", () => {
  assert.equal(HITOKOTO_ENDPOINT, "https://v1.hitokoto.cn/?c=d&c=i&c=k");

  assert.deepEqual(
    normalizeHitokotoQuote({
      hitokoto: "我们塑造工具，此后工具塑造我们。",
      from_who: "McLuhan",
      from: "Understanding Media",
    }),
    {
      text: "我们塑造工具，此后工具塑造我们。",
      source: "McLuhan·Understanding Media",
    },
  );
});

test("selectPostEasterEgg returns stable personal footnotes per slug", () => {
  const first = selectPostEasterEgg("yuque-import");
  const second = selectPostEasterEgg("yuque-import");

  assert.deepEqual(first, second);
  assert.equal(first.title, "写作边角");
  assert.ok(first.items.some((item) => item.label === "写这篇时"));
});

test("buildPresenceCopy gives the online counter a warmer reading-room voice", () => {
  assert.equal(buildPresenceCopy(1), "你正在翻页");
  assert.equal(buildPresenceCopy(3), "你和 2 个人正在翻页");
});

test("homepage no longer renders the thinking cabinet section", () => {
  const source = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.equal(source.includes("MarginaliaCabinet"), false);
  assert.equal(source.includes("给想法留一个形状"), false);
});

test("public pages no longer render random roaming entry points", () => {
  const home = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
  const post = readFileSync(
    new URL("../app/posts/[slug]/page.tsx", import.meta.url),
    "utf8",
  );

  for (const source of [home, post]) {
    assert.equal(source.includes("RandomRoamButton"), false);
    assert.equal(source.includes("带我去一个旧想法"), false);
    assert.equal(source.includes("随便翻一页"), false);
  }
});
