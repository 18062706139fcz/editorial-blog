import type { DeskArtifactListUI } from "@/lib/features/desk/types";

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export default function ArtifactList({ ui }: { ui: DeskArtifactListUI }) {
  return (
    <section>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-label text-[#7aa2f7]">
          artifact.list
        </p>
        <h2 className="mt-2 font-mono text-[15px] leading-relaxed text-[#f4f7f1]">
          {ui.title}
        </h2>
        {ui.description ? (
          <p className="mt-1 text-[13px] leading-6 text-[#d6e2d6]/62">
            {ui.description}
          </p>
        ) : null}
      </div>
      <div className="mt-3 space-y-3">
        {ui.items.map((item) => {
          const content = (
            <div className="grid gap-2 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <span className="font-mono text-[11px] uppercase tracking-label text-[#d6e2d6]/42">
                [{item.label}]
              </span>
              <div>
                <h3 className="font-mono text-[13px] text-[#f4f7f1]">
                  {item.title}
                </h3>
                <p className="mt-1 text-[13px] leading-6 text-[#d6e2d6]/66">
                  {item.body}
                </p>
              </div>
            </div>
          );

          if (!item.href) return <div key={`${item.label}-${item.title}`}>{content}</div>;

          return (
            <a
              key={`${item.label}-${item.title}`}
              href={item.href}
              target={isExternalHref(item.href) ? "_blank" : undefined}
              rel={isExternalHref(item.href) ? "noreferrer" : undefined}
              className="block"
            >
              {content}
            </a>
          );
        })}
      </div>
    </section>
  );
}
