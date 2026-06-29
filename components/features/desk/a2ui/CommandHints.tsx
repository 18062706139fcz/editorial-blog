import type { DeskCommandHintsUI } from "@/lib/features/desk/types";

export default function CommandHints({ ui }: { ui: DeskCommandHintsUI }) {
  return (
    <section>
      <p className="font-mono text-[10px] uppercase tracking-label text-[#82d99b]">
        command.hints
      </p>
      <h2 className="mt-2 font-mono text-xl leading-tight text-[#f4f7f1]">
        {ui.title}
      </h2>
      <div className="mt-4 grid gap-2">
        {ui.hints.map((hint) => (
          <div
            key={hint.command}
            className="rounded-[6px] border border-white/10 bg-white/[0.035] p-3"
          >
            <code className="font-mono text-sm text-[#82d99b]">
              {hint.command}
            </code>
            <p className="mt-1 text-sm leading-relaxed text-[#d6e2d6]/62">
              {hint.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
