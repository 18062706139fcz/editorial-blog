import type {
  DeskA2UI,
  DeskAgentResponse,
  DeskArtifactItem,
  DeskCommandHint,
  DeskDecisionOption,
} from "./types";

const MAX_ITEMS = 6;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanString(value: unknown, fallback = "") {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function cleanStringList(value: unknown) {
  if (!Array.isArray(value)) return undefined;
  const items = value
    .map((item) => cleanString(item))
    .filter(Boolean)
    .slice(0, MAX_ITEMS);
  return items.length ? items : undefined;
}

function cleanHref(value: unknown) {
  const href = cleanString(value);
  if (!href) return undefined;
  if (href.startsWith("/") && !href.startsWith("//")) return href;

  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:" ? href : undefined;
  } catch {
    return undefined;
  }
}

function normalizeNote(raw: Record<string, unknown>): DeskA2UI {
  const meta = cleanString(raw.meta);
  const tags = cleanStringList(raw.tags);

  return {
    type: "note",
    title: cleanString(raw.title, "Untitled note"),
    body: cleanString(raw.body, "No body returned."),
    ...(meta ? { meta } : {}),
    ...(tags ? { tags } : {}),
  };
}

function normalizeArtifactItem(raw: unknown): DeskArtifactItem | null {
  if (!isRecord(raw)) return null;
  const label = cleanString(raw.label, "item");
  const title = cleanString(raw.title);
  const body = cleanString(raw.body);
  if (!title || !body) return null;

  const href = cleanHref(raw.href);
  return {
    label,
    title,
    body,
    ...(href ? { href } : {}),
  };
}

function normalizeArtifactList(raw: Record<string, unknown>): DeskA2UI | null {
  if (!Array.isArray(raw.items)) return null;
  const items = raw.items
    .map(normalizeArtifactItem)
    .filter((item): item is DeskArtifactItem => Boolean(item))
    .slice(0, MAX_ITEMS);
  if (!items.length) return null;

  const description = cleanString(raw.description);
  return {
    type: "artifactList",
    title: cleanString(raw.title, "Artifacts"),
    ...(description ? { description } : {}),
    items,
  };
}

function normalizeDecisionOption(raw: unknown): DeskDecisionOption | null {
  if (!isRecord(raw)) return null;
  const option = cleanString(raw.option);
  const upside = cleanString(raw.upside);
  const risk = cleanString(raw.risk);
  const verdict = cleanString(raw.verdict);
  if (!option || !upside || !risk || !verdict) return null;

  return { option, upside, risk, verdict };
}

function normalizeDecisionMatrix(raw: Record<string, unknown>): DeskA2UI | null {
  if (!Array.isArray(raw.options)) return null;
  const options = raw.options
    .map(normalizeDecisionOption)
    .filter((option): option is DeskDecisionOption => Boolean(option))
    .slice(0, MAX_ITEMS);
  if (!options.length) return null;

  const recommendation = cleanString(raw.recommendation);
  return {
    type: "decisionMatrix",
    title: cleanString(raw.title, "Decision matrix"),
    options,
    ...(recommendation ? { recommendation } : {}),
  };
}

function normalizeCommandHint(raw: unknown): DeskCommandHint | null {
  if (!isRecord(raw)) return null;
  const command = cleanString(raw.command);
  const description = cleanString(raw.description);
  if (!command || !description) return null;
  return { command, description };
}

function normalizeCommandHints(raw: Record<string, unknown>): DeskA2UI | null {
  if (!Array.isArray(raw.hints)) return null;
  const hints = raw.hints
    .map(normalizeCommandHint)
    .filter((hint): hint is DeskCommandHint => Boolean(hint))
    .slice(0, MAX_ITEMS);
  if (!hints.length) return null;

  return {
    type: "commandHints",
    title: cleanString(raw.title, "Try next"),
    hints,
  };
}

export function normalizeDeskA2UI(value: unknown): DeskA2UI | null {
  if (!isRecord(value)) return null;

  switch (value.type) {
    case "note":
      return normalizeNote(value);
    case "artifactList":
      return normalizeArtifactList(value);
    case "decisionMatrix":
      return normalizeDecisionMatrix(value);
    case "commandHints":
      return normalizeCommandHints(value);
    default:
      return null;
  }
}

export function normalizeDeskAgentResponse(value: unknown): DeskAgentResponse {
  if (!isRecord(value)) {
    return { message: "Desk agent returned an unreadable response." };
  }

  const message = cleanString(value.message, "Desk agent returned no message.");
  const ui = normalizeDeskA2UI(value.ui);

  return {
    message,
    ...(ui ? { ui } : {}),
  };
}

export function parseDeskAgentResponse(content: string): DeskAgentResponse {
  try {
    return normalizeDeskAgentResponse(JSON.parse(content));
  } catch {
    return normalizeDeskAgentResponse({ message: content });
  }
}
