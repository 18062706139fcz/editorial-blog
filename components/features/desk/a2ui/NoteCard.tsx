import type { DeskNoteUI } from "@/lib/features/desk/types";

export default function NoteCard({ ui }: { ui: DeskNoteUI }) {
  return (
    <article className="rounded-[8px] border border-[#82d99b]/24 bg-[#82d99b]/[0.07] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-label text-[#d6e2d6]/48">
        <span>note.card</span>
        {ui.meta ? <span>{ui.meta}</span> : null}
      </div>
      <h2 className="mt-5 font-mono text-2xl leading-tight text-[#f4f7f1]">
        {ui.title}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-[#d6e2d6]/72">
        {ui.body}
      </p>
      {ui.tags?.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {ui.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[4px] border border-white/10 px-2 py-1 font-mono text-[10px] text-[#d6e2d6]/58"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
