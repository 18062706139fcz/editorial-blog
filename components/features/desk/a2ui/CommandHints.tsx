import type { DeskCommandHintsUI } from "@/lib/features/desk/types";

export default function CommandHints({ ui }: { ui: DeskCommandHintsUI }) {
  return (
    <section>
      <p className="font-mono text-[10px] uppercase tracking-label text-[#82d99b]">
        command.hints
      </p>
      <h2 className="mt-2 font-mono text-[15px] leading-relaxed text-[#f4f7f1]">
        {ui.title}
      </h2>
      <div className="mt-3 space-y-2">
        {ui.hints.map((hint) => (
          <div
            key={hint.command}
            className="grid gap-2 sm:grid-cols-[12rem_minmax(0,1fr)]"
          >
            <code className="font-mono text-sm text-[#82d99b]">
              $ {hint.command}
            </code>
            <p className="text-[13px] leading-6 text-[#d6e2d6]/62">
              {hint.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
