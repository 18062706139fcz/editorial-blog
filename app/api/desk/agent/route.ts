import { NextResponse } from "next/server";
import {
  buildDeskMessages,
  normalizeDeskHistory,
  normalizeDeskInput,
} from "@/lib/features/desk/prompt";
import { parseDeskAgentResponse } from "@/lib/features/desk/a2ui";

export const runtime = "nodejs";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeMode(value: unknown) {
  return value === "chat" ||
    value === "ui" ||
    value === "critic" ||
    value === "organize"
    ? value
    : "ui";
}

function readDeepSeekContent(value: unknown) {
  if (!isRecord(value)) return "";
  const choices = value.choices;
  if (!Array.isArray(choices)) return "";
  const first = choices[0];
  if (!isRecord(first) || !isRecord(first.message)) return "";
  return typeof first.message.content === "string" ? first.message.content : "";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!isRecord(body)) {
    return NextResponse.json({ message: "Invalid desk request." }, { status: 400 });
  }

  const input = normalizeDeskInput(body.input);
  if (!input) {
    return NextResponse.json({ message: "Desk input is required." }, { status: 400 });
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json(
      { message: "DEEPSEEK_API_KEY missing." },
      { status: 503 },
    );
  }

  const model = process.env.DEEPSEEK_MODEL ?? "deepseek-chat";
  const messages = buildDeskMessages({
    input,
    history: normalizeDeskHistory(body.history),
    mode: normalizeMode(body.mode),
  });

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "DeepSeek request failed." },
        { status: 502 },
      );
    }

    const payload = await response.json();
    const content = readDeepSeekContent(payload);
    if (!content) {
      return NextResponse.json(
        { message: "DeepSeek returned an empty response." },
        { status: 502 },
      );
    }

    return NextResponse.json(parseDeskAgentResponse(content));
  } catch {
    return NextResponse.json(
      { message: "Desk agent network request failed." },
      { status: 502 },
    );
  }
}
