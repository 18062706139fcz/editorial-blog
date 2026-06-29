"use client";

import { Fragment, useEffect, useRef } from "react";
import type { DeskBlock } from "@/lib/features/desk/types";
import A2UIRenderer from "./A2UIRenderer";

const blockAccent: Record<DeskBlock["kind"], string> = {
  assistant: "text-[#7aa2f7]",
  command: "text-[#d6e2d6]/52",
  error: "text-[#e06c75]",
  system: "text-[#82d99b]",
  ui: "text-[#e0b46a]",
  user: "text-[#82d99b]",
};

const seedBlockIds = new Set(["boot", "welcome-ui", "help-hint"]);

function isSeedBlock(block: DeskBlock) {
  return seedBlockIds.has(block.id);
}

function isFirstLiveBlock(block: DeskBlock, index: number, blocks: DeskBlock[]) {
  return !isSeedBlock(block) && blocks.slice(0, index).every(isSeedBlock);
}

function SectionDivider({
  label,
  marker,
}: {
  label: string;
  marker: string;
}) {
  return (
    <div
      data-desk-divider={marker}
      className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-x-3 text-[10px] uppercase tracking-label text-[#d6e2d6]/34"
    >
      <span className="text-[#82d99b]/70">·</span>
      <div className="flex items-center gap-3">
        <span className="text-[#82d99b]">{label}</span>
        <span className="h-px flex-1 bg-[#82d99b]/22" />
      </div>
    </div>
  );
}

function blockPrefix(block: DeskBlock) {
  if (block.kind === "user") return "ryker@desk %";
  if (block.kind === "assistant") return "desk.agent";
  if (block.kind === "error") return "desk.error";
  if (block.kind === "ui") return "a2ui.render";
  if (block.kind === "command") return block.command ?? "desk.command";
  return "system";
}

function blockGlyph(block: DeskBlock) {
  if (block.kind === "user") return ">";
  if (block.kind === "assistant") return "*";
  if (block.kind === "error") return "!";
  if (block.kind === "ui") return "+";
  if (block.kind === "command") return "$";
  return "-";
}

export default function TerminalTranscript({
  blocks,
  loading,
}: {
  blocks: DeskBlock[];
  loading: boolean;
}) {
  const transcriptRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ block: "end" });
      if (transcriptRef.current) {
        transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [blocks.length, loading]);

  return (
    <div
      data-desk-zone="terminal-output"
      ref={transcriptRef}
      aria-label="Claude Code-style terminal transcript"
      className="min-h-0 flex-1 overflow-y-auto bg-[#080a0c] px-4 py-6 font-mono sm:px-6 lg:px-8"
    >
      <div className="space-y-7">
        <SectionDivider label="DESK BOOT" marker="session-start" />
        {blocks.map((block, index) => (
          <Fragment key={block.id}>
            {isFirstLiveBlock(block, index, blocks) ? (
              <SectionDivider label="USER TURNS" marker="live-turns" />
            ) : null}
            <article
              data-desk-section={isSeedBlock(block) ? "seed" : "live"}
              className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-3 gap-y-2"
            >
              <span className={`pt-0.5 text-sm ${blockAccent[block.kind]}`}>
                {blockGlyph(block)}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-label text-[#d6e2d6]/44">
                  <span className={blockAccent[block.kind]}>{blockPrefix(block)}</span>
                  {block.meta ? <span>{block.meta}</span> : null}
                </div>
                {block.title ? (
                  <h2 className="mt-2 text-[14px] leading-relaxed text-[#f4f7f1]">
                    {block.title}
                  </h2>
                ) : null}
                <p className="mt-2 whitespace-pre-wrap text-[13px] leading-7 text-[#d6e2d6]/76">
                  {block.body}
                </p>
                {block.ui ? (
                  <div className="mt-4">
                    <A2UIRenderer ui={block.ui} />
                  </div>
                ) : null}
              </div>
            </article>
          </Fragment>
        ))}
        {loading ? (
          <div className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-3 text-[13px] text-[#d6e2d6]/70">
            <span className="text-[#82d99b]">...</span>
            <span>desk.agent is shaping a response...</span>
          </div>
        ) : null}
        <div ref={bottomRef} aria-hidden />
      </div>
    </div>
  );
}
