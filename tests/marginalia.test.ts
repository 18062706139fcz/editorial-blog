import assert from "node:assert/strict";
import test from "node:test";
import {
  artifactKindLabel,
  artifactSizeClass,
  getArtifactThreads,
  getCabinetArtifacts,
  getThinkingArtifacts,
  getThoughtModeLabel,
  getThoughtModes,
  type Artifact,
} from "../lib/features/marginalia";
import { normalizeThoughtInput, thoughtRecordToArtifact } from "../lib/features/thoughts";

const baseArtifact: Artifact = {
  id: "base",
  kind: "Observation",
  title: "A concrete note",
  body: "A short, specific fragment from the workbench.",
  thread: "Craft",
  tone: "Paper",
  size: "Small",
  pinned: false,
  visible: true,
  createdAt: "2026-06-01",
};

test("getCabinetArtifacts returns visible artifacts with pinned and larger items first", () => {
  const artifacts: Artifact[] = [
    { ...baseArtifact, id: "hidden", visible: false, pinned: true, size: "Feature" },
    { ...baseArtifact, id: "small", size: "Small", createdAt: "2026-06-04" },
    { ...baseArtifact, id: "wide", size: "Wide", createdAt: "2026-06-03" },
    { ...baseArtifact, id: "feature", size: "Feature", createdAt: "2026-06-02" },
    { ...baseArtifact, id: "pinned", pinned: true, size: "Small", createdAt: "2026-06-01" },
  ];

  const result = getCabinetArtifacts(artifacts, 4).map((artifact) => artifact.id);

  assert.deepEqual(result, ["pinned", "feature", "wide", "small"]);
});

test("artifact helpers expose concrete object-like presentation primitives", () => {
  assert.equal(artifactKindLabel("Prompt"), "提示词");
  assert.equal(artifactKindLabel("Rubric"), "清单");
  assert.equal(
    artifactSizeClass("Feature"),
    "md:col-span-2 md:row-span-2 min-h-[18rem]",
  );
});

test("getThinkingArtifacts returns the complete visible stream by recency", () => {
  const artifacts: Artifact[] = [
    { ...baseArtifact, id: "pinned-old", pinned: true, createdAt: "2026-06-01" },
    { ...baseArtifact, id: "hidden-new", visible: false, createdAt: "2026-06-05" },
    { ...baseArtifact, id: "new", createdAt: "2026-06-04" },
    { ...baseArtifact, id: "middle", createdAt: "2026-06-03" },
  ];

  const result = getThinkingArtifacts(artifacts).map((artifact) => artifact.id);

  assert.deepEqual(result, ["new", "middle", "pinned-old"]);
});

test("getArtifactThreads returns visible stream filters in first-seen order", () => {
  const artifacts: Artifact[] = [
    { ...baseArtifact, id: "ai", thread: "AI", createdAt: "2026-06-03" },
    { ...baseArtifact, id: "hidden", thread: "Shipping", visible: false },
    { ...baseArtifact, id: "taste", thread: "Taste", createdAt: "2026-06-02" },
    { ...baseArtifact, id: "ai-again", thread: "AI", createdAt: "2026-06-01" },
  ];

  assert.deepEqual(getArtifactThreads(artifacts), ["AI", "Taste"]);
});

test("thought mode labels are Chinese-facing and hide storage terms", () => {
  assert.equal(getThoughtModeLabel("all"), "全部");
  assert.equal(getThoughtModeLabel("object"), "对象");
  assert.equal(artifactKindLabel("Question"), "提问");

  const modes = getThoughtModes([
    { ...baseArtifact, id: "question", kind: "Question" },
    { ...baseArtifact, id: "link", kind: "Link" },
    { ...baseArtifact, id: "hidden", kind: "Prompt", visible: false },
  ]);

  assert.deepEqual(
    modes.map((mode) => [mode.key, mode.label, mode.count]),
    [
      ["all", "全部", 2],
      ["question", "提问", 1],
      ["object", "对象", 1],
    ],
  );
});

test("normalizeThoughtInput prepares admin payloads for persistence", () => {
  const result = normalizeThoughtInput({
    title: "  一个短札  ",
    body: "  这是一段还没长成文章的想法。  ",
    kind: "Question",
    mode: "question",
    tone: "Blueprint",
    featured: true,
    published: false,
    items: "第一条\n第二条",
    tags: "AI, 产品",
    objectTitle: "",
  });

  assert.equal(result.title, "一个短札");
  assert.equal(result.body, "这是一段还没长成文章的想法。");
  assert.equal(result.kind, "Question");
  assert.equal(result.thread, "提问");
  assert.equal(result.items, "[\"第一条\",\"第二条\"]");
  assert.equal(result.tags, "[\"AI\",\"产品\"]");
  assert.equal(result.objectTitle, null);
  assert.equal(result.featured, true);
  assert.equal(result.published, false);
});

test("thoughtRecordToArtifact maps persisted thoughts into public artifacts", () => {
  const artifact = thoughtRecordToArtifact({
    id: 7,
    kind: "Link",
    title: "一部值得留下的作品",
    body: "它解释了为什么对象卡比链接列表更像想法。",
    thread: "对象",
    tone: "Ink",
    size: "Wide",
    source: "豆瓣",
    href: "https://example.com",
    items: "[]",
    tags: "[\"media\"]",
    objectLabel: "电影",
    objectTitle: "花样年华",
    objectMeta: "2000 / 王家卫",
    objectDescription: "关于克制和未说出口的东西。",
    pinned: false,
    featured: true,
    published: true,
    views: 12,
    likes: 3,
    comments: 1,
    createdAt: new Date("2026-06-20T00:00:00.000Z"),
    updatedAt: new Date("2026-06-20T00:00:00.000Z"),
  });

  assert.equal(artifact.id, "thought-7");
  assert.equal(artifact.visible, true);
  assert.equal(artifact.object?.title, "花样年华");
  assert.deepEqual(artifact.tags, ["media"]);
  assert.deepEqual(artifact.stats, { views: 12, likes: 3, comments: 1 });
});
