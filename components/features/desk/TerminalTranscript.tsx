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
  return (
    <div
      aria-label="Claude Code-style terminal transcript"
      className="flex-1 overflow-y-auto pb-8 font-mono"
    >
      <div className="space-y-7">
        {blocks.map((block) => (
          <article
            key={block.id}
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
        ))}
        {loading ? (
          <div className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-3 text-[13px] text-[#d6e2d6]/70">
            <span className="text-[#82d99b]">...</span>
            <span>desk.agent is shaping a response...</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
