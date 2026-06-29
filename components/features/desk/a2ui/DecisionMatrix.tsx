import type { DeskDecisionMatrixUI } from "@/lib/features/desk/types";

export default function DecisionMatrix({ ui }: { ui: DeskDecisionMatrixUI }) {
  return (
    <section>
      <p className="font-mono text-[10px] uppercase tracking-label text-[#e0b46a]">
        decision.matrix
      </p>
      <h2 className="mt-2 font-mono text-[15px] leading-relaxed text-[#f4f7f1]">
        {ui.title}
      </h2>
      <div className="mt-3 space-y-4">
        {ui.options.map((option, index) => (
          <article
            key={`${option.option}-${index}`}
            className="grid gap-2 sm:grid-cols-[2rem_minmax(0,1fr)]"
          >
            <span className="font-mono text-[13px] text-[#e0b46a]">
              {index + 1}.
            </span>
            <div>
              <h3 className="font-mono text-[13px] text-[#f4f7f1]">
                {option.option}
              </h3>
              <dl className="mt-2 grid gap-2 text-[13px] leading-6 sm:grid-cols-3">
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
            </div>
          </article>
        ))}
      </div>
      {ui.recommendation ? (
        <p className="mt-4 border-l border-[#e0b46a]/38 pl-4 text-[13px] leading-6 text-[#f4f7f1]">
          recommendation: {ui.recommendation}
        </p>
      ) : null}
    </section>
  );
}
