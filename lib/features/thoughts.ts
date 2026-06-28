import type {
  Artifact,
  ArtifactKind,
  ArtifactSize,
  ArtifactTone,
} from "@/lib/features/marginalia";

export type ThoughtRecord = {
  id: number;
  kind: string;
  title: string;
  body: string;
  thread: string;
  tone: string;
  size: string;
  source: string | null;
  href: string | null;
  items: string | null;
  tags: string | null;
  objectLabel: string | null;
  objectTitle: string | null;
  objectMeta: string | null;
  objectDescription: string | null;
  pinned: boolean;
  featured: boolean;
  published: boolean;
  views: number;
  likes: number;
  comments: number;
  createdAt: Date;
  updatedAt: Date;
};

const artifactKinds: ArtifactKind[] = [
  "Observation",
  "Quote",
  "Prompt",
  "Link",
  "Rubric",
  "Question",
];
const tones: ArtifactTone[] = ["Paper", "Ink", "Ember", "Blueprint"];
const sizes: ArtifactSize[] = ["Feature", "Wide", "Tall", "Small"];

const defaultThreadByKind: Record<ArtifactKind, string> = {
  Observation: "随想",
  Quote: "摘录",
  Prompt: "提示词",
  Link: "对象",
  Rubric: "工具",
  Question: "提问",
};

function emptyToNull(value: unknown) {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

function normalizeKind(value: unknown): ArtifactKind {
  return artifactKinds.includes(value as ArtifactKind)
    ? (value as ArtifactKind)
    : "Observation";
}

function normalizeTone(value: unknown): ArtifactTone {
  return tones.includes(value as ArtifactTone) ? (value as ArtifactTone) : "Paper";
}

function normalizeSize(value: unknown): ArtifactSize {
  return sizes.includes(value as ArtifactSize) ? (value as ArtifactSize) : "Small";
}

function parseListInput(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value ?? "")
    .split(/[\n,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function readStoredList(value: string | null) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.map((item) => String(item).trim()).filter(Boolean)
      : [];
  } catch {
    return [];
  }
}

export function normalizeThoughtInput(body: Record<string, unknown>) {
  const title = String(body.title ?? "").trim();
  const thoughtBody = String(body.body ?? "").trim();

  if (!title || !thoughtBody) {
    throw new Error("标题和正文不能为空。");
  }

  const kind = normalizeKind(body.kind);
  const items = parseListInput(body.items);
  const tags = parseListInput(body.tags);

  return {
    title,
    body: thoughtBody,
    kind,
    thread:
      emptyToNull(body.thread) ??
      (body.mode === "question" ? "提问" : defaultThreadByKind[kind]),
    tone: normalizeTone(body.tone),
    size: normalizeSize(body.size),
    source: emptyToNull(body.source),
    href: emptyToNull(body.href),
    items: JSON.stringify(items),
    tags: JSON.stringify(tags),
    objectLabel: emptyToNull(body.objectLabel),
    objectTitle: emptyToNull(body.objectTitle),
    objectMeta: emptyToNull(body.objectMeta),
    objectDescription: emptyToNull(body.objectDescription),
    pinned: Boolean(body.pinned),
    featured: Boolean(body.featured),
    published: body.published === undefined ? true : Boolean(body.published),
  };
}

export function thoughtRecordToArtifact(thought: ThoughtRecord): Artifact {
  const object =
    thought.objectTitle || thought.objectLabel || thought.objectMeta
      ? {
          label: thought.objectLabel ?? "对象",
          title: thought.objectTitle ?? thought.title,
          meta: thought.objectMeta ?? "",
          description: thought.objectDescription ?? "",
        }
      : undefined;

  return {
    id: `thought-${thought.id}`,
    kind: normalizeKind(thought.kind),
    title: thought.title,
    body: thought.body,
    thread: thought.thread,
    tone: normalizeTone(thought.tone),
    size: normalizeSize(thought.size),
    pinned: thought.pinned,
    visible: thought.published,
    createdAt: thought.createdAt.toISOString(),
    source: thought.source ?? undefined,
    href: thought.href ?? undefined,
    items: readStoredList(thought.items),
    tags: readStoredList(thought.tags),
    stats: {
      views: thought.views,
      likes: thought.likes,
      comments: thought.comments,
    },
    object,
  };
}
