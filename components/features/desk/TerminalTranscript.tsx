import type { DeskBlock } from "@/lib/features/desk/types";

const blockTone: Record<DeskBlock["kind"], string> = {
  assistant: "border-[#7aa2f7]/20 bg-[#7aa2f7]/[0.055]",
  command: "border-white/10 bg-white/[0.035]",
  error: "border-[#e06c75]/35 bg-[#e06c75]/[0.08] text-[#f6caca]",
  system: "border-[#82d99b]/20 bg-[#82d99b]/[0.055]",
  ui: "border-[#e0b46a]/24 bg-[#e0b46a]/[0.07]",
  user: "border-white/10 bg-[#0b0f12]",
};

function blockPrefix(block: DeskBlock) {
  if (block.kind === "user") return "ryker@desk %";
  if (block.kind === "assistant") return "desk.agent";
  if (block.kind === "error") return "desk.error";
  if (block.kind === "ui") return "a2ui.render";
  if (block.kind === "command") return block.command ?? "desk.command";
  return "system";
}

export default function TerminalTranscript({
  blocks,
  loading,
}: {
  blocks: DeskBlock[];
  loading: boolean;
}) {
  return (
    <div className="min-h-[30rem] overflow-hidden rounded-[8px] border border-white/10 bg-[#0b0f12] shadow-[0_28px_80px_-56px_rgba(0,0,0,0.9)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 font-mono text-[10px] uppercase tracking-label text-[#d6e2d6]/50">
        <span>terminal.transcript</span>
        <span>{blocks.length} blocks</span>
      </div>
      <div className="max-h-[62svh] space-y-3 overflow-y-auto p-4">
        {blocks.map((block) => (
          <article
            key={block.id}
            className={`rounded-[6px] border p-4 ${blockTone[block.kind]}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-label text-[#d6e2d6]/46">
              <span>{blockPrefix(block)}</span>
              {block.meta ? <span>{block.meta}</span> : null}
            </div>
            {block.title ? (
              <h2 className="mt-3 font-mono text-sm text-[#f4f7f1]">
                {block.title}
              </h2>
            ) : null}
            <p className="mt-3 whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-[#d6e2d6]/78">
              {block.body}
            </p>
          </article>
        ))}
        {loading ? (
          <div className="rounded-[6px] border border-[#82d99b]/20 bg-[#82d99b]/[0.055] p-4 font-mono text-[13px] text-[#d6e2d6]/70">
            desk.agent is shaping a response...
          </div>
        ) : null}
      </div>
    </div>
  );
}
