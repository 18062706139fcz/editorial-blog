import { selectPostEasterEgg } from "@/lib/living-site";

export default function PostEasterEgg({ slug }: { slug: string }) {
  const egg = selectPostEasterEgg(slug);

  return (
    <aside className="rounded-[8px] border border-hairline bg-paper-dim/55 p-5 text-left shadow-[0_20px_60px_-46px_rgba(28,25,22,0.5)]">
      <p className="font-mono text-[10px] uppercase tracking-label text-accent">
        {egg.title}
      </p>
      <dl className="mt-4 grid gap-3">
        {egg.items.map((item) => (
          <div
            key={item.label}
            className="grid gap-1 border-t border-hairline pt-3 first:border-t-0 first:pt-0 sm:grid-cols-[5rem_1fr] sm:gap-4"
          >
            <dt className="font-mono text-[10px] uppercase tracking-label text-ink-soft">
              {item.label}
            </dt>
            <dd className="text-sm leading-relaxed text-ink-soft">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
