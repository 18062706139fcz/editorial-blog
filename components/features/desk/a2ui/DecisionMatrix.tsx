import type { DeskDecisionMatrixUI } from "@/lib/features/desk/types";

export default function DecisionMatrix({ ui }: { ui: DeskDecisionMatrixUI }) {
  return (
    <section>
      <p className="font-mono text-[10px] uppercase tracking-label text-[#e0b46a]">
        decision.matrix
      </p>
      <h2 className="mt-2 font-mono text-xl leading-tight text-[#f4f7f1]">
        {ui.title}
      </h2>
      <div className="mt-4 overflow-hidden rounded-[6px] border border-white/10">
        {ui.options.map((option, index) => (
          <article
            key={`${option.option}-${index}`}
            className="border-b border-white/10 bg-white/[0.025] p-4 last:border-b-0"
          >
            <h3 className="font-mono text-sm text-[#f4f7f1]">{option.option}</h3>
            <dl className="mt-3 grid gap-3 text-sm leading-relaxed sm:grid-cols-3">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-label text-[#82d99b]">
                  upside
                </dt>
                <dd className="mt-1 text-[#d6e2d6]/66">{option.upside}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-label text-[#e06c75]">
                  risk
                </dt>
                <dd className="mt-1 text-[#d6e2d6]/66">{option.risk}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-label text-[#7aa2f7]">
                  verdict
                </dt>
                <dd className="mt-1 text-[#d6e2d6]/66">{option.verdict}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      {ui.recommendation ? (
        <p className="mt-4 rounded-[6px] border border-[#e0b46a]/24 bg-[#e0b46a]/[0.07] p-4 text-sm leading-relaxed text-[#f4f7f1]">
          {ui.recommendation}
        </p>
      ) : null}
    </section>
  );
}
