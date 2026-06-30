"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { HiddenRoom } from "@/lib/features/hidden-rooms";
import {
  createInitialDeskBlocks,
  resolveDeskCommand,
} from "@/lib/features/desk/commands";
import { normalizeDeskAgentResponse } from "@/lib/features/desk/a2ui";
import type { DeskBlock, DeskHistoryMessage } from "@/lib/features/desk/types";
import DeskComposer from "./DeskComposer";
import TerminalTranscript from "./TerminalTranscript";

function createBlockId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createUserBlock(input: string): DeskBlock {
  return {
    id: createBlockId("user"),
    kind: "user",
    command: input,
    body: input,
  };
}

function createDeepSeekCallBlock(input: string): DeskBlock {
  return {
    id: createBlockId("deepseek"),
    kind: "system",
    title: "deepseek.call",
    body: [
      "Non-local input is sent to /api/desk/agent.",
      "The server calls DeepSeek chat/completions and asks for JSON: { message, ui? }.",
      `Intent preview: ${input.slice(0, 160)}`,
    ].join("\n"),
    meta: "server-only",
  };
}

function createA2UIProtocolBlock(uiType?: string): DeskBlock {
  if (!uiType) {
    return {
      id: createBlockId("a2ui-protocol"),
      kind: "system",
      title: "a2ui.protocol",
      body: "DeepSeek returned message-only JSON. No A2UI schema was rendered for this turn.",
      meta: "no_ui_chat",
    };
  }

  return {
    id: createBlockId("a2ui-protocol"),
    kind: "system",
    title: "a2ui.protocol",
    body: `A2UI schema received: ${uiType}. validate -> normalize -> render as a trusted React terminal surface.`,
    meta: "surfaceUpdate",
  };
}

function historyFromBlocks(blocks: DeskBlock[]): DeskHistoryMessage[] {
  return blocks
    .filter((block) => block.kind === "user" || block.kind === "assistant")
    .slice(-8)
    .map((block) => ({
      role: block.kind === "user" ? "user" : "assistant",
      content: block.body,
    }));
}

export default function DeskShell({ room }: { room: HiddenRoom }) {
  const router = useRouter();
  const [blocks, setBlocks] = useState<DeskBlock[]>(() => createInitialDeskBlocks());
  const [loading, setLoading] = useState(false);

  async function handleSubmit(input: string) {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userBlock = createUserBlock(trimmed);
    const command = resolveDeskCommand(trimmed);

    if (command?.kind === "clear") {
      setBlocks(createInitialDeskBlocks());
      return;
    }

    if (command?.kind === "blocks") {
      setBlocks((current) => [...current, userBlock, ...command.blocks]);
      return;
    }

    if (command?.kind === "navigate") {
      setBlocks((current) => [...current, userBlock, ...command.blocks]);
      requestAnimationFrame(() => {
        router.push(command.href);
      });
      return;
    }

    const deepSeekCallBlock = createDeepSeekCallBlock(trimmed);
    setBlocks((current) => [...current, userBlock, deepSeekCallBlock]);
    setLoading(true);

    try {
      const response = await fetch("/api/desk/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: trimmed,
          history: historyFromBlocks(blocks),
          mode: "ui",
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          typeof payload?.message === "string"
            ? payload.message
            : "Desk agent request failed.",
        );
      }

      const normalized = normalizeDeskAgentResponse(payload);
      const assistantBlock: DeskBlock = {
        id: createBlockId("assistant"),
        kind: "assistant",
        body: normalized.message,
      };
      const uiBlock: DeskBlock | null = normalized.ui
        ? {
            id: createBlockId("ui"),
            kind: "ui",
            title: normalized.ui.type,
            body: `Rendered ${normalized.ui.type} inline.`,
            ui: normalized.ui,
          }
        : null;
      const protocolBlock = createA2UIProtocolBlock(normalized.ui?.type);

      setBlocks((current) => [
        ...current,
        assistantBlock,
        protocolBlock,
        ...(uiBlock ? [uiBlock] : []),
      ]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Desk agent request failed.";
      setBlocks((current) => [
        ...current,
        {
          id: createBlockId("error"),
          kind: "error",
          title: "request failed",
          body: message,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="fixed inset-0 z-30 min-h-screen overflow-hidden bg-[#080a0c] text-[#d6e2d6]">
      <div className="flex h-screen min-h-0 flex-col">
        <header
          data-desk-zone="intro"
          className="shrink-0 border-b border-[#16211d] bg-[#080a0c] px-4 py-4 font-mono sm:px-6 lg:px-8"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-label text-[#d6e2d6]/40">
            <span className="text-[#82d99b]">{room.eyebrow}</span>
            <span>noindex</span>
            <span>hidden</span>
            <span>{loading ? "deepseek" : "agent-to-user"}</span>
          </div>
          <h1 className="mt-3 text-[15px] leading-relaxed text-[#f4f7f1]">
            ryker@desk:~/scratch
          </h1>
          <p className="mt-1 max-w-4xl text-[13px] leading-6 text-[#d6e2d6]/58">
            {room.summary}
          </p>
        </header>

        <TerminalTranscript blocks={blocks} loading={loading} />
        <DeskComposer loading={loading} onSubmit={handleSubmit} />
      </div>
    </section>
  );
}
