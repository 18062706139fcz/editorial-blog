import type { DeskArtifactListUI } from "@/lib/features/desk/types";

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export default function ArtifactList({ ui }: { ui: DeskArtifactListUI }) {
  return (
    <section className="space-y-3">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-label text-[#7aa2f7]">
          artifact.list
        </p>
        <h2 className="mt-2 font-mono text-xl leading-tight text-[#f4f7f1]">
          {ui.title}
        </h2>
        {ui.description ? (
          <p className="mt-2 text-sm leading-relaxed text-[#d6e2d6]/62">
            {ui.description}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        {ui.items.map((item) => {
          const content = (
            <div className="rounded-[6px] border border-white/10 bg-white/[0.035] p-4 transition-colors hover:border-[#7aa2f7]/35">
              <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-label text-[#d6e2d6]/45">
                <span>{item.label}</span>
                {item.href ? <span>open</span> : null}
              </div>
              <h3 className="mt-3 font-mono text-sm text-[#f4f7f1]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#d6e2d6]/66">
                {item.body}
              </p>
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
