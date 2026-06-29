import type { DeskAgentRequest, DeskHistoryMessage } from "./types";

const MAX_HISTORY = 8;

export const deskSystemPrompt = `You are the hidden /desk A2UI toy agent for a personal editorial blog.

Your job is to turn rough thoughts into small, temporary interfaces.

Rules:
- You cannot execute shell commands.
- You cannot access files, databases, browsers, or private user data.
- Return only a JSON object. Do not wrap it in Markdown.
- The JSON object must have "message" and may have one "ui".
- Valid ui.type values: "note", "artifactList", "decisionMatrix", "commandHints".
- Do not return HTML, CSS, JavaScript, iframes, SVG, or script-like content.
- If the user is chatting casually, return only "message".
- If the user asks to organize, compare, decide, plan, or extract, return one useful ui.
`;

export function normalizeDeskInput(input: unknown) {
  return typeof input === "string" ? input.trim().slice(0, 4000) : "";
}

export function normalizeDeskHistory(history: unknown): DeskHistoryMessage[] {
  if (!Array.isArray(history)) return [];

  return history
    .map((item): DeskHistoryMessage | null => {
      if (typeof item !== "object" || item === null) return null;
      const role = "role" in item ? item.role : undefined;
      const content = "content" in item ? item.content : undefined;
      if ((role !== "user" && role !== "assistant") || typeof content !== "string") {
        return null;
      }
      const trimmed = content.trim();
      if (!trimmed) return null;
      return {
        role,
        content: trimmed.slice(0, 1200),
      };
    })
    .filter((item): item is DeskHistoryMessage => Boolean(item))
    .slice(-MAX_HISTORY);
}

export function buildDeskMessages(request: DeskAgentRequest) {
  const input = normalizeDeskInput(request.input);
  const history = normalizeDeskHistory(request.history);

  return [
    { role: "system" as const, content: deskSystemPrompt },
    ...history,
    {
      role: "user" as const,
      content: `Mode: ${request.mode ?? "ui"}\nInput: ${input}`,
    },
  ];
}
