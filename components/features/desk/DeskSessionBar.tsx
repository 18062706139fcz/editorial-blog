import type { HiddenRoom } from "@/lib/features/hidden-rooms";

export default function DeskSessionBar({
  loading,
  room,
}: {
  loading: boolean;
  room: HiddenRoom;
}) {
  return (
    <header className="rounded-[8px] border border-white/10 bg-[#101418] shadow-[0_24px_80px_-60px_rgba(0,0,0,0.9)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 font-mono text-[10px] uppercase tracking-label text-[#d6e2d6]/55">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#e06c75]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e0b46a]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#82d99b]" />
          <span className="ml-2">desk.session</span>
        </div>
        <span>{loading ? "thinking" : "local first"}</span>
      </div>
      <div className="grid gap-3 px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-label text-[#82d99b]">
            {room.eyebrow}
          </p>
          <h1 className="mt-2 font-mono text-2xl leading-tight text-[#f4f7f1] sm:text-3xl">
            ryker@desk ~/scratch
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#d6e2d6]/62">
            {room.summary}
          </p>
        </div>
        <div className="rounded-[6px] border border-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-label text-[#d6e2d6]/50">
          noindex / hidden
        </div>
      </div>
    </header>
  );
}
