"use client";

import { useMemo, useState } from "react";
import type { HiddenRoom } from "@/lib/features/hidden-rooms";
import {
  createInitialDeskBlocks,
  resolveDeskCommand,
} from "@/lib/features/desk/commands";
import { normalizeDeskAgentResponse } from "@/lib/features/desk/a2ui";
import type { DeskBlock, DeskHistoryMessage } from "@/lib/features/desk/types";
import A2UIRenderer from "./A2UIRenderer";
import DeskComposer from "./DeskComposer";
import DeskSessionBar from "./DeskSessionBar";
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

function historyFromBlocks(blocks: DeskBlock[]): DeskHistoryMessage[] {
  return blocks
    .filter((block) => block.kind === "user" || block.kind === "assistant")
    .slice(-8)
    .map((block) => ({
      role: block.kind === "user" ? "user" : "assistant",
      content: block.body,
    }));
}

function latestUi(blocks: DeskBlock[]) {
  return [...blocks].reverse().find((block) => block.ui)?.ui;
}

export default function DeskShell({ room }: { room: HiddenRoom }) {
  const [blocks, setBlocks] = useState<DeskBlock[]>(() => createInitialDeskBlocks());
  const [loading, setLoading] = useState(false);
  const activeUi = useMemo(() => latestUi(blocks), [blocks]);

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

    setBlocks((current) => [...current, userBlock]);
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
            body: `Rendered ${normalized.ui.type} in the inspector.`,
            ui: normalized.ui,
          }
        : null;

      setBlocks((current) => [
        ...current,
        assistantBlock,
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
    <section className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6">
      <DeskSessionBar room={room} loading={loading} />

      <div className="grid flex-1 gap-4 py-4 lg:min-h-[38rem] lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)]">
        <TerminalTranscript blocks={blocks} loading={loading} />
        <aside className="min-h-[22rem] overflow-hidden rounded-[8px] border border-white/10 bg-[#101418] shadow-[0_28px_80px_-56px_rgba(0,0,0,0.9)]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 font-mono text-[10px] uppercase tracking-label text-[#d6e2d6]/50">
            <span>a2ui.inspector</span>
            <span>{activeUi?.type ?? "idle"}</span>
          </div>
          <div className="p-4">
            {activeUi ? (
              <A2UIRenderer ui={activeUi} />
            ) : (
              <div className="rounded-[6px] border border-dashed border-white/12 p-5 text-sm leading-relaxed text-[#d6e2d6]/58">
                Ask the desk to organize, compare, plan, or extract something.
                The next valid A2UI block will render here.
              </div>
            )}
          </div>
        </aside>
      </div>

      <DeskComposer loading={loading} onSubmit={handleSubmit} />
    </section>
  );
}
