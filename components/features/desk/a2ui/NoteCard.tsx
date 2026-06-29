import type { DeskNoteUI } from "@/lib/features/desk/types";

export default function NoteCard({ ui }: { ui: DeskNoteUI }) {
  return (
    <article className="border-l border-[#82d99b]/35 pl-4">
      <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-label text-[#d6e2d6]/48">
        <span>note</span>
        {ui.meta ? <span>{ui.meta}</span> : null}
      </div>
      <h2 className="mt-3 font-mono text-[15px] leading-relaxed text-[#f4f7f1]">
        {ui.title}
      </h2>
      <p className="mt-2 text-[13px] leading-7 text-[#d6e2d6]/72">
        {ui.body}
      </p>
      {ui.tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {ui.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[11px] text-[#82d99b]/76"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
